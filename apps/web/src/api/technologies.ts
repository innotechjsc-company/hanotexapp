/**
 * Technologies API functions
 * Các function để quản lý technologies với PayloadCMS
 */

import { PricingType, Technology, VisibilityMode } from "@/types/technologies";
import { payloadApiClient, ApiResponse } from "./client";
import { API_ENDPOINTS, PAGINATION_DEFAULTS } from "./config";
import { getStoredToken } from "./auth";

// Custom interface for list responses where both data and docs are arrays
export interface ListApiResponse<T> {
  data?: T[];
  docs?: T[];
  totalDocs?: number;
  limit?: number;
  page?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  nextPage?: number | null;
  prevPage?: number | null;
  message?: string;
  errors?: Array<{
    message: string;
    field?: string;
  }>;
}

export interface TechnologyFilters {
  status?: Technology["status"];
  visibility_mode?: VisibilityMode;
  category_id?: string;
  trl_level?: number;
  pricing_type?: PricingType;
  search?: string;
  submitter?: string;
}

export interface PaginationParams {
  limit?: number;
  page?: number;
  sort?: string;
}

/**
 * Get all technologies with pagination and filters
 */
export async function getTechnologies(
  filters: TechnologyFilters = {},
  pagination: PaginationParams = {}
): Promise<ListApiResponse<Technology>> {
  // Map friendly filters to PayloadCMS REST 'where' syntax
  const params: Record<string, any> = {
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-createdAt",
  };

  // Visibility mode
  if (filters.visibility_mode) {
    params["where[visibility_mode][equals]"] = filters.visibility_mode;
  }

  // Status
  if (filters.status) {
    params["where[status][equals]"] = filters.status;
  }

  // Category relationship (map category_id -> category field)
  if (filters.category_id) {
    params["where[category][equals]"] = filters.category_id;
  }

  // TRL level (exact)
  if (typeof filters.trl_level === "number") {
    params["where[trl_level][equals]"] = filters.trl_level;
  }

  // Pricing type (if any)
  if (filters.pricing_type) {
    params["where[pricing][pricing_type][equals]"] = filters.pricing_type;
  }

  // Text search: only match title using [contains]
  if (filters.search && filters.search.trim()) {
    const q = filters.search.trim();
    params["where[title][contains]"] = q;
  }

  return payloadApiClient.get<Technology[]>(
    API_ENDPOINTS.TECHNOLOGIES,
    params
  ) as Promise<ListApiResponse<Technology>>;
}

/**
 * Get technology by ID
 */
export async function getTechnologyById(id: string): Promise<Technology> {
  // Use depth=2 to populate referenced fields (e.g., category, submitter)
  const res = await payloadApiClient.get<Technology>(
    `${API_ENDPOINTS.TECHNOLOGIES}/${id}?depth=2`
  );
  const anyRes = res as any;
  const item =
    anyRes?.data ??
    anyRes?.doc ??
    (Array.isArray(anyRes?.docs) ? anyRes.docs[0] : undefined) ??
    anyRes;
  return item as Technology;
}

/**
 * Create new technology
 */
export async function createTechnology(
  data: Partial<Technology>
): Promise<Technology> {
  const response = await payloadApiClient.post<Technology>(
    API_ENDPOINTS.TECHNOLOGIES,
    data
  );
  return response.data!;
}

/**
 * Interface for creating technology with services and IP
 */
export interface CreateTechnologyPayload {
  title: string;
  category: string; // ID string
  trl_level: number;
  description: string;
  confidential_detail: string;
  documents?: string[]; // Media IDs
  owners?: Array<{
    owner_type: "individual" | "company" | "research_institution";
    owner_name: string;
    ownership_percentage: number;
  }>;
  legal_certification?: {
    protection_scope?: Array<{ scope: string }>;
    standard_certifications?: Array<{ certification: string }>;
    files?: string[]; // Media IDs
  };
  investment_desire?: Array<{ investment_option: string }>;
  transfer_type?: Array<{ transfer_option: string }>;
  pricing?: {
    pricing_type: "grant_seed" | "vc_joint_venture" | "growth_strategic";
    price_from: number;
    price_to: number;
    currency: "vnd" | "usd" | "eur";
  };
  intellectual_property?: Array<{
    code: string;
    type:
      | "patent"
      | "utility_solution"
      | "industrial_design"
      | "trademark"
      | "copyright"
      | "trade_secret";
    status: "pending" | "granted" | "expired" | "rejected";
  }>;
  visibility_mode?: "public" | "private" | "restricted";
  status?:
    | "draft"
    | "pending"
    | "approved"
    | "rejected"
    | "active"
    | "inactive";
  // Service ticket creation
  services?: Array<{
    service_id: string;
    description: string;
    responsible_user_id: string;
    implementer_ids: string[];
    document_id?: string;
  }>;
}

/**
 * Response interface for technology creation with additional data
 */
export interface CreateTechnologyResponse {
  success: boolean;
  data: Technology;
  doc: Technology; // For compatibility
  intellectual_property_records?: Array<any>;
  service_tickets?: Array<any>;
  message: string;
}

/**
 * Create new technology with services and intellectual property support
 * Uses our custom CMS API endpoint that handles service tickets and IP creation
 */
export async function createTechnologyWithServices(
  data: CreateTechnologyPayload
): Promise<CreateTechnologyResponse> {
  // Use direct fetch to call our custom CMS API endpoint
  const cmsApiUrl =
    process.env.NEXT_PUBLIC_PAYLOAD_API_URL || "http://localhost:4000";
  const endpoint = `${cmsApiUrl}/technologies/create`;

  try {
    // Get auth token if available (for PayloadCMS authentication)
    let authHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Try to get token from multiple sources
    if (typeof window !== "undefined") {
      // Use the centralized token retrieval function first
      let token = getStoredToken();

      // Fallback to manual localStorage checks if getStoredToken returns null
      if (!token) {
        token =
          localStorage.getItem("payload_token") || // Main token storage key
          localStorage.getItem("payload-token") ||
          sessionStorage.getItem("payload-token") ||
          localStorage.getItem("token") ||
          sessionStorage.getItem("token") ||
          // Check for cookie token
          document.cookie
            .split(";")
            .find((c) => c.trim().startsWith("payload-token="))
            ?.split("=")[1] ||
          null;
      }

      if (token) {
        authHeaders["Authorization"] = `Bearer ${token}`;
        console.log(
          "Token found and added to headers:",
          token.substring(0, 20) + "..."
        );
      } else {
        console.warn("No authentication token found in storage");
      }
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    const result = await response.json();
    return result as CreateTechnologyResponse;
  } catch (error) {
    console.error("Create technology error:", error);

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Failed to create technology");
  }
}

/**
 * Update technology
 */
export async function updateTechnology(
  id: string,
  data: Partial<Technology>
): Promise<Technology> {
  const response = await payloadApiClient.patch<Technology>(
    `${API_ENDPOINTS.TECHNOLOGIES}/${id}`,
    data
  );
  return response.data!;
}

/**
 * Delete technology
 */
export async function deleteTechnology(id: string): Promise<void> {
  await payloadApiClient.delete(`${API_ENDPOINTS.TECHNOLOGIES}/${id}`);
}

/**
 * Get public technologies (no authentication required)
 */
export async function getPublicTechnologies(
  filters: Omit<TechnologyFilters, "visibility_mode"> = {},
  pagination: PaginationParams = {}
): Promise<ListApiResponse<Technology>> {
  try {
    return await getTechnologies(
      { ...filters, visibility_mode: "public" },
      pagination
    );
  } catch (error) {
    console.warn(
      "getPublicTechnologies falling back to /api/technologies",
      error
    );

    try {
      const params = new URLSearchParams();

      if (filters.search && filters.search.trim()) {
        params.set("search", filters.search.trim());
      }

      if (filters.category_id) {
        params.set("category", filters.category_id);
      }

      if (typeof filters.trl_level === "number") {
        params.set("trl_level", String(filters.trl_level));
      }

      if (filters.status) {
        params.set("status", String(filters.status).toUpperCase());
      }

      if (pagination.limit) {
        params.set("limit", String(pagination.limit));
      }

      if (pagination.page) {
        params.set("page", String(pagination.page));
      }

      if (pagination.sort) {
        const sortRaw = pagination.sort;
        const order = sortRaw.startsWith("-") ? "DESC" : "ASC";
        const field = sortRaw.replace(/^-/, "");
        const fallbackField = field
          .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
          .toLowerCase();
        params.set("sort", fallbackField || "created_at");
        params.set("order", order);
      }

      const query = params.toString();
      const response = await fetch(
        `/api/technologies${query ? `?${query}` : ""}`
      );

      if (!response.ok) {
        throw new Error(
          `Fallback request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      const docs = Array.isArray(data?.data)
        ? (data?.data as Technology[])
        : Array.isArray(data?.docs)
          ? (data?.docs as Technology[])
          : [];

      const total = Number(data?.pagination?.total ?? docs.length ?? 0);
      const limit = Number(
        data?.pagination?.limit ?? pagination.limit ?? PAGINATION_DEFAULTS.limit
      );
      const page = Number(
        data?.pagination?.page ?? pagination.page ?? PAGINATION_DEFAULTS.page
      );
      const totalPages = Number(
        data?.pagination?.totalPages ??
          Math.max(1, Math.ceil((total || docs.length) / Math.max(limit, 1)))
      );

      return {
        data: docs,
        docs: docs,
        totalDocs: total,
        limit,
        page,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      } as ListApiResponse<Technology>;
    } catch (fallbackError) {
      console.error(
        "Fallback fetch for public technologies failed",
        fallbackError
      );
      throw fallbackError;
    }
  }
}

/**
 * Search technologies by title or summary
 */
export async function searchTechnologies(
  query: string,
  filters: TechnologyFilters = {},
  pagination: PaginationParams = {}
): Promise<ListApiResponse<Technology>> {
  return getTechnologies({ ...filters, search: query }, pagination);
}

/**
 * Get technologies by category
 */
export async function getTechnologiesByCategory(
  categoryId: string,
  pagination: PaginationParams = {}
): Promise<ListApiResponse<Technology>> {
  return getTechnologies({ category_id: categoryId }, pagination);
}

/**
 * Get technologies by status
 */
export async function getTechnologiesByStatus(
  status: Technology["status"],
  pagination: PaginationParams = {}
): Promise<ListApiResponse<Technology>> {
  return getTechnologies({ status }, pagination);
}

/**
 * Get technologies by user (submitter)
 */
export async function getTechnologiesByUser(
  userId: string,
  pagination: PaginationParams = {}
): Promise<ListApiResponse<Technology>> {
  const params: Record<string, any> = {
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-createdAt",
    "where[submitter][equals]": userId,
  };

  return payloadApiClient.get<Technology[]>(
    API_ENDPOINTS.TECHNOLOGIES,
    params
  ) as Promise<ListApiResponse<Technology>>;
}

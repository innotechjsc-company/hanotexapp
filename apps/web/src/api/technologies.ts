/**
 * Technologies API functions
 * Các function để quản lý technologies với PayloadCMS
 */

import { PricingType, Technology, VisibilityMode } from "@/types/technologies";
import { payloadApiClient, ApiResponse } from "./client";
import { API_ENDPOINTS, PAGINATION_DEFAULTS } from "./config";

export interface TechnologyFilters {
  status?: Technology["status"];
  visibility_mode?: VisibilityMode;
  category_id?: string;
  trl_level?: number;
  pricing_type?: PricingType;
  search?: string;
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
): Promise<ApiResponse<Technology[]>> {
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

  return payloadApiClient.get<Technology[]>(API_ENDPOINTS.TECHNOLOGIES, params);
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
): Promise<ApiResponse<Technology[]>> {
  return getTechnologies({ ...filters, visibility_mode: "public" }, pagination);
}

/**
 * Search technologies by title or summary
 */
export async function searchTechnologies(
  query: string,
  filters: TechnologyFilters = {},
  pagination: PaginationParams = {}
): Promise<ApiResponse<Technology[]>> {
  return getTechnologies({ ...filters, search: query }, pagination);
}

/**
 * Get technologies by category
 */
export async function getTechnologiesByCategory(
  categoryId: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Technology[]>> {
  return getTechnologies({ category_id: categoryId }, pagination);
}

/**
 * Get technologies by status
 */
export async function getTechnologiesByStatus(
  status: Technology["status"],
  pagination: PaginationParams = {}
): Promise<ApiResponse<Technology[]>> {
  return getTechnologies({ status }, pagination);
}

/**
 * Get technologies by user (submitter)
 */
export async function getTechnologiesByUser(
  userId: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Technology[]>> {
  const params: Record<string, any> = {
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-createdAt",
    "where[submitter][equals]": userId,
  };

  return payloadApiClient.get<Technology[]>(API_ENDPOINTS.TECHNOLOGIES, params);
}

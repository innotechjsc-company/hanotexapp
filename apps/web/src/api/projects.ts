/**
 * Projects API functions
 * Các function để quản lý projects với PayloadCMS
 */

import { Project, ProjectStatusEnum } from "@/types/project";
import { payloadApiClient, ApiResponse } from "./client";
import { API_ENDPOINTS, PAGINATION_DEFAULTS } from "./config";
import { getStoredToken } from "./auth";

export interface ProjectFilters {
  status?: Project["status"];
  user_id?: string;
  technology_id?: string;
  investment_fund_id?: string;
  search?: string;
  min_goal_money?: number;
  max_goal_money?: number;
  end_date_from?: string;
  end_date_to?: string;
  open_investment_fund?: boolean;
}

export interface PaginationParams {
  limit?: number;
  page?: number;
  sort?: string;
}

/**
 * Get all projects with pagination and filters
 */
export async function getProjects(
  filters: ProjectFilters = {},
  pagination: PaginationParams = {},
  depth: number = 2
): Promise<ApiResponse<Project[]>> {
  // Map friendly filters to PayloadCMS REST 'where' syntax
  const params: Record<string, any> = {
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-createdAt",
    depth: depth, // Populate nested relations
  };

  // Status filter
  if (filters.status) {
    params["where[status][equals]"] = filters.status;
  }

  // User relationship
  if (filters.user_id) {
    params["where[user][equals]"] = filters.user_id;
  }

  // Technology relationship
  if (filters.technology_id) {
    params["where[technology][equals]"] = filters.technology_id;
  }

  // Investment fund relationship
  if (filters.investment_fund_id) {
    params["where[investment_fund][equals]"] = filters.investment_fund_id;
  }

  // Goal money range
  if (typeof filters.min_goal_money === "number") {
    params["where[goal_money][greater_than_equal]"] = filters.min_goal_money;
  }
  if (typeof filters.max_goal_money === "number") {
    params["where[goal_money][less_than_equal]"] = filters.max_goal_money;
  }

  // End date range
  if (filters.end_date_from) {
    params["where[end_date][greater_than_equal]"] = filters.end_date_from;
  }
  if (filters.end_date_to) {
    params["where[end_date][less_than_equal]"] = filters.end_date_to;
  }

  // Text search: match name or description using [like]
  if (filters.search && filters.search.trim()) {
    const q = filters.search.trim();
    params["where[or][0][name][like]"] = q;
    params["where[or][1][description][like]"] = q;
    // Fallback generic search param
    params["search"] = q;
  }

  return payloadApiClient.get<Project[]>(API_ENDPOINTS.PROJECTS, params);
}

/**
 * Get project by ID with depth for relations
 */
export async function getProjectById(id: string, depth: number = 2): Promise<Project> {
  const params: Record<string, any> = {
    depth: depth, // Populate nested relations (user, investment_fund, documents_finance, etc.)
  };

  const response = await payloadApiClient.get<Project>(
    `${API_ENDPOINTS.PROJECTS}/${id}`,
    params
  );

  // Handle different response formats from PayloadCMS
  const projectData =
    (response as any as { data: Project }).data ?? (response as any as Project);

  if (!projectData) {
    throw new Error("Project not found");
  }

  return projectData;
}


/**
 * Interface for creating project with services and IP
 */
export interface CreateProjectPayload {
  name: string;
  description: string;
  goal_money: number;
  end_date: string;
  technology: string; // Technology ID
  user: string; // User ID
  status?: string;
  investment_fund?: string; // Investment fund ID
  open_investment_fund?: boolean;
  documents?: string[]; // Media IDs
  owners?: Array<{
    owner_type: "individual" | "company" | "research_institution";
    owner_name: string;
    ownership_percentage: number;
    contact_info?: string;
  }>;
 // Service ticket creation
 services?: Array<{
  service_id: string;
  description: string;
  responsible_user_id: string;
  implementer_ids: string[];
  document_id?: string;
}>;
  intellectual_property?: Array<{
    ip_type: "patent" | "trademark" | "copyright" | "trade_secret";
    title: string;
    description: string;
    registration_number?: string;
    registration_date?: string;
    expiry_date?: string;
  }>;
}

/**
 * Response interface for project creation with additional data
 */
export interface CreateProjectResponse {
  success: boolean;
  data: Project;
  doc: Project; // For compatibility
  intellectual_property_records?: Array<any>;
  service_tickets?: Array<any>;
  message: string;
}

/**
 * Create new project with services and intellectual property support
 * Uses our custom CMS API endpoint that handles service tickets and IP creation
 */
export async function createProjectWithServices(
  data: CreateProjectPayload
): Promise<CreateProjectResponse> {
  // Use direct fetch to call our custom CMS API endpoint
  const cmsApiUrl =
    process.env.NEXT_PUBLIC_PAYLOAD_API_URL || "http://localhost:4000";
  const endpoint = `${cmsApiUrl}/project/create`;

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
    return result as CreateProjectResponse;
  } catch (error) {
    console.error("Create project error:", error);

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Failed to create project");
  }
}

/**
 * Create new project
 */
export async function createProject(data: Partial<Project>): Promise<Project> {
  const response = await payloadApiClient.post<Project>(
    API_ENDPOINTS.PROJECTS,
    data
  );
  return response.data!;
}

/**
 * Update project
 */
export async function updateProject(
  id: string,
  data: Partial<Project>
): Promise<Project> {
  const response = await payloadApiClient.patch<Project>(
    `${API_ENDPOINTS.PROJECTS}/${id}`,
    data
  );
  return response.data!;
}

/**
 * Delete project
 */
export async function deleteProject(id: string): Promise<void> {
  await payloadApiClient.delete(`${API_ENDPOINTS.PROJECTS}/${id}`);
}

/**
 * Get projects by status
 */
export async function getProjectsByStatus(
  status: Project["status"],
  pagination: PaginationParams = {}
): Promise<ApiResponse<Project[]>> {
  return getProjects({ status }, pagination);
}

/**
 * Get projects by user
 */
export async function getProjectsByUser(
  userId: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Project[]>> {
  return getProjects({ user_id: userId }, pagination);
}

/**
 * Get projects by technology
 */
export async function getProjectsByTechnology(
  technologyId: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Project[]>> {
  return getProjects({ technology_id: technologyId }, pagination);
}

/**
 * Get projects by investment fund
 */
export async function getProjectsByInvestmentFund(
  investmentFundId: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Project[]>> {
  return getProjects({ investment_fund_id: investmentFundId }, pagination);
}

/**
 * Search projects by name or description
 */
export async function searchProjects(
  query: string,
  filters: ProjectFilters = {},
  pagination: PaginationParams = {}
): Promise<ApiResponse<Project[]>> {
  return getProjects({ ...filters, search: query }, pagination);
}

/**
 * Get active projects (status: in_progress)
 */
export async function getActiveProjects(
  pagination: PaginationParams = {}
): Promise<ApiResponse<Project[]>> {
  return getProjects({ status: ProjectStatusEnum.ACTIVE }, pagination);
}

/**
 * Get pending projects
 */
export async function getPendingProjects(
  pagination: PaginationParams = {}
): Promise<ApiResponse<Project[]>> {
  return getProjects({ status: ProjectStatusEnum.PENDING }, pagination);
}

/**
 * Get completed projects
 */
export async function getCompletedProjects(
  pagination: PaginationParams = {}
): Promise<ApiResponse<Project[]>> {
  return getProjects({ status: ProjectStatusEnum.ACTIVE }, pagination);
}

/**
 * Get projects ending soon
 */
export async function getProjectsEndingSoon(
  daysFromNow: number = 7,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Project[]>> {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + daysFromNow);

  return getProjects(
    {
      status: ProjectStatusEnum.ACTIVE,
      end_date_to: endDate.toISOString().split("T")[0], // YYYY-MM-DD format
    },
    { ...pagination, sort: "end_date" }
  );
}

/**
 * Get projects by goal money range
 */
export async function getProjectsByGoalMoneyRange(
  minAmount: number,
  maxAmount: number,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Project[]>> {
  return getProjects(
    {
      min_goal_money: minAmount,
      max_goal_money: maxAmount,
    },
    pagination
  );
}

/**
 * Get projects with high funding goals (above threshold)
 */
export async function getHighFundingProjects(
  threshold: number = 1000000, // 1M VND default
  pagination: PaginationParams = {}
): Promise<ApiResponse<Project[]>> {
  return getProjects({ min_goal_money: threshold }, pagination);
}

/**
 * Get all active projects (exclude pending and cancelled)
 * Lấy tất cả dự án đang hoạt động: gồm in_progress và completed
 */
export async function getActiveProjectsAll(
  openInvestmentFund: boolean = false,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Project[]>> {
  const params: Record<string, any> = {
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-createdAt",
    // status in [ACTIVE]
    "where[or][0][status][equals]": ProjectStatusEnum.ACTIVE,
    "where[open_investment_fund][equals]": openInvestmentFund, // Added filter
  };

  return payloadApiClient.get<Project[]>(API_ENDPOINTS.PROJECTS, params);
}

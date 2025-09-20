/**
 * Users API functions
 * Các function để quản lý users với PayloadCMS
 */

import { payloadApiClient, ApiResponse } from "./client";
import { API_ENDPOINTS, PAGINATION_DEFAULTS } from "./config";
import type { User } from "@/types/users";
import type { Company } from "@/types/companies";
import type { ResearchInstitution } from "@/types/research-institutions";

export interface UserFilters {
  user_type?: User["user_type"];
  role?: User["role"];
  is_active?: boolean;
  is_verified?: boolean;
  search?: string;
}

export interface PaginationParams {
  limit?: number;
  page?: number;
  sort?: string;
}

/**
 * Get all users with pagination and filters
 */
export async function getUsers(
  filters: UserFilters = {},
  pagination: PaginationParams = {}
): Promise<ApiResponse<User[]>> {
  const params = {
    ...filters,
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-createdAt",
  };

  return payloadApiClient.get<User[]>(API_ENDPOINTS.USERS, params);
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<User> {
  const response = await payloadApiClient.get<User>(
    `${API_ENDPOINTS.USERS}/${id}`
  );
  return (response as any as { data: User }).data ?? (response as any as User);
}

/**
 * Create new user
 */
export async function createUser(data: Partial<User>): Promise<User> {
  const response = await payloadApiClient.post<User>(API_ENDPOINTS.USERS, data);
  return (response as any as { data: User }).data ?? (response as any as User);
}

/**
 * Update user
 */
export async function updateUser(
  id: string,
  data: Partial<User>
): Promise<User> {
  const response = await payloadApiClient.patch<User>(
    `${API_ENDPOINTS.USERS}/${id}`,
    data
  );
  return (response as any as { data: User }).data ?? (response as any as User);
}

/**
 * Delete user
 */
export async function deleteUser(id: string): Promise<void> {
  await payloadApiClient.delete(`${API_ENDPOINTS.USERS}/${id}`);
}

/**
 * Check whether user has company or research institution linked
 */
export function hasOrganization(user: User | null | undefined): {
  hasCompany: boolean;
  hasResearchInstitution: boolean;
} {
  const hasCompany = !!(user && user.company);
  const hasResearchInstitution = !!(user && user.research_institution);
  return { hasCompany, hasResearchInstitution };
}

/**
 * Fetch company info for a user
 */
export async function getUserCompany(userId: string): Promise<Company | null> {
  // Lấy user để biết company id
  const user = await getUserById(userId);
  const companyId = (user?.company as unknown as string) || "";
  if (!companyId) return null;

  const response = await payloadApiClient.get<Company>(
    `${API_ENDPOINTS.COMPANIES}/${companyId}`
  );
  return (
    (response as any as { data: Company }).data ?? (response as any as Company)
  );
}

/**
 * Fetch research institution info for a user
 */
export async function getUserResearchInstitution(
  userId: string
): Promise<ResearchInstitution | null> {
  const user = await getUserById(userId);
  const riId = (user?.research_institution as unknown as string) || "";
  if (!riId) return null;

  const response = await payloadApiClient.get<ResearchInstitution>(
    `${API_ENDPOINTS.RESEARCH_INSTITUTIONS}/${riId}`
  );
  return (
    (response as any as { data: ResearchInstitution }).data ??
    (response as any as ResearchInstitution)
  );
}

/**
 * Helper: fetch both company and research institution concurrently
 */
export async function getUserOrganizations(userId: string): Promise<{
  company: Company | null;
  researchInstitution: ResearchInstitution | null;
}> {
  const user = await getUserById(userId);
  const companyId = (user?.company as unknown as string) || "";
  const riId = (user?.research_institution as unknown as string) || "";

  const [companyRes, riRes] = await Promise.all([
    companyId
      ? payloadApiClient.get<Company>(`${API_ENDPOINTS.COMPANIES}/${companyId}`)
      : Promise.resolve(null as any),
    riId
      ? payloadApiClient.get<ResearchInstitution>(
          `${API_ENDPOINTS.RESEARCH_INSTITUTIONS}/${riId}`
        )
      : Promise.resolve(null as any),
  ]);
  const company = companyRes
    ? ((companyRes as any as { data: Company }).data ??
      (companyRes as any as Company))
    : null;
  const researchInstitution = riRes
    ? ((riRes as any as { data: ResearchInstitution }).data ??
      (riRes as any as ResearchInstitution))
    : null;

  return { company, researchInstitution };
}

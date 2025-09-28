/**
 * Companies API functions
 * Các function để quản lý companies với PayloadCMS
 */

import { payloadApiClient, ApiResponse } from "./client";
import { API_ENDPOINTS, PAGINATION_DEFAULTS } from "./config";
import type { Company } from "@/types/companies";

export interface CompanyFilters {
  is_active?: boolean;
  search?: string; // tìm theo tên, mã số thuế, đại diện pháp luật, v.v.
}

export interface PaginationParams {
  limit?: number;
  page?: number;
  sort?: string;
}

/**
 * Get all companies with pagination and filters
 */
export async function getCompanies(
  filters: CompanyFilters = {},
  pagination: PaginationParams = {}
): Promise<ApiResponse<Company[]>> {
  const params = {
    ...filters,
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-createdAt",
  };

  return payloadApiClient.get<Company[]>(API_ENDPOINTS.COMPANIES, params);
}

/**
 * Get company by ID
 */
export async function getCompanyById(id: string): Promise<Company> {
  const response = await payloadApiClient.get<Company>(
    `${API_ENDPOINTS.COMPANIES}/${id}`
  );
  // PayloadCMS returns direct object for single document, not wrapped in data property
  return (response as Company) || (response as { data: Company }).data;
}

/**
 * Create new company
 */
export async function createCompany(data: Partial<Company>): Promise<Company> {
  const response = await payloadApiClient.post<Company>(
    API_ENDPOINTS.COMPANIES,
    data
  );
  return (response as Company) || (response as { data: Company }).data;
}

/**
 * Update company
 */
export async function updateCompany(
  id: string,
  data: Partial<Company>
): Promise<Company> {
  const response = await payloadApiClient.patch<Company>(
    `${API_ENDPOINTS.COMPANIES}/${id}`,
    data
  );
  return (response as Company) || (response as { data: Company }).data;
}

/**
 * Delete company
 */
export async function deleteCompany(id: string): Promise<void> {
  await payloadApiClient.delete(`${API_ENDPOINTS.COMPANIES}/${id}`);
}

/**
 * Get active companies only
 */
export async function getActiveCompanies(
  pagination: PaginationParams = {}
): Promise<ApiResponse<Company[]>> {
  return getCompanies({ is_active: true }, pagination);
}

/**
 * Search companies by name/tax code/etc.
 */
export async function searchCompanies(
  query: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Company[]>> {
  return getCompanies({ search: query }, pagination);
}

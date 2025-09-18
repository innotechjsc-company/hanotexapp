/**
 * Research Institutions API functions
 * Các function để quản lý research-institutions với PayloadCMS
 */

import { payloadApiClient, ApiResponse } from "./client";
import { API_ENDPOINTS, PAGINATION_DEFAULTS } from "./config";
import type { ResearchInstitution } from "@/types/research-institutions";

export interface ResearchInstitutionFilters {
  institution_type?: ResearchInstitution["institution_type"];
  is_active?: boolean;
  search?: string; // tìm theo tên, mã, cơ quan quản lý, v.v.
}

export interface PaginationParams {
  limit?: number;
  page?: number;
  sort?: string;
}

/**
 * Get all research institutions with pagination and filters
 */
export async function getResearchInstitutions(
  filters: ResearchInstitutionFilters = {},
  pagination: PaginationParams = {}
): Promise<ApiResponse<ResearchInstitution[]>> {
  const params = {
    ...filters,
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-createdAt",
  };

  return payloadApiClient.get<ResearchInstitution[]>(
    API_ENDPOINTS.RESEARCH_INSTITUTIONS,
    params
  );
}

/**
 * Get research institution by ID
 */
export async function getResearchInstitutionById(
  id: string
): Promise<ResearchInstitution> {
  const response = await payloadApiClient.get<ResearchInstitution>(
    `${API_ENDPOINTS.RESEARCH_INSTITUTIONS}/${id}`
  );
  return (
    (response as any as { data: ResearchInstitution }).data ??
    (response as any as ResearchInstitution)
  );
}

/**
 * Create new research institution
 */
export async function createResearchInstitution(
  data: Partial<ResearchInstitution>
): Promise<ResearchInstitution> {
  const response = await payloadApiClient.post<ResearchInstitution>(
    API_ENDPOINTS.RESEARCH_INSTITUTIONS,
    data
  );
  return (
    (response as any as { data: ResearchInstitution }).data ??
    (response as any as ResearchInstitution)
  );
}

/**
 * Update research institution
 */
export async function updateResearchInstitution(
  id: string,
  data: Partial<ResearchInstitution>
): Promise<ResearchInstitution> {
  const response = await payloadApiClient.patch<ResearchInstitution>(
    `${API_ENDPOINTS.RESEARCH_INSTITUTIONS}/${id}`,
    data
  );
  return (
    (response as any as { data: ResearchInstitution }).data ??
    (response as any as ResearchInstitution)
  );
}

/**
 * Delete research institution
 */
export async function deleteResearchInstitution(id: string): Promise<void> {
  await payloadApiClient.delete(`${API_ENDPOINTS.RESEARCH_INSTITUTIONS}/${id}`);
}

/**
 * Get active research institutions only
 */
export async function getActiveResearchInstitutions(
  pagination: PaginationParams = {}
): Promise<ApiResponse<ResearchInstitution[]>> {
  return getResearchInstitutions({ is_active: true }, pagination);
}

/**
 * Filter by institution type
 */
export async function getResearchInstitutionsByType(
  type: ResearchInstitution["institution_type"],
  pagination: PaginationParams = {}
): Promise<ApiResponse<ResearchInstitution[]>> {
  return getResearchInstitutions({ institution_type: type }, pagination);
}

/**
 * Search research institutions by name/code/etc.
 */
export async function searchResearchInstitutions(
  query: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<ResearchInstitution[]>> {
  return getResearchInstitutions({ search: query }, pagination);
}

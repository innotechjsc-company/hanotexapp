/**
 * Intellectual Properties API functions
 * Các function để quản lý intellectual properties với PayloadCMS
 */

import { payloadApiClient, ApiResponse } from './client';
import { API_ENDPOINTS, PAGINATION_DEFAULTS } from './config';

// Import the base type from CMS
import { IntellectualProperty as BaseIntellectualProperty } from '../../../cms/src/types/IntellectualProperty';

// Extended interface with API fields
export interface IntellectualProperty extends BaseIntellectualProperty {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Type mappings for better type safety
export type IPTechnology = IntellectualProperty['technology'];
export type IPCode = IntellectualProperty['code'];
export type IPType = IntellectualProperty['type'];
export type IPStatus = IntellectualProperty['status'];

export interface IntellectualPropertyFilters {
  technology?: string;
  code?: string;
  type?: string;
  status?: string;
  search?: string;
}

export interface PaginationParams {
  limit?: number;
  page?: number;
  sort?: string;
}

/**
 * Get all intellectual properties with pagination and filters
 */
export async function getIntellectualProperties(
  filters: IntellectualPropertyFilters = {},
  pagination: PaginationParams = {}
): Promise<ApiResponse<IntellectualProperty[]>> {
  const params = {
    ...filters,
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || '-createdAt',
  };

  return payloadApiClient.get<IntellectualProperty[]>(API_ENDPOINTS.INTELLECTUAL_PROPERTIES, params);
}

/**
 * Get intellectual property by ID
 */
export async function getIntellectualPropertyById(id: string): Promise<IntellectualProperty> {
  const response = await payloadApiClient.get<IntellectualProperty>(`${API_ENDPOINTS.INTELLECTUAL_PROPERTIES}/${id}`);
  return response.data!;
}

/**
 * Create new intellectual property
 */
export async function createIntellectualProperty(data: Partial<IntellectualProperty>): Promise<IntellectualProperty> {
  const response = await payloadApiClient.post<IntellectualProperty>(API_ENDPOINTS.INTELLECTUAL_PROPERTIES, data);
  return response.data!;
}

/**
 * Update intellectual property
 */
export async function updateIntellectualProperty(id: string, data: Partial<IntellectualProperty>): Promise<IntellectualProperty> {
  const response = await payloadApiClient.patch<IntellectualProperty>(`${API_ENDPOINTS.INTELLECTUAL_PROPERTIES}/${id}`, data);
  return response.data!;
}

/**
 * Delete intellectual property
 */
export async function deleteIntellectualProperty(id: string): Promise<void> {
  await payloadApiClient.delete(`${API_ENDPOINTS.INTELLECTUAL_PROPERTIES}/${id}`);
}

/**
 * Search intellectual properties by technology, code, or type
 */
export async function searchIntellectualProperties(
  query: string,
  filters: IntellectualPropertyFilters = {},
  pagination: PaginationParams = {}
): Promise<ApiResponse<IntellectualProperty[]>> {
  return getIntellectualProperties(
    { ...filters, search: query },
    pagination
  );
}

/**
 * Get intellectual properties by technology
 */
export async function getIntellectualPropertiesByTechnology(
  technology: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<IntellectualProperty[]>> {
  return getIntellectualProperties(
    { technology },
    pagination
  );
}

/**
 * Get intellectual properties by type
 */
export async function getIntellectualPropertiesByType(
  type: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<IntellectualProperty[]>> {
  return getIntellectualProperties(
    { type },
    pagination
  );
}

/**
 * Get intellectual properties by status
 */
export async function getIntellectualPropertiesByStatus(
  status: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<IntellectualProperty[]>> {
  return getIntellectualProperties(
    { status },
    pagination
  );
}

/**
 * Get intellectual properties by code
 */
export async function getIntellectualPropertiesByCode(
  code: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<IntellectualProperty[]>> {
  return getIntellectualProperties(
    { code },
    pagination
  );
}

/**
 * Get intellectual properties with multiple filters
 */
export async function getFilteredIntellectualProperties(
  filters: {
    technology?: string;
    type?: string;
    status?: string;
    code?: string;
  },
  pagination: PaginationParams = {}
): Promise<ApiResponse<IntellectualProperty[]>> {
  return getIntellectualProperties(filters, pagination);
}
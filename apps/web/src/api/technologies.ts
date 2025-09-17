/**
 * Technologies API functions
 * Các function để quản lý technologies với PayloadCMS
 */

import { payloadApiClient, ApiResponse } from './client';
import { API_ENDPOINTS, PAGINATION_DEFAULTS } from './config';

export interface Technology {
  id: string;
  title: string;
  public_summary?: string;
  confidential_detail?: any; // Rich text content
  trl_level?: number;
  category_id?: string | Category;
  submitter_id: string | User;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'INACTIVE';
  visibility_mode: 'public' | 'private' | 'restricted';
  owners?: Array<{
    owner_type: 'INDIVIDUAL' | 'COMPANY' | 'RESEARCH_INSTITUTION';
    owner_name: string;
    ownership_percentage: number;
  }>;
  ip_details?: Array<{
    ip_type: 'PATENT' | 'UTILITY_MODEL' | 'INDUSTRIAL_DESIGN' | 'TRADEMARK' | 'SOFTWARE_COPYRIGHT' | 'TRADE_SECRET';
    ip_number?: string;
    status?: string;
    territory?: string;
  }>;
  pricing?: {
    pricing_type: 'APPRAISAL' | 'ASK' | 'AUCTION' | 'OFFER';
    asking_price?: number;
    currency: 'VND' | 'USD' | 'EUR';
    price_type?: string;
    appraisal_purpose?: string;
    appraisal_scope?: string;
    appraisal_deadline?: string;
  };
  documents?: string[] | Media[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface User {
  id: string;
  email: string;
}

export interface Media {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
}

export interface Pricing {
  pricing_type: 'APPRAISAL' | 'ASK' | 'AUCTION' | 'OFFER';
  asking_price?: number;
  currency: 'VND' | 'USD' | 'EUR';
  price_type?: string;
  appraisal_purpose?: string;
}


export interface TechnologyFilters {
  status?: Technology['status'];
  visibility_mode?: Technology['visibility_mode'];
  category_id?: string;
  trl_level?: number;
  pricing_type?: Pricing['pricing_type'];
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
  const params = {
    ...filters,
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || '-createdAt',
  };

  return payloadApiClient.get<Technology[]>(API_ENDPOINTS.TECHNOLOGIES, params);
}

/**
 * Get technology by ID
 */
export async function getTechnologyById(id: string): Promise<Technology> {
  const response = await payloadApiClient.get<Technology>(`${API_ENDPOINTS.TECHNOLOGIES}/${id}`);
  return response.data!;
}

/**
 * Create new technology
 */
export async function createTechnology(data: Partial<Technology>): Promise<Technology> {
  const response = await payloadApiClient.post<Technology>(API_ENDPOINTS.TECHNOLOGIES, data);
  return response.data!;
}

/**
 * Update technology
 */
export async function updateTechnology(id: string, data: Partial<Technology>): Promise<Technology> {
  const response = await payloadApiClient.patch<Technology>(`${API_ENDPOINTS.TECHNOLOGIES}/${id}`, data);
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
  filters: Omit<TechnologyFilters, 'visibility_mode'> = {},
  pagination: PaginationParams = {}
): Promise<ApiResponse<Technology[]>> {
  return getTechnologies(
    { ...filters, visibility_mode: 'public' },
    pagination
  );
}

/**
 * Search technologies by title or summary
 */
export async function searchTechnologies(
  query: string,
  filters: TechnologyFilters = {},
  pagination: PaginationParams = {}
): Promise<ApiResponse<Technology[]>> {
  return getTechnologies(
    { ...filters, search: query },
    pagination
  );
}

/**
 * Get technologies by category
 */
export async function getTechnologiesByCategory(
  categoryId: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Technology[]>> {
  return getTechnologies(
    { category_id: categoryId },
    pagination
  );
}

/**
 * Get technologies by status
 */
export async function getTechnologiesByStatus(
  status: Technology['status'],
  pagination: PaginationParams = {}
): Promise<ApiResponse<Technology[]>> {
  return getTechnologies(
    { status },
    pagination
  );
}

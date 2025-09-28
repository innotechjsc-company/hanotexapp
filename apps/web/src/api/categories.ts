/**
 * Categories API functions
 * Các function để quản lý categories với PayloadCMS
 */

import { Category } from "@/types/categories";
import { payloadApiClient, ApiResponse } from "./client";
import { API_ENDPOINTS, PAGINATION_DEFAULTS } from "./config";

export interface CategoryFilters {
  parent_id?: string;
  is_active?: boolean;
  search?: string;
}

export interface PaginationParams {
  limit?: number;
  page?: number;
  sort?: string;
}

/**
 * Get all categories with pagination and filters
 */
export async function getCategories(
  filters: CategoryFilters = {},
  pagination: PaginationParams = {}
): Promise<ApiResponse<Category[]>> {
  const queryParams = new URLSearchParams();
  
  if (filters.search) queryParams.set('search', filters.search);
  if (filters.parent_id) queryParams.set('parent_id', filters.parent_id);
  if (filters.is_active !== undefined) queryParams.set('is_active', filters.is_active.toString());
  if (pagination.limit) queryParams.set('limit', pagination.limit.toString());
  if (pagination.page) queryParams.set('page', pagination.page.toString());
  if (pagination.sort) queryParams.set('sort', pagination.sort);

  const response = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:4000/api'}/master-data/categories?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

/**
 * Get category by ID
 */
export async function getCategoryById(id: string): Promise<Category> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:4000/api'}/master-data/categories/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.data || data;
}

/**
 * Create new category (Admin only - uses direct CMS API)
 */
export async function createCategory(
  data: Partial<Category>
): Promise<Category> {
  const response = await payloadApiClient.post<Category>(
    API_ENDPOINTS.CATEGORIES,
    data
  );
  return response.data!;
}

/**
 * Update category (Admin only - uses direct CMS API)
 */
export async function updateCategory(
  id: string,
  data: Partial<Category>
): Promise<Category> {
  const response = await payloadApiClient.patch<Category>(
    `${API_ENDPOINTS.CATEGORIES}/${id}`,
    data
  );
  return response.data!;
}

/**
 * Delete category (Admin only - uses direct CMS API)
 */
export async function deleteCategory(id: string): Promise<void> {
  await payloadApiClient.delete(`${API_ENDPOINTS.CATEGORIES}/${id}`);
}

/**
 * Get active categories only
 */
export async function getAllCategories(
  pagination: PaginationParams = {}
): Promise<ApiResponse<Category[]>> {
  const queryParams = new URLSearchParams();
  
  if (pagination.limit) queryParams.set('limit', pagination.limit.toString());
  if (pagination.page) queryParams.set('page', pagination.page.toString());
  if (pagination.sort) queryParams.set('sort', pagination.sort);

  // Use the updated web API route which fetches from CMS
  const response = await fetch(`${process.env.NEXT_PUBLIC_PAYLOAD_API_URL || 'http://localhost:4000/api'}/master-data/categories?${queryParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

/**
 * Get root categories (no parent)
 */
export async function getRootCategories(
  pagination: PaginationParams = {}
): Promise<ApiResponse<Category[]>> {
  return getCategories({ parent_id: undefined }, pagination);
}

/**
 * Get subcategories by parent ID
 */
export async function getSubcategories(
  parentId: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Category[]>> {
  return getCategories({ parent_id: parentId }, pagination);
}

/**
 * Search categories by name
 */
export async function searchCategories(
  query: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Category[]>> {
  return getCategories({ search: query }, pagination);
}

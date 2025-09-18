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
  const params = {
    ...filters,
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "sort_order",
  };

  return payloadApiClient.get<Category[]>(API_ENDPOINTS.CATEGORIES, params);
}

/**
 * Get category by ID
 */
export async function getCategoryById(id: string): Promise<Category> {
  const response = await payloadApiClient.get<Category>(
    `${API_ENDPOINTS.CATEGORIES}/${id}`
  );
  return response.data!;
}

/**
 * Create new category
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
 * Update category
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
 * Delete category
 */
export async function deleteCategory(id: string): Promise<void> {
  await payloadApiClient.delete(`${API_ENDPOINTS.CATEGORIES}/${id}`);
}

/**
 * Get active categories only
 */
export async function getActiveCategories(
  pagination: PaginationParams = {}
): Promise<ApiResponse<Category[]>> {
  return getCategories({ is_active: true }, pagination);
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

/**
 * Categories API functions
 * Các function để quản lý categories với PayloadCMS trực tiếp từ /api/categories
 */

import { Category } from "@/types/categories";
import { payloadApiClient, ApiResponse } from "./client";
import { API_ENDPOINTS, PAGINATION_DEFAULTS } from "./config";
import { getStoredToken } from "./auth";

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
 * Get all categories with pagination and filters - sử dụng trực tiếp /api/categories
 */
export async function getCategories(
  filters: CategoryFilters = {},
  pagination: PaginationParams = {}
): Promise<ApiResponse<Category[]>> {
  // Sử dụng payloadApiClient để gọi trực tiếp /api/categories
  const params: Record<string, any> = {
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-createdAt",
  };

  // Thêm filters vào params theo format của PayloadCMS
  if (filters.search && filters.search.trim()) {
    params["where[name][contains]"] = filters.search.trim();
  }
  if (filters.parent_id) {
    params["where[parent][equals]"] = filters.parent_id;
  }
  if (filters.is_active !== undefined) {
    params["where[is_active][equals]"] = filters.is_active;
  }

  return payloadApiClient.get<Category[]>(API_ENDPOINTS.CATEGORIES, params);
}

/**
 * Get category by ID - sử dụng trực tiếp /api/categories
 */
export async function getCategoryById(id: string): Promise<Category> {
  const res = await payloadApiClient.get<Category>(
    `${API_ENDPOINTS.CATEGORIES}/${id}`
  );
  const anyRes = res as any;
  const item =
    anyRes?.data ??
    anyRes?.doc ??
    (Array.isArray(anyRes?.docs) ? anyRes.docs[0] : undefined) ??
    anyRes;
  return item as Category;
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
 * Get all categories - sử dụng trực tiếp /api/categories (lấy tất cả, không filter is_active)
 */
export async function getAllCategories(
  pagination: PaginationParams = {}
): Promise<ApiResponse<Category[]>> {
  // Sử dụng payloadApiClient để gọi trực tiếp /api/categories
  const params: Record<string, any> = {
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-createdAt",
    // Lấy tất cả categories, không filter theo is_active
  };

  return payloadApiClient.get<Category[]>(API_ENDPOINTS.CATEGORIES, params);
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

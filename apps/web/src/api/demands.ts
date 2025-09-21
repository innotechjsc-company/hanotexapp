/**
 * Demands API functions
 * Các function để quản lý demands với PayloadCMS
 */

import { Demand } from "@/types/demand";
import { payloadApiClient, ApiResponse } from "./client";
import { API_ENDPOINTS, PAGINATION_DEFAULTS } from "./config";

export interface DemandFilters {
  category?: string;
  user?: string;
  trl_level?: number;
  from_price_min?: number;
  from_price_max?: number;
  to_price_min?: number;
  to_price_max?: number;
  cooperation?: string;
  search?: string;
}

export interface PaginationParams {
  limit?: number;
  page?: number;
  sort?: string;
}

/**
 * Get all demands with pagination and filters
 */
export async function getDemands(
  filters: DemandFilters = {},
  pagination: PaginationParams = {}
): Promise<ApiResponse<Demand[]>> {
  const params = {
    ...filters,
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-createdAt",
  };

  return payloadApiClient.get<Demand[]>(API_ENDPOINTS.DEMANDS, params);
}

/**
 * Get demand by ID
 */
export async function getDemandById(id: string): Promise<Demand> {
  const response = await payloadApiClient.get<Demand>(
    `${API_ENDPOINTS.DEMANDS}/${id}`
  );
  return response as any as Demand;
}

/**
 * Create new demand
 */
export async function createDemand(data: Partial<Demand>): Promise<Demand> {
  const response = await payloadApiClient.post<Demand>(
    API_ENDPOINTS.DEMANDS,
    data
  );
  return response.data!;
}

/**
 * Update demand
 */
export async function updateDemand(
  id: string,
  data: Partial<Demand>
): Promise<Demand> {
  const response = await payloadApiClient.patch<Demand>(
    `${API_ENDPOINTS.DEMANDS}/${id}`,
    data
  );
  return response.data!;
}

/**
 * Delete demand
 */
export async function deleteDemand(id: string): Promise<void> {
  await payloadApiClient.delete(`${API_ENDPOINTS.DEMANDS}/${id}`);
}

/**
 * Get all demands (convenience function)
 */
export async function getAllDemands(
  pagination: PaginationParams = {}
): Promise<ApiResponse<Demand[]>> {
  return getDemands({}, pagination);
}

/**
 * Search demands by title or description
 */
export async function searchDemands(
  query: string,
  filters: DemandFilters = {},
  pagination: PaginationParams = {}
): Promise<ApiResponse<Demand[]>> {
  return getDemands({ ...filters, search: query }, pagination);
}

/**
 * Get demands by category
 */
export async function getDemandsByCategory(
  categoryId: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Demand[]>> {
  return getDemands({ category: categoryId }, pagination);
}

/**
 * Get demands by user
 */
export async function getDemandsByUser(
  userId: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Demand[]>> {
  return getDemands({ user: userId }, pagination);
}

/**
 * Get demands by TRL level
 */
export async function getDemandsByTrlLevel(
  trlLevel: number,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Demand[]>> {
  return getDemands({ trl_level: trlLevel }, pagination);
}

/**
 * Get demands by price range
 */
export async function getDemandsByPriceRange(
  fromPriceMin?: number,
  fromPriceMax?: number,
  toPriceMin?: number,
  toPriceMax?: number,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Demand[]>> {
  return getDemands(
    {
      from_price_min: fromPriceMin,
      from_price_max: fromPriceMax,
      to_price_min: toPriceMin,
      to_price_max: toPriceMax,
    },
    pagination
  );
}

/**
 * Get demands by cooperation type
 */
export async function getDemandsByCooperation(
  cooperation: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Demand[]>> {
  return getDemands({ cooperation }, pagination);
}

/**
 * Get recent demands (sorted by creation date)
 */
export async function getRecentDemands(
  pagination: PaginationParams = {}
): Promise<ApiResponse<Demand[]>> {
  return getDemands({}, { ...pagination, sort: "-createdAt" });
}

/**
 * Get demands with documents
 */
export async function getDemandsWithDocuments(
  pagination: PaginationParams = {}
): Promise<ApiResponse<Demand[]>> {
  // This would need to be implemented based on how documents are filtered in the API
  // For now, we'll just return all demands
  return getDemands({}, pagination);
}

/**
 * Advanced search with multiple filters
 */
export async function advancedSearchDemands(
  searchQuery?: string,
  categoryId?: string,
  trlLevel?: number,
  priceRange?: {
    fromMin?: number;
    fromMax?: number;
    toMin?: number;
    toMax?: number;
  },
  cooperation?: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Demand[]>> {
  const filters: DemandFilters = {};

  if (searchQuery) filters.search = searchQuery;
  if (categoryId) filters.category = categoryId;
  if (trlLevel) filters.trl_level = trlLevel;
  if (cooperation) filters.cooperation = cooperation;
  if (priceRange) {
    if (priceRange.fromMin) filters.from_price_min = priceRange.fromMin;
    if (priceRange.fromMax) filters.from_price_max = priceRange.fromMax;
    if (priceRange.toMin) filters.to_price_min = priceRange.toMin;
    if (priceRange.toMax) filters.to_price_max = priceRange.toMax;
  }

  return getDemands(filters, pagination);
}

/**
 * Get demand statistics (if supported by API)
 */
export async function getDemandStats(): Promise<{
  total: number;
  byCategory: Record<string, number>;
  byTrlLevel: Record<number, number>;
  averagePriceRange: { from: number; to: number };
}> {
  // This would need to be implemented based on API capabilities
  // For now, return a placeholder
  throw new Error("Demand statistics not implemented yet");
}

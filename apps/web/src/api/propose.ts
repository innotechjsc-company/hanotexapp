/**
 * Propose API functions
 * Các function để quản lý propose với PayloadCMS
 */

import { Propose, ProposeStatus, ProposeStatusEnum } from "@/types/propose";
import { payloadApiClient, ApiResponse } from "./client";
import { API_ENDPOINTS, PAGINATION_DEFAULTS } from "./config";

export interface ProposeFilters {
  demand?: string;
  user?: string;
  technology?: string;
  receiver?: string;
  status?: ProposeStatus;
  estimated_cost_min?: number;
  estimated_cost_max?: number;
  execution_time_min?: string;
  execution_time_max?: string;
  search?: string;
}

export interface PaginationParams {
  limit?: number;
  page?: number;
  sort?: string;
}

/**
 * Get all proposes with pagination and filters
 */
export async function getProposes(
  filters: ProposeFilters = {},
  pagination: PaginationParams = {}
): Promise<ApiResponse<Propose[]>> {
  const params: Record<string, any> = {
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-createdAt",
  };

  // equals filters
  if (filters.demand) params["where[demand][equals]"] = filters.demand;
  if (filters.user) params["where[user][equals]"] = filters.user;
  if (filters.receiver) params["where[receiver][equals]"] = filters.receiver;
  if (filters.technology)
    params["where[technology][equals]"] = filters.technology;
  if (filters.status) params["where[status][equals]"] = filters.status;

  // numeric / range filters
  if (typeof filters.estimated_cost_min === "number")
    params["where[estimated_cost][gte]"] = filters.estimated_cost_min;
  if (typeof filters.estimated_cost_max === "number")
    params["where[estimated_cost][lte]"] = filters.estimated_cost_max;

  if (filters.execution_time_min)
    params["where[execution_time][gte]"] = filters.execution_time_min;
  if (filters.execution_time_max)
    params["where[execution_time][lte]"] = filters.execution_time_max;

  // optional text search (backend must support)
  if (filters.search) params["where[title][contains]"] = filters.search;

  return payloadApiClient.get<Propose[]>(API_ENDPOINTS.PROPOSE, params);
}

/**
 * Get propose by ID
 */
export async function getProposeById(id: string): Promise<Propose> {
  const response = await payloadApiClient.get<Propose>(
    `${API_ENDPOINTS.PROPOSE}/${id}?depth=2`
  );
  // PayloadCMS may return the document directly (not wrapped in data)
  const anyRes = response as any;
  const doc = anyRes?.data ?? anyRes?.doc ?? anyRes;
  return doc as Propose;
}

/**
 * Create new propose
 */
export async function createPropose(data: Partial<Propose>): Promise<Propose> {
  const response = await payloadApiClient.post<Propose>(
    API_ENDPOINTS.PROPOSE,
    data
  );
  return response as any;
}

/**
 * Update propose
 */
export async function updatePropose(
  id: string,
  data: Partial<Propose>
): Promise<Propose> {
  const response = await payloadApiClient.patch<Propose>(
    `${API_ENDPOINTS.PROPOSE}/${id}`,
    data
  );
  return response.data!;
}

/**
 * Delete propose
 */
export async function deletePropose(id: string): Promise<void> {
  await payloadApiClient.delete(`${API_ENDPOINTS.PROPOSE}/${id}`);
}

/**
 * Update propose status
 */
export async function updateProposeStatus(
  id: string,
  status: ProposeStatus
): Promise<Propose> {
  const response = await payloadApiClient.patch<Propose>(
    `${API_ENDPOINTS.PROPOSE}/${id}`,
    {
      status,
    }
  );
  return response.data!;
}

/**
 * Accept propose (simple status change)
 */
export async function acceptPropose(id: string): Promise<Propose> {
  return updateProposeStatus(id, ProposeStatusEnum.negotiating);
}

/**
 * Accept propose with message and negotiation setup
 */
export async function acceptProposeWithMessage(
  proposeId: string,
  message?: string
): Promise<{
  success: boolean;
  propose: Propose;
  propose_type: string;
  negotiating_message: any;
  offer: any;
  message: string;
}> {
  const response = await payloadApiClient.post("/propose/accept", {
    proposeId,
    proposeType: "propose", // For demand proposals
    message: message || "Đã chấp nhận đề xuất và sẵn sàng đàm phán.",
  });

  return response as any;
}

/**
 * Reject propose (simple status change)
 */
export async function rejectPropose(id: string): Promise<Propose> {
  return updateProposeStatus(id, ProposeStatusEnum.cancelled);
}

/**
 * Reject propose with message
 */
export async function rejectProposeWithMessage(
  proposeId: string,
  message?: string
): Promise<Propose> {
  // For rejection, we can just update the status directly
  // since we don't need to create negotiation messages
  const response = await payloadApiClient.patch<Propose>(
    `${API_ENDPOINTS.PROPOSE}/${proposeId}`,
    {
      status: ProposeStatusEnum.cancelled,
    }
  );
  return response.data!;
}

/**
 * Get all proposes (convenience function)
 */
export async function getAllProposes(
  pagination: PaginationParams = {}
): Promise<ApiResponse<Propose[]>> {
  return getProposes({}, pagination);
}

/**
 * Search proposes by description
 */
export async function searchProposes(
  query: string,
  filters: ProposeFilters = {},
  pagination: PaginationParams = {}
): Promise<ApiResponse<Propose[]>> {
  return getProposes({ ...filters, search: query }, pagination);
}

/**
 * Get proposes by demand
 */
export async function getProposesByDemand(
  demandId: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Propose[]>> {
  const params: Record<string, any> = {
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-createdAt",
    "where[demand][equals]": demandId,
  };
  return payloadApiClient.get<Propose[]>(API_ENDPOINTS.PROPOSE, params);
}

/**
 * Get proposes by user
 */
export async function getProposesByUser(
  userId: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Propose[]>> {
  return getProposes({ user: userId }, pagination);
}

/**
 * Get proposes by technology
 */
export async function getProposesByTechnology(
  technologyId: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Propose[]>> {
  return getProposes({ technology: technologyId }, pagination);
}

/**
 * Get proposes by status
 */
export async function getProposesByStatus(
  status: ProposeStatus,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Propose[]>> {
  return getProposes({ status }, pagination);
}

/**
 * Get pending proposes
 */
export async function getPendingProposes(
  pagination: PaginationParams = {}
): Promise<ApiResponse<Propose[]>> {
  return getProposesByStatus("pending", pagination);
}

/**
 * Get accepted proposes
 */
export async function getAcceptedProposes(
  pagination: PaginationParams = {}
): Promise<ApiResponse<Propose[]>> {
  return getProposesByStatus(ProposeStatusEnum.negotiating, pagination);
}

/**
 * Get rejected proposes
 */
export async function getRejectedProposes(
  pagination: PaginationParams = {}
): Promise<ApiResponse<Propose[]>> {
  return getProposesByStatus(ProposeStatusEnum.cancelled, pagination);
}

/**
 * Get proposes by cost range
 */
export async function getProposesByCostRange(
  minCost?: number,
  maxCost?: number,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Propose[]>> {
  return getProposes(
    {
      estimated_cost_min: minCost,
      estimated_cost_max: maxCost,
    },
    pagination
  );
}

/**
 * Get proposes by execution time range
 */
export async function getProposesByExecutionTime(
  minTime?: string,
  maxTime?: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Propose[]>> {
  return getProposes(
    {
      execution_time_min: minTime,
      execution_time_max: maxTime,
    },
    pagination
  );
}

/**
 * Get recent proposes (sorted by creation date)
 */
export async function getRecentProposes(
  pagination: PaginationParams = {}
): Promise<ApiResponse<Propose[]>> {
  return getProposes({}, { ...pagination, sort: "-createdAt" });
}

/**
 * Get proposes with documents
 */
export async function getProposesWithDocuments(
  pagination: PaginationParams = {}
): Promise<ApiResponse<Propose[]>> {
  // This would need to be implemented based on how documents are filtered in the API
  // For now, we'll just return all proposes
  return getProposes({}, pagination);
}

/**
 * Advanced search with multiple filters
 */
export async function advancedSearchProposes(
  searchQuery?: string,
  demandId?: string,
  userId?: string,
  technologyId?: string,
  status?: ProposeStatus,
  costRange?: {
    min?: number;
    max?: number;
  },
  executionTimeRange?: {
    min?: string;
    max?: string;
  },
  pagination: PaginationParams = {}
): Promise<ApiResponse<Propose[]>> {
  const filters: ProposeFilters = {};

  if (searchQuery) filters.search = searchQuery;
  if (demandId) filters.demand = demandId;
  if (userId) filters.user = userId;
  if (technologyId) filters.technology = technologyId;
  if (status) filters.status = status;
  if (costRange) {
    if (costRange.min) filters.estimated_cost_min = costRange.min;
    if (costRange.max) filters.estimated_cost_max = costRange.max;
  }
  if (executionTimeRange) {
    if (executionTimeRange.min)
      filters.execution_time_min = executionTimeRange.min;
    if (executionTimeRange.max)
      filters.execution_time_max = executionTimeRange.max;
  }

  return getProposes(filters, pagination);
}

/**
 * Get propose statistics (if supported by API)
 */
export async function getProposeStats(): Promise<{
  total: number;
  byStatus: Record<ProposeStatus, number>;
  byDemand: Record<string, number>;
  averageCost: number;
  averageExecutionTime: number;
}> {
  // This would need to be implemented based on API capabilities
  // For now, return a placeholder
  throw new Error("Propose statistics not implemented yet");
}

/**
 * Bulk update proposes
 */
export async function bulkUpdateProposes(
  ids: string[],
  updates: Partial<Propose>
): Promise<Propose[]> {
  // This would need to be implemented based on API capabilities
  // For now, update each propose individually
  const promises = ids.map((id) => updatePropose(id, updates));
  return Promise.all(promises);
}

/**
 * Bulk delete proposes
 */
export async function bulkDeleteProposes(ids: string[]): Promise<void> {
  // This would need to be implemented based on API capabilities
  // For now, delete each propose individually
  const promises = ids.map((id) => deletePropose(id));
  await Promise.all(promises);
}

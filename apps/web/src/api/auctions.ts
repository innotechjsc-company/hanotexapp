/**
 * Auctions API functions
 * Các function để quản lý auctions với PayloadCMS
 */

import { Auction } from "@/types/auctions";
import { payloadApiClient, ApiResponse } from "./client";
import { API_ENDPOINTS, PAGINATION_DEFAULTS } from "./config";

export interface AuctionFilters {
  status?: Auction["status"];
  auction_type?: Auction["auction_type"];
  technology_id?: string;
  seller_id?: string;
  search?: string;
}

export interface PaginationParams {
  limit?: number;
  page?: number;
  sort?: string;
}

/**
 * Get all auctions with pagination and filters
 */
export async function getAuctions(
  filters: AuctionFilters = {},
  pagination: PaginationParams = {}
): Promise<ApiResponse<Auction[]>> {
  const params = {
    ...filters,
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-createdAt",
  };

  return payloadApiClient.get<Auction[]>(API_ENDPOINTS.AUCTIONS, params);
}

/**
 * Get auction by ID
 */
export async function getAuctionById(id: string): Promise<Auction> {
  const response = await payloadApiClient.get<Auction>(
    `${API_ENDPOINTS.AUCTIONS}/${id}`
  );
  return response.data!;
}

/**
 * Create new auction
 */
export async function createAuction(data: Partial<Auction>): Promise<Auction> {
  const response = await payloadApiClient.post<Auction>(
    API_ENDPOINTS.AUCTIONS,
    data
  );
  return response.data!;
}

/**
 * Update auction
 */
export async function updateAuction(
  id: string,
  data: Partial<Auction>
): Promise<Auction> {
  const response = await payloadApiClient.patch<Auction>(
    `${API_ENDPOINTS.AUCTIONS}/${id}`,
    data
  );
  return response.data!;
}

/**
 * Delete auction
 */
export async function deleteAuction(id: string): Promise<void> {
  await payloadApiClient.delete(`${API_ENDPOINTS.AUCTIONS}/${id}`);
}

/**
 * Get active auctions
 */
export async function getActiveAuctions(
  pagination: PaginationParams = {}
): Promise<ApiResponse<Auction[]>> {
  return getAuctions({ status: "ACTIVE" }, pagination);
}

/**
 * Get auctions by technology
 */
export async function getAuctionsByTechnology(
  technologyId: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Auction[]>> {
  return getAuctions({ technology_id: technologyId }, pagination);
}

/**
 * Get auctions by seller
 */
export async function getAuctionsBySeller(
  sellerId: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Auction[]>> {
  return getAuctions({ seller_id: sellerId }, pagination);
}

/**
 * Search auctions
 */
export async function searchAuctions(
  query: string,
  filters: AuctionFilters = {},
  pagination: PaginationParams = {}
): Promise<ApiResponse<Auction[]>> {
  return getAuctions({ ...filters, search: query }, pagination);
}

/**
 * Get ending soon auctions
 */
export async function getEndingSoonAuctions(
  hoursFromNow: number = 24,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Auction[]>> {
  const endTime = new Date();
  endTime.setHours(endTime.getHours() + hoursFromNow);

  return getAuctions(
    {
      status: "ACTIVE",
      // Note: You might need to implement date filtering in PayloadCMS
    },
    { ...pagination, sort: "end_time" }
  );
}

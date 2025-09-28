/**
 * Bids API functions
 * Các function để quản lý bids với PayloadCMS
 */

import { Bid } from "@/types/bids";
import { payloadApiClient, ApiResponse } from "./client";
import { API_ENDPOINTS, PAGINATION_DEFAULTS } from "./config";

export interface BidFilters {
  auction_id?: string;
  bidder_id?: string;
  status?: Bid["status"];
}

export interface PaginationParams {
  limit?: number;
  page?: number;
  sort?: string;
}

export interface CreateBidData {
  auction_id: string;
  amount: number;
  bid_type?: "MANUAL" | "AUTO";
}

/**
 * Get all bids with pagination and filters
 */
export async function getBids(
  filters: BidFilters = {},
  pagination: PaginationParams = {}
): Promise<ApiResponse<Bid>> {
  const params = {
    ...filters,
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-createdAt",
  };

  const response = await payloadApiClient.get<Bid>(API_ENDPOINTS.BIDS, params);
  
  // Handle response format that has success, data, pagination structure
  const typedResponse = response as unknown as {
    success: boolean;
    data: Bid[];
    pagination: {
      total: number;
      limit: number;
      page: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      nextPage: number;
      prevPage: number;
    };
  };
  if (typedResponse.success && typedResponse.data) {
    return {
      docs: typedResponse.data,
      totalDocs: typedResponse.pagination?.total,
      limit: typedResponse.pagination?.limit,
      page: typedResponse.pagination?.page,
      totalPages: typedResponse.pagination?.totalPages,
      hasNextPage: typedResponse.pagination?.hasNextPage,
      hasPrevPage: typedResponse.pagination?.hasPrevPage,
      nextPage: typedResponse.pagination?.nextPage,
      prevPage: typedResponse.pagination?.prevPage,
    };
  }
  
  return response;
}

/**
 * Get bid by ID
 */
export async function getBidById(id: string): Promise<Bid> {
  const response = await payloadApiClient.get<Bid>(
    `${API_ENDPOINTS.BIDS}/${id}`
  );
  return (response as Bid) || response.data!;
}

/**
 * Create new bid
 */
export async function createBid(data: CreateBidData): Promise<Bid> {
  const response = await payloadApiClient.post<Bid>(
    API_ENDPOINTS.BIDS,
    data
  );
  return (response as Bid) || response.data!;
}

/**
 * Get bids for specific auction
 */
export async function getBidsByAuction(
  auctionId: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Bid>> {
  const response = await getBids({ auction_id: auctionId }, pagination);
  // Handle response format that has success, data, pagination structure
  const typedBidResponse = response as unknown as {
    success: boolean;
    data: Bid[];
    pagination: {
      total: number;
      limit: number;
      page: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      nextPage: number;
      prevPage: number;
    };
  };
  if (typedBidResponse.success && typedBidResponse.data) {
    return {
      docs: typedBidResponse.data,
      totalDocs: typedBidResponse.pagination?.total,
      limit: typedBidResponse.pagination?.limit,
      page: typedBidResponse.pagination?.page,
      totalPages: typedBidResponse.pagination?.totalPages,
      hasNextPage: typedBidResponse.pagination?.hasNextPage,
      hasPrevPage: typedBidResponse.pagination?.hasPrevPage,
      nextPage: typedBidResponse.pagination?.nextPage,
      prevPage: typedBidResponse.pagination?.prevPage,
    };
  }
  return response;
}

/**
 * Get bids by current user
 */
export async function getMyBids(
  pagination: PaginationParams = {}
): Promise<ApiResponse<Bid>> {
  // The API will automatically filter by authenticated user
  const response = await getBids({}, pagination);
  return response;
}

/**
 * Get active bids for auction
 */
export async function getActiveBidsByAuction(
  auctionId: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Bid>> {
  const response = await getBids(
    { auction_id: auctionId, status: "ACTIVE" }, 
    { ...pagination, sort: "-bid_time" }
  );
  return response;
}

/**
 * Get winning bid for auction
 */
export async function getWinningBid(auctionId: string): Promise<Bid | null> {
  const response = await getBids(
    { auction_id: auctionId, status: "ACTIVE" },
    { limit: 1, sort: "-amount" }
  );
  
  if (response.docs && response.docs.length > 0) {
    return response.docs[0];
  }
  
  return null;
}

/**
 * Get bid history for auction
 */
export async function getBidHistory(
  auctionId: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Bid>> {
  const response = await getBids(
    { auction_id: auctionId },
    { ...pagination, sort: "-bid_time" }
  );
  return response;
}

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

  return payloadApiClient.get<Bid>(API_ENDPOINTS.BIDS, params);
}

/**
 * Get bid by ID
 */
export async function getBidById(id: string): Promise<Bid> {
  const response = await payloadApiClient.get<Bid>(
    `${API_ENDPOINTS.BIDS}/${id}`
  );
  return response.data!;
}

/**
 * Create new bid
 */
export async function createBid(data: CreateBidData): Promise<Bid> {
  const response = await payloadApiClient.post<Bid>(
    API_ENDPOINTS.BIDS,
    data
  );
  return response.data!;
}

/**
 * Get bids for specific auction
 */
export async function getBidsByAuction(
  auctionId: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Bid>> {
  return getBids({ auction_id: auctionId }, pagination);
}

/**
 * Get bids by current user
 */
export async function getMyBids(
  pagination: PaginationParams = {}
): Promise<ApiResponse<Bid>> {
  // The API will automatically filter by authenticated user
  return getBids({}, pagination);
}

/**
 * Get active bids for auction
 */
export async function getActiveBidsByAuction(
  auctionId: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Bid>> {
  return getBids(
    { auction_id: auctionId, status: "ACTIVE" }, 
    { ...pagination, sort: "-bid_time" }
  );
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
  return getBids(
    { auction_id: auctionId },
    { ...pagination, sort: "-bid_time" }
  );
}
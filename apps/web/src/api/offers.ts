/**
 * Offers API
 * API để quản lý đề xuất giá (offers)
 */

import { payloadApiClient, ApiResponse } from "./client";
import { API_ENDPOINTS, PAGINATION_DEFAULTS } from "./config";
import type { Offer } from "@/types/offer";
import { OfferStatus } from "@/types/offer";

// Extended API type with PayloadCMS fields
export interface ApiOffer extends Offer {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOfferData {
  technology_propose?: string;
  propose?: string;
  negotiating_messages: string;
  content: string;
  price: number;
  status?: OfferStatus;
}

export interface UpdateOfferData {
  content?: string;
  price?: number;
  status?: OfferStatus;
}

export interface GetOffersParams {
  technology_propose?: string;
  propose?: string;
  negotiating_messages?: string;
  status?: OfferStatus;
  limit?: number;
  page?: number;
}

export class OfferApi {
  /**
   * Get offers with filters
   */
  async getOffers(
    params: GetOffersParams = {}
  ): Promise<ApiResponse<ApiOffer>> {
    const queryParams: Record<string, any> = {
      limit: params.limit || PAGINATION_DEFAULTS.limit,
      page: params.page || PAGINATION_DEFAULTS.page,
      sort: "-createdAt", // Sort by newest first
      depth: 2, // Populate relationships
    };

    // Filter by relationships
    if (params.technology_propose)
      queryParams["where[technology_propose][equals]"] =
        params.technology_propose;
    if (params.propose)
      queryParams["where[propose][equals]"] = params.propose;
    if (params.negotiating_messages)
      queryParams["where[negotiating_messages][equals]"] =
        params.negotiating_messages;
    if (params.status) queryParams["where[status][equals]"] = params.status;

    return payloadApiClient.get<ApiOffer>(API_ENDPOINTS.OFFERS, queryParams);
  }

  /**
   * Get offer by ID
   */
  async getById(id: string): Promise<ApiOffer> {
    const response = await payloadApiClient.get<ApiOffer>(
      `${API_ENDPOINTS.OFFERS}/${id}?depth=2`
    );
    return response.data!;
  }

  /**
   * Create new offer
   */
  async create(data: CreateOfferData): Promise<ApiOffer> {
    const response = await payloadApiClient.post<ApiOffer>(
      API_ENDPOINTS.OFFERS,
      {
        ...data,
        status: data.status || OfferStatus.PENDING,
      }
    );
    return response.data!;
  }

  /**
   * Update offer
   */
  async update(id: string, data: UpdateOfferData): Promise<ApiOffer> {
    const response = await payloadApiClient.patch<ApiOffer>(
      `${API_ENDPOINTS.OFFERS}/${id}`,
      data
    );
    return response.data!;
  }

  /**
   * Delete offer
   */
  async delete(id: string): Promise<void> {
    await payloadApiClient.delete(`${API_ENDPOINTS.OFFERS}/${id}`);
  }

  /**
   * Accept offer
   */
  async accept(id: string): Promise<ApiOffer> {
    return this.update(id, { status: OfferStatus.ACCEPTED });
  }

  /**
   * Reject offer
   */
  async reject(id: string): Promise<ApiOffer> {
    return this.update(id, { status: OfferStatus.REJECTED });
  }

  /**
   * Get latest offer for a technology proposal
   */
  async getLatestForProposal(
    technologyProposeId: string
  ): Promise<ApiOffer | null> {
    const response = await this.getOffers({
      technology_propose: technologyProposeId,
      limit: 1,
    });

    return response.docs && response.docs.length > 0 ? response.docs[0] : null;
  }

  /**
   * Get latest offer for a propose
   */
  async getLatestForPropose(proposeId: string): Promise<ApiOffer | null> {
    const response = await this.getOffers({
      propose: proposeId,
      limit: 1,
    });
    return response.docs && response.docs.length > 0 ? response.docs[0] : null;
  }
}

// Default instance
export const offerApi = new OfferApi();

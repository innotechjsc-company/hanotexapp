/**
 * Negotiating Messages API
 * API đơn giản cho đàm phán
 */

import { payloadApiClient, ApiResponse } from "./client";
import { API_ENDPOINTS, PAGINATION_DEFAULTS } from "./config";
import type { NegotiatingMessage } from "@/types/negotiating_messages";

// Extended API type with PayloadCMS fields
export interface ApiNegotiatingMessage extends NegotiatingMessage {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface SendMessageData {
  propose?: string;
  technology_propose?: string;
  project_propose?: string;
  user: string;
  message: string;
  documents?: string[]; // Array of Media IDs
  is_offer?: boolean;
  offer?: string; // Offer ID if this message contains an offer
}

export interface SendOfferData {
  technology_propose?: string;
  project_propose?: string;
  message?: string;
  price: number;
  content?: string;
}

// Response type for accept-offer custom route
export interface AcceptOfferResponse {
  success: boolean;
  offer?: any;
  technology_propose?: any;
  contract?: any;
  error?: string;
}

export interface GetMessagesParams {
  propose?: string;
  technology_propose?: string;
  project_propose?: string;
  limit?: number;
  page?: number;
}

export class NegotiatingMessageApi {
  /**
   * Get negotiations for a conversation
   */
  async getMessages(
    params: GetMessagesParams = {}
  ): Promise<ApiResponse<ApiNegotiatingMessage[]>> {
    const queryParams: Record<string, any> = {
      limit: params.limit || PAGINATION_DEFAULTS.limit,
      page: params.page || PAGINATION_DEFAULTS.page,
      sort: "createdAt", // Sort by oldest first for conversation
      depth: 2, // Populate relationships
    };

    // Filter by relationships
    if (params.propose) queryParams["where[propose][equals]"] = params.propose;
    if (params.technology_propose)
      queryParams["where[technology_propose][equals]"] =
        params.technology_propose;
    if (params.project_propose)
      queryParams["where[project_propose][equals]"] = params.project_propose;

    return payloadApiClient.get<ApiNegotiatingMessage[]>(
      API_ENDPOINTS.NEGOTIATING_MESSAGES,
      queryParams
    );
  }

  /**
   * Send a new negotiation
   */
  async sendMessage(data: SendMessageData): Promise<ApiNegotiatingMessage> {
    const response = await payloadApiClient.post<ApiNegotiatingMessage>(
      API_ENDPOINTS.NEGOTIATING_MESSAGES,
      data
    );
    return response.data!;
  }

  /**
   * Send a new offer with negotiation message
   */
  async sendOffer(data: SendOfferData): Promise<ApiNegotiatingMessage> {
    const response = await payloadApiClient.post<ApiNegotiatingMessage>(
      "/negotiating-message/send-offer",
      data
    );
    // Handle different response formats from PayloadCMS
    const anyResponse = response as any;
    return anyResponse?.doc || anyResponse?.data || anyResponse;
  }

  /**
   * Accept an offer via CMS custom route
   */
  async acceptOffer(offerId: string): Promise<AcceptOfferResponse> {
    const response = await payloadApiClient.post<AcceptOfferResponse>(
      "/negotiating-message/accept-offer",
      { offer_id: offerId }
    );
    // Custom routes return raw JSON; ensure we pass through
    return (response as unknown as AcceptOfferResponse) || { success: true };
  }

  /**
   * Reject an offer by updating status on Offer collection
   */
  async rejectOffer(offerId: string): Promise<any> {
    const response = await payloadApiClient.patch<any>(
      `${API_ENDPOINTS.OFFERS}/${offerId}`,
      { status: "rejected" }
    );
    return response.data || response;
  }
}

// Default instance
export const negotiatingMessageApi = new NegotiatingMessageApi();

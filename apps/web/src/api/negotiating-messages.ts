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
  propose: string;
  technology_propose: string;
  user: string;
  message: string;
  documents?: string[]; // Array of Media IDs
}

export interface GetMessagesParams {
  propose?: string;
  technology_propose?: string;
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
}

// Default instance
export const negotiatingMessageApi = new NegotiatingMessageApi();

/**
 * Technology Propose API
 * CRUD cho liên hệ/đề xuất liên quan đến công nghệ
 */

import { payloadApiClient, ApiResponse } from "./client";
import { API_ENDPOINTS, PAGINATION_DEFAULTS } from "./config";
import type {
  TechnologyPropose,
  TechnologyProposeStatus,
} from "@/types/technology-propose";

export interface TechnologyProposeFilters {
  technology?: string;
  user?: string;
  status?: TechnologyProposeStatus;
  search?: string;
}

export interface PaginationParams {
  limit?: number;
  page?: number;
  sort?: string;
}

export class TechnologyProposeApi {
  async list(
    filters: TechnologyProposeFilters = {},
    pagination: PaginationParams = {}
  ): Promise<ApiResponse<TechnologyPropose[]>> {
    const params: Record<string, any> = {
      limit: pagination.limit || PAGINATION_DEFAULTS.limit,
      page: pagination.page || PAGINATION_DEFAULTS.page,
      sort: pagination.sort || "-createdAt",
    };

    if (filters.technology)
      params["where[technology][equals]"] = filters.technology;
    if (filters.user) params["where[user][equals]"] = filters.user;
    if (filters.status) params["where[status][equals]"] = filters.status;
    if (filters.search) params["search"] = filters.search;

    return payloadApiClient.get<TechnologyPropose[]>(
      API_ENDPOINTS.TECHNOLOGY_PROPOSE,
      params
    );
  }

  async getById(id: string): Promise<TechnologyPropose> {
    const res = await payloadApiClient.get<TechnologyPropose>(
      `${API_ENDPOINTS.TECHNOLOGY_PROPOSE}/${id}?depth=2`
    );

    return res as TechnologyPropose;
  }

  async create(data: Partial<TechnologyPropose>): Promise<TechnologyPropose> {
    const res = await payloadApiClient.post<TechnologyPropose>(
      API_ENDPOINTS.TECHNOLOGY_PROPOSE,
      data
    );
    return res.data!;
  }

  async update(
    id: string,
    data: Partial<TechnologyPropose>
  ): Promise<TechnologyPropose> {
    const res = await payloadApiClient.patch<TechnologyPropose>(
      `${API_ENDPOINTS.TECHNOLOGY_PROPOSE}/${id}`,
      data
    );
    return res.data!;
  }

  async remove(id: string): Promise<void> {
    await payloadApiClient.delete(`${API_ENDPOINTS.TECHNOLOGY_PROPOSE}/${id}`);
  }

  async setStatus(
    id: string,
    status: TechnologyProposeStatus
  ): Promise<TechnologyPropose> {
    const res = await payloadApiClient.patch<TechnologyPropose>(
      `${API_ENDPOINTS.TECHNOLOGY_PROPOSE}/${id}`,
      { status }
    );
    return res.data!;
  }

  async acceptProposal(
    technologyProposeId: string,
    userId: string,
    message?: string
  ): Promise<any> {
    const res = await payloadApiClient.post<any>(`/technology-propose/accept`, {
      technologyProposeId,
      userId,
      message,
    });
    return res;
  }
}

export const technologyProposeApi = new TechnologyProposeApi();

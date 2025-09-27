/**
 * Project Propose API
 * CRUD cho liên hệ/đề xuất liên quan đến dự án
 */

import { payloadApiClient, ApiResponse } from "./client";
import { API_ENDPOINTS, PAGINATION_DEFAULTS } from "./config";
import type {
  ProjectPropose,
  ProjectProposeStatus,
} from "@/types/project-propose";

export interface ProjectProposeFilters {
  project?: string;
  user?: string;
  receiver?: string;
  status?: ProjectProposeStatus;
  search?: string;
}

export interface PaginationParams {
  limit?: number;
  page?: number;
  sort?: string;
}

export class ProjectProposeApi {
  async list(
    filters: ProjectProposeFilters = {},
    pagination: PaginationParams = {}
  ): Promise<ApiResponse<ProjectPropose[]>> {
    const params: Record<string, any> = {
      limit: pagination.limit || PAGINATION_DEFAULTS.limit,
      page: pagination.page || PAGINATION_DEFAULTS.page,
      sort: pagination.sort || "-createdAt",
    };

    if (filters.project) params["where[project][equals]"] = filters.project;
    if (filters.user) params["where[user][equals]"] = filters.user;
    if (filters.receiver) params["where[receiver][equals]"] = filters.receiver;
    if (filters.status) params["where[status][equals]"] = filters.status;
    if (filters.search) params["where[project][name][contains]"] = filters.search;

    return payloadApiClient.get<ProjectPropose[]>(
      API_ENDPOINTS.PROJECT_PROPOSE,
      params
    );
  }

  async getById(id: string): Promise<ProjectPropose> {
    const res = await payloadApiClient.get<ProjectPropose>(
      `${API_ENDPOINTS.PROJECT_PROPOSE}/${id}?depth=2`
    );

    return res as unknown as ProjectPropose;
  }

  async create(data: Partial<ProjectPropose>): Promise<ProjectPropose> {
    const res = await payloadApiClient.post<ProjectPropose>(
      API_ENDPOINTS.PROJECT_PROPOSE,
      data
    );
    return res.data!;
  }

  async update(
    id: string,
    data: Partial<ProjectPropose>
  ): Promise<ProjectPropose> {
    const res = await payloadApiClient.patch<ProjectPropose>(
      `${API_ENDPOINTS.PROJECT_PROPOSE}/${id}`,
      data
    );
    return res.data!;
  }

  async remove(id: string): Promise<void> {
    await payloadApiClient.delete(`${API_ENDPOINTS.PROJECT_PROPOSE}/${id}`);
  }

  async setStatus(
    id: string,
    status: ProjectProposeStatus
  ): Promise<ProjectPropose> {
    const res = await payloadApiClient.patch<ProjectPropose>(
      `${API_ENDPOINTS.PROJECT_PROPOSE}/${id}`,
      { status }
    );
    return res.data!;
  }

  async acceptProposal(
    projectProposeId: string,
    userId: string,
    message?: string
  ): Promise<any> {
    const res = await payloadApiClient.post<any>(`/project-propose/accept`, {
      projectProposeId,
      userId,
      message,
    });
    return res;
  }

  async rejectProposal(
    projectProposeId: string,
    userId: string,
    message?: string
  ): Promise<any> {
    return payloadApiClient.post<any>(`/project-propose/reject`, {
      projectProposeId,
      userId,
      message,
    });
  }

  async completeProposal(projectProposeId: string): Promise<any> {
    return payloadApiClient.post<any>(`/project-propose/complete`, {
      projectProposeId,
    });
  }
}

export const projectProposeApi = new ProjectProposeApi();

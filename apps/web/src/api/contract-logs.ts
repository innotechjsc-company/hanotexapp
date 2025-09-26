import { payloadApiClient, type ApiResponse } from "./client";
import { API_ENDPOINTS, PAGINATION_DEFAULTS } from "./config";
import type { ContractLog } from "@/types/contract-log";
import { ContractLogStatus } from "@/types/contract-log";

export interface ContractLogFilters {
  technology_propose?: string;
  user?: string;
  status?: ContractLogStatus;
  search?: string;
}

export interface PaginationParams {
  limit?: number;
  page?: number;
  sort?: string;
}

export interface ConfirmLogRequest {
  contract_log_id: string;
  status?: "completed" | "cancelled";
  reason?: string;
  is_done_contract?: boolean;
  contract_id?: string;
}

export interface ConfirmLogResponse {
  success: boolean;
  contract_log?: ContractLog;
  technology_propose?: any;
  error?: string;
}

class ContractLogsApi {
  async list(
    filters: ContractLogFilters = {},
    pagination: PaginationParams = {}
  ): Promise<ApiResponse<ContractLog[]>> {
    const params: Record<string, any> = {
      limit: pagination.limit || PAGINATION_DEFAULTS.limit,
      page: pagination.page || PAGINATION_DEFAULTS.page,
      sort: pagination.sort || "createdAt",
      depth: 2,
    };

    if (filters.technology_propose)
      params["where[technology_propose][equals]"] = filters.technology_propose;
    if (filters.user) params["where[user][equals]"] = filters.user;
    if (filters.status) params["where[status][equals]"] = filters.status;
    if (filters.search) params["search"] = filters.search;

    return payloadApiClient.get<ContractLog[]>(
      API_ENDPOINTS.CONTRACT_LOGS,
      params
    );
  }

  async create(data: Partial<ContractLog>): Promise<ContractLog> {
    const res = await payloadApiClient.post<ContractLog>(
      API_ENDPOINTS.CONTRACT_LOGS,
      data
    );
    return (res as any).doc || (res as any).data || (res as any);
  }

  async update(id: string, data: Partial<ContractLog>): Promise<ContractLog> {
    const res = await payloadApiClient.patch<ContractLog>(
      `${API_ENDPOINTS.CONTRACT_LOGS}/${id}`,
      data
    );
    return (res as any).doc || (res as any).data || (res as any);
  }

  async confirmLog(data: ConfirmLogRequest): Promise<ConfirmLogResponse> {
    const res = await payloadApiClient.post<ConfirmLogResponse>(
      `/contract/confirm-logs`,
      data
    );
    return res as any as ConfirmLogResponse;
  }
}

export const contractLogsApi = new ContractLogsApi();

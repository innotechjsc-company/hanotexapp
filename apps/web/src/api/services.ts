/**
 * Services API functions
 * CRUD cho collection `services` trong PayloadCMS
 */

import { payloadApiClient, ApiResponse } from "./client";
import { API_ENDPOINTS, PAGINATION_DEFAULTS } from "./config";
import type { Service } from "@/types/services";

export interface ServiceFilters {
  search?: string;
}

export interface PaginationParams {
  limit?: number;
  page?: number;
  sort?: string;
}

/**
 * Lấy danh sách services có phân trang và tìm kiếm
 */
export async function getServices(
  filters: ServiceFilters = {},
  pagination: PaginationParams = {}
): Promise<ApiResponse<Service[]>> {
  const params: Record<string, any> = {
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-createdAt",
  };

  if (filters.search && filters.search.trim()) {
    const q = filters.search.trim();
    params["where[or][0][name][like]"] = q;
    params["where[or][1][description][like]"] = q;
    params["search"] = q;
  }

  return payloadApiClient.get<Service[]>(API_ENDPOINTS.SERVICES, params);
}

/**
 * Lấy chi tiết service theo ID
 */
export async function getServiceById(id: string): Promise<Service> {
  const res = await payloadApiClient.get<Service>(
    `${API_ENDPOINTS.SERVICES}/${id}`
  );
  const anyRes = res as any;
  // Chuẩn hoá data tuỳ theo response của Payload (data | doc | raw)
  const item = anyRes?.data ?? anyRes?.doc ?? (Array.isArray(anyRes?.docs) ? anyRes.docs[0] : undefined) ?? anyRes;
  return item as Service;
}

/**
 * Tạo service mới
 */
export async function createService(data: Partial<Service>): Promise<Service> {
  const response = await payloadApiClient.post<Service>(
    API_ENDPOINTS.SERVICES,
    data
  );
  return (response as any).data ?? (response as any);
}

/**
 * Cập nhật service
 */
export async function updateService(
  id: string,
  data: Partial<Service>
): Promise<Service> {
  const response = await payloadApiClient.patch<Service>(
    `${API_ENDPOINTS.SERVICES}/${id}`,
    data
  );
  return (response as any).data ?? (response as any);
}

/**
 * Xoá service
 */
export async function deleteService(id: string): Promise<void> {
  await payloadApiClient.delete(`${API_ENDPOINTS.SERVICES}/${id}`);
}




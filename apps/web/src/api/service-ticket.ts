/**
 * Service Ticket API functions
 * CRUD cho collection `service-ticket` trong PayloadCMS
 */

import { payloadApiClient, ApiResponse } from "./client";
import { API_ENDPOINTS, PAGINATION_DEFAULTS } from "./config";
import type { ServiceTicket } from "@/types/service-ticket";

export interface ServiceTicketFilters {
  status?: ServiceTicket["status"];
  userId?: string;
  serviceId?: string;
  implementerId?: string;
  search?: string;
}

export interface PaginationParams {
  limit?: number;
  page?: number;
  sort?: string;
}

/**
 * Lấy danh sách service tickets có phân trang và filter
 */
export async function getServiceTickets(
  filters: ServiceTicketFilters = {},
  pagination: PaginationParams = {}
): Promise<ApiResponse<ServiceTicket[]>> {
  const params: Record<string, any> = {
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-createdAt",
  };

  if (filters.status) {
    params["where[status][equals]"] = filters.status;
  }
  if (filters.userId) {
    params["where[user][equals]"] = filters.userId;
  }
  if (filters.serviceId) {
    params["where[service][equals]"] = filters.serviceId;
  }
  if (filters.implementerId) {
    params["where[implementers][in]"] = filters.implementerId;
  }
  if (filters.search && filters.search.trim()) {
    const q = filters.search.trim();
    params["where[or][0][description][like]"] = q;
    params["search"] = q;
  }

  return payloadApiClient.get<ServiceTicket[]>(
    API_ENDPOINTS.SERVICE_TICKET,
    params
  );
}

/**
 * Lấy chi tiết service ticket theo ID (depth=2 để populate relationship)
 */
export async function getServiceTicketById(id: string): Promise<ServiceTicket> {
  const res = await payloadApiClient.get<ServiceTicket>(
    `${API_ENDPOINTS.SERVICE_TICKET}/${id}?depth=2`
  );
  const anyRes = res as any;
  const item = anyRes?.data ?? anyRes?.doc ?? (Array.isArray(anyRes?.docs) ? anyRes.docs[0] : undefined) ?? anyRes;
  return item as ServiceTicket;
}

/**
 * Tạo service ticket mới
 */
export async function createServiceTicket(
  data: Partial<ServiceTicket>
): Promise<ServiceTicket> {
  const response = await payloadApiClient.post<ServiceTicket>(
    API_ENDPOINTS.SERVICE_TICKET,
    data
  );
  return (response as any).data ?? (response as any);
}

/**
 * Cập nhật service ticket
 */
export async function updateServiceTicket(
  id: string,
  data: Partial<ServiceTicket>
): Promise<ServiceTicket> {
  const response = await payloadApiClient.patch<ServiceTicket>(
    `${API_ENDPOINTS.SERVICE_TICKET}/${id}`,
    data
  );
  return (response as any).data ?? (response as any);
}

/**
 * Xoá service ticket
 */
export async function deleteServiceTicket(id: string): Promise<void> {
  await payloadApiClient.delete(`${API_ENDPOINTS.SERVICE_TICKET}/${id}`);
}

/**
 * Service Ticket Log API functions
 */

import type { ServiceTicketLog } from "@/types/service_ticket_logs";

/**
 * Lấy danh sách logs của service ticket
 */
export async function getServiceTicketLogs(
  ticketId: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<ServiceTicketLog[]>> {
  const params: Record<string, any> = {
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-createdAt",
    "where[service_ticket][equals]": ticketId,
  };

  return payloadApiClient.get<ServiceTicketLog[]>(
    API_ENDPOINTS.SERVICE_TICKET_LOG,
    params
  );
}

/**
 * Tạo service ticket log mới
 */
export async function createServiceTicketLog(
  data: Partial<ServiceTicketLog>
): Promise<ServiceTicketLog> {
  const response = await payloadApiClient.post<ServiceTicketLog>(
    API_ENDPOINTS.SERVICE_TICKET_LOG,
    data
  );
  return (response as any).data ?? (response as any);
}

/**
 * Cập nhật service ticket log
 */
export async function updateServiceTicketLog(
  id: string,
  data: Partial<ServiceTicketLog>
): Promise<ServiceTicketLog> {
  const response = await payloadApiClient.patch<ServiceTicketLog>(
    `${API_ENDPOINTS.SERVICE_TICKET_LOG}/${id}`,
    data
  );
  return (response as any).data ?? (response as any);
}




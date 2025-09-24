/**
 * Room Chat API functions
 * Các function để quản lý room chat với PayloadCMS
 */

import { payloadApiClient, ApiResponse } from "./client";
import { API_ENDPOINTS, PAGINATION_DEFAULTS } from "./config";

// Interface cho RoomChat từ PayloadCMS
export interface RoomChat {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

// Interface cho User (simplified)
export interface User {
  id: string;
  full_name?: string;
  email: string;
  avatar?: string;
}

// Interface cho tạo room chat mới
export interface CreateRoomChatData {
  title: string;
}

// Interface cho cập nhật room chat
export interface UpdateRoomChatData {
  title?: string;
}

// Interface cho filters
export interface RoomChatFilters {
  search?: string;
}

// Interface cho pagination
export interface PaginationParams {
  limit?: number;
  page?: number;
  sort?: string;
}

/**
 * Get all room chats with pagination and filters
 */
export async function getRoomChats(
  filters: RoomChatFilters = {},
  pagination: PaginationParams = {}
): Promise<ApiResponse<RoomChat>> {
  const params: Record<string, any> = {
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-updatedAt",
    depth: 1,
  };

  // Search filter (by title)
  if (filters.search) {
    params["where[title][like]"] = filters.search;
  }

  return payloadApiClient.get<RoomChat>(API_ENDPOINTS.ROOM_CHAT, params);
}

/**
 * Get room chat by ID
 */
export async function getRoomChatById(id: string): Promise<RoomChat> {
  const response = await payloadApiClient.get<RoomChat>(
    `${API_ENDPOINTS.ROOM_CHAT}/${id}?depth=1`
  );
  const anyRes = response as any;
  const item =
    anyRes?.data ??
    anyRes?.doc ??
    (Array.isArray(anyRes?.docs) ? anyRes.docs[0] : undefined) ??
    anyRes;
  return item as RoomChat;
}

/**
 * Create a new room chat
 */
export async function createRoomChat(
  roomChatData: CreateRoomChatData
): Promise<RoomChat> {
  const response = await payloadApiClient.post<RoomChat>(
    API_ENDPOINTS.ROOM_CHAT,
    roomChatData
  );
  const anyRes = response as any;
  const item =
    anyRes?.data ??
    anyRes?.doc ??
    (Array.isArray(anyRes?.docs) ? anyRes.docs[0] : undefined) ??
    anyRes;
  return item as RoomChat;
}

/**
 * Update a room chat
 */
export async function updateRoomChat(
  id: string,
  roomChatData: UpdateRoomChatData
): Promise<RoomChat> {
  const response = await payloadApiClient.patch<RoomChat>(
    `${API_ENDPOINTS.ROOM_CHAT}/${id}`,
    roomChatData
  );
  const anyRes = response as any;
  const item =
    anyRes?.data ??
    anyRes?.doc ??
    (Array.isArray(anyRes?.docs) ? anyRes.docs[0] : undefined) ??
    anyRes;
  return item as RoomChat;
}

/**
 * Delete a room chat
 */
export async function deleteRoomChat(id: string): Promise<void> {
  await payloadApiClient.delete(`${API_ENDPOINTS.ROOM_CHAT}/${id}`);
}

/**
 * Create a simple room chat with title
 */
export async function createSimpleRoomChat(title: string): Promise<RoomChat> {
  return createRoomChat({ title });
}

/**
 * Update room chat title
 */
export async function updateRoomChatTitle(
  roomId: string,
  title: string
): Promise<RoomChat> {
  return updateRoomChat(roomId, { title });
}

/**
 * Search room chats by title
 */
export async function searchRoomChatsByTitle(
  searchQuery: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<RoomChat>> {
  return getRoomChats({ search: searchQuery }, pagination);
}

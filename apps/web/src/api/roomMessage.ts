/**
 * Room Message API functions
 * Các function để quản lý room message với PayloadCMS
 */

import { payloadApiClient, ApiResponse } from "./client";
import { API_ENDPOINTS, PAGINATION_DEFAULTS } from "./config";

// Interface cho RoomMessage từ PayloadCMS
export interface RoomMessage {
  id: string;
  room: string | RoomChat;
  message: string;
  document: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

// Interface cho RoomChat (simplified)
export interface RoomChat {
  id: string;
  title: string;
}

// Interface cho User (simplified)
export interface User {
  id: string;
  full_name?: string;
  email: string;
  avatar?: string;
}

// Interface cho tạo message mới
export interface CreateRoomMessageData {
  room: string;
  message: string;
  document?: string;
  user: string;
}

// Interface cho cập nhật message
export interface UpdateRoomMessageData {
  message?: string;
  document?: string;
}

// Interface cho filters
export interface RoomMessageFilters {
  room?: string;
  user?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
}

// Interface cho pagination
export interface PaginationParams {
  limit?: number;
  page?: number;
  sort?: string;
}

/**
 * Get all room messages with pagination and filters
 */
export async function getRoomMessages(
  filters: RoomMessageFilters = {},
  pagination: PaginationParams = {}
): Promise<ApiResponse<RoomMessage>> {
  const params: Record<string, any> = {
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-createdAt",
    depth: 2, // Populate room and user
  };

  // Room filter
  if (filters.room) {
    params["where[room][equals]"] = filters.room;
  }

  // User filter
  if (filters.user) {
    params["where[user][equals]"] = filters.user;
  }

  // Search filter (by message content)
  if (filters.search) {
    params["where[message][like]"] = filters.search;
  }

  // Date range filters
  if (filters.date_from) {
    params["where[createdAt][greater_than_equal]"] = filters.date_from;
  }

  if (filters.date_to) {
    params["where[createdAt][less_than_equal]"] = filters.date_to;
  }

  return payloadApiClient.get<RoomMessage>(API_ENDPOINTS.ROOM_MESSAGE, params);
}

/**
 * Get room message by ID
 */
export async function getRoomMessageById(id: string): Promise<RoomMessage> {
  const response = await payloadApiClient.get<RoomMessage>(
    `${API_ENDPOINTS.ROOM_MESSAGE}/${id}?depth=2`
  );
  const anyRes = response as any;
  const item =
    anyRes?.data ??
    anyRes?.doc ??
    (Array.isArray(anyRes?.docs) ? anyRes.docs[0] : undefined) ??
    anyRes;
  return item as RoomMessage;
}

/**
 * Create a new room message
 */
export async function createRoomMessage(
  messageData: CreateRoomMessageData
): Promise<RoomMessage> {
  const response = await payloadApiClient.post<RoomMessage>(
    API_ENDPOINTS.ROOM_MESSAGE,
    messageData
  );
  const anyRes = response as any;
  const item =
    anyRes?.data ??
    anyRes?.doc ??
    (Array.isArray(anyRes?.docs) ? anyRes.docs[0] : undefined) ??
    anyRes;
  return item as RoomMessage;
}

/**
 * Update a room message
 */
export async function updateRoomMessage(
  id: string,
  messageData: UpdateRoomMessageData
): Promise<RoomMessage> {
  const response = await payloadApiClient.patch<RoomMessage>(
    `${API_ENDPOINTS.ROOM_MESSAGE}/${id}`,
    messageData
  );
  const anyRes = response as any;
  const item =
    anyRes?.data ??
    anyRes?.doc ??
    (Array.isArray(anyRes?.docs) ? anyRes.docs[0] : undefined) ??
    anyRes;
  return item as RoomMessage;
}

/**
 * Delete a room message
 */
export async function deleteRoomMessage(id: string): Promise<void> {
  await payloadApiClient.delete(`${API_ENDPOINTS.ROOM_MESSAGE}/${id}`);
}

/**
 * Get messages for a specific room
 */
export async function getMessagesForRoom(
  roomId: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<RoomMessage>> {
  return getRoomMessages(
    {
      room: roomId,
    },
    {
      ...pagination,
      sort: pagination.sort || "createdAt", // Oldest first for chat
    }
  );
}

/**
 * Get messages by user in a room
 */
export async function getMessagesByUserInRoom(
  roomId: string,
  userId: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<RoomMessage>> {
  return getRoomMessages(
    {
      room: roomId,
      user: userId,
    },
    pagination
  );
}

/**
 * Get latest message for a room
 */
export async function getLatestMessageForRoom(
  roomId: string
): Promise<RoomMessage | null> {
  const response = await getRoomMessages(
    {
      room: roomId,
    },
    {
      limit: 1,
      sort: "-createdAt",
    }
  );

  return response.docs && response.docs.length > 0 ? response.docs[0] : null;
}

/**
 * Search messages in a room
 */
export async function searchMessagesInRoom(
  roomId: string,
  searchQuery: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<RoomMessage>> {
  return getRoomMessages(
    {
      room: roomId,
      search: searchQuery,
    },
    pagination
  );
}

/**
 * Get messages in date range for a room
 */
export async function getMessagesInDateRange(
  roomId: string,
  dateFrom: string,
  dateTo: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<RoomMessage>> {
  return getRoomMessages(
    {
      room: roomId,
      date_from: dateFrom,
      date_to: dateTo,
    },
    pagination
  );
}

/**
 * Send a simple text message
 */
export async function sendMessage(
  roomId: string,
  userId: string,
  message: string,
  document?: string
): Promise<RoomMessage> {
  return createRoomMessage({
    room: roomId,
    user: userId,
    message,
    document,
  });
}

/**
 * Update message content
 */
export async function updateMessageContent(
  messageId: string,
  message: string,
  document?: string
): Promise<RoomMessage> {
  return updateRoomMessage(messageId, {
    message,
    document,
  });
}

/**
 * Room User API functions
 * Các function để quản lý room user với PayloadCMS
 */

import { payloadApiClient, ApiResponse } from "./client";
import { API_ENDPOINTS, PAGINATION_DEFAULTS } from "./config";
import { RoomUser } from "@/types/room_user";

// Interface cho tạo room user mới
export interface CreateRoomUserData {
  room: string;
  user: string;
}

// Interface cho cập nhật room user
export interface UpdateRoomUserData {
  room?: string;
  user?: string;
}

// Interface cho filters
export interface RoomUserFilters {
  room?: string;
  user?: string;
  search?: string;
}

// Interface cho pagination
export interface PaginationParams {
  limit?: number;
  page?: number;
  sort?: string;
}

/**
 * Get all room users with pagination and filters
 */
export async function getRoomUsers(
  filters: RoomUserFilters = {},
  pagination: PaginationParams = {}
): Promise<ApiResponse<RoomUser>> {
  const params: Record<string, any> = {
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-createdAt",
    depth: 2, // Populate user
  };

  // Room filter
  if (filters.room) {
    params["where[room][equals]"] = filters.room;
  }

  // User filter
  if (filters.user) {
    params["where[user][equals]"] = filters.user;
  }

  // Search filter (by user name)
  if (filters.search) {
    params["where[user.full_name][like]"] = filters.search;
  }

  return payloadApiClient.get<RoomUser>(API_ENDPOINTS.ROOM_USER, params);
}

/**
 * Get room user by ID
 */
export async function getRoomUserById(id: string): Promise<RoomUser> {
  const response = await payloadApiClient.get<RoomUser>(
    `${API_ENDPOINTS.ROOM_USER}/${id}?depth=2`
  );
  const anyRes = response as any;
  const item =
    anyRes?.data ??
    anyRes?.doc ??
    (Array.isArray(anyRes?.docs) ? anyRes.docs[0] : undefined) ??
    anyRes;
  return item as RoomUser;
}

/**
 * Create a new room user
 */
export async function createRoomUser(
  roomUserData: CreateRoomUserData
): Promise<RoomUser> {
  const response = await payloadApiClient.post<RoomUser>(
    API_ENDPOINTS.ROOM_USER,
    roomUserData
  );
  const anyRes = response as any;
  const item =
    anyRes?.data ??
    anyRes?.doc ??
    (Array.isArray(anyRes?.docs) ? anyRes.docs[0] : undefined) ??
    anyRes;
  return item as RoomUser;
}

/**
 * Update a room user
 */
export async function updateRoomUser(
  id: string,
  roomUserData: UpdateRoomUserData
): Promise<RoomUser> {
  const response = await payloadApiClient.patch<RoomUser>(
    `${API_ENDPOINTS.ROOM_USER}/${id}`,
    roomUserData
  );
  const anyRes = response as any;
  const item =
    anyRes?.data ??
    anyRes?.doc ??
    (Array.isArray(anyRes?.docs) ? anyRes.docs[0] : undefined) ??
    anyRes;
  return item as RoomUser;
}

/**
 * Delete a room user
 */
export async function deleteRoomUser(id: string): Promise<void> {
  await payloadApiClient.delete(`${API_ENDPOINTS.ROOM_USER}/${id}`);
}

/**
 * Get users in a specific room
 */
export async function getUsersInRoom(
  roomId: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<RoomUser>> {
  return getRoomUsers(
    {
      room: roomId,
    },
    pagination
  );
}

/**
 * Get rooms for a specific user
 */
export async function getRoomsForUser(
  userId: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<RoomUser>> {
  return getRoomUsers(
    {
      user: userId,
    },
    pagination
  );
}

/**
 * Check if user is in room
 */
export async function isUserInRoom(
  roomId: string,
  userId: string
): Promise<boolean> {
  const response = await getRoomUsers({
    room: roomId,
    user: userId,
  });

  return !!(response.docs && response.docs.length > 0);
}

/**
 * Add user to room
 */
export async function addUserToRoom(
  roomId: string,
  userId: string
): Promise<RoomUser> {
  // Check if user is already in room
  const isAlreadyInRoom = await isUserInRoom(roomId, userId);

  if (isAlreadyInRoom) {
    // Get existing room user
    const existingRoomUsers = await getRoomUsers({
      room: roomId,
      user: userId,
    });
    return existingRoomUsers.docs![0];
  }

  // Add user to room
  return createRoomUser({
    room: roomId,
    user: userId,
  });
}

/**
 * Remove user from room
 */
export async function removeUserFromRoom(
  roomId: string,
  userId: string
): Promise<void> {
  const response = await getRoomUsers({
    room: roomId,
    user: userId,
  });

  if (response.docs && response.docs.length > 0) {
    const roomUser = response.docs[0];
    await deleteRoomUser(roomUser.id);
  }
}

/**
 * Get user count in room
 */
export async function getUserCountInRoom(roomId: string): Promise<number> {
  const response = await getRoomUsers({
    room: roomId,
  });

  return response.totalDocs || 0;
}

/**
 * Get room count for user
 */
export async function getRoomCountForUser(userId: string): Promise<number> {
  const response = await getRoomUsers({
    user: userId,
  });

  return response.totalDocs || 0;
}

/**
 * Search users in room by name
 */
export async function searchUsersInRoom(
  roomId: string,
  searchQuery: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<RoomUser>> {
  return getRoomUsers(
    {
      room: roomId,
      search: searchQuery,
    },
    pagination
  );
}

/**
 * Get all users in multiple rooms
 */
export async function getUsersInMultipleRooms(
  roomIds: string[],
  pagination: PaginationParams = {}
): Promise<ApiResponse<RoomUser>> {
  const params: Record<string, any> = {
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-createdAt",
    depth: 2,
  };

  // Multiple room filter using 'in' operator
  if (roomIds.length > 0) {
    params["where[room][in]"] = roomIds.join(",");
  }

  return payloadApiClient.get<RoomUser>(API_ENDPOINTS.ROOM_USER, params);
}

/**
 * Bulk add users to room
 */
export async function bulkAddUsersToRoom(
  roomId: string,
  userIds: string[]
): Promise<RoomUser[]> {
  const promises = userIds.map((userId) => addUserToRoom(roomId, userId));
  return Promise.all(promises);
}

/**
 * Bulk remove users from room
 */
export async function bulkRemoveUsersFromRoom(
  roomId: string,
  userIds: string[]
): Promise<void> {
  const promises = userIds.map((userId) => removeUserFromRoom(roomId, userId));
  await Promise.all(promises);
}

/**
 * Find existing room between two users
 * Returns the first room that contains both users
 */
export async function findRoomBetweenUsers(
  userId1: string,
  userId2: string
): Promise<string | null> {
  try {
    // Get all rooms for user1
    const user1Rooms = await getRoomsForUser(userId1, { limit: 100 });
    console.log("user1Rooms---findRoomBetweenUsers", user1Rooms);

    if (!user1Rooms.docs || user1Rooms.docs.length === 0) {
      return null;
    }

    // Extract room IDs from user1's rooms
    const roomIds = user1Rooms.docs.map((roomUser) => roomUser.room);

    // Check each room to see if user2 is also in it
    for (const roomId of roomIds) {
      const isUser2InRoom = await isUserInRoom(roomId, userId2);
      if (isUser2InRoom) {
        return roomId;
      }
    }

    return null;
  } catch (error) {
    console.error("Error finding room between users:", error);
    return null;
  }
}

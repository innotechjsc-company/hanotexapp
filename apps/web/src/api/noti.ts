/**
 * Notification API functions
 * Các function để quản lý notification với PayloadCMS
 */

import { Notification } from "../types/notification";
import { payloadApiClient, ApiResponse } from "./client";
import { API_ENDPOINTS, PAGINATION_DEFAULTS } from "./config";

export interface NotificationFilters {
  is_read?: boolean;
  user?: string;
  type?: string;
  created_from?: string;
  created_to?: string;
}

export interface PaginationParams {
  limit?: number;
  page?: number;
  sort?: string;
}

/**
 * Get all notifications with pagination and filters
 */
export async function getNotifications(
  filters: NotificationFilters = {},
  pagination: PaginationParams = {}
): Promise<ApiResponse<Notification>> {
  const params: Record<string, any> = {
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-createdAt",
  };

  if (filters.is_read !== undefined) {
    params["where[is_read][equals]"] = filters.is_read;
  }

  if (filters.user) {
    params["where[user][equals]"] = filters.user;
  }

  if (filters.type) {
    params["where[type][equals]"] = filters.type;
  }

  if (filters.created_from) {
    params["where[createdAt][greater_than_equal]"] = filters.created_from;
  }

  if (filters.created_to) {
    params["where[createdAt][less_than_equal]"] = filters.created_to;
  }

  return payloadApiClient.get<Notification>(
    API_ENDPOINTS.NOTIFICATIONS,
    params
  );
}

/**
 * Get notification by ID
 */
export async function getNotificationById(id: string): Promise<Notification> {
  const res = await payloadApiClient.get<Notification>(
    `${API_ENDPOINTS.NOTIFICATIONS}/${id}`
  );
  return (res as any)?.data as Notification;
}

/**
 * Mark a notification as read
 */
export async function markAsRead(id: string): Promise<Notification> {
  const response = await payloadApiClient.patch<Notification>(
    `${API_ENDPOINTS.NOTIFICATIONS}/${id}`,
    { is_read: true }
  );
  return response.data!;
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userId: string): Promise<void> {
  // This endpoint might not be standard in Payload, custom implementation may be needed
  // For now, we simulate by fetching unread and updating them one by one
  const response = await getNotifications({ user: userId, is_read: false });
  const unreadNotifs = response.docs as Notification[];

  if (unreadNotifs && unreadNotifs.length > 0) {
    const promises = unreadNotifs.map((notif) => markAsRead(notif.id!));
    await Promise.all(promises);
  }
}

/**
 * Create a new notification
 */
export async function createNotification(
  notificationData: Partial<Notification>
): Promise<Notification> {
  const response = await payloadApiClient.post<Notification>(
    API_ENDPOINTS.NOTIFICATIONS,
    notificationData
  );
  return response.data!;
}

/**
 * Delete a notification
 */
export async function deleteNotification(id: string): Promise<void> {
  await payloadApiClient.delete(`${API_ENDPOINTS.NOTIFICATIONS}/${id}`);
}

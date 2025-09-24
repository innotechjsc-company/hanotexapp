/**
 * Events API functions
 * Các function để quản lý events với PayloadCMS
 */

import { Event } from "@/types/event";
import { payloadApiClient, ApiResponse } from "./client";
import { API_ENDPOINTS, PAGINATION_DEFAULTS } from "./config";

export interface EventFilters {
  status?: Event["status"];
  location?: string;
  start_date_from?: string;
  start_date_to?: string;
  end_date_from?: string;
  end_date_to?: string;
  search?: string;
  hashtags?: string;
  url?: string;
}

export interface PaginationParams {
  limit?: number;
  page?: number;
  sort?: string;
}

/**
 * Get all events with pagination and filters
 */
export async function getEvents(
  filters: EventFilters = {},
  pagination: PaginationParams = {}
): Promise<ApiResponse<Event[]>> {
  // Map friendly filters to PayloadCMS REST 'where' syntax
  const params: Record<string, any> = {
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-createdAt",
  };

  // Status filter
  if (filters.status) {
    params["where[status][equals]"] = filters.status;
  }

  // Location filter
  if (filters.location) {
    params["where[location][like]"] = filters.location;
  }

  // URL filter
  if (filters.url) {
    params["where[url][like]"] = filters.url;
  }

  // Date range filters
  if (filters.start_date_from) {
    params["where[start_date][greater_than_equal]"] = filters.start_date_from;
  }
  if (filters.start_date_to) {
    params["where[start_date][less_than_equal]"] = filters.start_date_to;
  }
  if (filters.end_date_from) {
    params["where[end_date][greater_than_equal]"] = filters.end_date_from;
  }
  if (filters.end_date_to) {
    params["where[end_date][less_than_equal]"] = filters.end_date_to;
  }

  // Hashtags filter
  if (filters.hashtags) {
    params["where[hashtags][like]"] = filters.hashtags;
  }

  // Text search: match title or content using [like]
  if (filters.search && filters.search.trim()) {
    const q = filters.search.trim();
    params["where[or][0][title][like]"] = q;
    params["where[or][1][content][like]"] = q;
    params["where[or][2][hashtags][like]"] = q;
    // Fallback generic search param
    params["search"] = q;
  }

  return payloadApiClient.get<Event[]>(API_ENDPOINTS.EVENTS, params);
}

/**
 * Get event by ID
 */
export async function getEventById(id: string): Promise<Event> {
  // Use depth=2 to populate referenced fields (image, document)
  const res = await payloadApiClient.get<Event>(
    `${API_ENDPOINTS.EVENTS}/${id}?depth=2`
  );
  const anyRes = res as any;
  const item =
    anyRes?.data ??
    anyRes?.doc ??
    (Array.isArray(anyRes?.docs) ? anyRes.docs[0] : undefined) ??
    anyRes;
  return item as Event;
}

/**
 * Create new event
 */
export async function createEvent(eventData: Partial<Event>): Promise<Event> {
  const response = await payloadApiClient.post<Event>(
    API_ENDPOINTS.EVENTS,
    eventData
  );
  return response.data!;
}

/**
 * Update event
 */
export async function updateEvent(
  id: string,
  eventData: Partial<Event>
): Promise<Event> {
  const response = await payloadApiClient.patch<Event>(
    `${API_ENDPOINTS.EVENTS}/${id}`,
    eventData
  );
  return response.data!;
}

/**
 * Delete event
 */
export async function deleteEvent(id: string): Promise<void> {
  await payloadApiClient.delete(`${API_ENDPOINTS.EVENTS}/${id}`);
}

/**
 * Get all events (convenience function)
 */
export async function getAllEvents(
  pagination: PaginationParams = {}
): Promise<ApiResponse<Event[]>> {
  return getEvents({}, pagination);
}

/**
 * Search events by title, content, or hashtags
 */
export async function searchEvents(
  query: string,
  filters: EventFilters = {},
  pagination: PaginationParams = {}
): Promise<ApiResponse<Event[]>> {
  return getEvents({ ...filters, search: query }, pagination);
}

/**
 * Get events by status
 */
export async function getEventsByStatus(
  status: Event["status"],
  pagination: PaginationParams = {}
): Promise<ApiResponse<Event[]>> {
  return getEvents({ status }, pagination);
}

/**
 * Get upcoming events (start_date > now)
 */
export async function getUpcomingEvents(
  pagination: PaginationParams = {}
): Promise<ApiResponse<Event[]>> {
  const now = new Date().toISOString();

  return getEvents(
    {
      start_date_from: now,
    },
    { ...pagination, sort: "start_date" }
  );
}

/**
 * Get ongoing events (start_date <= now <= end_date)
 */
export async function getOngoingEvents(
  pagination: PaginationParams = {}
): Promise<ApiResponse<Event[]>> {
  const now = new Date().toISOString();

  return getEvents(
    {
      start_date_to: now,
      end_date_from: now,
    },
    pagination
  );
}

/**
 * Get past events (end_date < now)
 */
export async function getPastEvents(
  pagination: PaginationParams = {}
): Promise<ApiResponse<Event[]>> {
  const now = new Date().toISOString();

  return getEvents(
    {
      end_date_to: now,
    },
    { ...pagination, sort: "-end_date" }
  );
}

/**
 * Get events by location
 */
export async function getEventsByLocation(
  location: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Event[]>> {
  return getEvents({ location }, pagination);
}

/**
 * Get events in date range
 */
export async function getEventsInDateRange(
  startDate: string,
  endDate: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Event[]>> {
  return getEvents(
    {
      start_date_from: startDate,
      end_date_to: endDate,
    },
    pagination
  );
}

/**
 * Get events by hashtags
 */
export async function getEventsByHashtags(
  hashtags: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Event[]>> {
  return getEvents({ hashtags }, pagination);
}

/**
 * Get events by URL pattern
 */
export async function getEventsByUrl(
  url: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Event[]>> {
  return getEvents({ url }, pagination);
}

/**
 * Get events with documents
 */
export async function getEventsWithDocuments(
  pagination: PaginationParams = {}
): Promise<ApiResponse<Event[]>> {
  const params: Record<string, any> = {
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-createdAt",
    "where[document][exists]": true,
  };

  return payloadApiClient.get<Event[]>(API_ENDPOINTS.EVENTS, params);
}

/**
 * Get events with images
 */
export async function getEventsWithImages(
  pagination: PaginationParams = {}
): Promise<ApiResponse<Event[]>> {
  const params: Record<string, any> = {
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-createdAt",
    "where[image][exists]": true,
  };

  return payloadApiClient.get<Event[]>(API_ENDPOINTS.EVENTS, params);
}

/**
 * Get filtered events with multiple criteria
 */
export async function getFilteredEvents(
  filters: {
    status?: Event["status"];
    location?: string;
    hashtags?: string;
    hasDocument?: boolean;
    hasImage?: boolean;
    dateRange?: {
      start?: string;
      end?: string;
    };
  },
  pagination: PaginationParams = {}
): Promise<ApiResponse<Event[]>> {
  const eventFilters: EventFilters = {};

  if (filters.status) eventFilters.status = filters.status;
  if (filters.location) eventFilters.location = filters.location;
  if (filters.hashtags) eventFilters.hashtags = filters.hashtags;
  if (filters.dateRange?.start)
    eventFilters.start_date_from = filters.dateRange.start;
  if (filters.dateRange?.end) eventFilters.end_date_to = filters.dateRange.end;

  return getEvents(eventFilters, pagination);
}

/**
 * Get recent events (created recently)
 */
export async function getRecentEvents(
  daysBack: number = 7,
  pagination: PaginationParams = {}
): Promise<ApiResponse<Event[]>> {
  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() - daysBack);

  const params: Record<string, any> = {
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-createdAt",
    "where[createdAt][greater_than_equal]": dateFrom.toISOString(),
  };

  return payloadApiClient.get<Event[]>(API_ENDPOINTS.EVENTS, params);
}

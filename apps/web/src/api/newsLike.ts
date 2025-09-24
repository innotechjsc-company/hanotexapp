/**
 * News Like API functions
 * Các function để quản lý news like với PayloadCMS
 */

import { payloadApiClient, ApiResponse } from "./client";
import { API_ENDPOINTS, PAGINATION_DEFAULTS } from "./config";
import type { User } from "@/types/users";
import type { News } from "@/types/news";

export interface NewLike {
  id?: string;
  news: string | News;
  user: string | User;
  updatedAt?: string;
  createdAt?: string;
}

export interface NewsLikeFilters {
  news?: string;
  user?: string;
  created_from?: string;
  created_to?: string;
}

export interface PaginationParams {
  limit?: number;
  page?: number;
  sort?: string;
}

/**
 * Get all news likes with pagination and filters
 */
export async function getNewsLikes(
  filters: NewsLikeFilters = {},
  pagination: PaginationParams = {}
): Promise<ApiResponse<NewLike[]>> {
  // Map friendly filters to PayloadCMS REST 'where' syntax
  const params: Record<string, any> = {
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-createdAt",
  };

  // News filter
  if (filters.news) {
    params["where[news][equals]"] = filters.news;
  }

  // User filter
  if (filters.user) {
    params["where[user][equals]"] = filters.user;
  }

  // Date range filters
  if (filters.created_from) {
    params["where[createdAt][greater_than_equal]"] = filters.created_from;
  }
  if (filters.created_to) {
    params["where[createdAt][less_than_equal]"] = filters.created_to;
  }

  return payloadApiClient.get<NewLike[]>(API_ENDPOINTS.NEWS_LIKE, params);
}

/**
 * Get news like by ID
 */
export async function getNewsLikeById(id: string): Promise<NewLike> {
  // Use depth=2 to populate referenced fields (news, user)
  const res = await payloadApiClient.get<NewLike>(
    `${API_ENDPOINTS.NEWS_LIKE}/${id}?depth=2`
  );
  const anyRes = res as any;
  const item =
    anyRes?.data ??
    anyRes?.doc ??
    (Array.isArray(anyRes?.docs) ? anyRes.docs[0] : undefined) ??
    anyRes;
  return item as NewLike;
}

/**
 * Create new news like
 */
export async function createNewsLike(
  newsLikeData: Partial<NewLike>
): Promise<NewLike> {
  const response = await payloadApiClient.post<NewLike>(
    API_ENDPOINTS.NEWS_LIKE,
    newsLikeData
  );
  return response.data!;
}

/**
 * Update news like
 */
export async function updateNewsLike(
  id: string,
  newsLikeData: Partial<NewLike>
): Promise<NewLike> {
  const response = await payloadApiClient.patch<NewLike>(
    `${API_ENDPOINTS.NEWS_LIKE}/${id}`,
    newsLikeData
  );
  return response.data!;
}

/**
 * Delete news like
 */
export async function deleteNewsLike(id: string): Promise<void> {
  await payloadApiClient.delete(`${API_ENDPOINTS.NEWS_LIKE}/${id}`);
}

/**
 * Get all news likes (convenience function)
 */
export async function getAllNewsLikes(
  pagination: PaginationParams = {}
): Promise<ApiResponse<NewLike[]>> {
  return getNewsLikes({}, pagination);
}

/**
 * Get news likes by news ID
 */
export async function getNewsLikesByNewsId(
  newsId: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<NewLike[]>> {
  return getNewsLikes({ news: newsId }, pagination);
}

/**
 * Get news likes by user ID
 */
export async function getNewsLikesByUserId(
  userId: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<NewLike[]>> {
  return getNewsLikes({ user: userId }, pagination);
}

/**
 * Check if user has liked a specific news
 */
export async function hasUserLikedNews(
  userId: string,
  newsId: string
): Promise<boolean> {
  const response = await getNewsLikes(
    { user: userId, news: newsId },
    { limit: 1, page: 1 }
  );
  return (response as any)?.totalDocs > 0;
}

/**
 * Like a news article (create like if not exists)
 */
export async function likeNews(
  userId: string,
  newsId: string
): Promise<NewLike> {
  // Check if already liked
  const hasLiked = await hasUserLikedNews(userId, newsId);
  if (hasLiked) {
    throw new Error("User has already liked this news");
  }

  return createNewsLike({
    user: userId,
    news: newsId,
  });
}

/**
 * Unlike a news article (delete like if exists)
 */
export async function unlikeNews(
  userId: string,
  newsId: string
): Promise<void> {
  const response = await getNewsLikes(
    { user: userId, news: newsId },
    { limit: 1, page: 1 }
  );

  const likes = (response as any)?.docs || [];
  if (likes.length === 0) {
    throw new Error("User has not liked this news");
  }

  await deleteNewsLike(likes[0].id);
}

/**
 * Toggle like status for a news article
 */
export async function toggleNewsLike(
  userId: string,
  newsId: string
): Promise<{
  liked: boolean;
  like?: NewLike;
}> {
  const hasLiked = await hasUserLikedNews(userId, newsId);

  if (hasLiked) {
    await unlikeNews(userId, newsId);
    return { liked: false };
  } else {
    const like = await likeNews(userId, newsId);
    return { liked: true, like };
  }
}

/**
 * Get news likes count for a specific news
 */
export async function getNewsLikesCount(newsId: string): Promise<number> {
  const response = await getNewsLikes({ news: newsId }, { limit: 1, page: 1 });
  return (response as any)?.totalDocs || 0;
}

/**
 * Get user's liked news count
 */
export async function getUserLikedNewsCount(userId: string): Promise<number> {
  const response = await getNewsLikes({ user: userId }, { limit: 1, page: 1 });
  return (response as any)?.totalDocs || 0;
}

/**
 * Get news likes in date range
 */
export async function getNewsLikesInDateRange(
  startDate: string,
  endDate: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<NewLike[]>> {
  return getNewsLikes(
    {
      created_from: startDate,
      created_to: endDate,
    },
    pagination
  );
}

/**
 * Get recent news likes (created recently)
 */
export async function getRecentNewsLikes(
  daysBack: number = 7,
  pagination: PaginationParams = {}
): Promise<ApiResponse<NewLike[]>> {
  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() - daysBack);

  return getNewsLikes(
    {
      created_from: dateFrom.toISOString(),
    },
    { ...pagination, sort: "-createdAt" }
  );
}

/**
 * Get latest news likes (most recent first)
 */
export async function getLatestNewsLikes(
  pagination: PaginationParams = {}
): Promise<ApiResponse<NewLike[]>> {
  return getNewsLikes({}, { ...pagination, sort: "-createdAt" });
}

/**
 * Get filtered news likes with multiple criteria
 */
export async function getFilteredNewsLikes(
  filters: {
    newsId?: string;
    userId?: string;
    dateRange?: {
      start?: string;
      end?: string;
    };
  },
  pagination: PaginationParams = {}
): Promise<ApiResponse<NewLike[]>> {
  const newsLikeFilters: NewsLikeFilters = {};

  if (filters.newsId) newsLikeFilters.news = filters.newsId;
  if (filters.userId) newsLikeFilters.user = filters.userId;
  if (filters.dateRange?.start)
    newsLikeFilters.created_from = filters.dateRange.start;
  if (filters.dateRange?.end)
    newsLikeFilters.created_to = filters.dateRange.end;

  return getNewsLikes(newsLikeFilters, pagination);
}

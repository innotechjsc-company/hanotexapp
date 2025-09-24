/**
 * News API functions
 * Các function để quản lý news với PayloadCMS
 */

import { News } from "@/types/news";
import { payloadApiClient, ApiResponse } from "./client";
import { API_ENDPOINTS, PAGINATION_DEFAULTS } from "./config";

export interface NewsFilters {
  hashtags?: string;
  search?: string;
  has_document?: boolean;
  has_image?: boolean;
  created_from?: string;
  created_to?: string;
}

export interface PaginationParams {
  limit?: number;
  page?: number;
  sort?: string;
}

/**
 * Get all news with pagination and filters
 */
export async function getNews(
  filters: NewsFilters = {},
  pagination: PaginationParams = {}
): Promise<ApiResponse<News[]>> {
  // Map friendly filters to PayloadCMS REST 'where' syntax
  const params: Record<string, any> = {
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-createdAt",
  };

  // Hashtags filter
  if (filters.hashtags) {
    params["where[hashtags][like]"] = filters.hashtags;
  }

  // Date range filters
  if (filters.created_from) {
    params["where[createdAt][greater_than_equal]"] = filters.created_from;
  }
  if (filters.created_to) {
    params["where[createdAt][less_than_equal]"] = filters.created_to;
  }

  // Document exists filter
  if (filters.has_document !== undefined) {
    params["where[document][exists]"] = filters.has_document;
  }

  // Image exists filter
  if (filters.has_image !== undefined) {
    params["where[image][exists]"] = filters.has_image;
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

  return payloadApiClient.get<News[]>(API_ENDPOINTS.NEWS, params);
}

/**
 * Get news by ID
 */
export async function getNewsById(id: string): Promise<News> {
  // Use depth=2 to populate referenced fields (image, document)
  const res = await payloadApiClient.get<News>(
    `${API_ENDPOINTS.NEWS}/${id}?depth=2`
  );
  const anyRes = res as any;
  const item =
    anyRes?.data ??
    anyRes?.doc ??
    (Array.isArray(anyRes?.docs) ? anyRes.docs[0] : undefined) ??
    anyRes;
  return item as News;
}

/**
 * Create new news
 */
export async function createNews(newsData: Partial<News>): Promise<News> {
  const response = await payloadApiClient.post<News>(
    API_ENDPOINTS.NEWS,
    newsData
  );
  return response.data!;
}

/**
 * Update news
 */
export async function updateNews(
  id: string,
  newsData: Partial<News>
): Promise<News> {
  const response = await payloadApiClient.patch<News>(
    `${API_ENDPOINTS.NEWS}/${id}`,
    newsData
  );
  return response.data!;
}

/**
 * Increment likes count for a news article
 */
export async function incrementNewsLikes(id: string): Promise<News> {
  // First get current news to get current likes count
  const currentNews = await getNewsById(id);
  const currentLikes = currentNews.likes || 0;

  // Update with incremented likes
  return updateNews(id, { likes: currentLikes + 1 });
}

/**
 * Decrement likes count for a news article
 */
export async function decrementNewsLikes(id: string): Promise<News> {
  // First get current news to get current likes count
  const currentNews = await getNewsById(id);
  const currentLikes = currentNews.likes || 0;

  // Update with decremented likes (minimum 0)
  return updateNews(id, { likes: Math.max(0, currentLikes - 1) });
}

/**
 * Increment views count for a news article
 */
export async function incrementNewsViews(id: string): Promise<News> {
  // First get current news to get current views count
  const currentNews = await getNewsById(id);
  const currentViews = currentNews.views || 0;

  // Update with incremented views
  return updateNews(id, { views: currentViews + 1 });
}

/**
 * Delete news
 */
export async function deleteNews(id: string): Promise<void> {
  await payloadApiClient.delete(`${API_ENDPOINTS.NEWS}/${id}`);
}

/**
 * Get all news (convenience function)
 */
export async function getAllNews(
  pagination: PaginationParams = {}
): Promise<ApiResponse<News[]>> {
  return getNews({}, pagination);
}

/**
 * Search news by title, content, or hashtags
 */
export async function searchNews(
  query: string,
  filters: NewsFilters = {},
  pagination: PaginationParams = {}
): Promise<ApiResponse<News[]>> {
  return getNews({ ...filters, search: query }, pagination);
}

/**
 * Get news by hashtags
 */
export async function getNewsByHashtags(
  hashtags: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<News[]>> {
  return getNews({ hashtags }, pagination);
}

/**
 * Get news with documents
 */
export async function getNewsWithDocuments(
  pagination: PaginationParams = {}
): Promise<ApiResponse<News[]>> {
  return getNews({ has_document: true }, pagination);
}

/**
 * Get news with images
 */
export async function getNewsWithImages(
  pagination: PaginationParams = {}
): Promise<ApiResponse<News[]>> {
  return getNews({ has_image: true }, pagination);
}

/**
 * Get news in date range
 */
export async function getNewsInDateRange(
  startDate: string,
  endDate: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<News[]>> {
  return getNews(
    {
      created_from: startDate,
      created_to: endDate,
    },
    pagination
  );
}

/**
 * Get recent news (created recently)
 */
export async function getRecentNews(
  daysBack: number = 7,
  pagination: PaginationParams = {}
): Promise<ApiResponse<News[]>> {
  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() - daysBack);

  return getNews(
    {
      created_from: dateFrom.toISOString(),
    },
    { ...pagination, sort: "-createdAt" }
  );
}

/**
 * Get latest news (most recent first)
 */
export async function getLatestNews(
  pagination: PaginationParams = {}
): Promise<ApiResponse<News[]>> {
  return getNews({}, { ...pagination, sort: "-createdAt" });
}

/**
 * Get filtered news with multiple criteria
 */
export async function getFilteredNews(
  filters: {
    hashtags?: string;
    hasDocument?: boolean;
    hasImage?: boolean;
    dateRange?: {
      start?: string;
      end?: string;
    };
  },
  pagination: PaginationParams = {}
): Promise<ApiResponse<News[]>> {
  const newsFilters: NewsFilters = {};

  if (filters.hashtags) newsFilters.hashtags = filters.hashtags;
  if (filters.hasDocument !== undefined)
    newsFilters.has_document = filters.hasDocument;
  if (filters.hasImage !== undefined) newsFilters.has_image = filters.hasImage;
  if (filters.dateRange?.start)
    newsFilters.created_from = filters.dateRange.start;
  if (filters.dateRange?.end) newsFilters.created_to = filters.dateRange.end;

  return getNews(newsFilters, pagination);
}

/**
 * Get popular news (can be extended with view count logic)
 */
export async function getPopularNews(
  pagination: PaginationParams = {}
): Promise<ApiResponse<News[]>> {
  // For now, return recent news sorted by creation date
  // Can be extended with view count or engagement metrics
  return getNews({}, { ...pagination, sort: "-createdAt" });
}

/**
 * Get news by title pattern
 */
export async function getNewsByTitle(
  titlePattern: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<News[]>> {
  const params: Record<string, any> = {
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-createdAt",
    "where[title][like]": titlePattern,
  };

  return payloadApiClient.get<News[]>(API_ENDPOINTS.NEWS, params);
}

/**
 * Get news count by filters
 */
export async function getNewsCount(filters: NewsFilters = {}): Promise<number> {
  const response = await getNews(filters, { limit: 1, page: 1 });
  return (response as any)?.totalDocs || 0;
}

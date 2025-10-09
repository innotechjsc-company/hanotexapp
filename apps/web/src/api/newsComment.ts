/**
 * News Comments API functions
 * Các function để quản lý comments của news với PayloadCMS
 */

import { payloadApiClient, ApiResponse } from "./client";
import { API_ENDPOINTS, PAGINATION_DEFAULTS } from "./config";

// Interface cho NewsComment từ PayloadCMS
export interface NewsComment {
  id: string;
  user:
    | {
        id: string;
        full_name?: string;
        email: string;
      }
    | string;
  news: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// Interface cho comment data khi tạo mới
export interface CreateCommentData {
  user: string;
  news: string;
  comment: string;
}

// Interface cho comment hiển thị trên UI
export interface CommentDisplay {
  id: string;
  user: {
    name: string;
    avatar?: string;
    initial: string;
  };
  content: string;
  timestamp: string;
}

export interface PaginationParams {
  limit?: number;
  page?: number;
  sort?: string;
}

/**
 * Get comments for a specific news article
 */
export async function getNewsComments(
  newsId: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<NewsComment>> {
  const params: Record<string, any> = {
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-createdAt",
    "where[news][equals]": newsId,
    depth: 2, // Populate user information
  };

  return payloadApiClient.get<NewsComment>(API_ENDPOINTS.NEWS_COMMENT, params);
}

/**
 * Create a new comment for a news article
 */
export async function createNewsComment(
  commentData: CreateCommentData
): Promise<NewsComment> {
  const response = await payloadApiClient.post<NewsComment>(
    API_ENDPOINTS.NEWS_COMMENT,
    commentData
  );
  return response.data!;
}

/**
 * Update a comment
 */
export async function updateNewsComment(
  commentId: string,
  commentData: Partial<CreateCommentData>
): Promise<NewsComment> {
  const response = await payloadApiClient.patch<NewsComment>(
    `${API_ENDPOINTS.NEWS_COMMENT}/${commentId}`,
    commentData
  );
  return response.data!;
}

/**
 * Delete a comment
 */
export async function deleteNewsComment(commentId: string): Promise<void> {
  await payloadApiClient.delete(`${API_ENDPOINTS.NEWS_COMMENT}/${commentId}`);
}

/**
 * Get comment by ID
 */
export async function getNewsCommentById(
  commentId: string
): Promise<NewsComment> {
  const response = await payloadApiClient.get<NewsComment>(
    `${API_ENDPOINTS.NEWS_COMMENT}/${commentId}?depth=2`
  );
  return response.data!;
}

/**
 * Transform NewsComment from API to CommentDisplay for UI
 */
export function transformCommentForDisplay(
  comment: NewsComment
): CommentDisplay {
  let userName = "Unknown User";

  if (typeof comment.user === "object" && comment.user) {
    userName = comment.user.full_name || comment.user.email || "Unknown User";
  } else if (typeof comment.user === "string") {
    userName = "User";
  }

  const getInitial = (name: string): string => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    return words[0].charAt(0).toUpperCase();
  };

  const formatTimestamp = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short",
    });
  };

  return {
    id: comment.id,
    user: {
      name: userName,
      initial: getInitial(userName),
    },
    content: comment.comment,
    timestamp: formatTimestamp(comment.createdAt),
  };
}

/**
 * Get all comments for a news article and transform for display
 */
export async function getNewsCommentsForDisplay(
  newsId: string,
  pagination: PaginationParams = {}
): Promise<{
  comments: CommentDisplay[];
  totalDocs: number;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}> {
  const response = await getNewsComments(newsId, pagination);

  const comments =
    response.docs?.map((comment) => transformCommentForDisplay(comment)) || [];

  return {
    comments,
    totalDocs: response.totalDocs || 0,
    totalPages: response.totalPages || 0,
    page: response.page || 1,
    hasNextPage: response.hasNextPage || false,
    hasPrevPage: response.hasPrevPage || false,
  };
}

/**
 * Create comment and return transformed for display
 */
export async function createNewsCommentForDisplay(
  commentData: CreateCommentData
): Promise<CommentDisplay> {
  const newComment = await createNewsComment(commentData);

  const populatedComment = await getNewsCommentById(newComment.id);

  return transformCommentForDisplay(populatedComment);
}

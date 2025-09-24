/**
 * Event Comments API functions
 * Các function để quản lý comments của events với PayloadCMS
 */

import { payloadApiClient, ApiResponse } from "./client";
import { API_ENDPOINTS, PAGINATION_DEFAULTS } from "./config";

// Interface cho EventComment từ PayloadCMS
export interface EventComment {
  id: string;
  user:
    | {
        id: string;
        full_name?: string;
        email: string;
      }
    | string;
  event: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// Interface cho comment data khi tạo mới
export interface CreateCommentData {
  user: string;
  event: string;
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
 * Get comments for a specific event
 */
export async function getEventComments(
  eventId: string,
  pagination: PaginationParams = {}
): Promise<ApiResponse<EventComment>> {
  const params: Record<string, any> = {
    limit: pagination.limit || PAGINATION_DEFAULTS.limit,
    page: pagination.page || PAGINATION_DEFAULTS.page,
    sort: pagination.sort || "-createdAt",
    "where[event][equals]": eventId,
    depth: 2, // Populate user information
  };

  return payloadApiClient.get<EventComment>(
    API_ENDPOINTS.EVENT_COMMENT,
    params
  );
}

/**
 * Create a new comment for an event
 */
export async function createEventComment(
  commentData: CreateCommentData
): Promise<EventComment> {
  const response = await payloadApiClient.post<EventComment>(
    API_ENDPOINTS.EVENT_COMMENT,
    commentData
  );
  return response.data!;
}

/**
 * Update a comment
 */
export async function updateEventComment(
  commentId: string,
  commentData: Partial<CreateCommentData>
): Promise<EventComment> {
  const response = await payloadApiClient.patch<EventComment>(
    `${API_ENDPOINTS.EVENT_COMMENT}/${commentId}`,
    commentData
  );
  return response.data!;
}

/**
 * Delete a comment
 */
export async function deleteEventComment(commentId: string): Promise<void> {
  await payloadApiClient.delete(`${API_ENDPOINTS.EVENT_COMMENT}/${commentId}`);
}

/**
 * Get comment by ID
 */
export async function getEventCommentById(
  commentId: string
): Promise<EventComment> {
  const response = await payloadApiClient.get<EventComment>(
    `${API_ENDPOINTS.EVENT_COMMENT}/${commentId}?depth=2`
  );
  return response.data!;
}

/**
 * Transform EventComment from API to CommentDisplay for UI
 */
export function transformCommentForDisplay(
  comment: EventComment
): CommentDisplay {
  // Handle user object - could be populated or just ID
  let userName = "Unknown User";

  if (typeof comment.user === "object" && comment.user) {
    // User is populated object
    userName = comment.user.full_name || comment.user.email || "Unknown User";
  } else if (typeof comment.user === "string") {
    // User is just ID string
    userName = "User";
  }

  // Get user initial from name (first letter of first name)
  const getInitial = (name: string): string => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    // Always return the first letter of the first word
    return words[0].charAt(0).toUpperCase();
  };

  // Format timestamp
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
 * Get all comments for an event and transform for display
 */
export async function getEventCommentsForDisplay(
  eventId: string,
  pagination: PaginationParams = {}
): Promise<{
  comments: CommentDisplay[];
  totalDocs: number;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}> {
  const response = await getEventComments(eventId, pagination);

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
export async function createEventCommentForDisplay(
  commentData: CreateCommentData
): Promise<CommentDisplay> {
  const newComment = await createEventComment(commentData);

  // Fetch the comment with populated user data
  const populatedComment = await getEventCommentById(newComment.id);

  return transformCommentForDisplay(populatedComment);
}

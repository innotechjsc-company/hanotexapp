/**
 * Custom hook for managing news like functionality
 * Quản lý trạng thái like của từng bài viết
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/store/auth";
import {
  hasUserLikedNews,
  likeNews,
  unlikeNews,
  getNewsLikes,
} from "@/api/newsLike";
import { incrementNewsLikes, decrementNewsLikes } from "@/api/news";

interface UseNewsLikeProps {
  newsId: string;
  initialLikes?: number;
}

interface UseNewsLikeReturn {
  isLiked: boolean;
  likesCount: number;
  isLoading: boolean;
  error: string | null;
  toggleLike: () => Promise<void>;
  refreshLikeStatus: () => Promise<void>;
}

export function useNewsLike({
  newsId,
  initialLikes = 0,
}: UseNewsLikeProps): UseNewsLikeReturn {
  const { user, isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user has liked this news
  const checkLikeStatus = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setIsLiked(false);
      return;
    }

    try {
      const hasLiked = await hasUserLikedNews(user.id, newsId);
      setIsLiked(hasLiked);
    } catch (err) {
      console.error("Error checking like status:", err);
      setIsLiked(false);
    }
  }, [isAuthenticated, user?.id, newsId]);

  // Get current likes count
  const refreshLikesCount = useCallback(async () => {
    try {
      const response = await getNewsLikes(
        { news: newsId },
        { limit: 1, page: 1 }
      );
      const totalLikes = (response as any)?.totalDocs || 0;
      setLikesCount(totalLikes);
    } catch (err) {
      console.error("Error getting likes count:", err);
      // Don't update count if there's an error, keep current value
    }
  }, [newsId]);

  // Refresh both like status and count
  const refreshLikeStatus = useCallback(async () => {
    await Promise.all([checkLikeStatus(), refreshLikesCount()]);
  }, [checkLikeStatus, refreshLikesCount]);

  // Toggle like status
  const toggleLike = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setError("Bạn cần đăng nhập để thích bài viết");
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    // Store previous state for rollback
    const previousIsLiked = isLiked;
    const previousLikesCount = likesCount;

    try {
      if (isLiked) {
        // Optimistic update
        setIsLiked(false);
        setLikesCount((prev) => Math.max(0, prev - 1));

        // Unlike: Remove from news-like and decrement news likes
        await unlikeNews(user.id, newsId);
        await decrementNewsLikes(newsId);
      } else {
        // Optimistic update
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);

        // Like: Add to news-like and increment news likes
        await likeNews(user.id, newsId);
        await incrementNewsLikes(newsId);
      }
    } catch (err: any) {
      console.error("Error toggling like:", err);

      // Rollback optimistic updates
      setIsLiked(previousIsLiked);
      setLikesCount(previousLikesCount);

      setError(err.message || "Có lỗi xảy ra khi thích bài viết");

      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id, isLiked, isLoading, newsId, likesCount]);

  // Initialize like status on mount
  useEffect(() => {
    refreshLikeStatus();
  }, [refreshLikeStatus]);

  // Update likes count when initialLikes changes
  useEffect(() => {
    setLikesCount(initialLikes);
  }, [initialLikes]);

  return {
    isLiked,
    likesCount,
    isLoading,
    error,
    toggleLike,
    refreshLikeStatus,
  };
}

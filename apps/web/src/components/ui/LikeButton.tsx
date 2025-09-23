/**
 * LikeButton Component
 * Component có thể tái sử dụng cho tính năng like bài viết
 */

import React from "react";
import { Heart, Loader2 } from "lucide-react";
import { useNewsLike } from "@/hooks/useNewsLike";
import { useAuth } from "@/store/auth";

interface LikeButtonProps {
  newsId: string;
  initialLikes?: number;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "compact" | "icon-only";
  className?: string;
  showCount?: boolean;
  onLikeChange?: (isLiked: boolean, likesCount: number) => void;
}

const sizeClasses = {
  sm: {
    button: "p-1.5",
    icon: "h-3 w-3",
    text: "text-xs",
  },
  md: {
    button: "p-2",
    icon: "h-4 w-4",
    text: "text-sm",
  },
  lg: {
    button: "p-3",
    icon: "h-5 w-5",
    text: "text-base",
  },
};

export default function LikeButton({
  newsId,
  initialLikes = 0,
  size = "md",
  variant = "default",
  className = "",
  showCount = true,
  onLikeChange,
}: LikeButtonProps) {
  const { isAuthenticated } = useAuth();
  const { isLiked, likesCount, isLoading, error, toggleLike } = useNewsLike({
    newsId,
    initialLikes,
  });

  const sizeConfig = sizeClasses[size];

  // Notify parent component of like changes
  React.useEffect(() => {
    if (onLikeChange) {
      onLikeChange(isLiked, likesCount);
    }
  }, [isLiked, likesCount, onLikeChange]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      // Show a more user-friendly message
      const shouldLogin = window.confirm(
        "Bạn cần đăng nhập để thích bài viết. Bạn có muốn đăng nhập ngay không?"
      );
      if (shouldLogin) {
        window.location.href = "/auth/login";
      }
      return;
    }

    await toggleLike();
  };

  const getButtonClasses = () => {
    const baseClasses = `
      inline-flex items-center justify-center
      rounded-full transition-all duration-200
      hover:scale-105 active:scale-95
      focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
      disabled:opacity-50 disabled:cursor-not-allowed
      ${sizeConfig.button}
    `;

    if (variant === "icon-only") {
      return `${baseClasses} ${
        isLiked
          ? "bg-red-50 text-red-600 hover:bg-red-100"
          : "bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-red-500"
      }`;
    }

    return `${baseClasses} ${
      isLiked
        ? "bg-red-50 text-red-600 hover:bg-red-100"
        : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-red-500"
    }`;
  };

  const getIconClasses = () => {
    return `${sizeConfig.icon} transition-all duration-200 ${
      isLiked ? "fill-current text-red-600" : ""
    }`;
  };

  if (variant === "icon-only") {
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        <button
          onClick={handleClick}
          disabled={isLoading}
          className={getButtonClasses()}
          title={isLiked ? "Bỏ thích" : "Thích bài viết"}
        >
          {isLoading ? (
            <Loader2 className={`${sizeConfig.icon} animate-spin`} />
          ) : (
            <Heart className={getIconClasses()} />
          )}
        </button>
        {showCount && (
          <span className={`${sizeConfig.text} text-gray-600 font-medium`}>
            {likesCount}
          </span>
        )}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`
          inline-flex items-center space-x-1 px-3 py-1.5
          rounded-full transition-all duration-200
          hover:scale-105 active:scale-95
          focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
          disabled:opacity-50 disabled:cursor-not-allowed
          ${
            isLiked
              ? "bg-red-50 text-red-600 hover:bg-red-100"
              : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-red-500"
          }
          ${className}
        `}
      >
        {isLoading ? (
          <Loader2 className={`${sizeConfig.icon} animate-spin`} />
        ) : (
          <Heart className={getIconClasses()} />
        )}
        {showCount && (
          <span className={`${sizeConfig.text} font-medium`}>{likesCount}</span>
        )}
      </button>
    );
  }

  // Default variant
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={getButtonClasses()}
        title={isLiked ? "Bỏ thích" : "Thích bài viết"}
      >
        {isLoading ? (
          <Loader2 className={`${sizeConfig.icon} animate-spin`} />
        ) : (
          <Heart className={getIconClasses()} />
        )}
      </button>
      {showCount && (
        <span className={`${sizeConfig.text} text-gray-600 font-medium`}>
          {likesCount} lượt thích
        </span>
      )}
      {error && <span className="text-xs text-red-500 ml-2">{error}</span>}
    </div>
  );
}

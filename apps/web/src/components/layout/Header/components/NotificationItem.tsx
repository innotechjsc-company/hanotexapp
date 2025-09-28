import React from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@heroui/react";
import { MessageSquare } from "lucide-react";
import { Notification } from "@/types/notification";
import { markAsRead } from "@/api/noti";

interface NotificationItemProps {
  notification: Notification;
  onNotificationClick?: (notification: Notification) => void;
}

// Helper function to format time
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) + " năm trước";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " tháng trước";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " ngày trước";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " giờ trước";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " phút trước";
  }
  return "Vài giây trước";
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onNotificationClick,
}) => {
  const router = useRouter();

  // Placeholder for user avatar - replace with actual data if available
  const userAvatarUrl = "https://i.pravatar.cc/150?u=" + notification.id;

  // Helper function to extract route path from action_url
  const extractRoutePath = (actionUrl: string): string | null => {
    if (!actionUrl) return null;

    // If actionUrl is already a relative path starting with '/', use it directly
    if (actionUrl.startsWith('/')) {
      return actionUrl;
    }

    // If actionUrl is a complete URL, extract the pathname
    if (actionUrl.startsWith('http://') || actionUrl.startsWith('https://')) {
      try {
        const url = new URL(actionUrl);
        return url.pathname;
      } catch (error) {
        console.error('Invalid URL format:', actionUrl);
        return null;
      }
    }

    // If actionUrl is just a path without leading slash, add it
    return `/${actionUrl}`;
  };

  const handleClick = async () => {
    try {
      console.log("Notification clicked:", notification);
      console.log("Action URL:", notification.action_url);

      // Mark as read if not already read
      if (!notification.is_read && notification.id) {
        console.log("Marking notification as read:", notification.id);
        await markAsRead(notification.id);
      }

      // Call the parent callback if provided
      if (onNotificationClick) {
        onNotificationClick(notification);
      }

      // Navigate to action URL if it exists
      if (notification.action_url) {
        const routePath = extractRoutePath(notification.action_url);
        console.log("Original action_url:", notification.action_url);
        console.log("Extracted route path:", routePath);

        if (routePath) {
          console.log("Navigating to:", routePath);
          router.push(routePath);
        } else {
          console.log("Failed to extract valid route path");
        }
      } else {
        console.log("No action_url found for this notification");
      }
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };

  return (
    <div
      className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
      onClick={handleClick}
    >
      <div className="relative">
        <Avatar src={userAvatarUrl} size="lg" />
        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
          <MessageSquare className="h-3 w-3 text-white" />
        </div>
      </div>
      <div className="flex-1">
        {notification.title && (
          <p className="text-sm font-semibold text-gray-900">
            {notification.title}
          </p>
        )}
        <p className="text-sm text-gray-800">{notification.message}</p>
        <p
          className={`text-xs font-bold ${notification.is_read ? "text-gray-500" : "text-blue-600"}`}
        >
          {formatTimeAgo(notification.createdAt)}
        </p>
      </div>
      {!notification.is_read && (
        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
      )}
    </div>
  );
};

export default NotificationItem;

import React from "react";
import { Avatar } from "@heroui/react";
import { MessageSquare } from "lucide-react";
import { Notification } from "@/types/notification";

interface NotificationItemProps {
  notification: Notification;
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
}) => {
  // Placeholder for user avatar - replace with actual data if available
  const userAvatarUrl = "https://i.pravatar.cc/150?u=" + notification.id;

  return (
    <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
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

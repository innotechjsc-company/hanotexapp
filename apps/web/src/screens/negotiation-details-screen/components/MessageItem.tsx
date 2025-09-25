import React from "react";
import { Avatar, Typography, Button, Tooltip } from "antd";
import { Download, CheckCircle2 } from "lucide-react";
import type { ApiNegotiatingMessage } from "@/api/negotiating-messages";
import type { Media } from "@/types/media1";
import { useUser } from "@/store/auth";

const { Text } = Typography;

interface MessageItemProps {
  message: ApiNegotiatingMessage;
  formatFileSize: (bytes: number) => string;
  formatMessageTime: (timestamp: string) => string;
  side?: "left" | "right";
}

// Avatar component with online status
const MessageAvatar: React.FC<{
  message: ApiNegotiatingMessage;
  isRightSide: boolean;
}> = ({ message, isRightSide }) => {
  const getUserName = () => {
    if (!message.user) return "Unknown User";
    if (typeof message.user === "object") {
      return message.user.full_name || message.user.email || "Unknown User";
    }
    return message.user;
  };

  const getUserAvatar = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="flex-shrink-0 relative">
      <Avatar
        size={32}
        className={`${isRightSide ? "bg-blue-500" : "bg-blue-500"} text-white font-medium`}
      >
        {getUserAvatar()}
      </Avatar>
    </div>
  );
};

// Sender name component
const SenderName: React.FC<{
  message: ApiNegotiatingMessage;
  isRightSide: boolean;
}> = ({ message, isRightSide }) => {
  const getUserName = () => {
    if (!message.user) return "Unknown User";
    if (typeof message.user === "object") {
      return message.user.full_name || message.user.email || "Unknown User";
    }
    return message.user;
  };

  return (
    <div className={`mb-1 ${isRightSide ? "text-right" : "text-left"}`}>
      <Text
        className={`text-sm font-medium ${isRightSide ? "text-blue-600" : "text-gray-700"}`}
      >
        {isRightSide ? "Bạn" : getUserName()}
      </Text>
    </div>
  );
};

// File attachment component
const FileAttachment: React.FC<{
  attachment: Media | string; // Can be string or Media object
  isRightSide: boolean;
  formatFileSize: (bytes: number) => string;
}> = ({ attachment, isRightSide, formatFileSize }) => {
  const getFileName = () => {
    if (typeof attachment === "string") {
      return "Document";
    }
    // Use filename first, then alt as fallback, then default
    return attachment.filename || attachment.alt || "Tài liệu";
  };

  const getFileSize = () => {
    if (typeof attachment === "string") {
      return 0;
    }
    return attachment.filesize || 0;
  };

  const getFileUrl = () => {
    if (typeof attachment === "string") {
      return "#";
    }
    return attachment.url || "#";
  };

  const getMimeType = () => {
    if (typeof attachment === "string") {
      return "";
    }
    return attachment.mimeType || "";
  };

  const getFileIcon = () => {
    const mimeType = getMimeType();
    const fileName = getFileName().toLowerCase();

    // Check by mime type first
    if (mimeType.includes("pdf")) return "📄";
    if (mimeType.includes("word") || fileName.includes(".doc")) return "📝";
    if (mimeType.includes("excel") || fileName.includes(".xls")) return "📊";
    if (mimeType.includes("powerpoint") || fileName.includes(".ppt"))
      return "📋";
    if (mimeType.includes("image")) return "🖼️";
    if (mimeType.includes("video")) return "🎥";
    if (mimeType.includes("audio")) return "🎵";

    // Fallback to generic document icon
    return "📎";
  };

  const handleDownload = () => {
    const url = getFileUrl();
    if (url && url !== "#") {
      // Create a temporary link element to trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = getFileName();
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div
      className={`
        flex items-center gap-3 p-3 rounded-lg mt-2 transition-all hover:shadow-sm
        ${isRightSide ? "bg-white/20 hover:bg-white/30" : "bg-gray-50 border border-gray-200 hover:border-gray-300"}
      `}
    >
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-lg ${isRightSide ? "bg-white/20" : "bg-blue-50"}`}
      >
        <span className="text-sm">{getFileIcon()}</span>
      </div>

      <div className="flex-1 min-w-0">
        <Text
          className={`text-sm font-medium block truncate ${isRightSide ? "text-white" : "text-gray-800"}`}
        >
          {getFileName()}
        </Text>
        <Text
          className={`text-xs ${isRightSide ? "text-white/80" : "text-gray-500"}`}
        >
          {formatFileSize(getFileSize())}
        </Text>
      </div>

      <Tooltip title="Tải xuống" color="gray">
        <Button
          type="text"
          size="small"
          icon={<Download size={14} />}
          onClick={handleDownload}
          disabled={getFileUrl() === "#"}
          className={`
            border-none rounded-lg p-2 transition-colors
            ${
              isRightSide
                ? "text-white bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-white/50"
                : "text-blue-500 bg-blue-50 hover:bg-blue-100 disabled:bg-gray-100 disabled:text-gray-400"
            }
          `}
        />
      </Tooltip>
    </div>
  );
};

// Message bubble component
const MessageBubble: React.FC<{
  message: ApiNegotiatingMessage;
  isRightSide: boolean;
  formatFileSize: (bytes: number) => string;
}> = ({ message, isRightSide, formatFileSize }) => {
  const hasMessage = message.message && message.message.trim().length > 0;
  const hasDocuments = message.documents && message.documents.length > 0;

  return (
    <div className={`flex ${isRightSide ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          px-3 py-2 rounded-2xl max-w-full
          ${
            isRightSide
              ? "bg-blue-500 text-white rounded-br-md"
              : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
          }
        `}
      >
        {/* Message text */}
        {hasMessage && (
          <Text
            className={`text-sm leading-relaxed`}
            style={{ color: isRightSide ? "white" : "black" }}
          >
            {message.message}
          </Text>
        )}

        {/* File attachments */}
        {hasDocuments && (
          <div className={hasMessage ? "mt-2" : ""}>
            {message.documents.map((doc, index) => (
              <FileAttachment
                key={
                  typeof doc === "string"
                    ? doc
                    : doc.id?.toString() || `doc-${index}`
                }
                attachment={doc}
                isRightSide={isRightSide}
                formatFileSize={formatFileSize}
              />
            ))}
          </div>
        )}

        {/* Show placeholder if neither message nor documents */}
        {!hasMessage && !hasDocuments && (
          <Text
            className={`text-sm italic ${isRightSide ? "text-white/70" : "text-gray-500"}`}
          >
            Tin nhắn trống
          </Text>
        )}
      </div>
    </div>
  );
};

// Timestamp and status component
const MessageTimestamp: React.FC<{
  message: ApiNegotiatingMessage;
  isRightSide: boolean;
  formatMessageTime: (timestamp: string) => string;
}> = ({ message, isRightSide, formatMessageTime }) => (
  <div
    className={`flex items-center gap-1 mt-1 ${isRightSide ? "justify-end" : "justify-start"}`}
  >
    <Text className="text-xs text-gray-400">
      {formatMessageTime(message.createdAt || new Date().toISOString())}
    </Text>

    {isRightSide && <CheckCircle2 size={10} className="text-blue-400" />}
  </div>
);

// Main MessageItem component
export const MessageItem: React.FC<MessageItemProps> = ({
  message,
  formatFileSize,
  formatMessageTime,
  side,
}) => {
  const currentUser = useUser();

  // Determine side: use prop if provided, otherwise check if message is from current user
  const isCurrentUser =
    message.user && typeof message.user === "object"
      ? message.user.id === currentUser?.id
      : false;
  const isRightSide = side ? side === "right" : isCurrentUser;

  return (
    <div
      className={`flex gap-2 mb-3 ${isRightSide ? "flex-row-reverse" : "flex-row"}`}
    >
      <MessageAvatar message={message} isRightSide={isRightSide} />

      <div className="flex-1 max-w-[75%]">
        <SenderName message={message} isRightSide={isRightSide} />
        <MessageBubble
          message={message}
          isRightSide={isRightSide}
          formatFileSize={formatFileSize}
        />
        <MessageTimestamp
          message={message}
          isRightSide={isRightSide}
          formatMessageTime={formatMessageTime}
        />
      </div>
    </div>
  );
};

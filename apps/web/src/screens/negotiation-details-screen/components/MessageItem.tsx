import React from "react";
import { Avatar, Typography, Button, Tooltip } from "antd";
import { FileText, Download, CheckCircle2 } from "lucide-react";
import type { ApiNegotiatingMessage } from "@/api/negotiating-messages";
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
  attachment: any; // Can be string or Media object
  isRightSide: boolean;
  formatFileSize: (bytes: number) => string;
}> = ({ attachment, isRightSide, formatFileSize }) => {
  const getFileName = () => {
    if (typeof attachment === "string") {
      return "Document";
    }
    return attachment.filename || attachment.alt || "Document";
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

  return (
    <div
      className={`
        flex items-center gap-2 p-2 rounded-lg mt-1
        ${isRightSide ? "bg-white/20" : "bg-gray-50 border border-gray-200"}
      `}
    >
      <div
        className={`p-1 rounded ${isRightSide ? "bg-white/20" : "bg-blue-50"}`}
      >
        <FileText
          size={14}
          className={isRightSide ? "text-white" : "text-blue-500"}
        />
      </div>

      <div className="flex-1 min-w-0">
        <Text
          className={`text-xs font-medium block truncate ${isRightSide ? "text-white" : "text-gray-800"}`}
        >
          {getFileName()}
        </Text>
        <Text
          className={`text-xs ${isRightSide ? "text-white/80" : "text-gray-500"}`}
        >
          {formatFileSize(getFileSize())}
        </Text>
      </div>

      <Tooltip title="Tải xuống">
        <Button
          type="text"
          size="small"
          icon={<Download size={12} />}
          onClick={() => window.open(getFileUrl(), "_blank")}
          className={`
            border-none rounded p-1
            ${
              isRightSide
                ? "text-white bg-white/10 hover:bg-white/20"
                : "text-blue-500 bg-blue-50 hover:bg-blue-100"
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
}> = ({ message, isRightSide, formatFileSize }) => (
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
      <Text
        className={`text-sm leading-relaxed`}
        style={{ color: isRightSide ? "white" : "black" }}
      >
        {message.message}
      </Text>

      {/* File attachments */}
      {message.documents && message.documents.length > 0 && (
        <div className="mt-2">
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
    </div>
  </div>
);

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
      className={`flex gap-3 mb-4 ${isRightSide ? "flex-row-reverse" : "flex-row"}`}
    >
      <MessageAvatar message={message} isRightSide={isRightSide} />

      <div className="flex-1 max-w-[70%]">
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

import React from "react";
import { Avatar, Typography, Button, Tooltip } from "antd";
import { FileText, Download, CheckCircle2 } from "lucide-react";
import type { NegotiationMessage } from "../hooks/useNegotiation";

const { Text } = Typography;

interface MessageItemProps {
  message: NegotiationMessage;
  formatFileSize: (bytes: number) => string;
  formatMessageTime: (timestamp: string) => string;
  side?: "left" | "right";
}

// Avatar component with online status
const MessageAvatar: React.FC<{
  message: NegotiationMessage;
  isRightSide: boolean;
}> = ({ message, isRightSide }) => (
  <div className="flex-shrink-0 relative">
    <Avatar
      size={32}
      className={`${isRightSide ? "bg-blue-500" : "bg-blue-500"} text-white font-medium`}
    >
      {message.senderAvatar ||
        (isRightSide ? "B" : message.senderName?.charAt(0) || "A")}
    </Avatar>
  </div>
);

// Sender name component
const SenderName: React.FC<{
  message: NegotiationMessage;
  isRightSide: boolean;
}> = ({ message, isRightSide }) => (
  <div className={`mb-1 ${isRightSide ? "text-right" : "text-left"}`}>
    <Text
      className={`text-sm font-medium ${isRightSide ? "text-blue-600" : "text-gray-700"}`}
    >
      {isRightSide ? "Bạn" : message.senderName}
    </Text>
  </div>
);

// File attachment component
const FileAttachment: React.FC<{
  attachment: any;
  isRightSide: boolean;
  formatFileSize: (bytes: number) => string;
}> = ({ attachment, isRightSide, formatFileSize }) => (
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
        {attachment.name}
      </Text>
      <Text
        className={`text-xs ${isRightSide ? "text-white/80" : "text-gray-500"}`}
      >
        {formatFileSize(attachment.size)}
      </Text>
    </div>

    <Tooltip title="Tải xuống">
      <Button
        type="text"
        size="small"
        icon={<Download size={12} />}
        onClick={() => window.open(attachment.url, "_blank")}
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

// Message bubble component
const MessageBubble: React.FC<{
  message: NegotiationMessage;
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
      {message.attachments && message.attachments.length > 0 && (
        <div className="mt-2">
          {message.attachments.map((att) => (
            <FileAttachment
              key={att.id}
              attachment={att}
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
  message: NegotiationMessage;
  isRightSide: boolean;
  formatMessageTime: (timestamp: string) => string;
}> = ({ message, isRightSide, formatMessageTime }) => (
  <div
    className={`flex items-center gap-1 mt-1 ${isRightSide ? "justify-end" : "justify-start"}`}
  >
    <Text className="text-xs text-gray-400">
      {formatMessageTime(message.timestamp)}
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
  // Determine side: use prop if provided, otherwise fallback to sender logic
  const isRightSide = side ? side === "right" : message.sender === "owner";

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

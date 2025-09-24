import React from "react";
import { Avatar, Typography, Button, Tooltip } from "antd";
import { FileText, Download, Clock, CheckCircle2 } from "lucide-react";
import type { NegotiationMessage } from "../hooks/useNegotiation";

const { Text } = Typography;

interface NegotiationChatProps {
  messages: NegotiationMessage[];
  formatFileSize: (bytes: number) => string;
}

export const NegotiationChat: React.FC<NegotiationChatProps> = ({
  messages,
  formatFileSize,
}) => {
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100 p-6 relative">
      <div className="w-full mx-auto px-5">
        {messages.map((msg) => {
          const isOwner = msg.sender === "owner";

          return (
            <div
              key={msg.id}
              className={`flex gap-3 mb-6 ${isOwner ? "flex-row-reverse justify-end" : "flex-row justify-start"}`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0 relative">
                <Avatar
                  size={40}
                  className={`${isOwner ? "bg-blue-500" : "bg-green-500"} shadow-lg border-2 border-white`}
                >
                  {msg.senderAvatar || (isOwner ? "B" : "P")}
                </Avatar>

                {/* Online status indicator */}
                {msg.isOnline && (
                  <div
                    className={`absolute bottom-0.5 ${isOwner ? "right-0.5" : "left-0.5"} w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm`}
                  />
                )}
              </div>

              {/* Message content */}
              <div className="max-w-[calc(100%-60px)] min-w-[200px] relative">
                {/* Sender name and status (only for proposer) */}
                {!isOwner && (
                  <div className="mb-2 pl-1">
                    <Text className="text-sm font-semibold text-gray-800">
                      {msg.senderName}
                    </Text>
                    {msg.isOnline && (
                      <Text className="text-xs ml-2 text-green-500 font-medium">
                        • Đang hoạt động
                      </Text>
                    )}
                  </div>
                )}

                {/* Message bubble */}
                <div
                  className={`
                    p-4 leading-relaxed relative
                    ${
                      isOwner
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl rounded-br-md shadow-lg shadow-blue-500/20"
                        : "bg-white text-gray-800 rounded-3xl rounded-bl-md shadow-lg border border-gray-100"
                    }
                  `}
                >
                  {/* Message text */}
                  <Text
                    className={`text-[15px] leading-relaxed ${isOwner ? "text-white" : "text-gray-800"}`}
                  >
                    {msg.message}
                  </Text>

                  {/* File attachments */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-3">
                      {msg.attachments.map((att) => (
                        <div
                          key={att.id}
                          className={`
                            flex items-center gap-3 p-3 rounded-xl mt-2 transition-all duration-200 hover:scale-[1.02]
                            ${
                              isOwner
                                ? "bg-white/15 border border-white/20 hover:bg-white/20"
                                : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                            }
                          `}
                        >
                          <div
                            className={`p-2 rounded-lg ${isOwner ? "bg-white/20" : "bg-blue-50"}`}
                          >
                            <FileText
                              size={18}
                              className={
                                isOwner ? "text-white" : "text-blue-500"
                              }
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <Text
                              className={`text-sm font-medium block mb-0.5 truncate ${isOwner ? "text-white" : "text-gray-800"}`}
                            >
                              {att.name}
                            </Text>
                            <Text
                              className={`text-xs ${isOwner ? "text-white/80" : "text-gray-500"}`}
                            >
                              {formatFileSize(att.size)}
                            </Text>
                          </div>

                          <Tooltip title="Tải xuống">
                            <Button
                              type="text"
                              size="small"
                              icon={<Download size={16} />}
                              onClick={() => window.open(att.url, "_blank")}
                              className={`
                                border-none rounded-lg p-1.5 flex items-center justify-center transition-all duration-200
                                ${
                                  isOwner
                                    ? "text-white bg-white/10 hover:bg-white/20"
                                    : "text-blue-500 bg-blue-50 hover:bg-blue-100"
                                }
                              `}
                            />
                          </Tooltip>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Message timestamp and status */}
                <div
                  className={`flex items-center gap-2 mt-2 px-1 ${isOwner ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex items-center gap-1">
                    <Clock size={12} className="text-gray-400" />
                    <Text className="text-xs text-gray-500">
                      {formatMessageTime(msg.timestamp)}
                    </Text>
                  </div>

                  {isOwner && (
                    <CheckCircle2 size={12} className="text-blue-500" />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Empty state */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText size={32} className="text-gray-400" />
            </div>
            <Text className="text-gray-500 text-base italic">
              Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};

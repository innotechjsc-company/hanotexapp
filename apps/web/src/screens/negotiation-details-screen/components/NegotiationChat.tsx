import React from "react";
import { Typography } from "antd";
import { FileText } from "lucide-react";
import type { NegotiationMessage } from "../hooks/useNegotiation";
import { MessageItem } from "./MessageItem";

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
    <div className="h-full overflow-y-auto bg-gray-50 p-4">
      <div className="w-full max-w-7xl mx-auto">
        {messages.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            formatFileSize={formatFileSize}
            formatMessageTime={formatMessageTime}
            side={msg.sender === "owner" ? "right" : "left"}
          />
        ))}

        {/* Empty state */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center w-full">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <FileText size={24} className="text-gray-400" />
            </div>
            <Text className="text-gray-500 text-sm">
              Chưa có đàm phán nào. Hãy bắt đầu cuộc thương lượng!
            </Text>
          </div>
        )}
      </div>
    </div>
  );
};

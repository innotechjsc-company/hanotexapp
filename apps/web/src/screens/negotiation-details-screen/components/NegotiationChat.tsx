import React, { useEffect, useRef } from "react";
import { Typography } from "antd";
import { FileText } from "lucide-react";
import type { ApiNegotiatingMessage } from "@/api/negotiating-messages";
import { MessageItem } from "./MessageItem";

const { Text } = Typography;

interface NegotiationChatProps {
  messages: ApiNegotiatingMessage[];
  formatFileSize: (bytes: number) => string;
  messageInputComponent?: React.ReactNode;
}

export const NegotiationChat: React.FC<NegotiationChatProps> = ({
  messages,
  formatFileSize,
  messageInputComponent,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-full p-4 bg-gray-50">
      <div className="h-full max-w-4xl mx-auto">
        {/* Messages container with border and scroll */}
        <div
          className="h-full bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          {/* Messages scroll area */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto p-3 min-h-0"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#d1d5db #f3f4f6",
              WebkitOverflowScrolling: "touch", // For smooth scrolling on mobile
            }}
            onWheel={(e) => {
              // Prevent scroll from bubbling up to parent
              e.stopPropagation();

              // Ensure the scroll happens within this container
              const container = e.currentTarget;
              const { scrollTop, scrollHeight, clientHeight } = container;

              // If we're at the top and trying to scroll up, or at bottom and trying to scroll down
              if (
                (scrollTop === 0 && e.deltaY < 0) ||
                (scrollTop + clientHeight >= scrollHeight && e.deltaY > 0)
              ) {
                // Allow the event to bubble up
                return;
              }

              // Otherwise, prevent bubbling
              e.preventDefault();
            }}
          >
            <div className="space-y-1">
              {messages.map((msg) => (
                <MessageItem
                  key={msg.id}
                  message={msg}
                  formatFileSize={formatFileSize}
                  formatMessageTime={formatMessageTime}
                />
              ))}

              {/* Empty state */}
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center w-full min-h-[300px]">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                    <FileText size={24} className="text-gray-400" />
                  </div>
                  <Text className="text-gray-500 text-sm">
                    Chưa có đàm phán nào. Hãy bắt đầu cuộc thương lượng!
                  </Text>
                </div>
              )}

              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input at bottom of the frame */}
          {messageInputComponent && (
            <div className="flex-shrink-0 border-t border-gray-200">
              {messageInputComponent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

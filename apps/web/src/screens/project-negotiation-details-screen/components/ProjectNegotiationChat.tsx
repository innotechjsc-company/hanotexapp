import React, { useEffect, useRef } from "react";
import { Empty } from "antd";
import type { ApiNegotiatingMessage } from "@/api/negotiating-messages";
import { MessageItem } from "./MessageItem";

interface ProjectNegotiationChatProps {
  messages: ApiNegotiatingMessage[];
  formatFileSize: (bytes: number) => string;
  messageInputComponent: React.ReactNode;
}

export const ProjectNegotiationChat: React.FC<ProjectNegotiationChatProps> = ({
  messages,
  formatFileSize,
  messageInputComponent,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-full flex flex-col">
      {/* Messages area - scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <Empty
              description="Chưa có tin nhắn đàm phán nào"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                formatFileSize={formatFileSize}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message input - fixed at bottom */}
      <div className="flex-shrink-0 border-t bg-white">
        {messageInputComponent}
      </div>
    </div>
  );
};

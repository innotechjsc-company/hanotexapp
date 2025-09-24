"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  MessageSquare,
  Send,
  Search,
  MoreVertical,
  Star,
  Reply,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { getRoomChats } from "@/api/roomChat";
import { getUsersInRoom } from "@/api/roomUser";
import { getMessagesForRoom, sendMessage } from "@/api/roomMessage";
import { RoomChat } from "@/api/roomChat";
import { RoomUser } from "@/types/room_user";
import { RoomMessage } from "@/api/roomMessage";

export default function MessagesPage() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const roomIdFromUrl = searchParams.get("roomId");

  const [selectedConversation, setSelectedConversation] = useState<
    number | null
  >(null);
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState<RoomChat[]>([]);
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [roomUsers, setRoomUsers] = useState<RoomUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Load conversations on component mount
  useEffect(() => {
    if (user?.id) {
      loadConversations();
    }
  }, [user?.id]);

  // Auto-select conversation if roomId is provided in URL
  useEffect(() => {
    if (roomIdFromUrl && conversations.length > 0) {
      const roomIndex = conversations.findIndex(
        (room) => room.id === roomIdFromUrl
      );
      if (roomIndex !== -1) {
        setSelectedConversation(roomIndex);
      }
    }
  }, [roomIdFromUrl, conversations]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation !== null && conversations[selectedConversation]) {
      loadMessages(conversations[selectedConversation].id);
      loadRoomUsers(conversations[selectedConversation].id);
    }
  }, [selectedConversation, conversations]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      // For now, get all room chats - in a real app, you'd filter by user
      const response = await getRoomChats({}, { limit: 50 });
      setConversations(response.docs || []);
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (roomId: string) => {
    try {
      const response = await getMessagesForRoom(roomId, { limit: 100 });
      setMessages(response.docs || []);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const loadRoomUsers = async (roomId: string) => {
    try {
      const response = await getUsersInRoom(roomId);
      setRoomUsers(response.docs || []);
    } catch (error) {
      console.error("Error loading room users:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user?.id || selectedConversation === null)
      return;

    const currentRoom = conversations[selectedConversation];
    if (!currentRoom) return;

    try {
      setSendingMessage(true);
      await sendMessage(currentRoom.id, user.id, newMessage.trim());
      setNewMessage("");
      // Reload messages to show the new message
      await loadMessages(currentRoom.id);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Helper function to get conversation display name
  const getConversationName = (conversation: RoomChat) => {
    return conversation.title || `Room ${conversation.id}`;
  };

  // Helper function to get conversation avatar
  const getConversationAvatar = (conversation: RoomChat) => {
    const name = getConversationName(conversation);
    return name.substring(0, 2).toUpperCase();
  };

  // Helper function to format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("vi-VN");
    }
  };

  // Helper function to check if message is from current user
  const isOwnMessage = (message: RoomMessage) => {
    const messageUserId =
      typeof message.user === "string" ? message.user : message.user?.id;
    return messageUserId === user?.id;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <MessageSquare className="h-8 w-8 text-blue-600 mr-3" />
            Tin nhắn
          </h1>
          <p className="text-gray-600 mt-2">
            Quản lý tin nhắn và giao tiếp với các đối tác
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Conversations List */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm tin nhắn..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">
                  Đang tải cuộc trò chuyện...
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  Chưa có cuộc trò chuyện nào
                </div>
              ) : (
                conversations.map((conversation, index) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(index)}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                      selectedConversation === index
                        ? "bg-blue-50 border-blue-200"
                        : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                          {getConversationAvatar(conversation)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {getConversationName(conversation)}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatTime(conversation.updatedAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {messages.length > 0
                            ? messages[messages.length - 1]?.message
                            : "Chưa có tin nhắn"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow flex flex-col">
            {selectedConversation !== null ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                        {getConversationAvatar(
                          conversations[selectedConversation]
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {getConversationName(
                            conversations[selectedConversation]
                          )}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {roomUsers.length} thành viên
                        </p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isOwn = isOwnMessage(message);
                      const userName =
                        typeof message.user === "string"
                          ? "Unknown User"
                          : message.user?.full_name || "Unknown User";

                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              isOwn
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            {!isOwn && (
                              <p className="text-xs font-medium mb-1 text-gray-600">
                                {userName}
                              </p>
                            )}
                            <p className="text-sm">{message.message}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isOwn ? "text-blue-100" : "text-gray-500"
                              }`}
                            >
                              {formatTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Nhập tin nhắn..."
                      disabled={sendingMessage}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={sendingMessage || !newMessage.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Chọn cuộc trò chuyện
                  </h3>
                  <p className="text-gray-600">
                    Chọn một cuộc trò chuyện từ danh sách để bắt đầu
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

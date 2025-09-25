"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  MessageSquare,
  Send,
  Search,
  MoreVertical,
  Star,
  Reply,
  Paperclip,
  X,
  File,
  Image,
  FileText,
  Video,
  Download,
  Play,
  Eye,
  ExternalLink,
  Trash2,
  ChevronDown,
  LogIn,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import {
  getRoomChats,
  deleteRoomChat,
  getRoomChatsByIds,
} from "@/api/roomChat";
import {
  getUsersInRoom,
  deleteRoomUser,
  getRoomsForUser,
  getUsersInMultipleRooms,
} from "@/api/roomUser";
import {
  getMessagesForRoom,
  sendMessage,
  sendMessageWithFile,
  deleteRoomMessage,
  Media,
} from "@/api/roomMessage";
import { RoomChat } from "@/api/roomChat";
import { RoomUser } from "@/types/room_user";
import { RoomMessage } from "@/api/roomMessage";
import { uploadFile } from "@/api/media";
import { getMediaUrlWithDebug } from "@/utils/mediaUrl";
import { MediaType } from "@/types/media1";
import toast from "react-hot-toast";
import webSocketService, { ChatMessage } from "@/services/websocket";

export default function MessagesPage() {
  const { user, isAuthenticated } = useAuthStore();
  const searchParams = useSearchParams();
  const router = useRouter();
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
  const [roomParticipants, setRoomParticipants] = useState<
    Record<string, RoomUser[]>
  >({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingChat, setDeletingChat] = useState(false);
  const [lastMessages, setLastMessages] = useState<
    Record<string, RoomMessage | null>
  >({});
  const [typingUsers, setTypingUsers] = useState<
    Record<string, { userId: string; userName: string }[]>
  >({});
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const [messageReactions, setMessageReactions] = useState<
    Record<string, { userId: string; userName: string; emoji: string }[]>
  >({});
  const [userStatuses, setUserStatuses] = useState<
    Record<string, { status: "online" | "offline" | "away"; lastSeen?: string }>
  >({});
  const [messageStatuses, setMessageStatuses] = useState<
    Record<string, { status: string; readBy: string[] }>
  >({});
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const loadFromSelectionRef = useRef<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Play notification sound
  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .catch((e) => console.log("Could not play notification sound:", e));
    }
  };

  // Load conversations on component mount
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadConversations();
    } else if (!isAuthenticated) {
      // Clear conversations if not authenticated
      setConversations([]);
      setMessages([]);
      setSelectedConversation(null);
    }
  }, [isAuthenticated, user?.id]);

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
      loadMessages(conversations[selectedConversation].id, true);
      loadRoomUsers(conversations[selectedConversation].id);
    }
  }, [selectedConversation, conversations]);

  // Initialize WebSocket connection
  useEffect(() => {
    if (isAuthenticated && user?.id && user?.full_name) {
      console.log("🔌 Initializing WebSocket connection...");

      // Authenticate with WebSocket server
      webSocketService.authenticate(user.id, user.full_name);

      // Set up event listeners
      const cleanupMessageReceived = webSocketService.onMessageReceived(
        (message: ChatMessage) => {
          console.log("💬 Real-time message received:", message);

          // Add message to current messages if we're in the same room
          if (
            selectedConversation !== null &&
            conversations[selectedConversation]?.id === message.room
          ) {
            const newMessage: RoomMessage = {
              id: message.id,
              room: message.room,
              message: message.message,
              user: message.user,
              document: message.document as any, // Cast to match RoomMessage type
              createdAt: message.createdAt,
              updatedAt: message.updatedAt,
            };

            setMessages((prevMessages) => [...prevMessages, newMessage]);
          }

          // Update last message for the room
          const lastMessage: RoomMessage = {
            id: message.id,
            room: message.room,
            message: message.message,
            user: message.user,
            document: message.document as any, // Cast to match RoomMessage type
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
          };

          setLastMessages((prev) => ({
            ...prev,
            [message.room]: lastMessage,
          }));

          // Handle UI updates for new message
          if (
            selectedConversation !== null &&
            conversations[selectedConversation]?.id === message.room
          ) {
            // Auto-scroll to bottom for messages in current room
            setTimeout(scrollToBottom, 100);
          } else {
            // Show toast notification and play sound for messages in other rooms
            const roomName =
              conversations.find((c) => c.id === message.room)?.title ||
              "Unknown Room";
            toast.success(
              `New message in ${roomName}: ${message.message.substring(0, 50)}${message.message.length > 50 ? "..." : ""}`
            );
            playNotificationSound();
          }
        }
      );

      const cleanupUserTypingStart = webSocketService.onUserTypingStart(
        (data) => {
          if (data.userId !== user.id) {
            // Don't show our own typing
            setTypingUsers((prev) => ({
              ...prev,
              [data.roomId]: [
                ...(prev[data.roomId] || []).filter(
                  (u) => u.userId !== data.userId
                ),
                { userId: data.userId, userName: data.userName },
              ],
            }));
          }
        }
      );

      const cleanupUserTypingStop = webSocketService.onUserTypingStop(
        (data) => {
          setTypingUsers((prev) => ({
            ...prev,
            [data.roomId]: (prev[data.roomId] || []).filter(
              (u) => u.userId !== data.userId
            ),
          }));
        }
      );

      // Handle message reactions
      const cleanupMessageReaction = webSocketService.onMessageReaction(
        (data) => {
          console.log("🎭 Message reaction received:", data);

          setMessageReactions((prev) => {
            const messageReactions = prev[data.messageId] || [];

            if (data.action === "add") {
              // Add reaction if not already exists
              const existingReaction = messageReactions.find(
                (r) =>
                  r.userId === data.reaction.userId &&
                  r.emoji === data.reaction.emoji
              );

              if (!existingReaction) {
                return {
                  ...prev,
                  [data.messageId]: [
                    ...messageReactions,
                    {
                      userId: data.reaction.userId,
                      userName: data.reaction.userName,
                      emoji: data.reaction.emoji,
                    },
                  ],
                };
              }
            } else {
              // Remove reaction
              return {
                ...prev,
                [data.messageId]: messageReactions.filter(
                  (r) =>
                    !(
                      r.userId === data.reaction.userId &&
                      r.emoji === data.reaction.emoji
                    )
                ),
              };
            }

            return prev;
          });
        }
      );

      // Handle user status updates
      const cleanupUserStatus = webSocketService.onUserStatus((data) => {
        console.log("👤 User status received:", data);

        setUserStatuses((prev) => ({
          ...prev,
          [data.userId]: {
            status: data.status,
            lastSeen: data.lastSeen,
          },
        }));
      });

      // Handle message status updates
      const cleanupMessageStatus = webSocketService.onMessageStatus((data) => {
        setMessageStatuses((prev) => ({
          ...prev,
          [data.messageId]: {
            status: data.status,
            readBy: [...(prev[data.messageId]?.readBy || []), data.userId],
          },
        }));
      });

      // Monitor connection status
      const checkConnection = () => {
        setIsWebSocketConnected(webSocketService.isSocketConnected());
      };

      const connectionInterval = setInterval(checkConnection, 1000);
      checkConnection(); // Initial check

      // Cleanup function
      return () => {
        cleanupMessageReceived();
        cleanupUserTypingStart();
        cleanupUserTypingStop();
        cleanupMessageReaction();
        cleanupUserStatus();
        cleanupMessageStatus();
        clearInterval(connectionInterval);
      };
    }
  }, [
    isAuthenticated,
    user?.id,
    user?.full_name,
    selectedConversation,
    conversations,
  ]);

  // Join WebSocket room when conversation is selected
  useEffect(() => {
    if (
      selectedConversation !== null &&
      conversations[selectedConversation] &&
      isWebSocketConnected
    ) {
      const roomId = conversations[selectedConversation].id;
      console.log(`🏠 Joining WebSocket room: ${roomId}`);
      webSocketService.joinRoom(roomId);
    }
  }, [selectedConversation, conversations, isWebSocketConnected]);

  // Auto-scroll when messages change (skip when switching rooms)
  useEffect(() => {
    if (messages.length > 0 && !loadFromSelectionRef.current) {
      setTimeout(scrollToBottom, 100);
    }
    if (loadFromSelectionRef.current) {
      loadFromSelectionRef.current = false;
    }
  }, [messages]);

  // Initialize audio for notifications
  useEffect(() => {
    audioRef.current = new Audio(
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT"
    );
  }, []);

  // Mark messages as read when viewing them
  useEffect(() => {
    if (
      selectedConversation !== null &&
      conversations[selectedConversation] &&
      messages.length > 0
    ) {
      const roomId = conversations[selectedConversation].id;
      const lastMessage = messages[messages.length - 1];

      if (lastMessage && lastMessage.user.id !== user?.id) {
        // Mark the last message as read after a short delay
        setTimeout(() => {
          webSocketService.markMessageAsRead(lastMessage.id, roomId);
        }, 1000);
      }
    }
  }, [messages, selectedConversation, conversations, user?.id]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showDropdown]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      console.log("🔍 Starting loadConversations...");

      if (!user?.id) {
        console.log("❌ No user ID found");
        setConversations([]);
        return;
      }

      console.log("👤 User ID:", user.id);

      // Get rooms that current user is a member of
      console.log("📡 Fetching user rooms...");
      const userRoomsResponse = await getRoomsForUser(user.id, { limit: 100 });
      const userRooms = userRoomsResponse.docs || [];

      console.log("🏠 User rooms response:", userRoomsResponse);
      console.log("🏠 User rooms count:", userRooms.length);

      if (userRooms.length === 0) {
        console.log("❌ No rooms found for user");
        setConversations([]);
        return;
      }

      // Extract room IDs from user's room memberships
      // Handle both string ID and populated object cases
      const roomIds = userRooms.map((roomUser) => {
        // If room is populated (object), get the id property
        // If room is just an ID (string), use it directly
        return typeof roomUser.room === "string"
          ? roomUser.room
          : (roomUser.room as any).id;
      });

      // Get room chats by IDs (more efficient than filtering all rooms)
      const roomsResponse = await getRoomChatsByIds(roomIds, { limit: 100 });
      const conversationsList = roomsResponse.docs || [];

      // Sort conversations by updatedAt (most recent first)
      conversationsList.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );

      setConversations(conversationsList);

      // Load last message for each conversation
      await loadLastMessagesForConversations(conversationsList);

      // Load participants for each conversation (to display names excluding current user)
      await loadParticipantsForConversations(conversationsList);
    } catch (error) {
      console.error("❌ Error loading conversations:", error);
      toast.error("Có lỗi xảy ra khi tải cuộc trò chuyện");
    } finally {
      setLoading(false);
    }
  };

  const loadParticipantsForConversations = async (
    conversationsList: RoomChat[]
  ) => {
    try {
      const roomIds = conversationsList.map((c) => c.id);
      if (roomIds.length === 0) return;

      const resp = await getUsersInMultipleRooms(roomIds, { limit: 1000 });
      const docs = resp.docs || [];

      const map: Record<string, RoomUser[]> = {};
      for (const ru of docs) {
        const roomId = typeof ru.room === "string" ? ru.room : (ru.room as any);
        if (!map[roomId]) map[roomId] = [] as RoomUser[];
        map[roomId].push(ru as RoomUser);
      }
      setRoomParticipants(map);
    } catch (e) {
      console.error("Error loading room participants:", e);
    }
  };

  // Ensure participants for a single room if missing
  const ensureParticipantsForRoom = async (roomId: string) => {
    if (roomParticipants[roomId]) return;
    try {
      const resp = await getUsersInRoom(roomId, { limit: 1000 });
      const docs = resp.docs || [];
      setRoomParticipants((prev) => ({
        ...prev,
        [roomId]: docs as RoomUser[],
      }));
    } catch (e) {
      console.error("Error ensuring participants for room:", roomId, e);
    }
  };

  const loadLastMessagesForConversations = async (
    conversationsList: RoomChat[]
  ) => {
    const lastMessagesMap: Record<string, RoomMessage | null> = {};

    // Load last message for each conversation
    for (const conversation of conversationsList) {
      try {
        const response = await getMessagesForRoom(conversation.id, {
          limit: 1,
          sort: "-createdAt", // Sort by creation time descending to get latest message
        });
        const lastMessage =
          response.docs && response.docs.length > 0 ? response.docs[0] : null;
        lastMessagesMap[conversation.id] = lastMessage;

        console.log(
          `Last message for room ${conversation.id}:`,
          lastMessage?.message || "No message"
        );
      } catch (error) {
        console.error(
          `Error loading last message for room ${conversation.id}:`,
          error
        );
        lastMessagesMap[conversation.id] = null;
      }
    }

    setLastMessages(lastMessagesMap);
  };

  const loadMessages = async (
    roomId: string,
    fromSelection: boolean = false
  ) => {
    try {
      loadFromSelectionRef.current = fromSelection;
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
    } catch (error) {}
  };

  const handleSendMessage = async () => {
    // Kiểm tra authentication trước tiên
    if (!isAuthenticated || !user?.id) {
      toast.error("Vui lòng đăng nhập để gửi tin nhắn");
      router.push("/auth/login?redirect=/messages");
      return;
    }

    // Kiểm tra nội dung tin nhắn
    if (
      (!newMessage.trim() && selectedFiles.length === 0) ||
      selectedConversation === null
    ) {
      toast.error("Vui lòng nhập tin nhắn hoặc chọn file để gửi");
      return;
    }

    const currentRoom = conversations[selectedConversation];
    if (!currentRoom) {
      toast.error("Không tìm thấy cuộc trò chuyện");
      return;
    }

    try {
      setSendingMessage(true);

      let documentId: string | undefined;

      // Upload files if any are selected
      if (selectedFiles.length > 0) {
        setUploadingFiles(true);
        try {
          // Upload the first file (for now, support single file)
          const file = selectedFiles[0];
          const uploadedMedia = await uploadFile(file, {
            alt: file.name,
            caption: `File đính kèm từ ${user.full_name || user.email}`,
            type: file.type.startsWith("image/")
              ? MediaType.IMAGE
              : file.type.startsWith("video/")
                ? MediaType.VIDEO
                : MediaType.DOCUMENT,
          });
          documentId = uploadedMedia.id.toString();
        } catch (uploadError) {
          console.error("Error uploading file:", uploadError);
          return;
        } finally {
          setUploadingFiles(false);
        }
      }

      // Send message with or without file
      const sentMessage = await sendMessage(
        currentRoom.id,
        user.id,
        newMessage.trim() ||
          (selectedFiles.length > 0 ? `📎 ${selectedFiles[0].name}` : ""),
        documentId
      );

      // Send message via WebSocket for real-time delivery
      if (isWebSocketConnected && sentMessage) {
        const webSocketMessage: ChatMessage = {
          id: sentMessage.id,
          room: currentRoom.id,
          message: sentMessage.message,
          user: {
            id: user.id,
            full_name: user.full_name || user.email,
            email: user.email,
          },
          document: sentMessage.document
            ? {
                id:
                  typeof sentMessage.document === "string"
                    ? sentMessage.document
                    : sentMessage.document.id,
                filename:
                  typeof sentMessage.document === "string"
                    ? "Unknown"
                    : sentMessage.document.filename || "Unknown",
                url:
                  typeof sentMessage.document === "string"
                    ? ""
                    : sentMessage.document.url || "",
              }
            : undefined,
          createdAt: sentMessage.createdAt,
          updatedAt: sentMessage.updatedAt,
        };

        webSocketService.sendMessage(webSocketMessage);
      }

      setNewMessage("");
      setSelectedFiles([]);
      // Reload messages to show the new message
      await loadMessages(currentRoom.id);

      // Update last message for this conversation immediately with the sent message
      setLastMessages((prev) => ({
        ...prev,
        [currentRoom.id]: sentMessage,
      }));

      // Move this conversation to the top of the list by updating its updatedAt
      setConversations((prev) => {
        const updatedConversations = prev.map((conv) => {
          if (conv.id === currentRoom.id) {
            return {
              ...conv,
              updatedAt: sentMessage.createdAt, // Use the message timestamp
            };
          }
          return conv;
        });

        // Sort conversations by updatedAt descending (most recent first)
        const sortedConversations = updatedConversations.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );

        // Update selectedConversation index since the list order changed
        const newIndex = sortedConversations.findIndex(
          (conv) => conv.id === currentRoom.id
        );
        if (newIndex !== -1 && newIndex !== selectedConversation) {
          setSelectedConversation(newIndex);
        }

        return sortedConversations;
      });
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNewMessage(value);

    // Handle typing indicators
    if (
      isWebSocketConnected &&
      selectedConversation !== null &&
      conversations[selectedConversation]
    ) {
      const roomId = conversations[selectedConversation].id;

      if (value.trim()) {
        // Start typing
        webSocketService.startTyping(roomId);

        // Clear existing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        // Set timeout to stop typing after 3 seconds of inactivity
        typingTimeoutRef.current = setTimeout(() => {
          webSocketService.stopTyping(roomId);
        }, 3000);
      } else {
        // Stop typing if input is empty
        webSocketService.stopTyping(roomId);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = null;
        }
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files.slice(0, 1)); // Only allow one file for now
    }
    // Reset input value to allow selecting the same file again
    e.target.value = "";
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle delete chat - xóa theo thứ tự: messages -> users -> room
  const handleDeleteChat = async () => {
    if (selectedConversation === null || !conversations[selectedConversation]) {
      return;
    }

    setDeletingChat(true);
    try {
      const chatId = conversations[selectedConversation].id;

      console.log(`Bắt đầu xóa chat room: ${chatId}`);

      try {
        const messagesResponse = await getMessagesForRoom(chatId, {
          limit: 1000,
        });
        const allMessages = messagesResponse.docs || [];

        for (const message of allMessages) {
          await deleteRoomMessage(message.id);
        }
      } catch (messageError) {
        console.error("Lỗi khi xóa tin nhắn:", messageError);
        throw new Error("Không thể xóa tin nhắn trong room");
      }

      try {
        // Lấy tất cả users trong room (với limit cao để lấy hết)
        const usersResponse = await getUsersInRoom(chatId, { limit: 1000 });
        const allUsers = usersResponse.docs || [];

        // Xóa từng user
        for (const roomUser of allUsers) {
          await deleteRoomUser(roomUser.id);
        }
      } catch (userError) {
        console.error("Lỗi khi xóa người dùng:", userError);
        throw new Error("Không thể xóa người dùng trong room");
      }

      await deleteRoomChat(chatId);

      // Cập nhật UI
      setConversations((prev) =>
        prev.filter((_, index) => index !== selectedConversation)
      );

      // Xóa tin nhắn cuối cùng khỏi state
      setLastMessages((prev) => {
        const newLastMessages = { ...prev };
        delete newLastMessages[chatId];
        return newLastMessages;
      });

      // Reset selection
      setSelectedConversation(null);
      setMessages([]);
      setRoomUsers([]);

      // Close modal
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting chat:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
    } finally {
      setDeletingChat(false);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <Image className="h-4 w-4" />;
    if (file.type.startsWith("video/")) return <Video className="h-4 w-4" />;
    if (file.type.includes("pdf")) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const renderFilePreview = (file: File, index: number) => {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    return (
      <div key={index} className="bg-white p-3 rounded-lg border shadow-sm">
        {/* Image Preview */}
        {isImage && (
          <div className="mb-2">
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="max-w-full max-h-32 rounded object-cover"
              onLoad={(e) => {
                // Clean up object URL after image loads
                URL.revokeObjectURL((e.target as HTMLImageElement).src);
              }}
            />
          </div>
        )}

        {/* Video Preview */}
        {isVideo && (
          <div className="mb-2 relative">
            <video
              src={URL.createObjectURL(file)}
              className="max-w-full max-h-32 rounded object-cover"
              preload="metadata"
              onLoadedMetadata={(e) => {
                // Clean up object URL after video loads
                URL.revokeObjectURL((e.target as HTMLVideoElement).src);
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black bg-opacity-50 rounded-full p-2">
                <Play className="h-6 w-6 text-white fill-current" />
              </div>
            </div>
          </div>
        )}

        {/* File Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            {!isImage && !isVideo && getFileIcon(file)}
            <div className="flex-1 min-w-0">
              <span className="text-sm text-gray-700 font-medium truncate block">
                {file.name}
              </span>
              <span className="text-xs text-gray-500">
                ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            </div>
          </div>
          <button
            onClick={() => removeSelectedFile(index)}
            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
            title="Xóa file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  const getMediaFileIcon = (media: Media) => {
    if (media.type === "image") return <Image className="h-6 w-6" />;
    if (media.type === "video") return <Video className="h-6 w-6" />;
    if (media.type === "document") return <FileText className="h-6 w-6" />;
    return <File className="h-6 w-6" />;
  };

  const renderFileAttachment = (media: Media, isOwn: boolean) => {
    const mediaUrl = getMediaUrlWithDebug(media.url, "chat-attachment");

    const handleViewDetails = (e: React.MouseEvent) => {
      e.stopPropagation();

      // Create modal for file details
      const modal = document.createElement("div");
      modal.className =
        "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4";
      modal.onclick = (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
        }
      };

      const modalContent = document.createElement("div");
      modalContent.className = "bg-white rounded-lg p-6 max-w-md w-full mx-4";

      modalContent.innerHTML = `
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Chi tiết file</h3>
          <button class="text-gray-400 hover:text-gray-600 close-btn">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="space-y-3">
          <div>
            <label class="text-sm font-medium text-gray-700">Tên file:</label>
            <p class="text-sm text-gray-900 mt-1">${media.filename}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Kích thước:</label>
            <p class="text-sm text-gray-900 mt-1">${(media.filesize / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-700">Loại file:</label>
            <p class="text-sm text-gray-900 mt-1">${media.type}</p>
          </div>
        </div>
        <div class="flex space-x-3 mt-6">
          <button class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors view-btn">
            <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
            Xem file
          </button>
       </div>
      `;

      // Add event listeners
      const closeBtn = modalContent.querySelector(".close-btn");
      const viewBtn = modalContent.querySelector(".view-btn");
      const downloadBtn = modalContent.querySelector(".download-btn");

      closeBtn?.addEventListener("click", () =>
        document.body.removeChild(modal)
      );
      viewBtn?.addEventListener("click", () => {
        window.open(mediaUrl, "_blank");
        document.body.removeChild(modal);
      });
      downloadBtn?.addEventListener("click", () => {
        const link = document.createElement("a");
        link.href = mediaUrl;
        link.download = media.filename;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        document.body.removeChild(modal);
      });

      modal.appendChild(modalContent);
      document.body.appendChild(modal);
    };

    // Render image - clean and simple
    if (media.type === "image") {
      return (
        <div className="mt-2 relative group">
          <img
            src={mediaUrl}
            alt={media.alt}
            className="max-w-xs max-h-64 rounded-lg object-cover cursor-pointer shadow-sm"
            onClick={() => window.open(mediaUrl, "_blank")}
          />
          {/* View details overlay on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center">
            <button
              onClick={handleViewDetails}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg"
              title="Xem chi tiết"
            >
              <Eye className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>
      );
    }

    // Render video - clean and simple
    if (media.type === "video") {
      return (
        <div className="mt-2 relative group">
          <video
            src={mediaUrl}
            className="max-w-xs max-h-64 rounded-lg object-cover cursor-pointer shadow-sm"
            controls={false}
            preload="metadata"
            onClick={() => {
              const video = document.createElement("video");
              video.src = mediaUrl;
              video.controls = true;
              video.autoplay = true;
              video.style.maxWidth = "90vw";
              video.style.maxHeight = "90vh";

              const modal = document.createElement("div");
              modal.className =
                "fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50";
              modal.onclick = () => document.body.removeChild(modal);
              modal.appendChild(video);
              document.body.appendChild(modal);
            }}
          />
          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black bg-opacity-50 rounded-full p-3">
              <Play className="h-8 w-8 text-white fill-current" />
            </div>
          </div>
          {/* View details overlay on hover */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleViewDetails}
              className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg"
              title="Xem chi tiết"
            >
              <Eye className="h-4 w-4 text-gray-700" />
            </button>
          </div>
        </div>
      );
    }

    // Render other file types (documents, etc.) - clean and simple
    return (
      <div
        className={`mt-2 p-2 rounded-lg border cursor-pointer transition-colors inline-flex ${
          isOwn
            ? "bg-white bg-opacity-20 border-white border-opacity-30 hover:bg-opacity-30"
            : "bg-gray-50 border-gray-200 hover:bg-gray-100"
        }`}
        onClick={() => window.open(mediaUrl, "_blank")}
      >
        <div className="flex items-center justify-center space-x-3">
          <div
            className={`p-3 rounded-full ${
              isOwn ? "bg-white bg-opacity-30" : "bg-gray-100"
            }`}
          >
            {getMediaFileIcon(media)}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails(e);
            }}
            className={`p-2 rounded-full transition-colors ${
              isOwn
                ? "hover:bg-white hover:bg-opacity-20 text-white"
                : "hover:bg-gray-100 text-gray-600"
            }`}
            title="Xem chi tiết"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  // Helper function to get conversation display name
  const getConversationName = (conversation: RoomChat) => {
    const participants = roomParticipants[conversation.id];
    if (!participants) {
      // Fire-and-forget to fetch if missing; UI will update on state set
      ensureParticipantsForRoom(conversation.id);
      return conversation.title || `Room ${conversation.id}`;
    }

    // Exclude current user
    const others = participants.filter((ru) => {
      const ruId = (ru.user as any)?.id;
      const ruName = (ru.user as any)?.full_name;
      const currId = user?.id;
      const currName = user?.full_name;
      return ruId ? ruId !== currId : ruName !== currName;
    });

    // 1-1 chat: show the other user's name
    if (others.length === 1 && participants.length === 2) {
      const other = others[0];
      return (
        ((other.user as any)?.full_name as string) ||
        ((other.user as any)?.email as string) ||
        conversation.title ||
        `Room ${conversation.id}`
      );
    }

    // Group chat: join top names
    if (others.length > 0) {
      const names = others
        .map((ru) => (ru.user as any)?.full_name || (ru.user as any)?.email)
        .filter(Boolean) as string[];
      if (names.length === 1) return names[0];
      if (names.length === 2) return `${names[0]}, ${names[1]}`;
      if (names.length > 2)
        return `${names[0]}, ${names[1]} +${names.length - 2}`;
    }

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

  // Helper function to get last message display text
  const getLastMessageDisplay = (message: RoomMessage | null) => {
    if (!message) return "Chưa có tin nhắn";

    // If message has document attachment, show file indicator
    if (message.document) {
      return "📎 Đã gửi file";
    }

    // If message is empty but has document, show file indicator
    if (!message.message && message.document) {
      return "📎 File đính kèm";
    }

    // Return the actual message text
    return message.message || "Tin nhắn trống";
  };

  // Helper function to check if message is from current user
  const isOwnMessage = (message: RoomMessage) => {
    const messageUserId =
      typeof message.user === "string" ? message.user : message.user?.id;
    return messageUserId === user?.id;
  };

  return (
    <div className="min-h-screen h-[100vh] bg-gray-50 flex flex-col w-full">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Conversations List */}
          <div className="bg-white rounded-lg shadow flex flex-col h-full">
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

            <div className="overflow-y-auto flex-1">
              {!isAuthenticated ? (
                <div className="p-4 text-center">
                  <div className="text-gray-500 mb-3">
                    <LogIn className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">
                      Vui lòng đăng nhập để xem tin nhắn
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      router.push("/auth/login?redirect=/messages")
                    }
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Đăng nhập ngay
                  </button>
                </div>
              ) : loading ? (
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
                            {lastMessages[conversation.id]?.createdAt
                              ? formatTime(
                                  lastMessages[conversation.id]!.createdAt
                                )
                              : formatTime(conversation.updatedAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {getLastMessageDisplay(lastMessages[conversation.id])}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow flex flex-col h-full overflow-hidden">
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
                    <div className="relative">
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowDropdown(!showDropdown)}
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>

                      {/* Dropdown Menu */}
                      {showDropdown && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                setShowDropdown(false);
                                setShowDeleteModal(true);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Xóa đoạn chat</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4"
                >
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
                          className={`flex group ${isOwn ? "justify-end" : "justify-start"}`}
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

                            {/* File Attachment */}
                            {message.document &&
                              typeof message.document === "object" &&
                              renderFileAttachment(message.document, isOwn)}

                            {/* Message Reactions */}
                            {messageReactions[message.id] &&
                              messageReactions[message.id].length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {messageReactions[message.id].map(
                                    (reaction, index) => (
                                      <button
                                        key={`${reaction.userId}-${reaction.emoji}-${index}`}
                                        onClick={() => {
                                          if (reaction.userId === user?.id) {
                                            // Remove own reaction
                                            webSocketService.removeMessageReaction(
                                              message.id,
                                              typeof message.room === "string"
                                                ? message.room
                                                : message.room.id,
                                              reaction.emoji
                                            );
                                          }
                                        }}
                                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                          reaction.userId === user?.id
                                            ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        } transition-colors`}
                                        title={`${reaction.userName} reacted with ${reaction.emoji}`}
                                      >
                                        <span className="mr-1">
                                          {reaction.emoji}
                                        </span>
                                        <span className="text-xs">
                                          {
                                            messageReactions[message.id].filter(
                                              (r) => r.emoji === reaction.emoji
                                            ).length
                                          }
                                        </span>
                                      </button>
                                    )
                                  )}
                                </div>
                              )}

                            {/* Quick Reaction Buttons */}
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {["👍", "❤️", "😂", "😮", "😢", "😡"].map(
                                  (emoji) => (
                                    <button
                                      key={emoji}
                                      onClick={() => {
                                        const existingReaction =
                                          messageReactions[message.id]?.find(
                                            (r) =>
                                              r.userId === user?.id &&
                                              r.emoji === emoji
                                          );

                                        const roomId =
                                          typeof message.room === "string"
                                            ? message.room
                                            : message.room.id;

                                        if (existingReaction) {
                                          webSocketService.removeMessageReaction(
                                            message.id,
                                            roomId,
                                            emoji
                                          );
                                        } else {
                                          webSocketService.addMessageReaction(
                                            message.id,
                                            roomId,
                                            emoji
                                          );
                                        }
                                      }}
                                      className="hover:bg-gray-100 rounded-full p-1 text-sm transition-colors"
                                      title={`React with ${emoji}`}
                                    >
                                      {emoji}
                                    </button>
                                  )
                                )}
                              </div>

                              <p
                                className={`text-xs ${
                                  isOwn ? "text-blue-100" : "text-gray-500"
                                }`}
                              >
                                {formatTime(message.createdAt)}
                                {messageStatuses[message.id] && (
                                  <span className="ml-2">
                                    {messageStatuses[message.id].status ===
                                      "read" && "✓✓"}
                                    {messageStatuses[message.id].status ===
                                      "delivered" && "✓"}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Scroll anchor */}
                  <div ref={messagesEndRef} />
                </div>

                {/* Typing Indicators */}
                {selectedConversation !== null &&
                  conversations[selectedConversation] &&
                  typingUsers[conversations[selectedConversation].id] &&
                  typingUsers[conversations[selectedConversation].id].length >
                    0 && (
                    <div className="px-4 py-2 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {typingUsers[conversations[selectedConversation].id]
                            .map((u) => u.userName)
                            .join(", ")}{" "}
                          đang nhập...
                        </span>
                      </div>
                    </div>
                  )}

                {/* WebSocket Connection Status */}
                {!isWebSocketConnected && isAuthenticated && (
                  <div className="px-4 py-2 bg-yellow-50 border-t border-yellow-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-yellow-700">
                        Đang kết nối lại real-time chat...
                      </span>
                    </div>
                  </div>
                )}

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  {/* Authentication Warning */}
                  {!isAuthenticated && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <LogIn className="h-5 w-5 text-yellow-600" />
                        <div className="flex-1">
                          <p className="text-sm text-yellow-800">
                            Bạn cần đăng nhập để gửi tin nhắn
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            router.push("/auth/login?redirect=/messages")
                          }
                          className="text-sm bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded transition-colors"
                        >
                          Đăng nhập
                        </button>
                      </div>
                    </div>
                  )}

                  {/* File Preview */}
                  {selectedFiles.length > 0 && (
                    <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-3">
                        File đính kèm:
                      </div>
                      <div className="space-y-2">
                        {selectedFiles.map((file, index) =>
                          renderFilePreview(file, index)
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3">
                    {/* File Upload Button */}
                    <div className="relative">
                      <input
                        type="file"
                        id="file-upload"
                        onChange={handleFileSelect}
                        accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                        className="hidden"
                        disabled={!isAuthenticated}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          isAuthenticated
                            ? document.getElementById("file-upload")?.click()
                            : toast.error("Vui lòng đăng nhập để gửi file")
                        }
                        disabled={
                          sendingMessage || uploadingFiles || !isAuthenticated
                        }
                        className="text-gray-500 hover:text-blue-600 p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={
                          !isAuthenticated
                            ? "Cần đăng nhập để gửi file"
                            : "Đính kèm file"
                        }
                      >
                        <Paperclip className="h-5 w-5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => handleInputChange(e as any)}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        isAuthenticated
                          ? "Nhập tin nhắn..."
                          : "Đăng nhập để gửi tin nhắn..."
                      }
                      disabled={
                        sendingMessage || uploadingFiles || !isAuthenticated
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={
                        !isAuthenticated ||
                        sendingMessage ||
                        uploadingFiles ||
                        (!newMessage.trim() && selectedFiles.length === 0)
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title={
                        !isAuthenticated
                          ? "Cần đăng nhập để gửi tin nhắn"
                          : "Gửi tin nhắn"
                      }
                    >
                      {sendingMessage || uploadingFiles ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
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

      {/* Delete Chat Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Xác nhận xóa
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600">
                Bạn có chắc chắn muốn xóa đoạn chat này không?
              </p>
              <p className="text-gray-600 mt-2">
                Hành động này sẽ xóa toàn bộ tin nhắn và không thể hoàn tác.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={deletingChat}
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteChat}
                disabled={deletingChat}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingChat ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang xóa...
                  </div>
                ) : (
                  "Đồng ý xóa"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * WebSocket Service for Real-time Chat
 * Handles connection to Socket.IO server and real-time events
 */

import { io, Socket } from "socket.io-client";

export interface ChatMessage {
  id: string;
  room: string;
  message: string;
  user: {
    id: string;
    full_name: string;
    email: string;
  };
  document?: {
    id: string;
    filename: string;
    url: string;
  };
  createdAt: string;
  updatedAt: string;
  status?: "sending" | "sent" | "delivered" | "read";
  reactions?: MessageReaction[];
}

export interface MessageReaction {
  userId: string;
  userName: string;
  emoji: string;
  createdAt: string;
}

export interface UserStatus {
  userId: string;
  userName: string;
  status: "online" | "offline" | "away";
  lastSeen?: string;
}

export interface UserTyping {
  userId: string;
  userName: string;
  roomId: string;
}

export interface RoomUser {
  userId: string;
  userName: string;
}

class WebSocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private currentUserId: string | null = null;
  private currentUserName: string | null = null;
  private currentRoomId: string | null = null;

  // Event listeners
  private messageReceivedListeners: ((message: ChatMessage) => void)[] = [];
  private userJoinedListeners: ((data: {
    userId: string;
    userName: string;
    roomId: string;
  }) => void)[] = [];
  private userLeftListeners: ((data: {
    userId: string;
    userName: string;
    roomId: string;
  }) => void)[] = [];
  private userTypingStartListeners: ((data: UserTyping) => void)[] = [];
  private userTypingStopListeners: ((data: {
    userId: string;
    roomId: string;
  }) => void)[] = [];
  private roomUsersListeners: ((data: {
    roomId: string;
    users: RoomUser[];
  }) => void)[] = [];
  private messageUpdatedListeners: ((data: {
    messageId: string;
    roomId: string;
    action: "edit" | "delete";
  }) => void)[] = [];
  private messageStatusListeners: ((data: {
    messageId: string;
    status: string;
    userId: string;
  }) => void)[] = [];
  private messageReactionListeners: ((data: {
    messageId: string;
    roomId: string;
    reaction: MessageReaction;
    action: "add" | "remove";
  }) => void)[] = [];
  private userStatusListeners: ((data: UserStatus) => void)[] = [];
  private connectionErrorListeners: ((error: string) => void)[] = [];

  constructor() {
    // Initialize connection when service is created
    this.connect();
  }

  private connect() {
    if (this.socket?.connected) {
      return;
    }

    const serverUrl =
      process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:4000";

    this.socket = io(serverUrl, {
      path: "/socket.io/",
      transports: ["websocket", "polling"],
      autoConnect: true,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("🔌 Connected to WebSocket server ");
      this.isConnected = true;

      // Re-authenticate if we have user info
      if (this.currentUserId && this.currentUserName) {
        this.authenticate(this.currentUserId, this.currentUserName);
      }
    });

    this.socket.on("disconnect", () => {
      console.log("🔌 Disconnected from WebSocket server");
      this.isConnected = false;
    });

    this.socket.on("authenticated", (data: { success: boolean }) => {
      if (data.success) {
        console.log("✅ WebSocket authentication successful");

        // Re-join current room if we have one
        if (this.currentRoomId) {
          this.joinRoom(this.currentRoomId);
        }
      }
    });

    this.socket.on("error", (error: { message: string }) => {
      console.error("❌ WebSocket error:", error.message);
    });

    // Chat events
    this.socket.on("message-received", (message: ChatMessage) => {
      console.log("💬 Message received:", message);
      this.messageReceivedListeners.forEach((listener) => listener(message));
    });

    this.socket.on(
      "user-joined",
      (data: { userId: string; userName: string; roomId: string }) => {
        console.log("👥 User joined:", data);
        this.userJoinedListeners.forEach((listener) => listener(data));
      }
    );

    this.socket.on(
      "user-left",
      (data: { userId: string; userName: string; roomId: string }) => {
        console.log("👋 User left:", data);
        this.userLeftListeners.forEach((listener) => listener(data));
      }
    );

    this.socket.on("user-typing-start", (data: UserTyping) => {
      console.log("⌨️ User typing start:", data);
      this.userTypingStartListeners.forEach((listener) => listener(data));
    });

    this.socket.on(
      "user-typing-stop",
      (data: { userId: string; roomId: string }) => {
        console.log("⌨️ User typing stop:", data);
        this.userTypingStopListeners.forEach((listener) => listener(data));
      }
    );

    this.socket.on(
      "room-users",
      (data: { roomId: string; users: RoomUser[] }) => {
        console.log("👥 Room users:", data);
        this.roomUsersListeners.forEach((listener) => listener(data));
      }
    );

    this.socket.on(
      "message-updated",
      (data: {
        messageId: string;
        roomId: string;
        action: "edit" | "delete";
      }) => {
        console.log("📝 Message updated:", data);
        this.messageUpdatedListeners.forEach((listener) => listener(data));
      }
    );

    // New event handlers for enhanced features
    this.socket.on(
      "message-status",
      (data: { messageId: string; status: string; userId: string }) => {
        console.log("📊 Message status:", data);
        this.messageStatusListeners.forEach((listener) => listener(data));
      }
    );

    this.socket.on(
      "message-reaction",
      (data: {
        messageId: string;
        roomId: string;
        reaction: MessageReaction;
        action: "add" | "remove";
      }) => {
        console.log("😀 Message reaction:", data);
        this.messageReactionListeners.forEach((listener) => listener(data));
      }
    );

    this.socket.on("user-status", (data: UserStatus) => {
      console.log("👤 User status:", data);
      this.userStatusListeners.forEach((listener) => listener(data));
    });

    this.socket.on("connection-error", (error: string) => {
      console.error("🚨 Connection error:", error);
      this.connectionErrorListeners.forEach((listener) => listener(error));
    });
  }

  // Public methods
  authenticate(userId: string, userName: string) {
    if (!this.socket) {
      console.error("❌ Socket not connected");
      return;
    }

    this.currentUserId = userId;
    this.currentUserName = userName;

    this.socket.emit("authenticate", { userId, userName });
  }

  joinRoom(roomId: string) {
    if (!this.socket || !this.isConnected) {
      console.error("❌ Socket not connected");
      return;
    }

    // Leave current room if we're in one
    if (this.currentRoomId && this.currentRoomId !== roomId) {
      this.leaveRoom(this.currentRoomId);
    }

    this.currentRoomId = roomId;
    this.socket.emit("join-room", roomId);
    console.log(`👥 Joining room: ${roomId}`);
  }

  leaveRoom(roomId: string) {
    if (!this.socket || !this.isConnected) {
      return;
    }

    this.socket.emit("leave-room", roomId);
    console.log(`👋 Leaving room: ${roomId}`);

    if (this.currentRoomId === roomId) {
      this.currentRoomId = null;
    }
  }

  sendMessage(message: ChatMessage) {
    if (!this.socket || !this.isConnected) {
      console.error("❌ Socket not connected");
      return;
    }

    this.socket.emit("new-message", message);
  }

  startTyping(roomId: string) {
    if (!this.socket || !this.isConnected) {
      return;
    }

    this.socket.emit("typing-start", { roomId });
  }

  stopTyping(roomId: string) {
    if (!this.socket || !this.isConnected) {
      return;
    }

    this.socket.emit("typing-stop", { roomId });
  }

  // New methods for enhanced features
  markMessageAsRead(messageId: string, roomId: string) {
    if (!this.socket || !this.isConnected) {
      return;
    }

    this.socket.emit("message-read", { messageId, roomId });
  }

  addMessageReaction(messageId: string, roomId: string, emoji: string) {
    if (!this.socket || !this.isConnected) {
      return;
    }

    this.socket.emit("add-reaction", { messageId, roomId, emoji });
  }

  removeMessageReaction(messageId: string, roomId: string, emoji: string) {
    if (!this.socket || !this.isConnected) {
      return;
    }

    this.socket.emit("remove-reaction", { messageId, roomId, emoji });
  }

  updateUserStatus(status: "online" | "offline" | "away") {
    if (!this.socket || !this.isConnected) {
      return;
    }

    this.socket.emit("user-status", { status });
  }

  // Event listener management
  onMessageReceived(listener: (message: ChatMessage) => void) {
    this.messageReceivedListeners.push(listener);

    // Return cleanup function
    return () => {
      const index = this.messageReceivedListeners.indexOf(listener);
      if (index > -1) {
        this.messageReceivedListeners.splice(index, 1);
      }
    };
  }

  onUserJoined(
    listener: (data: {
      userId: string;
      userName: string;
      roomId: string;
    }) => void
  ) {
    this.userJoinedListeners.push(listener);

    return () => {
      const index = this.userJoinedListeners.indexOf(listener);
      if (index > -1) {
        this.userJoinedListeners.splice(index, 1);
      }
    };
  }

  onUserLeft(
    listener: (data: {
      userId: string;
      userName: string;
      roomId: string;
    }) => void
  ) {
    this.userLeftListeners.push(listener);

    return () => {
      const index = this.userLeftListeners.indexOf(listener);
      if (index > -1) {
        this.userLeftListeners.splice(index, 1);
      }
    };
  }

  onUserTypingStart(listener: (data: UserTyping) => void) {
    this.userTypingStartListeners.push(listener);

    return () => {
      const index = this.userTypingStartListeners.indexOf(listener);
      if (index > -1) {
        this.userTypingStartListeners.splice(index, 1);
      }
    };
  }

  onUserTypingStop(
    listener: (data: { userId: string; roomId: string }) => void
  ) {
    this.userTypingStopListeners.push(listener);

    return () => {
      const index = this.userTypingStopListeners.indexOf(listener);
      if (index > -1) {
        this.userTypingStopListeners.splice(index, 1);
      }
    };
  }

  onRoomUsers(listener: (data: { roomId: string; users: RoomUser[] }) => void) {
    this.roomUsersListeners.push(listener);

    return () => {
      const index = this.roomUsersListeners.indexOf(listener);
      if (index > -1) {
        this.roomUsersListeners.splice(index, 1);
      }
    };
  }

  onMessageUpdated(
    listener: (data: {
      messageId: string;
      roomId: string;
      action: "edit" | "delete";
    }) => void
  ) {
    this.messageUpdatedListeners.push(listener);

    return () => {
      const index = this.messageUpdatedListeners.indexOf(listener);
      if (index > -1) {
        this.messageUpdatedListeners.splice(index, 1);
      }
    };
  }

  // New event listener methods
  onMessageStatus(
    listener: (data: {
      messageId: string;
      status: string;
      userId: string;
    }) => void
  ) {
    this.messageStatusListeners.push(listener);

    return () => {
      const index = this.messageStatusListeners.indexOf(listener);
      if (index > -1) {
        this.messageStatusListeners.splice(index, 1);
      }
    };
  }

  onMessageReaction(
    listener: (data: {
      messageId: string;
      roomId: string;
      reaction: MessageReaction;
      action: "add" | "remove";
    }) => void
  ) {
    this.messageReactionListeners.push(listener);

    return () => {
      const index = this.messageReactionListeners.indexOf(listener);
      if (index > -1) {
        this.messageReactionListeners.splice(index, 1);
      }
    };
  }

  onUserStatus(listener: (data: UserStatus) => void) {
    this.userStatusListeners.push(listener);

    return () => {
      const index = this.userStatusListeners.indexOf(listener);
      if (index > -1) {
        this.userStatusListeners.splice(index, 1);
      }
    };
  }

  onConnectionError(listener: (error: string) => void) {
    this.connectionErrorListeners.push(listener);

    return () => {
      const index = this.connectionErrorListeners.indexOf(listener);
      if (index > -1) {
        this.connectionErrorListeners.splice(index, 1);
      }
    };
  }

  // Utility methods
  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  getCurrentRoomId(): string | null {
    return this.currentRoomId;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.currentRoomId = null;
    }
  }
}

// Create singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;

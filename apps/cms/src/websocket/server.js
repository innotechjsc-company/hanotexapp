/**
 * WebSocket Server for Real-time Chat
 * Handles real-time messaging for chat rooms
 */

import { Server as SocketIOServer } from 'socket.io'

/**
 * ChatMessage structure:
 * {
 *   id: string,
 *   room: string,
 *   message: string,
 *   user: { id: string, full_name: string, email: string },
 *   document?: { id: string, filename: string, url: string },
 *   createdAt: string,
 *   updatedAt: string
 * }
 */

/**
 * UserTyping structure:
 * {
 *   userId: string,
 *   userName: string,
 *   roomId: string
 * }
 */

export class ChatWebSocketServer {
  constructor(server) {
    this.connectedUsers = new Map() // Map<string, { socketId: string; userId: string; userName: string }>
    this.roomUsers = new Map() // Map<string, Set<string>> - roomId -> Set of userIds
    this.io = new SocketIOServer(server, {
      cors: {
        origin: [
          'http://localhost:3000',
          'http://127.0.0.1:3000',
          'http://34.142.238.176:3000',
          'https://hanotex.vn',
          ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : []),
        ],
        methods: ['GET', 'POST'],
        credentials: true,
      },
      path: '/socket.io/',
    })

    this.setupEventHandlers()
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`🔌 User connected: ${socket.id}`)

      // Handle user authentication and joining
      socket.on('authenticate', (data) => {
        const { userId, userName } = data

        // Store user connection info
        this.connectedUsers.set(userId, {
          socketId: socket.id,
          userId,
          userName,
        })

        socket.userId = userId
        socket.userName = userName

        console.log(`✅ User authenticated: ${userName} (${userId})`)

        // Send authentication success
        socket.emit('authenticated', { success: true })
      })

      // Handle joining a chat room
      socket.on('join-room', (roomId) => {
        if (!socket.userId) {
          socket.emit('error', { message: 'User not authenticated' })
          return
        }

        socket.join(roomId)

        // Add user to room tracking
        if (!this.roomUsers.has(roomId)) {
          this.roomUsers.set(roomId, new Set())
        }
        this.roomUsers.get(roomId).add(socket.userId)

        console.log(`👥 User ${socket.userName} joined room: ${roomId}`)

        // Notify others in the room
        socket.to(roomId).emit('user-joined', {
          userId: socket.userId,
          userName: socket.userName,
          roomId,
        })

        // Send current room users to the joining user
        const roomUserIds = Array.from(this.roomUsers.get(roomId) || [])
        const roomUsersList = roomUserIds
          .map((userId) => {
            const userInfo = this.connectedUsers.get(userId)
            return userInfo ? { userId, userName: userInfo.userName } : null
          })
          .filter(Boolean)

        socket.emit('room-users', { roomId, users: roomUsersList })
      })

      // Handle leaving a chat room
      socket.on('leave-room', (roomId) => {
        if (!socket.userId) return

        socket.leave(roomId)

        // Remove user from room tracking
        if (this.roomUsers.has(roomId)) {
          this.roomUsers.get(roomId).delete(socket.userId)
          if (this.roomUsers.get(roomId).size === 0) {
            this.roomUsers.delete(roomId)
          }
        }

        console.log(`👋 User ${socket.userName} left room: ${roomId}`)

        // Notify others in the room
        socket.to(roomId).emit('user-left', {
          userId: socket.userId,
          userName: socket.userName,
          roomId,
        })
      })

      // Handle new message
      socket.on('new-message', (message) => {
        console.log(`💬 New message in room ${message.room}: ${message.message}`)

        // Broadcast to all users in the room except sender
        socket.to(message.room).emit('message-received', message)
      })

      // Handle typing indicators
      socket.on('typing-start', (data) => {
        if (!socket.userId || !socket.userName) return

        const typingData = {
          userId: socket.userId,
          userName: socket.userName,
          roomId: data.roomId,
        }

        socket.to(data.roomId).emit('user-typing-start', typingData)
      })

      socket.on('typing-stop', (data) => {
        if (!socket.userId) return

        socket.to(data.roomId).emit('user-typing-stop', {
          userId: socket.userId,
          roomId: data.roomId,
        })
      })

      // Handle message updates (edit/delete)
      socket.on('message-updated', (data) => {
        socket.to(data.roomId).emit('message-updated', data)
      })

      // Handle message read receipts
      socket.on('message-read', (data) => {
        if (!socket.userId) return

        console.log(`📖 Message read: ${data.messageId} by ${socket.userName}`)

        // Broadcast to all users in the room except sender
        socket.to(data.roomId).emit('message-status', {
          messageId: data.messageId,
          status: 'read',
          userId: socket.userId,
        })
      })

      // Handle message reactions
      socket.on('add-reaction', (data) => {
        if (!socket.userId || !socket.userName) return

        console.log(`😀 Add reaction: ${data.emoji} to message ${data.messageId}`)

        const reaction = {
          userId: socket.userId,
          userName: socket.userName,
          emoji: data.emoji,
          createdAt: new Date().toISOString(),
        }

        socket.to(data.roomId).emit('message-reaction', {
          messageId: data.messageId,
          roomId: data.roomId,
          reaction,
          action: 'add',
        })
      })

      socket.on('remove-reaction', (data) => {
        if (!socket.userId || !socket.userName) return

        console.log(`😐 Remove reaction: ${data.emoji} from message ${data.messageId}`)

        const reaction = {
          userId: socket.userId,
          userName: socket.userName,
          emoji: data.emoji,
          createdAt: new Date().toISOString(),
        }

        socket.to(data.roomId).emit('message-reaction', {
          messageId: data.messageId,
          roomId: data.roomId,
          reaction,
          action: 'remove',
        })
      })

      // Handle user status updates
      socket.on('user-status', (data) => {
        if (!socket.userId || !socket.userName) return

        console.log(`👤 User status update: ${socket.userName} is ${data.status}`)

        const userStatus = {
          userId: socket.userId,
          userName: socket.userName,
          status: data.status,
          lastSeen: data.status === 'offline' ? new Date().toISOString() : undefined,
        }

        // Broadcast to all connected users
        this.io.emit('user-status', userStatus)
      })

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`🔌 User disconnected: ${socket.id}`)

        if (socket.userId) {
          // Remove from all rooms
          this.roomUsers.forEach((userSet, roomId) => {
            if (userSet.has(socket.userId)) {
              userSet.delete(socket.userId)

              // Notify room users
              socket.to(roomId).emit('user-left', {
                userId: socket.userId,
                userName: socket.userName,
                roomId,
              })

              if (userSet.size === 0) {
                this.roomUsers.delete(roomId)
              }
            }
          })

          // Remove from connected users
          this.connectedUsers.delete(socket.userId)
        }
      })
    })
  }

  // Method to broadcast message to specific room (called from API)
  broadcastToRoom(roomId, event, data) {
    this.io.to(roomId).emit(event, data)
  }

  // Method to get connected users in a room
  getRoomUsers(roomId) {
    return Array.from(this.roomUsers.get(roomId) || [])
  }

  // Method to check if user is online
  isUserOnline(userId) {
    return this.connectedUsers.has(userId)
  }

  getIO() {
    return this.io
  }
}

// Global instance
let chatWebSocketServer = null

export function initializeChatWebSocket(server) {
  if (!chatWebSocketServer) {
    chatWebSocketServer = new ChatWebSocketServer(server)
    console.log('🚀 Chat WebSocket server initialized')
  }
  return chatWebSocketServer
}

export function getChatWebSocketServer() {
  return chatWebSocketServer
}

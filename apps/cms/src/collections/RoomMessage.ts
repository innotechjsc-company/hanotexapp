import { CollectionConfig } from 'payload'
import { getChatWebSocketServer } from '../websocket/server.js'

export const RoomMessage: CollectionConfig = {
  slug: 'room-message',
  admin: {
    useAsTitle: 'message',
    group: '💬 Truyền thông',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        // Only broadcast for create operations (new messages)
        if (operation === 'create') {
          const webSocketServer = getChatWebSocketServer()

          if (webSocketServer && doc.room) {
            // Populate the user and document fields for the WebSocket broadcast
            let populatedDoc = doc

            try {
              // Get the full document with populated fields
              const fullDoc = await req.payload.findByID({
                collection: 'room-message',
                id: doc.id,
                depth: 2, // Populate user and document
              })

              populatedDoc = fullDoc
            } catch (error) {
              console.error('Error populating message for WebSocket:', error)
            }

            // Broadcast to room
            const roomId = typeof doc.room === 'string' ? doc.room : doc.room.id

            console.log(`📡 Broadcasting new message to room: ${roomId}`)

            webSocketServer.broadcastToRoom(roomId, 'message-received', {
              id: populatedDoc.id,
              room: roomId,
              message: populatedDoc.message,
              user: populatedDoc.user,
              document: populatedDoc.document,
              createdAt: populatedDoc.createdAt,
              updatedAt: populatedDoc.updatedAt,
            })
          }
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        const webSocketServer = getChatWebSocketServer()

        if (webSocketServer && doc.room) {
          const roomId = typeof doc.room === 'string' ? doc.room : doc.room.id

          console.log(`📡 Broadcasting message deletion to room: ${roomId}`)

          webSocketServer.broadcastToRoom(roomId, 'message-updated', {
            messageId: doc.id,
            roomId,
            action: 'delete',
          })
        }
      },
    ],
  },
  fields: [
    {
      name: 'room',
      label: 'Phòng chat',
      type: 'relationship',
      relationTo: 'room-chat',
      required: true,
    },
    {
      name: 'message',
      label: 'Tin nhắn',
      type: 'text',
    },
    {
      name: 'document',
      label: 'Tài liệu',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'user',
      label: 'Người gửi',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
  ],
  timestamps: true,
}

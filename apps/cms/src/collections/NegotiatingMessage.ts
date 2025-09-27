import type { CollectionConfig } from 'payload'
import { getChatWebSocketServer } from '../websocket/server.js'

type NegotiationDoc = {
  id?: string
  technology_propose?: string | { id: string }
  project_propose?: string | { id: string }
  propose?: string | { id: string }
}

const extractRelationId = (value?: string | { id: string } | null) => {
  if (!value) return null
  if (typeof value === 'string') return value
  if (typeof value === 'object' && 'id' in value && value.id) return value.id
  return null
}

const getNegotiationRoomIds = (doc: NegotiationDoc): string[] => {
  const roomIds: string[] = []

  const technologyId = extractRelationId(doc.technology_propose)
  if (technologyId) {
    roomIds.push(`negotiation:technology:${technologyId}`)
  }

  const projectId = extractRelationId(doc.project_propose)
  if (projectId) {
    roomIds.push(`negotiation:project:${projectId}`)
  }

  const proposeId = extractRelationId(doc.propose)
  if (proposeId) {
    roomIds.push(`negotiation:propose:${proposeId}`)
  }

  return roomIds
}

export const NegotiatingMessage: CollectionConfig = {
  slug: 'negotiating-messages',
  admin: {
    group: 'Tin nhắn đàm phán',
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
        const roomIds = getNegotiationRoomIds(doc)
        if (roomIds.length === 0) return

        const webSocketServer = getChatWebSocketServer()
        if (!webSocketServer) return

        let populatedDoc = doc

        if (doc?.id && req?.payload) {
          try {
            populatedDoc = await req.payload.findByID({
              collection: 'negotiating-messages',
              id: doc.id,
              depth: 2,
            })
          } catch (error) {
            console.error('Không thể tải đầy đủ dữ liệu đàm phán để phát realtime:', error)
          }
        }

        for (const roomId of roomIds) {
          if (operation === 'create') {
            webSocketServer.broadcastToRoom(roomId, 'negotiation:new-message', {
              roomId,
              message: populatedDoc,
            })
          } else if (operation === 'update') {
            webSocketServer.broadcastToRoom(roomId, 'negotiation:message-updated', {
              roomId,
              message: populatedDoc,
            })
          }
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        const roomIds = getNegotiationRoomIds(doc)
        if (roomIds.length === 0) return

        const webSocketServer = getChatWebSocketServer()
        if (!webSocketServer) return

        for (const roomId of roomIds) {
          webSocketServer.broadcastToRoom(roomId, 'negotiation:message-deleted', {
            roomId,
            messageId: doc.id,
          })
        }
      },
    ],
  },
  fields: [
    {
      name: 'propose',
      type: 'relationship',
      relationTo: 'propose',
      label: 'Đề xuất',
      admin: {
        description: 'Đề xuất',
      },
    },
    {
      name: 'project_propose',
      type: 'relationship',
      relationTo: 'project-propose',
      label: 'Đề xuất dự án',
      admin: {
        description: 'Đề xuất dự án',
      },
    },
    {
      name: 'technology_propose',
      type: 'relationship',
      relationTo: 'technology-propose',
      label: 'Đề xuất công nghệ',
      admin: {
        description: 'Đề xuất công nghệ',
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Người gửi',
      admin: {
        description: 'Người gửi',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Nội dung',
      admin: {
        description: 'Nội dung',
      },
    },
    {
      name: 'documents',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Tài liệu đính kèm',
      admin: {
        description: 'Tài liệu đính kèm',
      },
    },
    {
      name: 'is_offer',
      type: 'checkbox',
      label: 'Là offer',
      defaultValue: false,
    },
    {
      name: 'offer',
      type: 'relationship',
      relationTo: 'offer',
      label: 'Offer',
      admin: {
        description: 'Offer',
      },
    },
  ],
  timestamps: true,
}

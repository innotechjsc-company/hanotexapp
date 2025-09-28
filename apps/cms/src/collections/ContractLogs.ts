import type { CollectionConfig } from 'payload'
import { getChatWebSocketServer } from '../websocket/server.js'
import { notificationManager, type NotificationData } from '../app/api/createNotification'

type ContractLogDoc = {
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

const getContractLogRoomIds = (doc: ContractLogDoc): string[] => {
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

export const ContractLogs: CollectionConfig = {
  slug: 'contract-logs',
  admin: {
    useAsTitle: 'content',
    group: 'Quản lý tiến độ hợp đồng',
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
        // Chỉ tạo notification khi contract log được tạo mới
        if (operation === 'create') {
          try {
            console.log('🎯 Creating notifications for contract log:', doc.id)

            // Lấy thông tin contract với depth để populate user data
            const contract = await req.payload.findByID({
              collection: 'contract',
              id: typeof doc.contract === 'string' ? doc.contract : doc.contract?.id,
              depth: 2,
            })

            if (!contract) {
              console.log('Contract not found, skipping notification')
              return
            }

            // Lấy thông tin người gửi contract log
            const logSender = await req.payload.findByID({
              collection: 'users',
              id: typeof doc.user === 'string' ? doc.user : doc.user?.id,
            })

            if (!logSender) {
              console.log('Log sender not found, skipping notification')
              return
            }

            const senderName = logSender.full_name || logSender.email || 'Người dùng'
            const contractTitle = `Hợp đồng #${contract.id}`
            const logContent =
              doc.content?.substring(0, 100) +
              (doc.content && doc.content.length > 100 ? '...' : '')

            // Xác định các bên liên quan trong contract
            const userAId =
              typeof contract.user_a === 'string' ? contract.user_a : contract.user_a?.id
            const userBId =
              typeof contract.user_b === 'string' ? contract.user_b : contract.user_b?.id

            // Tạo notifications cho các bên liên quan (trừ người gửi log)
            const notifications: NotificationData[] = []

            // Notification cho user A (nếu khác người gửi)
            if (userAId && userAId !== (typeof doc.user === 'string' ? doc.user : doc.user?.id)) {
              notifications.push({
                user: userAId,
                title: `Cập nhật tiến độ hợp đồng`,
                message: `${senderName} đã cập nhật tiến độ hợp đồng: "${logContent}"`,
                type: 'contract',
                action_url: `technologies/negotiations/${contract.id}`,
                priority: 'normal',
              })
            }

            // Notification cho user B (nếu khác người gửi)
            if (userBId && userBId !== (typeof doc.user === 'string' ? doc.user : doc.user?.id)) {
              notifications.push({
                user: userBId,
                title: `Cập nhật tiến độ hợp đồng`,
                message: `${senderName} đã cập nhật tiến độ hợp đồng: "${logContent}"`,
                type: 'contract',
                action_url: `technologies/negotiations/${contract.id}`,
                priority: 'normal',
              })
            }

            // Tạo notifications
            if (notifications.length > 0) {
              const result = await notificationManager.createBatchNotifications(notifications)
              console.log(`✅ Created ${result.created} contract log notifications`)
            } else {
              console.log('No notifications to create (user is the only party in contract)')
            }

            // WebSocket broadcast cho real-time updates
            const roomIds = getContractLogRoomIds(doc)
            if (roomIds.length > 0) {
              const webSocketServer = getChatWebSocketServer()
              if (webSocketServer) {
                for (const roomId of roomIds) {
                  webSocketServer.broadcastToRoom(roomId, 'contract-log:created', {
                    roomId,
                    logId: doc.id,
                    content: doc.content,
                    sender: senderName,
                    status: doc.status,
                    timestamp: new Date().toISOString(),
                  })
                }
                console.log(`📡 Broadcasted contract log to ${roomIds.length} room(s)`)
              }
            }
          } catch (error) {
            console.error('❌ Error creating contract log notifications:', error)
            // Không throw error để không ảnh hưởng đến việc tạo contract log
          }
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        const roomIds = getContractLogRoomIds(doc)
        if (roomIds.length === 0) return

        const webSocketServer = getChatWebSocketServer()
        if (!webSocketServer) return

        for (const roomId of roomIds) {
          webSocketServer.broadcastToRoom(roomId, 'contract-log:deleted', {
            roomId,
            logId: doc.id,
          })
        }
      },
    ],
  },
  fields: [
    {
      name: 'technology_propose',
      type: 'relationship',
      relationTo: 'technology-propose',
      label: 'Đề xuất đầu tư công nghệ',
    },
    {
      name: 'propose',
      type: 'relationship',
      relationTo: 'propose',
      label: 'Đề xuất',
    },
    {
      name: 'project_propose',
      type: 'relationship',
      relationTo: 'project-propose',
      label: 'Đề xuất đầu tư dự án',
    },
    {
      name: 'contract',
      type: 'relationship',
      relationTo: 'contract',
      required: true,
      label: 'Hợp đồng',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Người gửi',
    },
    {
      name: 'content',
      type: 'text',
      required: true,
      label: 'Nội dung',
    },
    {
      name: 'documents',
      type: 'upload',
      relationTo: 'media',
      label: 'Tài liệu',
    },
    {
      name: 'reason',
      type: 'text',
      label: 'Lý do (khi từ chối)',
      admin: {
        condition: (_: unknown, siblingData: unknown) => {
          return (
            typeof siblingData === 'object' &&
            siblingData !== null &&
            'status' in siblingData &&
            (siblingData as { status?: string }).status === 'cancelled'
          )
        },
      },
      validate: (val: unknown, { siblingData }: { siblingData: unknown }) => {
        const isCancelled =
          typeof siblingData === 'object' &&
          siblingData !== null &&
          'status' in siblingData &&
          (siblingData as { status?: string }).status === 'cancelled'
        if (isCancelled && (!val || (typeof val === 'string' && val.trim() === ''))) {
          return 'Vui lòng nhập lý do khi từ chối'
        }
        return true
      },
    },
    {
      name: 'status',
      type: 'select',
      options: ['pending', 'completed', 'cancelled'],
      defaultValue: 'pending',
      label: 'Trạng thái',
    },
    {
      name: 'is_done_contract',
      type: 'checkbox',
      defaultValue: false,
      label: 'Xác nhận hoàn thành hợp đồng',
    },
  ],
  timestamps: true,
}

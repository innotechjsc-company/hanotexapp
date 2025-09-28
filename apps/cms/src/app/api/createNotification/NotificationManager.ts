import { getPayload } from 'payload'

// Types và Interfaces
export interface NotificationData {
  user: string
  title: string
  message: string
  type: NotificationType
  action_url?: string
  priority?: NotificationPriority
  is_read?: boolean
  metadata?: Record<string, any>
}

export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'auction'
  | 'transaction'
  | 'technology'
  | 'system'
  | 'propose'
  | 'contract'
  | 'negotiation'

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent'

export interface NotificationResult {
  success: boolean
  notificationId?: string
  error?: string
}

export interface BatchNotificationResult {
  success: boolean
  created: number
  failed: number
  results: NotificationResult[]
  errors: string[]
}

// Context types cho các trường hợp khác nhau
export interface ProposeContext {
  proposeId: string
  proposeType: 'technology-propose' | 'project-propose' | 'propose'
  proposeOwnerId: string
  entityOwnerId?: string
  entityTitle?: string
  entityId?: string
  price?: number
  message?: string
}

export interface AuctionContext {
  auctionId: string
  auctionTitle: string
  bidderId: string
  bidAmount: number
  auctionOwnerId: string
  isWinningBid: boolean
}

export interface ContractContext {
  contractId: string
  userAId: string
  userBId: string
  contractTitle: string
  price: number
  status: string
}

export interface NegotiationContext {
  negotiationId: string
  offerId: string
  proposerId: string
  acceptorId: string
  price: number
  message?: string
  technologyId?: string
}

export interface RoomMessageContext {
  roomId: string
  messageId: string
  senderId: string
  message: string
  roomTitle?: string
}

/**
 * NotificationManager - Class để xử lý tất cả các trường hợp tạo notification
 */
export class NotificationManager {
  private payload: any

  constructor() {
    // Không khởi tạo payload trong constructor để tránh circular dependency
  }

  private async getPayload() {
    if (!this.payload) {
      // Import config dynamically để tránh circular dependency
      const config = await import('@payload-config')
      this.payload = await getPayload({ config: config.default })
    }
    return this.payload
  }

  /**
   * Tạo một notification đơn lẻ
   */
  async createNotification(data: NotificationData): Promise<NotificationResult> {
    try {
      console.log(`📝 Creating notification for user: ${data.user}`)

      const payloadInstance = await this.getPayload()
      const notification = await payloadInstance.create({
        collection: 'notifications',
        data: {
          user: data.user,
          title: data.title,
          message: data.message,
          type: data.type,
          action_url: data.action_url,
          priority: data.priority || 'normal',
          is_read: data.is_read || false,
        },
      })

      console.log(`✅ Notification created successfully: ${notification.id}`)

      return {
        success: true,
        notificationId: notification.id,
      }
    } catch (error) {
      console.error(`❌ Failed to create notification:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Tạo nhiều notifications cùng lúc
   */
  async createBatchNotifications(
    notifications: NotificationData[],
  ): Promise<BatchNotificationResult> {
    console.log(`📝 Creating ${notifications.length} notifications in batch`)

    const results: NotificationResult[] = []
    const errors: string[] = []
    let created = 0
    let failed = 0

    for (const notificationData of notifications) {
      const result = await this.createNotification(notificationData)
      results.push(result)

      if (result.success) {
        created++
      } else {
        failed++
        if (result.error) {
          errors.push(result.error)
        }
      }
    }

    console.log(`✅ Batch notification completed: ${created} created, ${failed} failed`)

    return {
      success: failed === 0,
      created,
      failed,
      results,
      errors,
    }
  }

  /**
   * Tạo notification khi accept propose
   */
  async notifyAcceptPropose(context: ProposeContext): Promise<BatchNotificationResult> {
    console.log(`🎯 Creating notifications for accept propose: ${context.proposeId}`)

    const notifications: NotificationData[] = []

    // Notification cho người đề xuất
    notifications.push({
      user: context.proposeOwnerId,
      title: `Đề xuất của bạn đã được chấp nhận`,
      message:
        context.message ||
        `Đề xuất của bạn cho "${context.entityTitle || 'dự án'}" đã được chấp nhận và sẵn sàng đàm phán.`,
      type: 'success',
      action_url: context.entityId
        ? `technologies/${context.entityId}`
        : `technologies/negotiations/${context.proposeId}`,
      priority: 'high',
    })

    return await this.createBatchNotifications(notifications)
  }

  /**
   * Tạo notification khi có bid mới trong auction
   */
  async notifyAuctionBid(context: AuctionContext): Promise<BatchNotificationResult> {
    console.log(`🎯 Creating notifications for auction bid: ${context.auctionId}`)

    const notifications: NotificationData[] = []

    // Notification cho chủ sở hữu auction
    notifications.push({
      user: context.auctionOwnerId,
      title: `Có bid mới cho đấu giá "${context.auctionTitle}"`,
      message: `Có bid mới với giá ${context.bidAmount.toLocaleString()} VNĐ${context.isWinningBid ? ' (Bid cao nhất hiện tại)' : ''}.`,
      type: 'auction',
      action_url: `auctions/${context.auctionId}`,
      priority: context.isWinningBid ? 'high' : 'normal',
    })

    // Notification cho bidder (nếu là winning bid)
    if (context.isWinningBid) {
      notifications.push({
        user: context.bidderId,
        title: `Bid của bạn đang dẫn đầu`,
        message: `Bid của bạn với giá ${context.bidAmount.toLocaleString()} VNĐ đang dẫn đầu trong đấu giá "${context.auctionTitle}".`,
        type: 'success',
        action_url: `auctions/${context.auctionId}`,
        priority: 'normal',
      })
    }

    return await this.createBatchNotifications(notifications)
  }

  /**
   * Tạo notification khi accept offer
   */
  async notifyAcceptOffer(context: NegotiationContext): Promise<BatchNotificationResult> {
    console.log(`🎯 Creating notifications for accept offer: ${context.offerId}`)

    const notifications: NotificationData[] = []

    // Notification cho người đề xuất offer
    notifications.push({
      user: context.proposerId,
      title: `Offer của bạn đã được chấp nhận`,
      message:
        context.message ||
        `Offer của bạn với giá ${context.price.toLocaleString()} VNĐ đã được chấp nhận.`,
      type: 'success',
      action_url: context.technologyId
        ? `technologies/${context.technologyId}`
        : `negotiations/${context.negotiationId}`,
      priority: 'high',
    })

    // Notification cho người chấp nhận offer
    notifications.push({
      user: context.acceptorId,
      title: `Bạn đã chấp nhận offer`,
      message:
        context.message || `Bạn đã chấp nhận offer với giá ${context.price.toLocaleString()} VNĐ.`,
      type: 'info',
      action_url: context.technologyId
        ? `technologies/${context.technologyId}`
        : `negotiations/${context.negotiationId}`,
      priority: 'normal',
    })

    return await this.createBatchNotifications(notifications)
  }

  /**
   * Tạo notification khi có tin nhắn mới trong room chat
   */
  async notifyRoomMessage(context: RoomMessageContext): Promise<BatchNotificationResult> {
    console.log(`🎯 Creating notifications for room message: ${context.messageId}`)

    try {
      // Lấy danh sách người dùng trong phòng chat
      const payloadForRoom = await this.getPayload()
      const roomUsers = await payloadForRoom.find({
        collection: 'room-user',
        where: {
          room: {
            equals: context.roomId,
          },
        },
        depth: 2,
      })

      if (!roomUsers.docs || roomUsers.docs.length === 0) {
        console.log('No users found in room')
        return {
          success: true,
          created: 0,
          failed: 0,
          results: [],
          errors: [],
        }
      }

      // Lấy thông tin người gửi
      const payloadForSender = await this.getPayload()
      const sender = await payloadForSender.findByID({
        collection: 'users',
        id: context.senderId,
      })

      const senderName = sender?.full_name || sender?.email || 'Người dùng'
      const messagePreview =
        context.message?.substring(0, 100) +
        (context.message && context.message.length > 100 ? '...' : '')

      const notifications: NotificationData[] = roomUsers.docs
        .filter((roomUser: any) => {
          const userId = typeof roomUser.user === 'string' ? roomUser.user : roomUser.user?.id
          return userId !== context.senderId
        })
        .map((roomUser: any) => {
          const userId = typeof roomUser.user === 'string' ? roomUser.user : roomUser.user?.id

          return {
            user: userId,
            title: `Tin nhắn mới từ ${senderName}`,
            message: `Bạn có tin nhắn mới: "${messagePreview}"`,
            type: 'info',
            action_url: `messages?room=${context.roomId}`,
            priority: 'normal',
          }
        })

      return await this.createBatchNotifications(notifications)
    } catch (error) {
      console.error('Error in notifyRoomMessage:', error)
      return {
        success: false,
        created: 0,
        failed: 1,
        results: [],
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      }
    }
  }

  /**
   * Tạo notification khi contract được tạo
   */
  async notifyContractCreated(context: ContractContext): Promise<BatchNotificationResult> {
    console.log(`🎯 Creating notifications for contract created: ${context.contractId}`)

    const notifications: NotificationData[] = []

    // Notification cho cả hai bên trong contract
    const contractMessage = `Hợp đồng "${context.contractTitle}" đã được tạo với giá trị ${context.price.toLocaleString()} VNĐ.`

    notifications.push({
      user: context.userAId,
      title: `Hợp đồng mới đã được tạo`,
      message: contractMessage,
      type: 'contract',
      action_url: `contracts/${context.contractId}`,
      priority: 'high',
    })

    notifications.push({
      user: context.userBId,
      title: `Hợp đồng mới đã được tạo`,
      message: contractMessage,
      type: 'contract',
      action_url: `contracts/${context.contractId}`,
      priority: 'high',
    })

    return await this.createBatchNotifications(notifications)
  }

  /**
   * Tạo notification khi contract status thay đổi
   */
  async notifyContractStatusChange(
    context: ContractContext,
    oldStatus: string,
    newStatus: string,
  ): Promise<BatchNotificationResult> {
    console.log(`🎯 Creating notifications for contract status change: ${context.contractId}`)

    const notifications: NotificationData[] = []

    const statusMessages: Record<string, string> = {
      in_progress: 'Hợp đồng đang được thực hiện',
      completed: 'Hợp đồng đã hoàn thành',
      cancelled: 'Hợp đồng đã bị hủy',
      disputed: 'Hợp đồng có tranh chấp',
    }

    const message = `Hợp đồng "${context.contractTitle}" đã chuyển từ "${oldStatus}" sang "${newStatus}". ${statusMessages[newStatus] || ''}`

    notifications.push({
      user: context.userAId,
      title: `Trạng thái hợp đồng đã thay đổi`,
      message,
      type: 'contract',
      action_url: `contracts/${context.contractId}`,
      priority: 'normal',
    })

    notifications.push({
      user: context.userBId,
      title: `Trạng thái hợp đồng đã thay đổi`,
      message,
      type: 'contract',
      action_url: `contracts/${context.contractId}`,
      priority: 'normal',
    })

    return await this.createBatchNotifications(notifications)
  }

  /**
   * Tạo notification tùy chỉnh với template
   */
  async notifyCustom(
    userIds: string[],
    template: {
      title: string
      message: string
      type: NotificationType
      action_url?: string
      priority?: NotificationPriority
    },
  ): Promise<BatchNotificationResult> {
    console.log(`🎯 Creating custom notifications for ${userIds.length} users`)

    const notifications: NotificationData[] = userIds.map((userId) => ({
      user: userId,
      title: template.title,
      message: template.message,
      type: template.type,
      action_url: template.action_url,
      priority: template.priority || 'normal',
    }))

    return await this.createBatchNotifications(notifications)
  }

  /**
   * Lấy thông tin user để tạo notification context
   */
  async getUserInfo(userId: string): Promise<{ id: string; name: string; email: string } | null> {
    try {
      const payloadInstance = await this.getPayload()
      const user = await payloadInstance.findByID({
        collection: 'users',
        id: userId,
      })

      return {
        id: user.id,
        name: user.full_name || user.email,
        email: user.email,
      }
    } catch (error) {
      console.error(`Error getting user info for ${userId}:`, error)
      return null
    }
  }

  /**
   * Lấy thông tin entity (technology/project/demand) để tạo notification context
   */
  async getEntityInfo(
    collection: string,
    entityId: string,
  ): Promise<{ id: string; title: string; ownerId?: string } | null> {
    try {
      const payloadInstance = await this.getPayload()
      const entity = await payloadInstance.findByID({
        collection,
        id: entityId,
        depth: 1,
      })

      return {
        id: entity.id,
        title: entity.title || entity.name || 'N/A',
        ownerId: entity.submitter || entity.user || entity.owner,
      }
    } catch (error) {
      console.error(`Error getting entity info for ${collection}/${entityId}:`, error)
      return null
    }
  }
}

// Export singleton instance
export const notificationManager = new NotificationManager()

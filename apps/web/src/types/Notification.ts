/**
 * Notification Types for Hanotex CMS
 * Định nghĩa các interface cho Notification collection
 */

import { User } from './User'
import { Technology } from './Technology'
import { Auction } from './Auction'
import { Transaction } from './Transaction'

// Enums cho Notification
export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'auction'
  | 'transaction'
  | 'technology'
  | 'system'
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent'

// Main Notification Interface
export interface Notification {
  id: string
  user: string | User
  title: string
  message: string
  type?: NotificationType
  is_read: boolean

  // Related entities
  related_technology?: string | Technology
  related_auction?: Auction
  related_transaction?: Transaction

  // Action and priority
  action_url?: string
  priority: NotificationPriority

  // Timestamps
  createdAt: string
  updatedAt: string
}

// Types for form data and API responses
export interface NotificationCreateData
  extends Omit<Notification, 'id' | 'is_read' | 'createdAt' | 'updatedAt'> {}
export interface NotificationUpdateData
  extends Partial<Pick<Notification, 'is_read' | 'title' | 'message'>> {}

// Notification summary for lists
export interface NotificationSummary {
  id: string
  title: string
  type?: NotificationType
  is_read: boolean
  priority: NotificationPriority
  action_url?: string
  createdAt: string
}

// Notification counts for UI
export interface NotificationCounts {
  total: number
  unread: number
  by_type: Record<NotificationType, number>
  by_priority: Record<NotificationPriority, number>
}

// Real-time notification
export interface NotificationUpdate {
  notification: NotificationSummary
  counts: NotificationCounts
}

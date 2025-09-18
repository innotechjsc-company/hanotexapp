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
  id: string // Mã định danh thông báo
  user: string | User // Người dùng nhận thông báo
  title: string // Tiêu đề thông báo
  message: string // Nội dung thông báo
  type?: NotificationType // Loại thông báo
  is_read: boolean // Trạng thái đã đọc

  // Related entities
  related_technology?: string | Technology // Công nghệ liên quan
  related_auction?: Auction // Đấu giá liên quan
  related_transaction?: Transaction // Giao dịch liên quan

  // Action and priority
  action_url?: string // URL hành động
  priority: NotificationPriority // Độ ưu tiên

  // Timestamps
  createdAt: string // Thời gian tạo
  updatedAt: string // Thời gian cập nhật
}

// Types for form data and API responses
export interface NotificationCreateData
  extends Omit<Notification, 'id' | 'is_read' | 'createdAt' | 'updatedAt'> {}
export interface NotificationUpdateData
  extends Partial<Pick<Notification, 'is_read' | 'title' | 'message'>> {}

// Notification summary for lists
export interface NotificationSummary {
  id: string // Mã định danh thông báo
  title: string // Tiêu đề thông báo
  type?: NotificationType // Loại thông báo
  is_read: boolean // Trạng thái đã đọc
  priority: NotificationPriority // Độ ưu tiên
  action_url?: string // URL hành động
  createdAt: string // Thời gian tạo
}

// Notification counts for UI
export interface NotificationCounts {
  total: number // Tổng số thông báo
  unread: number // Số thông báo chưa đọc
  by_type: Record<NotificationType, number> // Số lượng theo loại
  by_priority: Record<NotificationPriority, number> // Số lượng theo độ ưu tiên
}

// Real-time notification
export interface NotificationUpdate {
  notification: NotificationSummary // Thông báo tóm tắt
  counts: NotificationCounts // Số lượng thông báo
}

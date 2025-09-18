import { Auction, Technology, Transaction, User } from '@/payload-types'
import { ID, DateTimeString } from './common'

// Loại thông báo
export type NotificationType =
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'auction'
  | 'transaction'
  | 'technology'
  | 'system' // Phân loại thông báo

// Mức độ ưu tiên thông báo
export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent' // Mức ưu tiên

// Thông báo gửi tới người dùng
export interface Notification {
  id?: ID // ID duy nhất của thông báo
  user: ID | User // ID người dùng nhận thông báo
  title: string // Tiêu đề thông báo
  message: string // Nội dung thông báo
  type?: NotificationType // Loại thông báo
  is_read: boolean // Trạng thái đã đọc hay chưa
  related_technology?: ID | Technology // ID công nghệ liên quan (nếu có)
  related_auction?: ID | Auction // ID phiên đấu giá liên quan (nếu có)
  related_transaction?: ID | Transaction // ID giao dịch liên quan (nếu có)
  action_url?: string // URL điều hướng khi nhấp vào thông báo
  priority?: NotificationPriority // Mức độ ưu tiên
  createdAt?: DateTimeString // Thời điểm tạo bản ghi
  updatedAt?: DateTimeString // Thời điểm cập nhật bản ghi
}

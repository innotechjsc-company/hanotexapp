/**
 * Transaction Types for Hanotex CMS
 * Định nghĩa các interface cho Transaction collection
 */

import { User } from './User'
import { Technology } from './Technology'
import { Auction } from './Auction'

// Enums cho Transaction
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
export type TransactionCurrency = 'VND' | 'USD' | 'EUR'

// Main Transaction Interface
export interface Transaction {
  id: string // Mã định danh giao dịch
  technology?: string | Technology // Công nghệ liên quan
  buyer?: string | User // Người mua
  seller?: string | User // Người bán
  amount: number // Số tiền giao dịch
  currency: TransactionCurrency // Đơn vị tiền tệ
  status: TransactionStatus // Trạng thái giao dịch
  payment_method?: string // Phương thức thanh toán
  transaction_fee?: number // Phí giao dịch
  completed_at?: string // Thời gian hoàn thành
  notes?: string // Ghi chú
  auction?: string | Auction // Phiên đấu giá liên quan

  // Timestamps
  createdAt: string // Thời gian tạo
  updatedAt: string // Thời gian cập nhật
}

// Types for form data and API responses
export interface TransactionCreateData
  extends Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> {}
export interface TransactionUpdateData extends Partial<TransactionCreateData> {}

// Transaction summary for lists
export interface TransactionSummary {
  id: string // Mã định danh giao dịch
  technology?: string | Technology // Công nghệ liên quan
  buyer?: string | User // Người mua
  seller?: string | User // Người bán
  amount: number // Số tiền giao dịch
  currency: TransactionCurrency // Đơn vị tiền tệ
  status: TransactionStatus // Trạng thái giao dịch
  completed_at?: string // Thời gian hoàn thành
  createdAt: string // Thời gian tạo
  updatedAt: string // Thời gian cập nhật
}

// Financial report data
export interface TransactionStats {
  total_amount: number // Tổng số tiền
  currency: TransactionCurrency // Đơn vị tiền tệ
  transaction_count: number // Số lượng giao dịch
  completed_count: number // Số lượng giao dịch hoàn thành
  pending_count: number // Số lượng giao dịch đang chờ
  failed_count: number // Số lượng giao dịch thất bại
  average_amount: number // Số tiền trung bình
}

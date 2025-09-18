/**
 * Auction Types for Hanotex CMS
 * Định nghĩa các interface cho Auction collection
 */

import { Technology } from './Technology'
import { Bid } from './Bid'

// Enums cho Auction
export type AuctionType = 'ENGLISH' | 'DUTCH' | 'SEALED_BID'
export type AuctionStatus = 'SCHEDULED' | 'ACTIVE' | 'ENDED' | 'CANCELLED'

// Main Auction Interface
export interface Auction {
  id: string // Mã định danh đấu giá
  technology: string | Technology // Công nghệ được đấu giá
  auction_type: AuctionType // Loại hình đấu giá
  start_price?: number // Giá khởi điểm
  reserve_price?: number // Giá sàn
  current_price?: number // Giá hiện tại
  start_time?: string // Thời gian bắt đầu
  end_time?: string // Thời gian kết thúc
  status: AuctionStatus // Trạng thái đấu giá

  // Related bids
  bids?: string[] | Bid[] // Các lượt đặt giá liên quan

  // Timestamps
  createdAt: string // Thời gian tạo
  updatedAt: string // Thời gian cập nhật
}

// Types for form data and API responses
export interface AuctionCreateData
  extends Omit<Auction, 'id' | 'current_price' | 'bids' | 'createdAt' | 'updatedAt'> {}
export interface AuctionUpdateData extends Partial<AuctionCreateData> {}

// Auction summary for lists
export interface AuctionSummary {
  id: string // Mã định danh đấu giá
  technology: string | Technology // Công nghệ được đấu giá
  auction_type: AuctionType // Loại hình đấu giá
  current_price?: number // Giá hiện tại
  start_time?: string // Thời gian bắt đầu
  end_time?: string // Thời gian kết thúc
  status: AuctionStatus // Trạng thái đấu giá
  bid_count?: number // Số lượt đặt giá
  createdAt: string // Thời gian tạo
  updatedAt: string // Thời gian cập nhật
}

// Active auction info for real-time updates
export interface ActiveAuctionInfo extends Auction {
  time_remaining?: number // Thời gian còn lại
  bid_count: number // Số lượt đặt giá
  highest_bidder_id?: string // ID người đặt giá cao nhất
  is_user_bidding?: boolean // Người dùng hiện tại có đang đặt giá không
}

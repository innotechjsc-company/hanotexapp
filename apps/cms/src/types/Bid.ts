/**
 * Bid Types for Hanotex CMS
 * Định nghĩa các interface cho Bid collection
 */

import { User } from './User'
import { Auction } from './Auction'

// Main Bid Interface
export interface Bid {
  id: string // Mã định danh lượt đặt giá
  auction: string | Auction // Phiên đấu giá liên quan
  bidder: string | User // Người đặt giá
  bid_amount: number // Số tiền đặt giá
  bid_time: string // Thời gian đặt giá
  is_winning: boolean // Trạng thái thắng cuộc

  // Timestamps
  createdAt: string // Thời gian tạo
  updatedAt: string // Thời gian cập nhật
}

// Types for form data and API responses
export interface BidCreateData extends Omit<Bid, 'id' | 'is_winning' | 'createdAt' | 'updatedAt'> {}
export interface BidUpdateData extends Partial<Pick<Bid, 'is_winning'>> {}

// Bid summary for auction display
export interface BidSummary {
  id: string // Mã định danh lượt đặt giá
  bidder: string | User // Người đặt giá
  bid_amount: number // Số tiền đặt giá
  bid_time: string // Thời gian đặt giá
  is_winning: boolean // Trạng thái thắng cuộc
}

// Real-time bid update
export interface BidUpdate {
  auction: string | Auction // Phiên đấu giá liên quan
  new_bid: BidSummary // Lượt đặt giá mới
  previous_highest?: number // Giá cao nhất trước đó
  bid_count: number // Tổng số lượt đặt giá
}

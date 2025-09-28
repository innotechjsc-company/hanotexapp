import { Media } from '@/payload-types'
import { ID, DateTimeString } from './common'

// Danh mục đấu giá
export type AuctionCategory = 'it' | 'biotech' | 'energy' | 'materials' | 'medical' | 'agriculture'

// Trạng thái phiên đấu giá
export type AuctionStatus = 'upcoming' | 'active' | 'ended' | 'cancelled'

// Thông tin người tổ chức
export interface Organizer {
  name: string
  email: string
  phone?: string
}

// Tài liệu đính kèm
export interface Document {
  name: string
  file: ID | Media
  description?: string
}

// Điều khoản đấu giá
export interface Term {
  term: string
}

// Lịch sử đấu giá
export interface BidHistory {
  amount: number
  bidder: string
  timestamp: DateTimeString
  isWinning: boolean
}

// Đấu giá tự động
export interface AutoBid {
  maxAmount: number
  bidder: string
  createdAt: DateTimeString
  isActive: boolean
}

// Phiên đấu giá
export interface Auction {
  id?: ID // ID duy nhất của phiên đấu giá
  title: string // Tiêu đề đấu giá
  description: any // Mô tả chi tiết (rich text)
  category: AuctionCategory // Danh mục
  startingPrice: number // Giá khởi điểm (VNĐ)
  currentBid?: number // Giá hiện tại (VNĐ)
  minBid?: number // Giá đấu giá tối thiểu (VNĐ)
  bidIncrement: number // Bước nhảy đấu giá (VNĐ)
  startTime: DateTimeString // Thời gian bắt đầu
  endTime: DateTimeString // Thời gian kết thúc
  location?: string // Địa điểm
  image?: ID | Media // Hình ảnh
  organizer: Organizer // Thông tin người tổ chức
  documents?: Document[] // Tài liệu đính kèm
  terms?: Term[] // Điều khoản đấu giá
  bids?: BidHistory[] // Lịch sử đấu giá
  autoBids?: AutoBid[] // Đấu giá tự động
  status: AuctionStatus // Trạng thái
  viewers: number // Số người xem
  bidCount: number // Số lượt đấu giá
  createdAt?: DateTimeString // Thời điểm tạo bản ghi
  updatedAt?: DateTimeString // Thời điểm cập nhật bản ghi
}

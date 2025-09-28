import { Media } from '@/payload-types'
import { ID, DateTimeString } from './common'

// Danh mục đấu giá
export type AuctionCategory = 'it' | 'biotech' | 'energy' | 'materials' | 'medical' | 'agriculture'

// Trạng thái phiên đấu giá
export type AuctionStatus = 'upcoming' | 'active' | 'ended' | 'cancelled'

// Rich text description structure
export interface RichTextDescription {
  root: {
    type: string
    children: {
      type: string
      version: number
      [k: string]: unknown
    }[]
    direction: ('ltr' | 'rtl') | null
    format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''
    indent: number
    version: number
  }
  [k: string]: unknown
}

// Thông tin người tổ chức
export interface Organizer {
  name: string
  email: string
  phone?: string | null
}

// Tài liệu đính kèm
export interface Document {
  name: string
  file: ID | Media
  description?: string | null
  id?: string | null
}

// Điều khoản đấu giá
export interface Term {
  term: string
  id?: string | null
}

// Lịch sử đấu giá
export interface BidHistory {
  amount: number
  bidder: string
  timestamp: DateTimeString
  isWinning?: boolean | null
  id?: string | null
}

// Đấu giá tự động
export interface AutoBid {
  maxAmount: number
  bidder: string
  createdAt: DateTimeString
  isActive?: boolean | null
  id?: string | null
}

// Phiên đấu giá
export interface Auction {
  id: string // ID duy nhất của phiên đấu giá
  title: string // Tiêu đề đấu giá
  description: RichTextDescription // Mô tả chi tiết (rich text)
  category: AuctionCategory // Danh mục
  startingPrice: number // Giá khởi điểm (VNĐ)
  currentBid?: number | null // Giá hiện tại (VNĐ)
  minBid?: number | null // Giá đấu giá tối thiểu (VNĐ)
  bidIncrement?: number | null // Bước nhảy đấu giá (VNĐ)
  startTime: DateTimeString // Thời gian bắt đầu
  endTime: DateTimeString // Thời gian kết thúc
  location?: string | null // Địa điểm
  image?: (string | null) | Media // Hình ảnh
  organizer: Organizer // Thông tin người tổ chức
  documents?: Document[] | null // Tài liệu đính kèm
  terms?: Term[] | null // Điều khoản đấu giá
  bids?: BidHistory[] | null // Lịch sử đấu giá
  autoBids?: AutoBid[] | null // Đấu giá tự động
  status?: AuctionStatus | null // Trạng thái
  viewers?: number | null // Số người xem
  bidCount?: number | null // Số lượt đấu giá
  createdAt: DateTimeString // Thời điểm tạo bản ghi
  updatedAt: DateTimeString // Thời điểm cập nhật bản ghi
}

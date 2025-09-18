import { Technology } from '@/payload-types'
import { ID, DateTimeString } from './common'

// Loại đấu giá
export type AuctionType = 'ENGLISH' | 'DUTCH' | 'SEALED_BID' // Kiểu đấu giá

// Trạng thái phiên đấu giá
export type AuctionStatus = 'SCHEDULED' | 'ACTIVE' | 'ENDED' | 'CANCELLED' // Trạng thái tiến trình phiên

// Phiên đấu giá cho một công nghệ
export interface Auction {
  id?: ID // ID duy nhất của phiên đấu giá
  technology: ID | Technology // ID công nghệ được đấu giá
  auction_type: AuctionType // Kiểu đấu giá
  start_price?: number // Giá khởi điểm
  reserve_price?: number // Giá sàn (tối thiểu chấp nhận)
  current_price?: number // Giá/giá thầu hiện tại cao nhất
  start_time?: DateTimeString // Thời gian bắt đầu
  end_time?: DateTimeString // Thời gian kết thúc
  status: AuctionStatus // Trạng thái phiên đấu giá
  bids?: ID[] // Danh sách ID các lượt đặt giá liên quan
  createdAt?: DateTimeString // Thời điểm tạo bản ghi
  updatedAt?: DateTimeString // Thời điểm cập nhật bản ghi
}

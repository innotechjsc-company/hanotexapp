import { Auction, User } from '@/payload-types'
import { ID, DateTimeString } from './common'

// Lượt đặt giá trong phiên đấu giá
export interface Bid {
  id?: ID // ID duy nhất của lượt đặt giá
  auction: ID | Auction // ID phiên đấu giá liên quan
  bidder: ID | User // ID người đặt giá
  bid_amount: number // Số tiền đặt giá
  bid_time: DateTimeString // Thời gian đặt giá
  is_winning: boolean // Có phải lượt đặt giá thắng hiện tại hay không
  createdAt?: DateTimeString // Thời điểm tạo bản ghi
  updatedAt?: DateTimeString // Thời điểm cập nhật bản ghi
}

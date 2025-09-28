import { Auction } from "./auctions";
import { ID, DateTimeString } from "./common";
import { User } from "./users";

// Bid status types
export type BidStatus = "ACTIVE" | "WITHDRAWN" | "WON" | "LOST";

// Bid type
export type BidType = "MANUAL" | "AUTO";

// Lượt đặt giá trong phiên đấu giá
export interface Bid {
  id?: ID; // ID duy nhất của lượt đặt giá
  auction_id?: string; // ID phiên đấu giá liên quan
  auction?: ID | Auction; // Phiên đấu giá liên quan
  bidder_id?: string; // ID người đặt giá
  bidder?: ID | User; // Người đặt giá
  bidder_email?: string; // Email người đặt giá
  bidder_name?: string; // Tên người đặt giá
  amount?: number; // Số tiền đặt giá (alias for bid_amount)
  bid_amount?: number; // Số tiền đặt giá
  currency?: string; // Loại tiền tệ
  bid_type?: BidType; // Loại đặt giá
  status?: BidStatus; // Trạng thái đặt giá
  bid_time?: DateTimeString; // Thời gian đặt giá
  is_winning?: boolean; // Có phải lượt đặt giá thắng hiện tại hay không
  created_at?: DateTimeString; // Thời điểm tạo bản ghi (alias)
  updated_at?: DateTimeString; // Thời điểm cập nhật bản ghi (alias)
  createdAt?: DateTimeString; // Thời điểm tạo bản ghi
  updatedAt?: DateTimeString; // Thời điểm cập nhật bản ghi
}

import { Auction } from "./auctions";
import { ID, DateTimeString, Currency } from "./common";

// Loại đấu giá
export type BidType = "MANUAL" | "AUTOMATIC";

// Trạng thái đấu giá
export type BidStatus = "ACTIVE" | "CANCELLED" | "WON" | "LOST";

// Lượt đặt giá trong phiên đấu giá
export interface Bid {
  id?: ID; // ID duy nhất của lượt đặt giá
  auction: ID | Auction; // ID phiên đấu giá liên quan
  bidder: string; // ID người đặt giá
  bidder_name?: string; // Tên người đặt giá
  bidder_email?: string; // Email người đặt giá
  bid_amount: number; // Số tiền đặt giá
  currency: Currency; // Đơn vị tiền tệ
  bid_type: BidType; // Loại đấu giá
  status: BidStatus; // Trạng thái
  bid_time: DateTimeString; // Thời gian đặt giá
  is_winning: boolean; // Là lượt đặt giá thắng
  createdAt?: DateTimeString; // Thời điểm tạo bản ghi
  updatedAt?: DateTimeString; // Thời điểm cập nhật bản ghi
}

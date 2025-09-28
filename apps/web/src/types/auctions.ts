import { ID, DateTimeString } from "./common";
import { Technology } from "./technologies";

// Loại đấu giá
export type AuctionType = "ENGLISH" | "DUTCH" | "SEALED_BID"; // Kiểu đấu giá

// Trạng thái phiên đấu giá
export type AuctionStatus = "SCHEDULED" | "ACTIVE" | "ENDED" | "CANCELLED" | "upcoming" | "active" | "ended"; // Trạng thái tiến trình phiên

// Phiên đấu giá cho một công nghệ
export interface Auction {
  id?: ID; // ID duy nhất của phiên đấu giá
  title?: string; // Tiêu đề phiên đấu giá
  description?: any; // Mô tả (rich text)
  technology?: ID | Technology; // ID công nghệ được đấu giá
  auction_type?: AuctionType; // Kiểu đấu giá
  category?: string; // Danh mục
  startingPrice?: number; // Giá khởi điểm
  start_price?: number; // Giá khởi điểm (alias)
  currentBid?: number; // Giá hiện tại
  current_price?: number; // Giá hiện tại (alias)
  bidIncrement?: number; // Bước nhảy giá
  reserve_price?: number; // Giá sàn
  startTime?: DateTimeString; // Thời gian bắt đầu
  start_time?: DateTimeString; // Thời gian bắt đầu (alias)
  endTime?: DateTimeString; // Thời gian kết thúc
  end_time?: DateTimeString; // Thời gian kết thúc (alias)
  status?: AuctionStatus; // Trạng thái phiên đấu giá
  location?: string; // Địa điểm
  organizer?: string; // Người tổ chức
  terms?: Array<{term: string}>; // Điều kiện
  image?: {
    url?: string;
    alt?: string;
  }; // Hình ảnh
  viewers?: number; // Số lượng người xem
  bidCount?: number; // Số lượng bid
  minBid?: number; // Giá đặt tối thiểu
  bids?: ID[]; // Danh sách ID các lượt đặt giá
  createdAt?: DateTimeString; // Thời điểm tạo bản ghi
  updatedAt?: DateTimeString; // Thời điểm cập nhật bản ghi
}

import { ID, DateTimeString } from "./common";
import { Technology } from "./technologies";
import { User } from "./users";

// Đơn vị tiền tệ giao dịch
export type TransactionCurrency = "VND" | "USD" | "EUR"; // Tiền tệ giao dịch

// Trạng thái giao dịch
export type TransactionStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"; // Trạng thái xử lý

// Giao dịch mua bán công nghệ
export interface Transaction {
  id?: ID; // ID duy nhất của giao dịch
  technology?: ID | Technology; // ID công nghệ liên quan
  buyer?: ID | User; // ID người mua
  seller?: ID | User; // ID người bán
  amount: number; // Số tiền giao dịch
  currency: TransactionCurrency; // Đơn vị tiền tệ
  status: TransactionStatus; // Trạng thái giao dịch
  payment_method?: string; // Phương thức thanh toán
  transaction_fee?: number; // Phí giao dịch
  completed_at?: DateTimeString; // Ngày/giờ hoàn thành
  notes?: string; // Ghi chú nội bộ
  auction?: ID; // ID phiên đấu giá liên quan (nếu phát sinh từ đấu giá)
  createdAt?: DateTimeString; // Thời điểm tạo bản ghi
  updatedAt?: DateTimeString; // Thời điểm cập nhật bản ghi
}

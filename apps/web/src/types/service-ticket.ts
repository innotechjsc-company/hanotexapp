import { ID, DateTimeString } from "./common";
import { Service } from "./services";
import { User } from "./users";

// Trạng thái phiếu dịch vụ
export type ServiceTicketStatus = "PENDING" | "PROCESSING" | "COMPLETED"; // Trạng thái xử lý

// Phiếu yêu cầu dịch vụ
export interface ServiceTicket {
  id?: ID; // ID duy nhất của phiếu
  service: ID | Service; // ID dịch vụ liên quan
  user: ID | User; // ID người dùng gửi yêu cầu
  status: ServiceTicketStatus; // Trạng thái xử lý phiếu
  implementer: string; // Người thực hiện
  createdAt?: DateTimeString; // Thời điểm tạo bản ghi
  updatedAt?: DateTimeString; // Thời điểm cập nhật bản ghi
}

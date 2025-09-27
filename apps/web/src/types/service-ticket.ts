import { ID, DateTimeString } from "./common";
import { Service } from "./services";
import { User } from "./users";
import { Technology } from "./technologies";
import { Project } from "./project";

// Trạng thái phiếu dịch vụ
export type ServiceTicketStatus = "pending" | "processing" | "completed" | "cancelled"; // Trạng thái xử lý

// Phiếu yêu cầu dịch vụ
export interface ServiceTicket {
  id?: ID; // ID duy nhất của phiếu
  service: ID | Service; // ID dịch vụ liên quan
  user: ID | User; // ID người dùng gửi yêu cầu
  status: ServiceTicketStatus; // Trạng thái xử lý phiếu
  responsible_user: ID | User; // Người chịu trách nhiệm chính
  implementers: (ID | User)[]; // Người thực hiện
  technologies?: (ID | Technology)[]; // Công nghệ liên quan
  project?: ID | Project; // Dự án liên quan
  description: string; // Mô tả yêu cầu
  document?: ID; // Tài liệu đính kèm
  createdAt?: DateTimeString; // Thời điểm tạo bản ghi
  updatedAt?: DateTimeString; // Thời điểm cập nhật bản ghi
}

import { IPType } from "@/api/intellectual-properties";
import { ID, DateTimeString } from "./common";
import { TRL } from "./trl";
import { Category } from "./categories";
import { User } from "./users";

// Trạng thái công nghệ
export type TechnologyStatus =
  | "DRAFT"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "INACTIVE"; // Trạng thái phê duyệt/hiển thị

// Chế độ hiển thị công nghệ
export type VisibilityMode = "public" | "private" | "restricted"; // Mức độ hiển thị

// Loại chủ sở hữu công nghệ
export type OwnerType = "INDIVIDUAL" | "COMPANY" | "RESEARCH_INSTITUTION"; // Nhóm chủ sở hữu

// Chi tiết chủ sở hữu
export interface TechnologyOwner {
  owner_type: OwnerType; // Loại chủ sở hữu
  owner_name: string; // Tên chủ sở hữu
  ownership_percentage: number; // Tỷ lệ sở hữu (0-100)
}

// Chi tiết Sở hữu Trí tuệ
export interface IPDetail {
  ip_type: IPType; // Loại SHTT
  ip_number?: string; // Số/văn bằng SHTT
  status?: string; // Trạng thái IP
}

// Nhóm Chứng nhận Pháp lý
export interface LegalCertification {
  protection_scope?: { scope: string }[]; // Phạm vi bảo hộ (mảng chuỗi)
  standard_certifications?: { certification: string }[]; // Chứng nhận tiêu chuẩn
  local_certification_url?: string; // Đường dẫn/file chứng nhận
}

// Đơn vị tiền tệ
export type Currency = "VND" | "USD" | "EUR"; // Tiền tệ định giá

// Thông tin Định giá
export type PricingType =
  | "GRANT_SEED"
  | "VC_JOINT_VENTURE"
  | "GROWTH_STRATEGIC"; // Kiểu định giá theo TRL

export interface PricingInfo {
  pricing_type: PricingType; // Kiểu định giá
  price_from: number; // Giá từ
  price_to: number; // Giá đến
  currency: Currency; // Đơn vị tiền tệ
}

// Dữ liệu bổ sung
export interface AdditionalData {
  test_results?: unknown; // Kết quả kiểm tra (rich text)
  economic_social_impact?: unknown; // Tác động kinh tế & xã hội (rich text)
  financial_support_info?: unknown; // Thông tin hỗ trợ tài chính (rich text)
}

// Chế độ hiển thị chi tiết công nghệ
export type DisplayMode =
  | "public_summary_with_nda_details"
  | "fully_public"
  | "private_by_invitation";

// Thực thể Công nghệ
export interface Technology {
  id?: ID; // ID duy nhất của công nghệ
  title: string; // Tiêu đề công nghệ
  public_summary?: string; // Tóm tắt công khai
  category?: ID | Category; // ID danh mục/lĩnh vực
  confidential_detail?: string; // Chi tiết bảo mật (nội bộ)
  trl_level: ID | TRL; // ID mức TRL
  submitter: ID | User; // ID người đăng tải
  status: TechnologyStatus; // Trạng thái công nghệ
  visibility_mode?: VisibilityMode; // Chế độ hiển thị
  owners?: TechnologyOwner[]; // Danh sách chủ sở hữu công nghệ
  ip_details?: IPDetail[]; // Danh sách chi tiết SHTT
  legal_certification?: LegalCertification; // Nhóm chứng nhận pháp lý
  pricing?: PricingInfo; // Thông tin định giá
  additional_data?: AdditionalData; // Dữ liệu bổ sung
  documents?: ID[]; // Danh sách ID tài liệu/media liên quan
  createdAt?: DateTimeString; // Thời điểm tạo bản ghi
  updatedAt?: DateTimeString; // Thời điểm cập nhật bản ghi
  display_mode?: DisplayMode; // Chế độ hiển thị chi tiết công nghệ
}

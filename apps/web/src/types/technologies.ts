import { Category } from "./categories";
import { ID, DateTimeString } from "./common";
import { Media } from "./media";
import { TRL } from "./trl";
import { User } from "./users";

// Trạng thái công nghệ
export type TechnologyStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "active"
  | "inactive"; // Trạng thái phê duyệt/hiển thị

// Chế độ hiển thị công nghệ
export type VisibilityMode = "public" | "private" | "restricted"; // Mức độ hiển thị

// Loại chủ sở hữu công nghệ
export type OwnerType = "individual" | "company" | "research_institution"; // Nhóm chủ sở hữu

export type PricingType =
  | "grant_seed"
  | "vc_joint_venture"
  | "growth_strategic"; // Kiểu định giá theo TRL

export type Currency = "vnd" | "usd" | "eur"; // Tiền tệ định giá

// Chế độ hiển thị chi tiết công nghệ
export type DisplayMode =
  | "public_summary_with_nda_details"
  | "fully_public"
  | "private_by_invitation";

// Chi tiết chủ sở hữu
export interface TechnologyOwner {
  owner_type: OwnerType; // Loại chủ sở hữu
  owner_name: string; // Tên chủ sở hữu
  ownership_percentage: number; // Tỷ lệ sở hữu (0-100)
}

// Chi tiết Mong muốn đầu tư
export interface InvestmentDesire {
  investment_option: string; // Mong muốn đầu tư
}

// Chi tiết Hình thức chuyển giao
export interface TransferType {
  transfer_option: string; // Hình thức chuyển giao
}

// Nhóm Chứng nhận Pháp lý
export interface LegalCertification {
  protection_scope?: { scope: string }[]; // Phạm vi bảo hộ (mảng chuỗi)
  standard_certifications?: { certification: string }[]; // Chứng nhận tiêu chuẩn
  files?: Media[]; // Đường dẫn/file chứng nhận
}

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

// Thực thể Công nghệ
export interface Technology {
  id?: ID; // ID duy nhất của công nghệ
  title: string; // Tiêu đề công nghệ
  documents?: Media[]; // Danh sách ID tài liệu/media liên quan
  category?: ID | Category; // ID danh mục/lĩnh vực
  trl_level: ID | TRL; // ID mức TRL
  description?: string; // Tóm tắt công khai
  confidential_detail?: string; // Chi tiết bảo mật (nội bộ)
  owners?: TechnologyOwner[]; // Danh sách chủ sở hữu công nghệ
  legal_certification?: LegalCertification; // Pháp lý, Lãnh thổ
  investment_desire?: InvestmentDesire[]; // Mong muốn đầu tư
  transfer_type?: TransferType[]; // Hình thức chuyển giao
  pricing?: PricingInfo; // Thông tin định giá
  createdAt?: DateTimeString; // Thời điểm tạo bản ghi
  updatedAt?: DateTimeString; // Thời điểm cập nhật bản ghi
  submitter: ID | User; // ID người đăng tải
  status: TechnologyStatus; // Trạng thái công nghệ
  visibility_mode?: VisibilityMode; // Chế độ hiển thị
}

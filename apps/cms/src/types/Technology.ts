/**
 * Technology Types for Hanotex CMS
 * Định nghĩa các interface cho Technology collection
 */

import { User } from './User'
import { Category } from './Category'
import { Media } from './Media'

// Enums cho Technology
export type TechnologyStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'INACTIVE'
export type VisibilityMode = 'public' | 'private' | 'restricted'
export type OwnerType = 'INDIVIDUAL' | 'COMPANY' | 'RESEARCH_INSTITUTION'
export type IPType =
  | 'PATENT'
  | 'UTILITY_MODEL'
  | 'INDUSTRIAL_DESIGN'
  | 'TRADEMARK'
  | 'SOFTWARE_COPYRIGHT'
  | 'TRADE_SECRET'
export type PricingType = 'APPRAISAL' | 'ASK' | 'AUCTION' | 'OFFER'
export type Currency = 'VND' | 'USD' | 'EUR'

// Technology Owner Interface
export interface TechnologyOwner {
  owner_type: OwnerType // Loại chủ sở hữu
  owner_name: string // Tên chủ sở hữu
  ownership_percentage: number // Tỷ lệ sở hữu
}

// IP Details Interface
export interface IPDetail {
  ip_type: IPType // Loại sở hữu trí tuệ
  ip_number?: string // Số IP
  status?: string // Trạng thái IP
  territory?: string // Lãnh thổ
}

// Legal Certification Interfaces
export interface ProtectionScope {
  scope: string // Phạm vi
}

export interface StandardCertification {
  certification: string // Chứng nhận
}

export interface LegalCertification {
  protection_scope?: ProtectionScope[] // Phạm vi bảo hộ
  standard_certifications?: StandardCertification[] // Chứng nhận tiêu chuẩn
  local_certification_url?: string // URL chứng nhận địa phương
}

// Pricing Information Interface
export interface PricingInfo {
  pricing_type: PricingType // Loại định giá
  asking_price?: number // Giá yêu cầu
  currency: Currency // Đơn vị tiền tệ
  price_type?: string // Loại giá
  appraisal_purpose?: string // Mục đích đánh giá
  appraisal_scope?: string // Phạm vi đánh giá
  appraisal_deadline?: string // Thời hạn đánh giá
}

// Investment & Transfer Interfaces
export interface CommercializationMethod {
  method: string // Phương pháp
}

export interface TransferMethod {
  method: string // Phương pháp
}

export interface FinancialMethod {
  method: string // Phương pháp
}

export interface InvestmentTransferInfo {
  investment_stage?: string // Giai đoạn đầu tư
  commercialization_methods?: CommercializationMethod[] // Phương pháp thương mại hóa
  transfer_methods?: TransferMethod[] // Phương pháp chuyển giao
  territory_scope?: string // Phạm vi lãnh thổ
  financial_methods?: FinancialMethod[] // Phương pháp tài chính
  usage_limitations?: string // Hạn chế sử dụng
  current_partners?: string // Đối tác hiện tại
  potential_partners?: string // Đối tác tiềm năng
}

// Additional Data Interface
export interface AdditionalData {
  test_results?: string // Kết quả kiểm tra
  economic_social_impact?: string // Tác động kinh tế & xã hội
  financial_support_info?: string // Thông tin hỗ trợ tài chính
}

// Main Technology Interface
export interface Technology {
  id: string // Mã định danh công nghệ
  title: string // Tiêu đề công nghệ
  public_summary?: string // Tóm tắt công khai
  confidential_detail?: string // Chi tiết bảo mật
  trl_level?: number // Mức TRL
  category?: string | Category // Danh mục
  submitter: string | User // Người đăng tải
  status: TechnologyStatus // Trạng thái công nghệ
  visibility_mode: VisibilityMode // Chế độ hiển thị

  // Complex nested data
  owners?: TechnologyOwner[] // Chủ sở hữu công nghệ
  ip_details?: IPDetail[] // Chi tiết sở hữu trí tuệ
  legal_certification?: LegalCertification // Chứng nhận pháp lý
  pricing?: PricingInfo // Thông tin định giá
  investment_transfer?: InvestmentTransferInfo // Thông tin đầu tư & chuyển giao
  additional_data?: AdditionalData // Dữ liệu bổ sung

  // Related documents
  documents?: string[] | Media[] // Tài liệu liên quan

  // Timestamps
  createdAt: string // Thời gian tạo
  updatedAt: string // Thời gian cập nhật
}

// Types for form data and API responses
export interface TechnologyCreateData extends Omit<Technology, 'id' | 'createdAt' | 'updatedAt'> {}
export interface TechnologyUpdateData extends Partial<TechnologyCreateData> {}

// Technology summary for lists
export interface TechnologySummary {
  id: string // Mã định danh công nghệ
  title: string // Tiêu đề công nghệ
  public_summary?: string // Tóm tắt công khai
  trl_level?: number // Mức TRL
  status: TechnologyStatus // Trạng thái công nghệ
  category?: string | Category // Danh mục
  submitter: string | User // Người đăng tải
  pricing?: Pick<PricingInfo, 'asking_price' | 'currency' | 'pricing_type'> // Thông tin định giá
  createdAt: string // Thời gian tạo
  updatedAt: string // Thời gian cập nhật
}

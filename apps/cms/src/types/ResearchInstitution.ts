/**
 * Research Institution Types for Hanotex CMS
 * Định nghĩa các interface cho Research Institution collection
 */

// Import Address from Company types (shared interface)
import { Address } from './Company'

// Enums for Research Institution
export type InstitutionType =
  | 'UNIVERSITY'
  | 'RESEARCH_INSTITUTE'
  | 'GOVERNMENT_LAB'
  | 'PRIVATE_RND'
  | 'INTERNATIONAL_ORG'

// Contact information interface
export interface ContactInfo {
  contact_email?: string // Email liên hệ
  contact_phone?: string // Số điện thoại liên hệ
  website?: string // Trang web
}

// Research area interface
export interface ResearchArea {
  area: string // Lĩnh vực nghiên cứu
}

// Accreditation information interface
export interface AccreditationInfo {
  accreditation_body?: string // Cơ quan cấp chứng nhận
  accreditation_level?: string // Cấp độ chứng nhận
  accreditation_date?: string // Ngày cấp chứng nhận
  accreditation_expiry?: string // Ngày hết hạn chứng nhận
}

// Main Research Institution Interface
export interface ResearchInstitution {
  id: string // Mã định danh viện nghiên cứu
  institution_name: string // Tên viện nghiên cứu
  institution_code: string // Mã viện nghiên cứu
  governing_body: string // Cơ quan quản lý
  institution_type: InstitutionType // Loại hình viện nghiên cứu
  contact_info?: ContactInfo // Thông tin liên hệ
  address?: Address // Địa chỉ
  research_areas?: ResearchArea[] // Lĩnh vực nghiên cứu
  research_task_code?: string // Mã số đề tài nghiên cứu
  acceptance_report?: string // Báo cáo nghiệm thu
  research_group?: string // Nhóm nghiên cứu
  established_year?: number // Năm thành lập
  staff_count?: number // Số lượng nhân viên
  accreditation_info?: AccreditationInfo // Thông tin chứng nhận
  is_active: boolean // Trạng thái hoạt động

  // Timestamps
  createdAt: string // Thời gian tạo
  updatedAt: string // Thời gian cập nhật
}

// Types for form data and API responses
export interface ResearchInstitutionCreateData
  extends Omit<ResearchInstitution, 'id' | 'createdAt' | 'updatedAt'> {}
export interface ResearchInstitutionUpdateData extends Partial<ResearchInstitutionCreateData> {}

// Research Institution summary for lists and references
export interface ResearchInstitutionSummary {
  id: string // Mã định danh viện nghiên cứu
  institution_name: string // Tên viện nghiên cứu
  institution_code: string // Mã viện nghiên cứu
  governing_body: string // Cơ quan quản lý
  institution_type: InstitutionType // Loại hình viện nghiên cứu
  contact_info?: ContactInfo // Thông tin liên hệ
  is_active: boolean // Trạng thái hoạt động
  createdAt: string // Thời gian tạo
}

// Research Institution profile for user display
export interface ResearchInstitutionProfile
  extends Omit<ResearchInstitution, 'createdAt' | 'updatedAt'> {}

// Research Institution search filters
export interface ResearchInstitutionFilters {
  institution_name?: string // Tên viện nghiên cứu
  institution_code?: string // Mã viện nghiên cứu
  governing_body?: string // Cơ quan quản lý
  institution_type?: InstitutionType[] // Loại hình viện nghiên cứu
  research_areas?: string[] // Lĩnh vực nghiên cứu
  established_year_min?: number // Năm thành lập tối thiểu
  established_year_max?: number // Năm thành lập tối đa
  staff_count_min?: number // Số lượng nhân viên tối thiểu
  staff_count_max?: number // Số lượng nhân viên tối đa
  is_active?: boolean // Trạng thái hoạt động
}

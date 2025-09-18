import { ID, DateTimeString } from './common'

// Loại hình viện nghiên cứu
export type InstitutionType =
  | 'UNIVERSITY'
  | 'RESEARCH_INSTITUTE'
  | 'GOVERNMENT_LAB'
  | 'PRIVATE_RND'
  | 'INTERNATIONAL_ORG' // Phân loại tổ chức nghiên cứu

// Thông tin liên hệ
export interface ContactInfo {
  contact_email?: string // Email liên hệ
  contact_phone?: string // Số điện thoại liên hệ
  website?: string // Trang web viện nghiên cứu
}

// Địa chỉ
export interface InstitutionAddress {
  street?: string // Địa chỉ đường
  city?: string // Thành phố
  state?: string // Tỉnh/Bang
  country?: string // Quốc gia
  postal_code?: string // Mã bưu chính
}

// Lĩnh vực nghiên cứu (mục mảng)
export interface ResearchArea {
  area: string // Tên lĩnh vực nghiên cứu
}

// Thông tin chứng nhận kiểm định
export interface AccreditationInfo {
  accreditation_body?: string // Cơ quan cấp chứng nhận
  accreditation_level?: string // Cấp độ chứng nhận
  accreditation_date?: DateTimeString // Ngày cấp chứng nhận
  accreditation_expiry?: DateTimeString // Ngày hết hạn chứng nhận
}

// Thực thể Viện nghiên cứu
export interface ResearchInstitution {
  id?: ID // ID duy nhất của viện nghiên cứu
  institution_name: string // Tên viện nghiên cứu
  institution_code: string // Mã viện nghiên cứu (duy nhất)
  governing_body: string // Cơ quan quản lý
  institution_type: InstitutionType // Loại hình viện nghiên cứu
  contact_info?: ContactInfo // Thông tin liên hệ
  address?: InstitutionAddress // Địa chỉ
  research_areas?: ResearchArea[] // Danh sách lĩnh vực nghiên cứu
  research_task_code?: string // Mã số đề tài nghiên cứu
  acceptance_report?: string // Báo cáo nghiệm thu
  research_group?: string // Nhóm/phòng ban nghiên cứu
  established_year?: number // Năm thành lập
  staff_count?: number // Số lượng nhân viên nghiên cứu
  accreditation_info?: AccreditationInfo // Thông tin chứng nhận
  is_active: boolean // Trạng thái hoạt động
  createdAt?: DateTimeString // Thời điểm tạo bản ghi
  updatedAt?: DateTimeString // Thời điểm cập nhật bản ghi
}


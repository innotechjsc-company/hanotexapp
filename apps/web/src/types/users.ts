import { Company, ResearchInstitution } from '@/payload-types'
import { ID, DateTimeString } from './common'

// Phân loại người dùng
export type UserType = 'INDIVIDUAL' | 'COMPANY' | 'RESEARCH_INSTITUTION' // Loại hồ sơ người dùng

// Vai trò hệ thống
export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR' | 'SUPPORT' // Quyền vai trò

// Người dùng hệ thống (Payload auth)
export interface User {
  id?: ID // ID duy nhất của người dùng
  email: string // Email đăng nhập
  user_type: UserType // Loại người dùng
  role: UserRole // Vai trò
  is_verified: boolean // Email đã xác minh
  is_active: boolean // Tài khoản đang hoạt động

  // Hồ sơ cá nhân (INDIVIDUAL)
  full_name?: string // Họ và tên
  id_number?: string // Số CMND/CCCD/hộ chiếu
  phone?: string // Số điện thoại
  profession?: string // Nghề nghiệp
  bank_account?: string // Tài khoản ngân hàng

  // Liên kết hồ sơ công ty (COMPANY)
  company?: ID | Company // ID hồ sơ công ty

  // Liên kết hồ sơ viện nghiên cứu (RESEARCH_INSTITUTION)
  research_institution?: ID | ResearchInstitution // ID hồ sơ viện nghiên cứu

  createdAt?: DateTimeString // Thời điểm tạo bản ghi
  updatedAt?: DateTimeString // Thời điểm cập nhật bản ghi
}

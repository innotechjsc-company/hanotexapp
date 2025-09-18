/**
 * User Types for Hanotex CMS
 * Định nghĩa các interface cho User collection (after separating Company and ResearchInstitution)
 */

import { Company } from './Company'
import { ResearchInstitution } from './ResearchInstitution'

// Enums cho User
export type UserType = 'INDIVIDUAL' | 'COMPANY' | 'RESEARCH_INSTITUTION'
export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR' | 'SUPPORT'

// Main User Interface
export interface User {
  id: string // Mã định danh người dùng
  email: string // Địa chỉ email
  user_type: UserType // Loại người dùng (Cá nhân, Công ty, Viện nghiên cứu)
  role: UserRole // Vai trò người dùng (Người dùng, Quản trị viên, Kiểm duyệt viên, Hỗ trợ)
  is_verified: boolean // Trạng thái xác minh
  is_active: boolean // Trạng thái hoạt động

  // Individual profile data (for INDIVIDUAL user_type)
  full_name?: string // Tên đầy đủ
  id_number?: string // Số CMND/CCCD
  phone?: string // Số điện thoại
  profession?: string // Nghề nghiệp
  bank_account?: string // Tài khoản ngân hàng

  // Relationships to separate entities
  company?: string | Company // ID hoặc thông tin công ty liên quan
  research_institution?: string | ResearchInstitution // ID hoặc thông tin viện nghiên cứu liên quan

  // Timestamps
  createdAt: string // Thời gian tạo
  updatedAt: string // Thời gian cập nhật
}

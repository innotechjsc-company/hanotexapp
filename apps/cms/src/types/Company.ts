/**
 * Company Types for Hanotex CMS
 * Định nghĩa các interface cho Company collection
 */

// Address interface for company location
export interface Address {
  street?: string // Tên đường
  city?: string // Thành phố
  state?: string // Tỉnh/Bang
  country?: string // Quốc gia
  postal_code?: string // Mã bưu chính
}

// Business sector interface
export interface BusinessSector {
  sector: string // Lĩnh vực kinh doanh
}

// Main Company Interface
export interface Company {
  id: string // Mã định danh công ty
  company_name: string // Tên công ty
  tax_code: string // Mã số thuế
  business_license?: string // Giấy phép kinh doanh
  legal_representative: string // Người đại diện pháp luật
  contact_email?: string // Email liên hệ
  contact_phone?: string // Số điện thoại liên hệ
  address?: Address // Địa chỉ
  production_capacity?: string // Năng lực sản xuất
  business_sectors?: BusinessSector[] // Lĩnh vực kinh doanh
  employee_count?: number // Số lượng nhân viên
  established_year?: number // Năm thành lập
  website?: string // Trang web
  is_active: boolean // Trạng thái hoạt động

  // Timestamps
  createdAt: string // Thời gian tạo
  updatedAt: string // Thời gian cập nhật
}

// Types for form data and API responses
export interface CompanyCreateData extends Omit<Company, 'id' | 'createdAt' | 'updatedAt'> {}
export interface CompanyUpdateData extends Partial<CompanyCreateData> {}

// Company summary for lists and references
export interface CompanySummary {
  id: string // Mã định danh công ty
  company_name: string // Tên công ty
  tax_code: string // Mã số thuế
  legal_representative: string // Người đại diện pháp luật
  contact_email?: string // Email liên hệ
  is_active: boolean // Trạng thái hoạt động
  createdAt: string // Thời gian tạo
}

// Company profile for user display
export interface CompanyProfile extends Omit<Company, 'createdAt' | 'updatedAt'> {}

// Company search filters
export interface CompanyFilters {
  company_name?: string // Tên công ty
  tax_code?: string // Mã số thuế
  business_sectors?: string[] // Lĩnh vực kinh doanh
  employee_count_min?: number // Số lượng nhân viên tối thiểu
  employee_count_max?: number // Số lượng nhân viên tối đa
  established_year_min?: number // Năm thành lập tối thiểu
  established_year_max?: number // Năm thành lập tối đa
  is_active?: boolean // Trạng thái hoạt động
}

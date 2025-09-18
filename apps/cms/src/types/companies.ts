import { ID, DateTimeString } from './common'

// Địa chỉ công ty
export interface CompanyAddress {
  street?: string // Địa chỉ đường
  city?: string // Thành phố
  state?: string // Tỉnh/Bang
  country?: string // Quốc gia
  postal_code?: string // Mã bưu chính
}

// Lĩnh vực kinh doanh của công ty (mục mảng)
export interface BusinessSector {
  sector: string // Tên lĩnh vực kinh doanh
}

// Thực thể Công ty
export interface Company {
  id?: ID // ID duy nhất của công ty
  company_name: string // Tên công ty
  tax_code: string // Mã số thuế (duy nhất)
  business_license?: string // Giấy phép kinh doanh
  legal_representative: string // Người đại diện pháp luật
  contact_email?: string // Email liên hệ
  contact_phone?: string // Số điện thoại liên hệ
  address?: CompanyAddress // Địa chỉ công ty
  production_capacity?: string // Năng lực sản xuất (mô tả)
  business_sectors?: BusinessSector[] // Danh sách lĩnh vực kinh doanh
  employee_count?: number // Số lượng nhân viên
  established_year?: number // Năm thành lập
  website?: string // Trang web công ty
  is_active: boolean // Trạng thái hoạt động
  createdAt?: DateTimeString // Thời điểm tạo bản ghi
  updatedAt?: DateTimeString // Thời điểm cập nhật bản ghi
}


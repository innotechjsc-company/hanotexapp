import { ID, DateTimeString } from './common'

// Danh mục lĩnh vực/công nghệ
export interface Category {
  id?: ID // ID duy nhất của danh mục
  name: string // Tên danh mục
  parent?: ID | Category // ID danh mục cha (nếu có)
  code_intl: string // Mã danh mục quốc tế
  code_vn: string // Tên danh mục Việt Nam
  createdAt?: DateTimeString // Thời điểm tạo bản ghi
  updatedAt?: DateTimeString // Thời điểm cập nhật bản ghi
}

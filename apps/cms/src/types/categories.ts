import { ID, DateTimeString } from './common'

// Danh mục lĩnh vực/công nghệ
export interface Category {
  id?: ID // ID duy nhất của danh mục
  name: string // Tên danh mục
  code: string // Mã danh mục (duy nhất)
  parent?: ID | Category // ID danh mục cha (nếu có)
  level: number // Cấp độ phân cấp (1-5)
  description?: string // Mô tả danh mục
  createdAt?: DateTimeString // Thời điểm tạo bản ghi
  updatedAt?: DateTimeString // Thời điểm cập nhật bản ghi
}

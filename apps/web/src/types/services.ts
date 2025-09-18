import { ID, DateTimeString } from './common'

// Dịch vụ cung cấp
export interface Service {
  id?: ID // ID duy nhất của dịch vụ
  name: string // Tên dịch vụ
  description: string // Mô tả dịch vụ
  createdAt?: DateTimeString // Thời điểm tạo bản ghi
  updatedAt?: DateTimeString // Thời điểm cập nhật bản ghi
}


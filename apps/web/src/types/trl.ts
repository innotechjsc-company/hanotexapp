import { ID, DateTimeString } from './common'

// Mức TRL (Technology Readiness Level)
export interface TRL {
  id?: ID // ID duy nhất của bản ghi TRL
  title: string // Tên TRL
  value: number // Giá trị TRL (cấp độ)
  description: string // Mô tả TRL
  createdAt?: DateTimeString // Thời điểm tạo bản ghi
  updatedAt?: DateTimeString // Thời điểm cập nhật bản ghi
}


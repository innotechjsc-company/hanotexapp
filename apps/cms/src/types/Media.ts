import { ID, DateTimeString } from './common'

// Tệp media (ảnh/tài liệu tải lên)
export interface MediaAsset {
  id?: ID // ID duy nhất của tệp
  alt: string // Mô tả/Alt text
  // Các trường tải lên mặc định của Payload có thể tồn tại (filename, url, etc.) nhưng không bắt buộc trong type đơn giản này.
  createdAt?: DateTimeString // Thời điểm tạo bản ghi
  updatedAt?: DateTimeString // Thời điểm cập nhật bản ghi
}


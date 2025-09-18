/**
 * Media Types for Hanotex CMS
 * Định nghĩa các interface cho Media collection
 */

// Main Media Interface
export interface Media {
  id: string // Mã định danh media
  alt: string // Văn bản thay thế
  filename?: string // Tên tệp
  mimeType?: string // Loại MIME
  filesize?: number // Kích thước tệp
  width?: number // Chiều rộng
  height?: number // Chiều cao
  url?: string // URL tệp

  // Timestamps
  createdAt: string // Thời gian tạo
  updatedAt: string // Thời gian cập nhật
}

// Types for form data and API responses
export interface MediaCreateData extends Omit<Media, 'id' | 'createdAt' | 'updatedAt'> {}
export interface MediaUpdateData extends Partial<Pick<Media, 'alt'>> {}

// Media summary for lists
export interface MediaSummary {
  id: string // Mã định danh media
  alt: string // Văn bản thay thế
  filename?: string // Tên tệp
  mimeType?: string // Loại MIME
  filesize?: number // Kích thước tệp
  url?: string // URL tệp
  createdAt: string // Thời gian tạo
}

// File upload response
export interface FileUploadResponse {
  media: Media // Thông tin media
  success: boolean // Trạng thái thành công
  error?: string // Thông báo lỗi
}

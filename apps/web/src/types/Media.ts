export type Media = {
  id: number;
  /**
   * Mô tả ngắn gọn về file media (dùng cho SEO và accessibility). Sẽ tự động tạo từ tên file nếu để trống.
   */
  alt: string;
  /**
   * Chú thích hiển thị dưới ảnh (tùy chọn)
   */
  caption?: string | null;
  /**
   * Loại file media
   */
  type?: ("image" | "video" | "document" | "other") | null;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  thumbnailURL?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  focalX?: number | null;
  focalY?: number | null;
};

import type { CollectionConfig } from 'payload'
import path from 'path'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    group: '🔔 Hệ thống',
    description: 'Quản lý tất cả file media (ảnh, video, documents)',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description:
          'Mô tả ngắn gọn về file media (dùng cho SEO và accessibility). Sẽ tự động tạo từ tên file nếu để trống.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description: 'Chú thích hiển thị dưới ảnh (tùy chọn)',
      },
      hidden: true,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Hình ảnh', value: 'image' },
        { label: 'Video', value: 'video' },
        { label: 'Tài liệu', value: 'document' },
        { label: 'Khác', value: 'other' },
      ],
      defaultValue: 'image',
      admin: {
        description: 'Loại file media',
      },
    },
  ],
  upload: {
    staticDir: path.resolve(process.cwd(), 'uploads'),
    disableLocalStorage: false,
    mimeTypes: [
      // Images
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      // Videos
      'video/mp4',
      'video/webm',
      'video/ogg',
      // Documents
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      // Archives
      'application/zip',
      'application/x-rar-compressed',
    ],
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    crop: true,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Tự động set type dựa trên mimeType
        if (data.mimeType) {
          if (data.mimeType.startsWith('image/')) {
            data.type = 'image'
          } else if (data.mimeType.startsWith('video/')) {
            data.type = 'video'
          } else if (
            data.mimeType.includes('pdf') ||
            data.mimeType.includes('document') ||
            data.mimeType.includes('sheet')
          ) {
            data.type = 'document'
          } else {
            data.type = 'other'
          }
        }

        // Helper function để format filename thành text đẹp
        const formatFilenameToText = (filename: string) => {
          const nameWithoutExt = filename.replace(/\.[^/.]+$/, '')
          return nameWithoutExt.replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim()
        }

        // Tự động set alt từ filename nếu chưa có alt
        if (!data.alt && data.filename) {
          data.alt = formatFilenameToText(data.filename)
        }

        // Tự động set caption từ filename nếu chưa có caption
        if (!data.caption && data.filename) {
          data.caption = formatFilenameToText(data.filename)
        }

        return data
      },
    ],
  },
  timestamps: true,
}

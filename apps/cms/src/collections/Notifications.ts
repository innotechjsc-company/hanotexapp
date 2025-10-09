import type { CollectionConfig } from 'payload'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'title',
    group: '🔔 Hệ thống',
    defaultColumns: ['title', 'user_id', 'type', 'is_read', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Người dùng',
      admin: {
        description: 'Người dùng sẽ nhận thông báo này',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Tiêu đề thông báo',
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Nội dung',
      admin: {
        description: 'Nội dung chính của thông báo',
      },
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Thông tin', value: 'info' },
        { label: 'Thành công', value: 'success' },
        { label: 'Cảnh báo', value: 'warning' },
        { label: 'Lỗi', value: 'error' },
        { label: 'Đấu giá', value: 'auction' },
        { label: 'Giao dịch', value: 'transaction' },
        { label: 'Công nghệ', value: 'technology' },
        { label: 'Hệ thống', value: 'system' },
        { label: 'Hợp đồng', value: 'contract' },
      ],
      label: 'Loại thông báo',
      admin: {
        description: 'Phân loại thông báo để tạo kiểu và lọc',
      },
    },
    {
      name: 'is_read',
      type: 'checkbox',
      defaultValue: false,
      label: 'Đã đọc',
      admin: {
        description: 'Người dùng đã đọc thông báo này hay chưa',
      },
    },
    // Action URL for clickable notifications
    {
      name: 'action_url',
      type: 'text',
      label: 'URL hành động',
      admin: {
        description: 'URL để điều hướng khi nhấp vào thông báo',
      },
    },
    // Priority level
    {
      name: 'priority',
      type: 'select',
      defaultValue: 'normal',
      options: [
        { label: 'Thấp', value: 'low' },
        { label: 'Bình thường', value: 'normal' },
        { label: 'Cao', value: 'high' },
        { label: 'Khẩn cấp', value: 'urgent' },
      ],
      label: 'Mức độ ưu tiên',
    },
  ],
  timestamps: true,
}

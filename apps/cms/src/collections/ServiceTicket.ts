import type { CollectionConfig } from 'payload'

export const ServiceTicket: CollectionConfig = {
  slug: 'service-ticket',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      required: true,
      label: 'Dịch vụ',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Người dùng',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Chờ xử lý', value: 'pending' },
        { label: 'Đang xử lý', value: 'processing' },
        { label: 'Đã hoàn thành', value: 'completed' },
        { label: 'Đã hủy', value: 'cancelled' },
      ],
      label: 'Trạng thái',
    },
    {
      name: 'responsible_user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Người chịu trách nhiệm chính',
    },
    {
      name: 'implementers',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: true,
      label: 'Người thực hiện',
    },
    // chọn 1 trong 2 technologies hoặc project
    {
      name: 'technologies',
      type: 'relationship',
      relationTo: 'technologies',
      hasMany: true,
      label: 'Công nghệ',
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'project',
      label: 'Dự án',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Mô tả',
    },
    {
      name: 'document',
      type: 'upload',
      relationTo: 'media',
      label: 'Tài liệu',
    },
  ],
  timestamps: true,
}

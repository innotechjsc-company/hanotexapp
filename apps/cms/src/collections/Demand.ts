import type { CollectionConfig } from 'payload'

export const Demand: CollectionConfig = {
  slug: 'demand',
  admin: {
    useAsTitle: 'title',
    group: 'Quản lý Yêu cầu dịch vụ',
    defaultColumns: ['title', 'trl_level', 'cooperation'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Tiêu đề',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Mô tả',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      label: 'Lĩnh vực',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Người yêu cầu',
    },
    {
      name: 'trl_level',
      type: 'number',
      required: true,
      label: 'TRL',
    },
    {
      name: 'option',
      type: 'textarea',
      label: 'Mô tả yêu cầu mong muốn',
    },
    {
      name: 'option_technology',
      type: 'textarea',
      label: 'Mô tả yêu cầu công nghệ',
    },
    {
      name: 'option_rule',
      type: 'textarea',
      label: 'Mô tả yêu cầu quy tắc',
    },
    {
      name: 'from_price',
      type: 'number',
      label: 'Giá từ',
    },
    {
      name: 'to_price',
      type: 'number',
      label: 'Giá đến',
    },
    {
      name: 'cooperation',
      type: 'text',
      label: 'Hình thức hợp tác',
    },
    {
      name: 'start_date',
      type: 'text',
      label: 'Thời gian dự kiến bắt đầu',
    },
    {
      name: 'end_date',
      type: 'text',
      label: 'Thời gian dự kiến kết thúc',
    },

    {
      name: 'documents',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      label: 'Tài liệu đính kèm',
    },
  ],
  timestamps: true,
}

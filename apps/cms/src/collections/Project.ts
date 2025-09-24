import { CollectionConfig } from 'payload'

export const Project: CollectionConfig = {
  slug: 'project',
  admin: {
    useAsTitle: 'name',
    group: 'Quản lý Dự án',
    defaultColumns: ['name', 'description', 'user'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Tên dự án',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Mô tả',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Người tạo',
    },
    {
      name: 'technology',
      type: 'relationship',
      relationTo: 'technologies',
      required: true,
      label: 'Công nghệ',
    },
    {
      name: 'investment_fund',
      type: 'relationship',
      relationTo: 'investment-fund',
      label: 'Quỹ đầu tư',
    },
    {
      name: 'status',
      type: 'select',
      options: ['pending', 'in_progress', 'completed', 'cancelled'],
      defaultValue: 'pending',
      label: 'Trạng thái',
    },
    {
      name: 'goal_money',
      type: 'number',
      label: 'Số tiền đầu tư kêu gọi',
    },
    {
      name: 'end_date',
      type: 'date',
      label: 'Ngày kết thúc',
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

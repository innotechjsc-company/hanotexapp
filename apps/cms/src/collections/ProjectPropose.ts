import { CollectionConfig } from 'payload'

export const ProjectPropose: CollectionConfig = {
  slug: 'project-propose',
  admin: {
    group: 'Đề xuất đầu tư dự án',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'project',
      required: true,
      label: 'Dự án',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Người gửi',
    },
    {
      name: 'investor_capacity',
      type: 'text',
      label: 'Năng lực NĐT',
    },
    {
      name: 'investment_amount',
      type: 'number',
      label: 'Số vốn đề xuất (Không được nhỏ hơn yêu cầu)',
    },
    {
      name: 'investment_ratio',
      type: 'number',
      label: 'Tỷ lệ sở hữu mong muốn',
    },
    {
      name: 'investment_type',
      type: 'textarea',
      label: 'Hình thức đầu tư',
    },
    {
      name: 'investment_benefits',
      type: 'text',
      label: 'Các lợi ích có thể mang lại',
    },
    {
      name: 'documents',
      type: 'upload',
      relationTo: 'media',
      label: 'Tài liệu',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Trạng thái',
      options: [
        'pending',
        'negotiating',
        'contact_signing',
        'contract_signed',
        'completed',
        'cancelled',
      ],
      defaultValue: 'pending',
      admin: {
        description: 'Trạng thái',
      },
    },
  ],
  timestamps: true,
}

import type { CollectionConfig } from 'payload'

export const ContractLogs: CollectionConfig = {
  slug: 'contract-logs',
  admin: {
    useAsTitle: 'content',
    group: 'Quản lý tiến độ hợp đồng',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'technology_propose',
      type: 'relationship',
      relationTo: 'technology-propose',
      required: true,
      label: 'Đề xuất đầu tư công nghệ',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Người gửi',
    },
    {
      name: 'content',
      type: 'text',
      required: true,
      label: 'Nội dung',
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
      options: ['pending', 'completed', 'cancelled'],
      defaultValue: 'pending',
      label: 'Trạng thái',
    },
  ],
  timestamps: true,
}

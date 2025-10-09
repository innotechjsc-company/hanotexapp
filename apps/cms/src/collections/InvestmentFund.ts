import type { CollectionConfig } from 'payload'

export const InvestmentFund: CollectionConfig = {
  slug: 'investment-fund',
  admin: {
    useAsTitle: 'name',
    group: '💰 Giao dịch & Đấu thầu',
    defaultColumns: ['name', 'description', 'user'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Ảnh đại diện',
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Tên quỹ đầu tư',
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
  ],
  timestamps: true,
}

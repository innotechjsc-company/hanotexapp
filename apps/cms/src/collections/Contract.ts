import type { CollectionConfig } from 'payload'

export const Contract: CollectionConfig = {
  slug: 'contract',
  admin: {
    group: 'Hợp đồng',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'user_a',
      type: 'relationship',
      required: true,
      relationTo: 'users',
      label: 'Bên A',
    },
    {
      name: 'user_b',
      type: 'relationship',
      required: true,
      relationTo: 'users',
      label: 'Bên B',
    },
    {
      name: 'technologies',
      type: 'relationship',
      required: true,
      relationTo: 'technologies',
      label: 'Công nghệ',
      hasMany: true,
    },
    {
      name: 'technology_propose',
      type: 'relationship',
      required: true,
      relationTo: 'technology-propose',
      label: 'Đề xuất công nghệ',
    },
    {
      name: 'offer',
      type: 'relationship',
      required: true,
      relationTo: 'offer',
      label: 'Đề xuất',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: 'Giá',
    },
    {
      name: 'contract_file',
      type: 'upload',
      relationTo: 'media',
      label: 'Tài liệu hợp đồng',
    },
    {
      name: 'documents',
      type: 'upload',
      relationTo: 'media',
      label: 'Tài liệu liên quan',
      hasMany: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Trạng thái',
      defaultValue: 'in_progress',
      options: ['signed', 'in_progress', 'completed', 'cancelled'],
    },
    {
      name: 'users_confirm',
      type: 'relationship',
      relationTo: 'users',
      label: 'Bên đã xác nhận',
      hasMany: true,
    },
  ],
  timestamps: true,
}

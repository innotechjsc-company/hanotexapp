import type { CollectionConfig } from 'payload'

export const TRL: CollectionConfig = {
  slug: 'trl',
  admin: {
    group: '🔬 Công nghệ & Dự án',
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
      label: 'Tên TRL',
    },
    {
      name: 'value',
      type: 'number',
      required: true,
      label: 'Giá trị TRL',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Mô tả dịch vụ',
    },
  ],
}

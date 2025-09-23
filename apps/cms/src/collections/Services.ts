import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
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
      label: 'Tên dịch vụ',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Mô tả dịch vụ',
    },
  ],
  timestamps: true,
}

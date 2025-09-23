import type { CollectionConfig } from 'payload'

export const ServiceTicketLog: CollectionConfig = {
  slug: 'service-ticket-log',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'service_ticket',
      type: 'relationship',
      relationTo: 'service-ticket',
      required: true,
      label: 'Dịch vụ',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Người tạo',
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: 'Mô tả',
    },
    {
      name: 'document',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Tài liệu',
    },
    {
      name: 'status',
      type: 'select',
      options: ['approved', 'rejected'],
      label: 'Trạng thái',
    },
    {
      name: 'reason',
      type: 'text',
      label: 'Lý do',
    },
  ],
  timestamps: true,
}

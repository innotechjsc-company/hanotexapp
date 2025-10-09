import type { CollectionConfig } from 'payload'

export const ServiceTicketLog: CollectionConfig = {
  slug: 'service-ticket-log',
  admin: {
    group: '🛠️ Dịch vụ',
  },
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
      options: ['pending', 'completed', 'cancelled'],
      defaultValue: 'pending',
      label: 'Trạng thái',
    },
    {
      name: 'reason',
      type: 'text',
      label: 'Lý do',
    },
    {
      name: 'is_done_service',
      type: 'checkbox',
      defaultValue: false,
      label: 'Xác nhận hoàn thành dịch vụ',
    },
  ],
  timestamps: true,
}

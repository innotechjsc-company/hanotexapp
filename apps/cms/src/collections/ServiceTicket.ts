import type { CollectionConfig } from 'payload'

export const ServiceTicket: CollectionConfig = {
  slug: 'service-ticket',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'service',
      type: 'relationship',
      relationTo: 'services',
      required: true,
      label: 'Dịch vụ',
    },
    {
        name: 'user',
        type: 'relationship',
        relationTo: 'users',
        required: true,
        label: 'Người dùng',
    },
    {
        name: 'status',
        type: 'select',
        required: true,
        options: [
            { label: 'Chờ xử lý', value: 'PENDING' },
            { label: 'Đang xử lý', value: 'PROCESSING' },
            { label: 'Đã hoàn thành', value: 'COMPLETED' },
        ],
        label: 'Trạng thái',
    },
		{
            name: 'implementer',
            type: 'text',
            required: true,
            label: 'Người thực hiện',
        },
		
	],
}

import type { CollectionConfig } from 'payload'

export const Offer: CollectionConfig = {
  slug: 'offer',
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'propose',
      label: 'Đề xuất',
      type: 'relationship',
      relationTo: 'propose',
    },
    {
      name: 'project_propose',
      label: 'Đề xuất dự án',
      type: 'relationship',
      relationTo: 'project-propose',
    },
    {
      name: 'technology_propose',
      label: 'Đề xuất công nghệ',
      type: 'relationship',
      relationTo: 'technology-propose',
    },
    {
      name: 'negotiating_messages',
      label: 'Tin nhắn đàm phán',
      type: 'relationship',
      relationTo: 'negotiating-messages',
      required: true,
    },
    {
      name: 'content',
      label: 'Nội dung',
      type: 'textarea',
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      label: 'Giá',
    },
    {
      name: 'status',
      type: 'select',
      options: ['pending', 'accepted', 'rejected'],
      label: 'Trạng thái',
      defaultValue: 'pending',
    },
  ],
  timestamps: true,
}

import type { CollectionConfig } from 'payload'

export const NegotiatingMessage: CollectionConfig = {
  slug: 'negotiating-messages',
  admin: {
    group: 'Tin nhắn đàm phán',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'propose',
      type: 'relationship',
      relationTo: 'propose',
      label: 'Đề xuất',
      admin: {
        description: 'Đề xuất',
      },
    },
    {
      name: 'technology_propose',
      type: 'relationship',
      relationTo: 'technology-propose',
      label: 'Đề xuất công nghệ',
      admin: {
        description: 'Đề xuất công nghệ',
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Người gửi',
      admin: {
        description: 'Người gửi',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Nội dung',
      admin: {
        description: 'Nội dung',
      },
    },
    {
      name: 'document',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Tài liệu đính kèm',
      admin: {
        description: 'Tài liệu đính kèm',
      },
    },
  ],
  timestamps: true,
}

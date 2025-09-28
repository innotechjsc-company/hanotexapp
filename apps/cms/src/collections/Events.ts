import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    group: 'Quản lý sự kiện',
    defaultColumns: ['title', 'start_date', 'end_date', 'location', 'status', 'url'],
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
      label: 'Tiêu đề',
    },
    {
      name: 'image',
      type: 'relationship',
      relationTo: 'media',
      required: true,
      label: 'Ảnh đại diện',
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: 'Nội dung',
    },
    {
      name: 'hashtags',
      type: 'text',
      label: 'Hashtags',
    },
    {
      name: 'document',
      type: 'relationship',
      relationTo: 'media',
      label: 'Tài liệu',
    },
    {
      name: 'start_date',
      type: 'date',
      required: true,
      label: 'Ngày bắt đầu',
    },
    {
      name: 'end_date',
      type: 'date',
      required: true,
      label: 'Ngày kết thúc',
    },
    {
      name: 'location',
      type: 'text',
      label: 'Địa điểm',
    },
    {
      name: 'status',
      type: 'select',
      options: ['pending', 'in_progress', 'completed', 'cancelled'],
      defaultValue: 'pending',
      required: true,
      label: 'Trạng thái',
    },
    {
      name: 'url',
      type: 'text',
      label: 'URL',
    },
  ],
  timestamps: true,
}

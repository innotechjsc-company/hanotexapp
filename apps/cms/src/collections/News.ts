import type { CollectionConfig } from 'payload'

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    group: 'Quản lý tin tức',
    defaultColumns: ['title', 'hashtags', 'document'],
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
      type: 'upload',
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
      type: 'upload',
      relationTo: 'media',
      label: 'Tài liệu',
    },
    {
      name: 'views',
      type: 'number',
      label: 'Lượt xem',
    },
    {
      name: 'likes',
      type: 'number',
      label: 'Lượt thích',
    },
    {
      name: 'isLiked',
      type: 'checkbox',
      label: 'Đã thích',
    },
  ],
  timestamps: true,
}

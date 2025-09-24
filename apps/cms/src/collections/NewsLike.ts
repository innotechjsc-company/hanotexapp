import type { CollectionConfig } from 'payload'

export const NewsLike: CollectionConfig = {
  slug: 'news-like',
  admin: {
    group: 'lượt thích tin tức',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'news',
      type: 'relationship',
      relationTo: 'news',
      required: true,
      label: 'Tin tức',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Người dùng',
    },
  ],
  timestamps: true,
}

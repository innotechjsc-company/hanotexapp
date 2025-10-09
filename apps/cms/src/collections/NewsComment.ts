import type { CollectionConfig } from 'payload'

export const NewsComment: CollectionConfig = {
  slug: 'news-comment',
  admin: {
    group: 'Bình luận sự kiện',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      required: true,
      relationTo: 'users',
      label: 'Người tham gia sự kiện',
    },
    {
      name: 'news',
      type: 'relationship',
      required: true,
      relationTo: 'news',
      label: 'Tin tức',
    },
    {
      name: 'comment',
      type: 'textarea',
      required: true,
      label: 'Bình luận',
    },
  ],
  timestamps: true,
}

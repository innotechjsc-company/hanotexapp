import type { CollectionConfig } from 'payload'

export const EventComment: CollectionConfig = {
  slug: 'event-comment',
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
      name: 'event',
      type: 'relationship',
      required: true,
      relationTo: 'events',
      label: 'Sự kiện',
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

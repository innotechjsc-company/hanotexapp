import type { CollectionConfig } from 'payload'

export const EventUser: CollectionConfig = {
  slug: 'event-user',
  admin: {
    group: '📰 Tin tức & Sự kiện',
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
  ],
  timestamps: true,
}

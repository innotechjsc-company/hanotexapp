import { CollectionConfig } from 'payload'

export const RoomUser: CollectionConfig = {
  slug: 'room-user',
  admin: {
    group: '💬 Truyền thông',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'room',
      type: 'relationship',
      relationTo: 'room-chat',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
  ],
  timestamps: true,
}

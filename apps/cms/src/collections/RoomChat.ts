import { CollectionConfig } from 'payload'

export const RoomChat: CollectionConfig = {
  slug: 'room-chat',
  admin: {
    useAsTitle: 'title',
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
      name: 'title',
      type: 'text',
      required: true,
    },
  ],
  timestamps: true,
}

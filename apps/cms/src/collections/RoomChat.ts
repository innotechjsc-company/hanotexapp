import { CollectionConfig } from 'payload'

export const RoomChat: CollectionConfig = {
  slug: 'room-chat',
  admin: {
    useAsTitle: 'title',
    group: 'Phòng chat',
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

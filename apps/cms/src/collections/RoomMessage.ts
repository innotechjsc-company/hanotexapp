import { CollectionConfig } from 'payload'

export const RoomMessage: CollectionConfig = {
  slug: 'room-message',
  admin: {
    useAsTitle: 'message',
    group: 'Phòng tin nhắn',
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
      label: 'Phòng chat',
      type: 'relationship',
      relationTo: 'room-chat',
      required: true,
    },
    {
      name: 'message',
      label: 'Tin nhắn',
      type: 'text',
    },
    {
      name: 'document',
      label: 'Tài liệu',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'user',
      label: 'Người gửi',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
  ],
  timestamps: true,
}

import type { CollectionConfig } from 'payload'

export const Notifications: CollectionConfig = {
  slug: 'notifications',
  admin: {
    useAsTitle: 'title',
    group: 'Communication',
    defaultColumns: ['title', 'user_id', 'type', 'is_read', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'user_id',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'User',
      admin: {
        description: 'The user who will receive this notification',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Notification Title',
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Message',
      admin: {
        description: 'The main notification message',
      },
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Success', value: 'success' },
        { label: 'Warning', value: 'warning' },
        { label: 'Error', value: 'error' },
        { label: 'Auction', value: 'auction' },
        { label: 'Transaction', value: 'transaction' },
        { label: 'Technology', value: 'technology' },
        { label: 'System', value: 'system' },
      ],
      label: 'Notification Type',
      admin: {
        description: 'Category of notification for styling and filtering',
      },
    },
    {
      name: 'is_read',
      type: 'checkbox',
      defaultValue: false,
      label: 'Mark as Read',
      admin: {
        description: 'Whether the user has read this notification',
      },
    },
    // Related entities
    {
      name: 'related_technology',
      type: 'relationship',
      relationTo: 'technologies',
      label: 'Related Technology',
      admin: {
        description: 'Technology related to this notification',
      },
    },
    {
      name: 'related_auction',
      type: 'relationship',
      relationTo: 'auctions',
      label: 'Related Auction',
      admin: {
        description: 'Auction related to this notification',
      },
    },
    {
      name: 'related_transaction',
      type: 'relationship',
      relationTo: 'transactions',
      label: 'Related Transaction',
      admin: {
        description: 'Transaction related to this notification',
      },
    },
    // Action URL for clickable notifications
    {
      name: 'action_url',
      type: 'text',
      label: 'Action URL',
      admin: {
        description: 'URL to navigate to when notification is clicked',
      },
    },
    // Priority level
    {
      name: 'priority',
      type: 'select',
      defaultValue: 'normal',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Normal', value: 'normal' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
      label: 'Priority Level',
    },
  ],
  timestamps: true,
}
import type { CollectionConfig } from 'payload'

export const Transactions: CollectionConfig = {
  slug: 'transactions',
  admin: {
    useAsTitle: 'id',
    group: 'Transaction Management',
    defaultColumns: ['technology_id', 'buyer_id', 'seller_id', 'amount', 'status'],
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'technology',
      type: 'relationship',
      relationTo: 'technologies',
      label: 'Technology',
      admin: {
        description: 'The technology involved in this transaction',
      },
    },
    {
      name: 'buyer',
      type: 'relationship',
      relationTo: 'users',
      label: 'Buyer',
      admin: {
        description: 'User who is purchasing',
      },
    },
    {
      name: 'seller',
      type: 'relationship',
      relationTo: 'users',
      label: 'Seller',
      admin: {
        description: 'User who is selling',
      },
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      min: 0,
      label: 'Transaction Amount',
    },
    {
      name: 'currency',
      type: 'select',
      required: true,
      defaultValue: 'VND',
      options: [
        { label: 'Vietnamese Dong (VND)', value: 'VND' },
        { label: 'US Dollar (USD)', value: 'USD' },
        { label: 'Euro (EUR)', value: 'EUR' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'PENDING',
      options: [
        { label: 'Pending', value: 'PENDING' },
        { label: 'Completed', value: 'COMPLETED' },
        { label: 'Failed', value: 'FAILED' },
        { label: 'Refunded', value: 'REFUNDED' },
      ],
    },
    {
      name: 'payment_method',
      type: 'text',
      label: 'Payment Method',
      admin: {
        description: 'Method used for payment (e.g., bank transfer, credit card)',
      },
    },
    {
      name: 'transaction_fee',
      type: 'number',
      label: 'Transaction Fee',
      min: 0,
      admin: {
        description: 'Fee charged for processing this transaction',
      },
    },
    {
      name: 'completed_at',
      type: 'date',
      label: 'Completion Date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Date and time when transaction was completed',
      },
    },
    // Transaction Notes
    {
      name: 'notes',
      type: 'textarea',
      label: 'Transaction Notes',
      admin: {
        description: 'Internal notes about this transaction',
      },
    },
    // Related auction if applicable
    {
      name: 'auction',
      type: 'relationship',
      relationTo: 'auctions',
      label: 'Related Auction',
      admin: {
        description: 'If this transaction resulted from an auction',
      },
    },
  ],
  timestamps: true,
}

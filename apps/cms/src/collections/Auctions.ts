import type { CollectionConfig } from 'payload'

export const Auctions: CollectionConfig = {
  slug: 'auctions',
  admin: {
    useAsTitle: 'id',
    group: 'Auction Management',
    defaultColumns: ['technology_id', 'auction_type', 'status', 'current_price', 'end_time'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'technology_id',
      type: 'relationship',
      relationTo: 'technologies',
      required: true,
      label: 'Technology',
      admin: {
        description: 'The technology being auctioned',
      },
    },
    {
      name: 'auction_type',
      type: 'select',
      required: true,
      options: [
        { label: 'English Auction', value: 'ENGLISH' },
        { label: 'Dutch Auction', value: 'DUTCH' },
        { label: 'Sealed Bid', value: 'SEALED_BID' },
      ],
    },
    {
      name: 'start_price',
      type: 'number',
      label: 'Starting Price',
      min: 0,
      admin: {
        description: 'Initial price for the auction',
      },
    },
    {
      name: 'reserve_price',
      type: 'number',
      label: 'Reserve Price',
      min: 0,
      admin: {
        description: 'Minimum acceptable price',
      },
    },
    {
      name: 'current_price',
      type: 'number',
      label: 'Current Price',
      min: 0,
      admin: {
        description: 'Current highest bid',
        readOnly: true,
      },
    },
    {
      name: 'start_time',
      type: 'date',
      label: 'Start Time',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'end_time',
      type: 'date',
      label: 'End Time',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'SCHEDULED',
      options: [
        { label: 'Scheduled', value: 'SCHEDULED' },
        { label: 'Active', value: 'ACTIVE' },
        { label: 'Ended', value: 'ENDED' },
        { label: 'Cancelled', value: 'CANCELLED' },
      ],
    },
    // Related Bids
    {
      name: 'bids',
      type: 'relationship',
      relationTo: 'bids',
      hasMany: true,
      label: 'Auction Bids',
      admin: {
        readOnly: true,
        description: 'All bids placed on this auction',
      },
    },
  ],
  timestamps: true,
}
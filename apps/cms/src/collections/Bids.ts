import type { CollectionConfig } from 'payload'

export const Bids: CollectionConfig = {
  slug: 'bids',
  admin: {
    useAsTitle: 'id',
    group: 'Auction Management',
    defaultColumns: ['auction_id', 'bidder_id', 'bid_amount', 'bid_time', 'is_winning'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'auction',
      type: 'relationship',
      relationTo: 'auctions',
      required: true,
      label: 'Auction',
    },
    {
      name: 'bidder',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Bidder',
    },
    {
      name: 'bid_amount',
      type: 'number',
      required: true,
      min: 0,
      label: 'Bid Amount',
    },
    {
      name: 'bid_time',
      type: 'date',
      required: true,
      label: 'Bid Time',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'is_winning',
      type: 'checkbox',
      defaultValue: false,
      label: 'Is Winning Bid',
      admin: {
        description: 'Indicates if this is currently the winning bid',
      },
    },
  ],
  timestamps: true,
}

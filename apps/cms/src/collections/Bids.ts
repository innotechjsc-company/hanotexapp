import type { CollectionConfig } from 'payload'

export const Bids: CollectionConfig = {
  slug: 'bids',
  admin: {
    useAsTitle: 'id',
    group: 'Quản lý Đấu giá',
    defaultColumns: ['auction_id', 'bidder_id', 'bid_amount', 'bid_time', 'is_winning'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'auction',
      type: 'relationship',
      relationTo: 'auctions',
      required: true,
      label: 'Phiên đấu giá',
    },
    {
      name: 'bidder',
      type: 'text',
      required: true,
      label: 'Người đặt giá',
    },
    {
      name: 'bid_amount',
      type: 'number',
      required: true,
      min: 0,
      label: 'Số tiền đặt giá',
    },
    {
      name: 'bid_time',
      type: 'date',
      required: true,
      label: 'Thời gian đặt giá',
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
      label: 'Là lượt đặt giá thắng',
      admin: {
        description: 'Cho biết đây có phải là lượt đặt giá thắng hiện tại không',
      },
    },
  ],
  timestamps: true,
}

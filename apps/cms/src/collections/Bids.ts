import type { CollectionConfig } from 'payload'

export const Bids: CollectionConfig = {
  slug: 'bids',
  admin: {
    useAsTitle: 'id',
    group: '💰 Giao dịch & Đấu thầu',
    defaultColumns: ['auction', 'bidder', 'bid_amount', 'bid_time', 'is_winning'],
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
      label: 'ID người đặt giá',
    },
    {
      name: 'bidder_name',
      type: 'text',
      label: 'Tên người đặt giá',
    },
    {
      name: 'bidder_email',
      type: 'email',
      label: 'Email người đặt giá',
    },
    {
      name: 'bid_amount',
      type: 'number',
      required: true,
      min: 0,
      label: 'Số tiền đặt giá',
    },
    {
      name: 'currency',
      type: 'select',
      options: [
        { label: 'VND', value: 'VND' },
        { label: 'USD', value: 'USD' },
        { label: 'EUR', value: 'EUR' },
      ],
      defaultValue: 'VND',
      label: 'Đơn vị tiền tệ',
    },
    {
      name: 'bid_type',
      type: 'select',
      options: [
        { label: 'Thủ công', value: 'MANUAL' },
        { label: 'Tự động', value: 'AUTOMATIC' },
      ],
      defaultValue: 'MANUAL',
      label: 'Loại đấu giá',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Hoạt động', value: 'ACTIVE' },
        { label: 'Bị hủy', value: 'CANCELLED' },
        { label: 'Đã thắng', value: 'WON' },
        { label: 'Đã thua', value: 'LOST' },
      ],
      defaultValue: 'ACTIVE',
      label: 'Trạng thái',
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

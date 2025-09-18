import type { CollectionConfig } from 'payload'

export const Auctions: CollectionConfig = {
  slug: 'auctions',
  admin: {
    useAsTitle: 'id',
    group: 'Quản lý Đấu giá',
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
      name: 'technology',
      type: 'relationship',
      relationTo: 'technologies',
      required: true,
      label: 'Công nghệ',
      admin: {
        description: 'Công nghệ được đấu giá',
      },
    },
    {
      name: 'auction_type',
      type: 'select',
      required: true,
      options: [
        { label: 'Đấu giá kiểu Anh', value: 'ENGLISH' },
        { label: 'Đấu giá kiểu Hà Lan', value: 'DUTCH' },
        { label: 'Chào giá kín', value: 'SEALED_BID' },
      ],
    },
    {
      name: 'start_price',
      type: 'number',
      label: 'Giá khởi điểm',
      min: 0,
      admin: {
        description: 'Giá ban đầu cho phiên đấu giá',
      },
    },
    {
      name: 'reserve_price',
      type: 'number',
      label: 'Giá sàn',
      min: 0,
      admin: {
        description: 'Giá tối thiểu chấp nhận được',
      },
    },
    {
      name: 'current_price',
      type: 'number',
      label: 'Giá hiện tại',
      min: 0,
      admin: {
        description: 'Lượt đặt giá cao nhất hiện tại',
        readOnly: true,
      },
    },
    {
      name: 'start_time',
      type: 'date',
      label: 'Thời gian bắt đầu',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'end_time',
      type: 'date',
      label: 'Thời gian kết thúc',
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
        { label: 'Đã lên lịch', value: 'SCHEDULED' },
        { label: 'Đang hoạt động', value: 'ACTIVE' },
        { label: 'Đã kết thúc', value: 'ENDED' },
        { label: 'Đã hủy', value: 'CANCELLED' },
      ],
    },
    // Related Bids
    {
      name: 'bids',
      type: 'relationship',
      relationTo: 'bids',
      hasMany: true,
      label: 'Các lượt đặt giá đấu giá',
      admin: {
        readOnly: true,
        description: 'Tất cả các lượt đặt giá cho phiên đấu giá này',
      },
    },
  ],
  timestamps: true,
}

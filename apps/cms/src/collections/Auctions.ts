import { CollectionConfig } from 'payload'

export const Auctions: CollectionConfig = {
  slug: 'auctions',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'currentBid', 'endTime', 'status'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Tiêu đề đấu giá',
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      label: 'Mô tả chi tiết',
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Công nghệ thông tin', value: 'it' },
        { label: 'Công nghệ sinh học', value: 'biotech' },
        { label: 'Công nghệ năng lượng', value: 'energy' },
        { label: 'Công nghệ vật liệu', value: 'materials' },
        { label: 'Công nghệ y tế', value: 'medical' },
        { label: 'Công nghệ nông nghiệp', value: 'agriculture' },
      ],
      defaultValue: 'it',
      label: 'Danh mục',
    },
    {
      name: 'startingPrice',
      type: 'number',
      required: true,
      min: 0,
      label: 'Giá khởi điểm (VNĐ)',
    },
    {
      name: 'currentBid',
      type: 'number',
      min: 0,
      label: 'Giá hiện tại (VNĐ)',
    },
    {
      name: 'minBid',
      type: 'number',
      min: 0,
      label: 'Giá đấu giá tối thiểu (VNĐ)',
    },
    {
      name: 'bidIncrement',
      type: 'number',
      min: 1000,
      defaultValue: 100000,
      label: 'Bước nhảy đấu giá (VNĐ)',
    },
    {
      name: 'startTime',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      label: 'Thời gian bắt đầu',
    },
    {
      name: 'endTime',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      label: 'Thời gian kết thúc',
    },
    {
      name: 'location',
      type: 'text',
      label: 'Địa điểm',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Hình ảnh',
    },
    {
      name: 'organizer',
      type: 'group',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Tên người tổ chức',
        },
        {
          name: 'email',
          type: 'email',
          required: true,
          label: 'Email',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Số điện thoại',
        },
      ],
      label: 'Thông tin người tổ chức',
    },
    {
      name: 'documents',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Tên tài liệu',
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'File tài liệu',
        },
        {
          name: 'description',
          type: 'text',
          label: 'Mô tả',
        },
      ],
      label: 'Tài liệu đính kèm',
    },
    {
      name: 'terms',
      type: 'array',
      fields: [
        {
          name: 'term',
          type: 'text',
          required: true,
          label: 'Điều khoản',
        },
      ],
      label: 'Điều khoản đấu giá',
    },
    {
      name: 'bids',
      type: 'array',
      fields: [
        {
          name: 'amount',
          type: 'number',
          required: true,
          label: 'Số tiền đấu giá',
        },
        {
          name: 'bidder',
          type: 'text',
          required: true,
          label: 'Người đấu giá',
        },
        {
          name: 'timestamp',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
          label: 'Thời gian đấu giá',
        },
        {
          name: 'isWinning',
          type: 'checkbox',
          defaultValue: false,
          label: 'Đang thắng cuộc',
        },
      ],
      label: 'Lịch sử đấu giá',
    },
    {
      name: 'autoBids',
      type: 'array',
      fields: [
        {
          name: 'maxAmount',
          type: 'number',
          required: true,
          label: 'Số tiền tối đa',
        },
        {
          name: 'bidder',
          type: 'text',
          required: true,
          label: 'Người đấu giá',
        },
        {
          name: 'createdAt',
          type: 'date',
          required: true,
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
          label: 'Thời gian tạo',
        },
        {
          name: 'isActive',
          type: 'checkbox',
          defaultValue: true,
          label: 'Đang hoạt động',
        },
      ],
      label: 'Đấu giá tự động',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Sắp diễn ra', value: 'upcoming' },
        { label: 'Đang diễn ra', value: 'active' },
        { label: 'Đã kết thúc', value: 'ended' },
        { label: 'Đã hủy', value: 'cancelled' },
      ],
      defaultValue: 'upcoming',
      label: 'Trạng thái',
    },
    {
      name: 'viewers',
      type: 'number',
      defaultValue: 0,
      label: 'Số người xem',
    },
    {
      name: 'bidCount',
      type: 'number',
      defaultValue: 0,
      label: 'Số lượt đấu giá',
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-update currentBid if not set
        if (!data.currentBid && data.startingPrice) {
          data.currentBid = data.startingPrice
        }

        // Auto-update minBid if not set
        if (!data.minBid && data.currentBid) {
          data.minBid = data.currentBid + (data.bidIncrement || 100000)
        }

        // Auto-update status based on time
        const now = new Date()
        const startTime = new Date(data.startTime)
        const endTime = new Date(data.endTime)

        if (now < startTime) {
          data.status = 'upcoming'
        } else if (now >= startTime && now < endTime) {
          data.status = 'active'
        } else if (now >= endTime) {
          data.status = 'ended'
        }

        return data
      },
    ],
  },
}

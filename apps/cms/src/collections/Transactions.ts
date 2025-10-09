import type { CollectionConfig } from 'payload'

export const Transactions: CollectionConfig = {
  slug: 'transactions',
  admin: {
    useAsTitle: 'id',
    group: '💰 Giao dịch & Đấu thầu',
    defaultColumns: ['technology_id', 'buyer_id', 'seller_id', 'amount', 'status'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'technology',
      type: 'relationship',
      relationTo: 'technologies',
      label: 'Công nghệ',
      admin: {
        description: 'Công nghệ liên quan đến giao dịch này',
      },
    },
    {
      name: 'buyer',
      type: 'relationship',
      relationTo: 'users',
      label: 'Người mua',
      admin: {
        description: 'Người dùng thực hiện giao dịch mua',
      },
    },
    {
      name: 'seller',
      type: 'relationship',
      relationTo: 'users',
      label: 'Người bán',
      admin: {
        description: 'Người dùng thực hiện giao dịch bán',
      },
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      min: 0,
      label: 'Số tiền giao dịch',
    },
    {
      name: 'currency',
      type: 'select',
      required: true,
      defaultValue: 'VND',
      options: [
        { label: 'Đồng Việt Nam (VND)', value: 'VND' },
        { label: 'Đô la Mỹ (USD)', value: 'USD' },
        { label: 'Euro (EUR)', value: 'EUR' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'PENDING',
      options: [
        { label: 'Đang chờ', value: 'PENDING' },
        { label: 'Đã hoàn thành', value: 'COMPLETED' },
        { label: 'Thất bại', value: 'FAILED' },
        { label: 'Đã hoàn tiền', value: 'REFUNDED' },
      ],
    },
    {
      name: 'payment_method',
      type: 'text',
      label: 'Phương thức thanh toán',
      admin: {
        description:
          'Phương thức được sử dụng để thanh toán (ví dụ: chuyển khoản ngân hàng, thẻ tín dụng)',
      },
    },
    {
      name: 'transaction_fee',
      type: 'number',
      label: 'Phí giao dịch',
      min: 0,
      admin: {
        description: 'Phí được tính để xử lý giao dịch này',
      },
    },
    {
      name: 'completed_at',
      type: 'date',
      label: 'Ngày hoàn thành',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Ngày và giờ khi giao dịch được hoàn thành',
      },
    },
    // Transaction Notes
    {
      name: 'notes',
      type: 'textarea',
      label: 'Ghi chú giao dịch',
      admin: {
        description: 'Ghi chú nội bộ về giao dịch này',
      },
    },
    // Related auction if applicable
    {
      name: 'auction',
      type: 'relationship',
      relationTo: 'auctions',
      label: 'Phiên đấu giá liên quan',
      admin: {
        description: 'Nếu giao dịch này phát sinh từ một phiên đấu giá',
      },
    },
  ],
  timestamps: true,
}

import type { CollectionConfig } from 'payload'

export const IntellectualProperty: CollectionConfig = {
  slug: 'intellectual_property',
  admin: {
    useAsTitle: 'title',
    group: 'Quản lý sở hữu trí tuệ',
    defaultColumns: ['title', 'type', 'status'],
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
      label: 'Sản phẩm khoa học/công nghệ',
      admin: {
        description: 'Sản phẩm khoa học/công nghệ',
      },
    },
    {
      name: 'code',
      type: 'text',
      label: 'Số đơn/số bằng',
      admin: {
        description: 'Số đơn/số bằng',
      },
      required: true,
      unique: true,
    },
    {
      name: 'type',
      type: 'select',
      label: 'Loại sở hữu trí tuệ',
      options: [
        { label: 'Sáng chế (Patent)', value: 'patent' },
        { label: 'Giải pháp hữu ích', value: 'utility_solution' },
        { label: 'Kiểu dáng công nghiệp', value: 'industrial_design' },
        { label: 'Nhãn hiệu', value: 'trademark' },
        { label: 'Quyền tác giả', value: 'copyright' },
        { label: 'Bí mật kinh doanh', value: 'trade_secret' },
      ],
      admin: {
        description: 'Loại sở hữu trí tuệ',
      },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Tình trạng',
      options: [
        { label: 'Đang nộp', value: 'pending' },
        { label: 'Đã được cấp', value: 'granted' },
        { label: 'Hết hiệu lực', value: 'expired' },
        { label: 'Bị từ chối', value: 'rejected' },
      ],
      admin: {
        description: 'Tình trạng sở hữu trí tuệ',
      },
    },
  ],
  timestamps: true,
}

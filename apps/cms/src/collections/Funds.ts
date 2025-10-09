import { CollectionConfig } from 'payload'

export const Funds: CollectionConfig = {
  slug: 'funds',
  admin: {
    useAsTitle: 'name',
    group: '💰 Giao dịch & Đấu thầu',
    defaultColumns: ['name', 'type', 'size', 'status', 'createdAt'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Tên quỹ',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Mô tả',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Quỹ đầu tư mạo hiểm', value: 'venture_capital' },
        { label: 'Quỹ đầu tư tư nhân', value: 'private_equity' },
        { label: 'Quỹ đầu tư công nghệ', value: 'tech_fund' },
        { label: 'Quỹ tăng trưởng', value: 'growth_fund' },
        { label: 'Quỹ đầu tư xanh', value: 'green_fund' },
        { label: 'Quỹ đầu tư xã hội', value: 'social_fund' },
        { label: 'Quỹ đầu tư nhà nước', value: 'government_fund' },
        { label: 'Khác', value: 'other' },
      ],
      label: 'Loại quỹ',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
    },
    {
      name: 'website',
      type: 'text',
      label: 'Website',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email liên hệ',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Số điện thoại',
    },
    {
      name: 'size',
      type: 'select',
      required: true,
      options: [
        { label: 'Dưới 10 tỷ VNĐ', value: 'small' },
        { label: '10-50 tỷ VNĐ', value: 'medium' },
        { label: '50-200 tỷ VNĐ', value: 'large' },
        { label: '200-500 tỷ VNĐ', value: 'very_large' },
        { label: 'Trên 500 tỷ VNĐ', value: 'mega' },
      ],
      label: 'Quy mô quỹ',
    },
    {
      name: 'total_size',
      type: 'number',
      label: 'Tổng quy mô (VNĐ)',
    },
    {
      name: 'focus',
      type: 'array',
      fields: [
        {
          name: 'sector',
          type: 'text',
          required: true,
          label: 'Lĩnh vực đầu tư',
        },
      ],
      label: 'Lĩnh vực tập trung',
    },
    {
      name: 'investment_stage',
      type: 'array',
      fields: [
        {
          name: 'stage',
          type: 'select',
          options: [
            { label: 'Pre-seed', value: 'pre_seed' },
            { label: 'Seed', value: 'seed' },
            { label: 'Series A', value: 'series_a' },
            { label: 'Series B', value: 'series_b' },
            { label: 'Series C+', value: 'series_c_plus' },
            { label: 'Growth', value: 'growth' },
            { label: 'Late Stage', value: 'late_stage' },
          ],
          required: true,
          label: 'Giai đoạn đầu tư',
        },
      ],
      label: 'Giai đoạn đầu tư',
    },
    {
      name: 'investment_range',
      type: 'group',
      fields: [
        {
          name: 'min',
          type: 'number',
          label: 'Số tiền đầu tư tối thiểu (VNĐ)',
        },
        {
          name: 'max',
          type: 'number',
          label: 'Số tiền đầu tư tối đa (VNĐ)',
        },
      ],
      label: 'Khoảng đầu tư',
    },
    {
      name: 'portfolio',
      type: 'array',
      fields: [
        {
          name: 'company_name',
          type: 'text',
          required: true,
          label: 'Tên công ty',
        },
        {
          name: 'description',
          type: 'text',
          label: 'Mô tả',
        },
        {
          name: 'investment_amount',
          type: 'number',
          label: 'Số tiền đầu tư (VNĐ)',
        },
        {
          name: 'investment_date',
          type: 'date',
          label: 'Ngày đầu tư',
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Đang đầu tư', value: 'active' },
            { label: 'Đã thoái vốn', value: 'exited' },
            { label: 'Thất bại', value: 'failed' },
          ],
          defaultValue: 'active',
          label: 'Trạng thái',
        },
      ],
      label: 'Danh mục đầu tư',
    },
    {
      name: 'team',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Tên thành viên',
        },
        {
          name: 'position',
          type: 'text',
          required: true,
          label: 'Vị trí',
        },
        {
          name: 'bio',
          type: 'text',
          label: 'Tiểu sử',
        },
        {
          name: 'linkedin',
          type: 'text',
          label: 'LinkedIn',
        },
      ],
      label: 'Đội ngũ',
    },
    {
      name: 'location',
      type: 'group',
      fields: [
        {
          name: 'address',
          type: 'text',
          label: 'Địa chỉ',
        },
        {
          name: 'city',
          type: 'text',
          label: 'Thành phố',
        },
        {
          name: 'country',
          type: 'text',
          label: 'Quốc gia',
        },
      ],
      label: 'Địa chỉ',
    },
    {
      name: 'founded',
      type: 'date',
      label: 'Năm thành lập',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Đang hoạt động', value: 'active' },
        { label: 'Đang gọi vốn', value: 'fundraising' },
        { label: 'Đã đóng', value: 'closed' },
        { label: 'Tạm dừng', value: 'paused' },
      ],
      defaultValue: 'active',
      label: 'Trạng thái',
    },
    {
      name: 'contact_person',
      type: 'group',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Tên người liên hệ',
        },
        {
          name: 'position',
          type: 'text',
          label: 'Chức vụ',
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Số điện thoại',
        },
      ],
      label: 'Người liên hệ',
    },
    {
      name: 'social_media',
      type: 'group',
      fields: [
        {
          name: 'linkedin',
          type: 'text',
          label: 'LinkedIn',
        },
        {
          name: 'twitter',
          type: 'text',
          label: 'Twitter',
        },
        {
          name: 'facebook',
          type: 'text',
          label: 'Facebook',
        },
      ],
      label: 'Mạng xã hội',
    },
    {
      name: 'is_verified',
      type: 'checkbox',
      defaultValue: false,
      label: 'Đã xác thực',
    },
    {
      name: 'is_active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Đang hoạt động',
    },
  ],
}

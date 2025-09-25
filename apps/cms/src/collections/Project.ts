import { CollectionConfig } from 'payload'

export const Project: CollectionConfig = {
  slug: 'project',
  admin: {
    useAsTitle: 'name',
    group: 'Quản lý Dự án',
    defaultColumns: ['name', 'description', 'status', 'end_date', 'user'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    // Thông tin dự án
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Tên dự án',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Mô tả',
    },
    {
      name: 'business_model',
      type: 'textarea',
      label: 'Mô hình kinh doanh',
    },
    {
      name: 'market_data',
      type: 'textarea',
      label: 'Số liệu và thị trường',
    },

    //Thông tin pháp lý và pháp nhân
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Người tạo',
    },
    {
      name: 'technologies',
      type: 'relationship',
      relationTo: 'technologies',
      hasMany: true,
      required: true,
      label: 'Công nghệ',
    },
    // quỹ đầu tư
    {
      name: 'investment_fund',
      type: 'relationship',
      relationTo: 'investment-fund',
      hasMany: true,
      label: 'Quỹ đầu tư',
    },

    // Thông tin tài chính
    {
      name: 'revenue',
      type: 'number',
      label: 'Doanh thu',
    },
    {
      name: 'profit',
      type: 'number',
      label: 'Lợi nhuận',
    },
    {
      name: 'assets',
      type: 'number',
      label: 'Tài sản',
    },
    {
      name: 'documents_finance',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      label: 'Tài liệu tài chính',
    },
    // Profile đội ngũ
    {
      name: 'team_profile',
      type: 'textarea',
      label: 'Profile đội ngũ',
    },
    //Thông tin kêu gọi
    {
      name: 'goal_money',
      type: 'number',
      label: 'Số vốn kêu gọi',
    },
    {
      name: 'share_percentage',
      type: 'number',
      label: 'Tỉ lệ cổ phần',
    },
    {
      name: 'goal_money_purpose',
      type: 'textarea',
      label: 'Mục đích kêu gọi và tỉ lệ phân bổ chi tiết',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Trạng thái',
      options: ['pending', 'active', 'rejected'],
      defaultValue: 'pending',
      admin: {
        description: 'Trạng thái',
      },
    },
    {
      name: 'open_investment_fund',
      type: 'checkbox',
      label: 'Mở kêu gọi đầu tư',
      defaultValue: false,
    },
    {
      name: 'end_date',
      type: 'date',
      required: true,
      label: 'Ngày kết thúc',
    },
  ],
  timestamps: true,
}

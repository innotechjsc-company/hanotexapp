import type { CollectionConfig } from 'payload'

export const Technologies: CollectionConfig = {
  slug: 'technologies',
  admin: {
    useAsTitle: 'title',
    group: 'Quản lý Công nghệ',
    defaultColumns: ['title', 'status', 'trl_level', 'submitter_id'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Tiêu đề Công nghệ',
    },
    {
      name: 'documents',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      label: 'Tài liệu chứng minh',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Lĩnh vực',
    },
    {
      name: 'trl_level',
      type: 'number',
      required: true,
      min: 1,
      max: 9,
      label: 'Mức TRL',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Tóm tắt công khai',
    },
    {
      name: 'confidential_detail',
      type: 'textarea',
      label: 'Chi tiết Bảo mật',
      admin: {
        description: 'Thông tin chi tiết chỉ dành cho người dùng được ủy quyền',
      },
    },
    // Chủ sở hữu công nghệ
    {
      name: 'owners',
      type: 'array',
      label: 'Chủ sở hữu Công nghệ',
      fields: [
        {
          name: 'owner_type',
          type: 'select',
          required: true,
          options: [
            { label: 'Cá nhân', value: 'individual' },
            { label: 'Công ty', value: 'company' },
            { label: 'Viện/Trường', value: 'research_institution' },
          ],
        },
        {
          name: 'owner_name',
          type: 'text',
          required: true,
          label: 'Tên Chủ sở hữu',
        },
        {
          name: 'ownership_percentage',
          type: 'number',
          required: true,
          min: 0,
          max: 100,
          admin: {
            description: 'Tỷ lệ sở hữu (0-100)',
          },
        },
      ],
    },
    // Sở hữu trí tuệ (Bảng Intellectual Property)

    // Pháp lý & Lãnh thổ
    {
      name: 'legal_certification',
      type: 'group',
      label: 'Pháp lý & Lãnh thổ',
      fields: [
        {
          name: 'protection_scope',
          type: 'array',
          label: 'Phạm vi Bảo hộ',
          fields: [
            {
              name: 'scope',
              type: 'text',
              label: 'Phạm vi',
            },
          ],
        },
        {
          name: 'standard_certifications',
          type: 'array',
          label: 'Chứng nhận Tiêu chuẩn',
          fields: [
            {
              name: 'certification',
              type: 'text',
              label: 'Chứng nhận',
            },
          ],
        },
        {
          name: 'files',
          type: 'upload',
          relationTo: 'media',
          label: 'File chứng nhận',
          hasMany: true,
        },
      ],
    },
    // Mong muốn đầu tư
    {
      name: 'investment_desire',
      type: 'array',
      label: 'Mong muốn đầu tư & Hình thức chuyển giao',
      fields: [
        {
          name: 'investment_option',
          type: 'text',
          label: 'Mong muốn đầu tư & Hình thức chuyển giao',
        },
      ],
    },
    // Hình thức chuyển giao
    {
      name: 'transfer_type',
      type: 'array',
      label: 'Hình thức chuyển giao',
      fields: [
        {
          name: 'transfer_option',
          type: 'text',
          label: 'Hình thức chuyển giao',
        },
      ],
    },
    // Pricing Information
    {
      name: 'pricing',
      type: 'group',
      label: 'Thông tin Định giá',
      fields: [
        {
          name: 'pricing_type',
          type: 'select',
          required: true,
          options: [
            { label: 'Grant/Seed (TRL 1–3)', value: 'grant_seed' },
            { label: 'VC/Joint Venture (TRL 4–6)', value: 'vc_joint_venture' },
            { label: 'Growth/Strategic (TRL 7–9)', value: 'growth_strategic' },
          ],
        },
        {
          name: 'price_from',
          type: 'number',
          required: true,
          label: 'Giá từ',
        },
        {
          name: 'price_to',
          type: 'number',
          required: true,
          label: 'Giá đến',
        },
        {
          name: 'currency',
          type: 'select',
          required: true,
          defaultValue: 'vnd',
          options: [
            { label: 'Đồng Việt Nam (VND)', value: 'vnd' },
            { label: 'Đô la Mỹ (USD)', value: 'usd' },
            { label: 'Euro (EUR)', value: 'eur' },
          ],
        },
      ],
    },
    // Additional Data
    {
      name: 'additional_data',
      type: 'group',
      label: 'Dữ liệu bổ sung',
      fields: [
        {
          name: 'test_results',
          type: 'richText',
          label: 'Kết quả kiểm tra',
        },
        {
          name: 'economic_social_impact',
          type: 'richText',
          label: 'Tác động kinh tế & xã hội',
        },
        {
          name: 'financial_support_info',
          type: 'richText',
          label: 'Thông tin hỗ trợ tài chính',
        },
      ],
    },
    {
      name: 'submitter',
      type: 'relationship',
      relationTo: 'users',
      label: 'Người đăng tải',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Bản nháp', value: 'draft' },
        { label: 'Đang chờ duyệt', value: 'pending' },
        { label: 'Đã duyệt', value: 'approved' },
        { label: 'Từ chối', value: 'rejected' },
        { label: 'Hoạt động', value: 'active' },
        { label: 'Không hoạt động', value: 'inactive' },
      ],
    },
    {
      name: 'visibility_mode',
      type: 'select',
      defaultValue: 'public',
      options: [
        { label: 'Công khai', value: 'public' },
        { label: 'Riêng tư', value: 'private' },
        { label: 'Hạn chế', value: 'restricted' },
      ],
    },
  ],
  timestamps: true,
}

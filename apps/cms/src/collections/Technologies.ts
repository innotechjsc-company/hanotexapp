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
      name: 'confidential_detail',
      type: 'textarea',
      label: 'Chi tiết Bảo mật',
      admin: {
        description: 'Thông tin chi tiết chỉ dành cho người dùng được ủy quyền',
      },
    },
    {
      name: 'trl_level',
      type: 'relationship',
      required: true,
      relationTo: 'trl',
      label: 'Mức TRL',
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
      defaultValue: 'DRAFT',
      options: [
        { label: 'Bản nháp', value: 'DRAFT' },
        { label: 'Đang chờ duyệt', value: 'PENDING' },
        { label: 'Đã duyệt', value: 'APPROVED' },
        { label: 'Từ chối', value: 'REJECTED' },
        { label: 'Hoạt động', value: 'ACTIVE' },
        { label: 'Không hoạt động', value: 'INACTIVE' },
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
    // Technology Owners
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
            { label: 'Cá nhân', value: 'INDIVIDUAL' },
            { label: 'Công ty', value: 'COMPANY' },
            { label: 'Viện nghiên cứu', value: 'RESEARCH_INSTITUTION' },
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
    // Legal Certification
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
          name: 'local_certification_url',
          type: 'text',
          label: 'File chứng nhận',
        },
      ],
    },
    // Mong muốn đầu tư & Hình thức chuyển giao
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
            { label: 'Grant/Seed (TRL 1–3)', value: 'GRANT_SEED' },
            { label: 'VC/Joint Venture (TRL 4–6)', value: 'VC_JOINT_VENTURE' },
            { label: 'Growth/Strategic (TRL 7–9)', value: 'GROWTH_STRATEGIC' },
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
          defaultValue: 'VND',
          options: [
            { label: 'Đồng Việt Nam (VND)', value: 'VND' },
            { label: 'Đô la Mỹ (USD)', value: 'USD' },
            { label: 'Euro (EUR)', value: 'EUR' },
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
      name: 'display_mode',
      type: 'select',
      defaultValue: 'public_summary_with_nda_details',
      options: [
        { label: 'Tóm tắt công khai + Chi tiết sau NDA', value: 'public_summary_with_nda_details' },
        { label: 'Hoàn toàn công khai', value: 'fully_public' },
        { label: 'Riêng tư (chỉ theo lời mời)', value: 'private_by_invitation' },
      ],
    },
  ],
  timestamps: true,
}

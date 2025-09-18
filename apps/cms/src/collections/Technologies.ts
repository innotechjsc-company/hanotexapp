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
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Tiêu đề Công nghệ',
    },
    {
      name: 'public_summary',
      type: 'textarea',
      label: 'Tóm tắt Công khai',
      admin: {
        description: 'Tóm tắt hiển thị cho người dùng công khai',
      },
    },
    {
      name: 'confidential_detail',
      type: 'richText',
      label: 'Chi tiết Bảo mật',
      admin: {
        description: 'Thông tin chi tiết chỉ dành cho người dùng được ủy quyền',
      },
    },
    {
      name: 'trl_level',
      type: 'number',
      label: 'Mức TRL',
      min: 1,
      max: 9,
      admin: {
        description: 'Mức độ sẵn sàng công nghệ (1-9)',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Danh mục',
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
    // Intellectual Property Details
    {
      name: 'ip_details',
      type: 'array',
      label: 'Chi tiết Sở hữu Trí tuệ',
      fields: [
        {
          name: 'ip_type',
          type: 'select',
          required: true,
          options: [
            { label: 'Bằng sáng chế', value: 'PATENT' },
            { label: 'Giải pháp hữu ích', value: 'UTILITY_MODEL' },
            { label: 'Kiểu dáng công nghiệp', value: 'INDUSTRIAL_DESIGN' },
            { label: 'Nhãn hiệu', value: 'TRADEMARK' },
            { label: 'Bản quyền phần mềm', value: 'SOFTWARE_COPYRIGHT' },
            { label: 'Bí mật kinh doanh', value: 'TRADE_SECRET' },
          ],
        },
        {
          name: 'ip_number',
          type: 'text',
          label: 'Số IP',
        },
        {
          name: 'status',
          type: 'text',
          label: 'Trạng thái IP',
        },
        {
          name: 'territory',
          type: 'text',
          label: 'Lãnh thổ',
        },
      ],
    },
    // Legal Certification
    {
      name: 'legal_certification',
      type: 'group',
      label: 'Chứng nhận Pháp lý',
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
          label: 'URL Chứng nhận Địa phương',
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
            { label: 'Đánh giá', value: 'APPRAISAL' },
            { label: 'Yêu cầu giá', value: 'ASK' },
            { label: 'Đấu giá', value: 'AUCTION' },
            { label: 'Chào hàng', value: 'OFFER' },
          ],
        },
        {
          name: 'asking_price',
          type: 'number',
          label: 'Giá yêu cầu',
          min: 0,
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
          name: 'price_type',
          type: 'text',
          label: 'Loại giá',
        },
        {
          name: 'appraisal_purpose',
          type: 'text',
          label: 'Mục đích đánh giá',
        },
        {
          name: 'appraisal_scope',
          type: 'text',
          label: 'Phạm vi đánh giá',
        },
        {
          name: 'appraisal_deadline',
          type: 'date',
          label: 'Thời hạn đánh giá',
        },
      ],
    },
    // Investment & Transfer Information
    {
      name: 'investment_transfer',
      type: 'group',
      label: 'Thông tin Đầu tư & Chuyển giao',
      fields: [
        {
          name: 'investment_stage',
          type: 'text',
          label: 'Giai đoạn đầu tư',
        },
        {
          name: 'commercialization_methods',
          type: 'array',
          label: 'Phương pháp thương mại hóa',
          fields: [
            {
              name: 'method',
              type: 'text',
              label: 'Phương pháp',
            },
          ],
        },
        {
          name: 'transfer_methods',
          type: 'array',
          label: 'Phương pháp chuyển giao',
          fields: [
            {
              name: 'method',
              type: 'text',
              label: 'Phương pháp',
            },
          ],
        },
        {
          name: 'territory_scope',
          type: 'text',
          label: 'Phạm vi lãnh thổ',
        },
        {
          name: 'financial_methods',
          type: 'array',
          label: 'Phương pháp tài chính',
          fields: [
            {
              name: 'method',
              type: 'text',
              label: 'Phương pháp',
            },
          ],
        },
        {
          name: 'usage_limitations',
          type: 'textarea',
          label: 'Hạn chế sử dụng',
        },
        {
          name: 'current_partners',
          type: 'textarea',
          label: 'Đối tác hiện tại',
        },
        {
          name: 'potential_partners',
          type: 'textarea',
          label: 'Đối tác tiềm năng',
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
    // Related Documents
    {
      name: 'documents',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      label: 'Tài liệu liên quan',
    },
  ],
  timestamps: true,
}

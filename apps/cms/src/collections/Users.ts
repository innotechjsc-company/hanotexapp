import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: '👥 Người dùng & Tổ chức',
    defaultColumns: ['email', 'user_type', 'role', 'is_verified'],
  },
  auth: true,
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    // Email added by default
    {
      name: 'user_type',
      type: 'select',
      required: true,
      defaultValue: 'INDIVIDUAL',
      options: [
        { label: 'Cá nhân', value: 'INDIVIDUAL' },
        { label: 'Công ty', value: 'COMPANY' },
        { label: 'Viện nghiên cứu', value: 'RESEARCH_INSTITUTION' },
      ],
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'USER',
      options: [
        { label: 'Người dùng', value: 'USER' },
        { label: 'Quản trị viên', value: 'ADMIN' },
        { label: 'Kiểm duyệt viên', value: 'MODERATOR' },
        { label: 'Hỗ trợ', value: 'SUPPORT' },
      ],
    },
    {
      name: 'is_verified',
      type: 'checkbox',
      defaultValue: false,
      label: 'Email đã xác minh',
    },
    {
      name: 'is_active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Tài khoản hoạt động',
    },
    // Individual Profile - for INDIVIDUAL users
    {
      name: 'full_name',
      type: 'text',
      label: 'Họ và tên',
      admin: {
        condition: (data) => data.user_type === 'INDIVIDUAL',
        description: 'Tên đầy đủ của người dùng cá nhân',
      },
    },
    {
      name: 'id_number',
      type: 'text',
      label: 'Số CMND/CCCD',
      admin: {
        condition: (data) => data.user_type === 'INDIVIDUAL',
        description: 'Số CMND hoặc hộ chiếu quốc gia',
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Số điện thoại',
      admin: {
        condition: (data) => data.user_type === 'INDIVIDUAL',
        description: 'Số điện thoại cá nhân',
      },
    },
    {
      name: 'profession',
      type: 'text',
      label: 'Nghề nghiệp',
      admin: {
        condition: (data) => data.user_type === 'INDIVIDUAL',
        description: 'Nghề nghiệp chuyên môn',
      },
    },
    {
      name: 'bank_account',
      type: 'text',
      label: 'Tài khoản ngân hàng',
      admin: {
        condition: (data) => data.user_type === 'INDIVIDUAL',
        description: 'Thông tin tài khoản ngân hàng cho thanh toán',
      },
    },

    // Company Profile - relationship to Companies collection
    {
      name: 'company',
      type: 'relationship',
      relationTo: 'companies',
      label: 'Hồ sơ công ty',
      admin: {
        condition: (data) => data.user_type === 'COMPANY',
        description: 'Liên kết đến thông tin công ty',
      },
    },

    // Research Institution Profile - relationship to ResearchInstitutions collection
    {
      name: 'research_institution',
      type: 'relationship',
      relationTo: 'research-institutions',
      label: 'Hồ sơ viện nghiên cứu',
      admin: {
        condition: (data) => data.user_type === 'RESEARCH_INSTITUTION',
        description: 'Liên kết đến thông tin viện nghiên cứu',
      },
    },
  ],
  timestamps: true,
}

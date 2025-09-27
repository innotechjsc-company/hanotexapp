import { CollectionConfig } from 'payload'

export const Organizations: CollectionConfig = {
  slug: 'organizations',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'location', 'createdAt'],
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
      label: 'Tên tổ chức',
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
        { label: 'Doanh nghiệp', value: 'enterprise' },
        { label: 'Viện nghiên cứu', value: 'research_institute' },
        { label: 'Trường đại học', value: 'university' },
        { label: 'Tổ chức phi lợi nhuận', value: 'nonprofit' },
        { label: 'Cơ quan nhà nước', value: 'government' },
        { label: 'Tổ chức quốc tế', value: 'international' },
      ],
      defaultValue: 'enterprise',
      label: 'Loại tổ chức',
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
          name: 'province',
          type: 'text',
          label: 'Tỉnh/Thành phố',
        },
        {
          name: 'country',
          type: 'text',
          label: 'Quốc gia',
          defaultValue: 'Việt Nam',
        },
      ],
      label: 'Địa chỉ',
    },
    {
      name: 'specializations',
      type: 'array',
      fields: [
        {
          name: 'field',
          type: 'text',
          required: true,
          label: 'Lĩnh vực chuyên môn',
        },
      ],
      label: 'Lĩnh vực chuyên môn',
    },
    {
      name: 'size',
      type: 'select',
      options: [
        { label: 'Dưới 10 nhân viên', value: 'small' },
        { label: '10-50 nhân viên', value: 'medium' },
        { label: '50-200 nhân viên', value: 'large' },
        { label: 'Trên 200 nhân viên', value: 'enterprise' },
      ],
      label: 'Quy mô',
    },
    {
      name: 'founded',
      type: 'date',
      label: 'Năm thành lập',
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
          name: 'facebook',
          type: 'text',
          label: 'Facebook',
        },
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

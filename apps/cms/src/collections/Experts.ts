import { CollectionConfig } from 'payload'

export const Experts: CollectionConfig = {
  slug: 'experts',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'field', 'organization', 'createdAt'],
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
      label: 'Tên chuyên gia',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Chức danh',
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      label: 'Ảnh đại diện',
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
    {
      name: 'field',
      type: 'select',
      required: true,
      options: [
        { label: 'Công nghệ thông tin', value: 'it' },
        { label: 'Công nghệ sinh học', value: 'biotech' },
        { label: 'Công nghệ năng lượng', value: 'energy' },
        { label: 'Công nghệ vật liệu', value: 'materials' },
        { label: 'Công nghệ y tế', value: 'medical' },
        { label: 'Công nghệ nông nghiệp', value: 'agriculture' },
        { label: 'Trí tuệ nhân tạo', value: 'ai' },
        { label: 'Blockchain', value: 'blockchain' },
        { label: 'IoT', value: 'iot' },
        { label: 'Khác', value: 'other' },
      ],
      label: 'Lĩnh vực chuyên môn',
    },
    {
      name: 'specialization',
      type: 'text',
      label: 'Chuyên môn cụ thể',
    },
    {
      name: 'organization',
      type: 'relationship',
      relationTo: 'organizations',
      label: 'Tổ chức',
    },
    {
      name: 'position',
      type: 'text',
      label: 'Vị trí công việc',
    },
    {
      name: 'experience',
      type: 'number',
      label: 'Số năm kinh nghiệm',
    },
    {
      name: 'education',
      type: 'array',
      fields: [
        {
          name: 'degree',
          type: 'text',
          required: true,
          label: 'Bằng cấp',
        },
        {
          name: 'institution',
          type: 'text',
          required: true,
          label: 'Trường/Đại học',
        },
        {
          name: 'year',
          type: 'number',
          label: 'Năm tốt nghiệp',
        },
        {
          name: 'field',
          type: 'text',
          label: 'Chuyên ngành',
        },
      ],
      label: 'Học vấn',
    },
    {
      name: 'certifications',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Tên chứng chỉ',
        },
        {
          name: 'issuer',
          type: 'text',
          label: 'Tổ chức cấp',
        },
        {
          name: 'date',
          type: 'date',
          label: 'Ngày cấp',
        },
        {
          name: 'expiry',
          type: 'date',
          label: 'Ngày hết hạn',
        },
      ],
      label: 'Chứng chỉ',
    },
    {
      name: 'skills',
      type: 'array',
      fields: [
        {
          name: 'skill',
          type: 'text',
          required: true,
          label: 'Kỹ năng',
        },
        {
          name: 'level',
          type: 'select',
          options: [
            { label: 'Cơ bản', value: 'beginner' },
            { label: 'Trung bình', value: 'intermediate' },
            { label: 'Nâng cao', value: 'advanced' },
            { label: 'Chuyên gia', value: 'expert' },
          ],
          defaultValue: 'intermediate',
          label: 'Mức độ',
        },
      ],
      label: 'Kỹ năng',
    },
    {
      name: 'bio',
      type: 'richText',
      label: 'Tiểu sử',
    },
    {
      name: 'achievements',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Tiêu đề',
        },
        {
          name: 'description',
          type: 'text',
          label: 'Mô tả',
        },
        {
          name: 'year',
          type: 'number',
          label: 'Năm',
        },
      ],
      label: 'Thành tựu',
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
          name: 'github',
          type: 'text',
          label: 'GitHub',
        },
        {
          name: 'website',
          type: 'text',
          label: 'Website cá nhân',
        },
      ],
      label: 'Mạng xã hội',
    },
    {
      name: 'availability',
      type: 'select',
      options: [
        { label: 'Có sẵn', value: 'available' },
        { label: 'Bận', value: 'busy' },
        { label: 'Không có sẵn', value: 'unavailable' },
      ],
      defaultValue: 'available',
      label: 'Tình trạng',
    },
    {
      name: 'consultation_rate',
      type: 'number',
      label: 'Phí tư vấn (VNĐ/giờ)',
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

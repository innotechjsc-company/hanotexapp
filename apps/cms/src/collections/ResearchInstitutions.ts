import type { CollectionConfig } from 'payload'

export const ResearchInstitutions: CollectionConfig = {
  slug: 'research-institutions',
  admin: {
    useAsTitle: 'institution_name',
    group: '👥 Người dùng & Tổ chức',
    defaultColumns: ['institution_name', 'institution_code', 'governing_body'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'institution_name',
      type: 'text',
      required: true,
      label: 'Tên viện nghiên cứu',
      admin: {
        description: 'Tên chính thức của viện nghiên cứu',
      },
    },
    {
      name: 'institution_code',
      type: 'text',
      required: true,
      unique: true,
      label: 'Mã viện nghiên cứu',
      admin: {
        description: 'Mã định danh duy nhất của viện nghiên cứu',
      },
    },
    {
      name: 'governing_body',
      type: 'text',
      required: true,
      label: 'Cơ quan quản lý',
      admin: {
        description: 'Cơ quan chính phủ hoặc tổ chức giám sát viện nghiên cứu này',
      },
    },
    {
      name: 'institution_type',
      type: 'select',
      required: true,
      defaultValue: 'UNIVERSITY',
      options: [
        { label: 'Đại học', value: 'UNIVERSITY' },
        { label: 'Viện nghiên cứu', value: 'RESEARCH_INSTITUTE' },
        { label: 'Phòng thí nghiệm chính phủ', value: 'GOVERNMENT_LAB' },
        { label: 'Trung tâm R&D tư nhân', value: 'PRIVATE_RND' },
        { label: 'Tổ chức quốc tế', value: 'INTERNATIONAL_ORG' },
      ],
      label: 'Loại hình viện nghiên cứu',
    },
    {
      name: 'contact_info',
      type: 'group',
      label: 'Thông tin liên hệ',
      fields: [
        {
          name: 'contact_email',
          type: 'email',
          label: 'Email liên hệ',
        },
        {
          name: 'contact_phone',
          type: 'text',
          label: 'Số điện thoại liên hệ',
        },
        {
          name: 'website',
          type: 'text',
          label: 'Trang web viện nghiên cứu',
        },
      ],
    },
    {
      name: 'address',
      type: 'group',
      label: 'Địa chỉ viện nghiên cứu',
      fields: [
        {
          name: 'street',
          type: 'text',
          label: 'Địa chỉ đường',
        },
        {
          name: 'city',
          type: 'text',
          label: 'Thành phố',
        },
        {
          name: 'state',
          type: 'text',
          label: 'Tỉnh/Bang',
        },
        {
          name: 'country',
          type: 'text',
          label: 'Quốc gia',
        },
        {
          name: 'postal_code',
          type: 'text',
          label: 'Mã bưu chính',
        },
      ],
    },
    {
      name: 'research_areas',
      type: 'array',
      label: 'Lĩnh vực nghiên cứu',
      fields: [
        {
          name: 'area',
          type: 'text',
          required: true,
          label: 'Lĩnh vực',
        },
      ],
      admin: {
        description: 'Các lĩnh vực trọng tâm nghiên cứu chính',
      },
    },
    {
      name: 'research_task_code',
      type: 'text',
      label: 'Mã số đề tài nghiên cứu',
      admin: {
        description: 'Mã định danh đề tài hoặc nhiệm vụ nghiên cứu hiện tại',
      },
    },
    {
      name: 'acceptance_report',
      type: 'text',
      label: 'Báo cáo nghiệm thu',
      admin: {
        description: 'Tham chiếu báo cáo nghiệm thu nghiên cứu mới nhất',
      },
    },
    {
      name: 'research_group',
      type: 'text',
      label: 'Nhóm nghiên cứu',
      admin: {
        description: 'Nhóm hoặc phòng ban nghiên cứu cụ thể trong viện',
      },
    },
    {
      name: 'established_year',
      type: 'number',
      label: 'Năm thành lập',
      min: 1800,
      max: new Date().getFullYear(),
      admin: {
        description: 'Năm thành lập viện nghiên cứu',
      },
    },
    {
      name: 'staff_count',
      type: 'number',
      label: 'Số lượng nhân viên',
      min: 0,
      admin: {
        description: 'Số lượng nhân viên nghiên cứu',
      },
    },
    {
      name: 'accreditation_info',
      type: 'group',
      label: 'Thông tin chứng nhận',
      fields: [
        {
          name: 'accreditation_body',
          type: 'text',
          label: 'Cơ quan cấp chứng nhận',
        },
        {
          name: 'accreditation_level',
          type: 'text',
          label: 'Cấp độ chứng nhận',
        },
        {
          name: 'accreditation_date',
          type: 'date',
          label: 'Ngày cấp chứng nhận',
        },
        {
          name: 'accreditation_expiry',
          type: 'date',
          label: 'Ngày hết hạn chứng nhận',
        },
      ],
    },
    {
      name: 'is_active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Trạng thái hoạt động',
      admin: {
        description: 'Viện nghiên cứu có đang hoạt động hay không',
      },
    },
  ],
  timestamps: true,
}

import type { CollectionConfig } from 'payload'

export const Companies: CollectionConfig = {
  slug: 'companies',
  admin: {
    useAsTitle: 'company_name',
    group: '👥 Người dùng & Tổ chức',
    defaultColumns: ['company_name', 'tax_code', 'legal_representative'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'company_name',
      type: 'text',
      required: true,
      label: 'Tên công ty',
      admin: {
        description: 'Tên chính thức của công ty',
      },
    },
    {
      name: 'tax_code',
      type: 'text',
      required: true,
      unique: true,
      label: 'Mã số thuế',
      admin: {
        description: 'Mã số nhận dạng thuế duy nhất',
      },
    },
    {
      name: 'business_license',
      type: 'text',
      label: 'Giấy phép kinh doanh',
      admin: {
        description: 'Số giấy phép đăng ký kinh doanh',
      },
    },
    {
      name: 'legal_representative',
      type: 'text',
      required: true,
      label: 'Người đại diện pháp luật',
      admin: {
        description: 'Tên người đại diện pháp luật',
      },
    },
    {
      name: 'contact_email',
      type: 'email',
      label: 'Email liên hệ',
      admin: {
        description: 'Email liên hệ chính thức của công ty',
      },
    },
    {
      name: 'contact_phone',
      type: 'text',
      label: 'Số điện thoại liên hệ',
      admin: {
        description: 'Số điện thoại liên hệ chính thức của công ty',
      },
    },
    {
      name: 'address',
      type: 'group',
      label: 'Địa chỉ công ty',
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
      name: 'production_capacity',
      type: 'textarea',
      label: 'Năng lực sản xuất',
      admin: {
        description: 'Mô tả năng lực sản xuất của công ty',
      },
    },
    {
      name: 'business_sectors',
      type: 'array',
      label: 'Lĩnh vực kinh doanh',
      fields: [
        {
          name: 'sector',
          type: 'text',
          required: true,
          label: 'Lĩnh vực',
        },
      ],
      admin: {
        description: 'Các lĩnh vực kinh doanh chính của công ty',
      },
    },
    {
      name: 'employee_count',
      type: 'number',
      label: 'Số lượng nhân viên',
      min: 0,
      admin: {
        description: 'Số lượng nhân viên',
      },
    },
    {
      name: 'established_year',
      type: 'number',
      label: 'Năm thành lập',
      min: 1900,
      max: new Date().getFullYear(),
      admin: {
        description: 'Năm thành lập công ty',
      },
    },
    {
      name: 'website',
      type: 'text',
      label: 'Trang web công ty',
      admin: {
        description: 'URL trang web chính thức của công ty',
      },
    },
    {
      name: 'is_active',
      type: 'checkbox',
      defaultValue: true,
      label: 'Trạng thái hoạt động',
      admin: {
        description: 'Công ty có đang hoạt động hay không',
      },
    },
  ],
  timestamps: true,
}

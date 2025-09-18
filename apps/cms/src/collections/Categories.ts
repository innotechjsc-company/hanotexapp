import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    group: 'Quản lý Danh mục',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Tên danh mục',
    },
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      label: 'Mã danh mục',
      admin: {
        description: 'Mã định danh duy nhất cho danh mục này',
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Danh mục cha',
      admin: {
        description: 'Chọn danh mục cha cho cấu trúc phân cấp',
      },
    },
    {
      name: 'level',
      type: 'number',
      required: true,
      defaultValue: 1,
      min: 1,
      max: 5,
      label: 'Cấp độ phân cấp',
      admin: {
        description: 'Cấp độ phân cấp danh mục (1-5)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Mô tả',
      admin: {
        description: 'Mô tả tùy chọn cho danh mục này',
      },
    },
  ],
  timestamps: true,
}

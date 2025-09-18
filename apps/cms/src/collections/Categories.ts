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
      name: 'code_intl',
      type: 'text',
      unique: true,
      label: 'Mã danh mục quốc tế',
      admin: {
        description: 'Mã danh mục quốc tế',
      },
    },
    {
      name: 'code_vn',
      type: 'text',
      unique: true,
      label: 'Tên danh mục Việt Nam',
      admin: {
        description: 'Tên danh mục Việt Nam',
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
  ],
  timestamps: true,
}

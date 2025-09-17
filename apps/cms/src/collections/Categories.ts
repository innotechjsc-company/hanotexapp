import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    group: 'Technology Management',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Category Name',
    },
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      label: 'Category Code',
      admin: {
        description: 'Unique identifier code for this category',
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Parent Category',
      admin: {
        description: 'Select parent category for hierarchical structure',
      },
    },
    {
      name: 'level',
      type: 'number',
      required: true,
      defaultValue: 1,
      min: 1,
      max: 5,
      label: 'Hierarchy Level',
      admin: {
        description: 'Category hierarchy level (1-5)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'Optional description for this category',
      },
    },
  ],
  timestamps: true,
}

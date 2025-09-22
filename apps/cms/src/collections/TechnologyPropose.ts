import { CollectionConfig } from 'payload'

export const TechnologyPropose: CollectionConfig = {
  slug: 'technology-propose',
  admin: {
    useAsTitle: 'name',
    group: 'Đề xuất đầu tư công nghệ',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        // Chỉ tạo notification khi propose được tạo mới
        if (operation === 'create') {
          try {
            // Lấy thông tin technology để có user_id
            const technology = await req.payload.findByID({
              collection: 'technologies',
              id: doc.technology,
            })

            if (technology && technology.submitter) {
              // Tạo notification cho user của technology
              await req.payload.create({
                collection: 'notifications',
                data: {
                  user: technology.submitter,
                  title: `Có đề xuất mới cho công nghệ ${technology.title}`,
                  message: `Có một đề xuất mới cho công nghệ "${technology.title}".`,
                  type: 'info',
                  priority: 'normal',
                  is_read: false,
                },
              })
            }
          } catch (error) {
            console.error('Lỗi khi tạo notification cho propose mới:', error)
          }
        }
      },
    ],
  },
  fields: [
    {
      name: 'technology',
      type: 'relationship',
      relationTo: 'technologies',
      required: true,
      label: 'Công nghệ',
      admin: {
        description: 'Công nghệ',
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Người ra đề xuất',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Mô tả',
    },
    {
      name: 'document',
      type: 'upload',
      relationTo: 'media',
      label: 'Tài liệu bổ sung',
      admin: {
        description: 'Tài liệu',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Trạng thái',
      options: ['pending', 'accepted', 'rejected'],
      defaultValue: 'pending',
      admin: {
        description: 'Trạng thái',
      },
    },
  ],
  timestamps: true,
}

import { CollectionConfig } from 'payload'

export const TechnologyPropose: CollectionConfig = {
  slug: 'technology-propose',
  admin: {
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
        if (operation === 'create') {
          try {
            // Lấy technology ID - có thể là string hoặc object
            const technologyId =
              typeof doc.technology === 'string' ? doc.technology : doc.technology?.id

            if (!technologyId) {
              console.error('Không tìm thấy technology ID')
              return
            }

            const technology = await req.payload.findByID({
              collection: 'technologies',
              id: technologyId,
            })

            if (technology && technology.submitter) {
              const technologyUserId =
                typeof technology.submitter === 'string'
                  ? technology.submitter
                  : technology.submitter?.id

              const proposeUserId = typeof doc.user === 'string' ? doc.user : doc.user?.id
              let proposeUserName = 'Người dùng'

              if (proposeUserId) {
                try {
                  const proposeUser = await req.payload.findByID({
                    collection: 'users',
                    id: proposeUserId,
                  })
                  proposeUserName = proposeUser?.full_name || proposeUser?.email || 'Người dùng'
                } catch (error) {
                  console.error('Lỗi khi lấy thông tin user:', error)
                }
              }

              if (technologyUserId) {
                // Tạo notification cho user của technology
                await req.payload.create({
                  collection: 'notifications',
                  data: {
                    user: technologyUserId,
                    title: `Có đề xuất đầu tư mới cho công nghệ của bạn`,
                    message: `Có một đề xuất đầu tư mới cho công nghệ "${technology.title}" từ ${proposeUserName}`,
                    type: 'technology',
                    action_url: `my-proposals`,
                    priority: 'normal',
                    is_read: false,
                  },
                })
              }
            }
          } catch (error) {
            console.error('Lỗi khi tạo notification cho technology propose mới:', error)
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
      name: 'receiver',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Người nhận đề xuất',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Mô tả',
    },
    {
      name: 'budget',
      type: 'number',
      required: true,
      label: 'Ngân sách',
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
    // thêm trạng thái đang kí hợp đồng, đang hoàn thiện hợp đồng
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Trạng thái',
      options: [
        'pending',
        'negotiating',
        'contact_signing',
        'contract_signed',
        'completed',
        'cancelled',
      ],
      defaultValue: 'pending',
      admin: {
        description: 'Trạng thái',
      },
    },
  ],
  timestamps: true,
}

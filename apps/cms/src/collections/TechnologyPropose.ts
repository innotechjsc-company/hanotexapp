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
      async ({ doc, req, operation, previousDoc }) => {
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

          if (!technology) {
            console.error('Không tìm thấy technology')
            return
          }

          // Xử lý khi tạo mới propose
          if (operation === 'create') {
            if (technology.submitter) {
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
          }

          // Xử lý khi cập nhật trạng thái thành negotiating
          if (
            operation === 'update' &&
            doc.status === 'negotiating' &&
            previousDoc?.status !== 'negotiating'
          ) {
            // Lấy thông tin người đề xuất
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
                console.error('Lỗi khi lấy thông tin user đề xuất:', error)
              }
            }

            // Gửi thông báo cho người nhận đề xuất (receiver)
            const receiverId = typeof doc.receiver === 'string' ? doc.receiver : doc.receiver?.id
            console.log('receiverId', receiverId)
            if (receiverId) {
              await req.payload.create({
                collection: 'notifications',
                data: {
                  user: receiverId,
                  title: `Đề xuất đầu tư đang được thương lượng`,
                  message: `Đề xuất đầu tư cho công nghệ "${technology.title}" từ ${proposeUserName} đã chuyển sang trạng thái thương lượng`,
                  type: 'technology',
                  action_url: `my-proposals`,
                  priority: 'high',
                  is_read: false,
                },
              })
            }

            // Gửi thông báo cho người đề xuất (user)
            if (proposeUserId) {
              await req.payload.create({
                collection: 'notifications',
                data: {
                  user: proposeUserId,
                  title: `Đề xuất của bạn đang được thương lượng`,
                  message: `Đề xuất đầu tư của bạn cho công nghệ "${technology.title}" đã chuyển sang trạng thái thương lượng`,
                  type: 'technology',
                  action_url: `my-proposals`,
                  priority: 'high',
                  is_read: false,
                },
              })
            }
          }
        } catch (error) {
          console.error('Lỗi khi xử lý notification cho technology propose:', error)
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

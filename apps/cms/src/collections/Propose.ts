import { CollectionConfig } from 'payload'

export const Propose: CollectionConfig = {
  slug: 'propose',
  admin: {
    useAsTitle: 'title',
    group: '🎯 Đề xuất',
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
            // Lấy demand ID - có thể là string hoặc object
            const demandId = typeof doc.demand === 'string' ? doc.demand : doc.demand?.id

            if (!demandId) {
              console.error('Không tìm thấy demand ID')
              return
            }

            const demand = await req.payload.findByID({
              collection: 'demand',
              id: demandId,
            })
            if (demand && demand.user) {
              const demandUserId = typeof demand.user === 'string' ? demand.user : demand.user?.id

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

              if (demandUserId) {
                // Tạo notification cho user của demand
                await req.payload.create({
                  collection: 'notifications',
                  data: {
                    user: demandUserId,
                    title: `Có đề xuất mới cho yêu cầu của bạn`,
                    message: `Có một đề xuất mới cho yêu cầu "${demand.title}" từ ${proposeUserName}`,
                    type: 'technology',
                    action_url: `my-demands`,
                    priority: 'normal',
                    is_read: false,
                  },
                })
              }
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
      name: 'title',
      type: 'text',
      required: true,
      label: 'Tiêu đề đề xuất',
      admin: {
        description: 'Tiêu đề ngắn gọn cho đề xuất này',
      },
    },
    {
      name: 'demand',
      type: 'relationship',
      relationTo: 'demand',
      required: true,
      label: 'Thuộc yêu cầu nào',
      admin: {
        description: 'Thuộc yêu cầu nào',
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
      name: 'technology',
      type: 'relationship',
      relationTo: 'technologies',
      required: true,
      label: 'Công nghệ',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Mô tả',
    },
    {
      name: 'execution_time',
      type: 'text',
      required: true,
      label: 'Thời gian thực hiện',
      admin: {
        description: 'Thời gian thực hiện (tháng)',
      },
    },
    {
      name: 'estimated_cost',
      type: 'number',
      required: true,
      label: 'Chi phí ước tính',
      admin: {
        description: 'Chi phí ước tính (VND)',
      },
    },
    {
      name: 'cooperation_conditions',
      type: 'textarea',
      required: true,
      label: 'Điều kiện hợp tác',
      admin: {
        description: 'Điều kiện hợp tác',
      },
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

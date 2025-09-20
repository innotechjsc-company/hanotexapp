import { CollectionConfig } from 'payload'

export const Propose: CollectionConfig = {
  slug: 'propose',
  admin: {
    useAsTitle: 'name',
    group: 'Đề xuất yêu cầu',
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
            // Lấy thông tin demand để có user_id
            const demand = await req.payload.findByID({
              collection: 'demand',
              id: doc.demand,
            })

            if (demand && demand.user) {
              // Tạo notification cho user của demand
              await req.payload.create({
                collection: 'notifications',
                data: {
                  user: demand.user,
                  title: `Có đề xuất mới cho yêu cầu của bạn ${demand.title}`,
                  message: `Có một đề xuất mới cho yêu cầu "${demand.title}". Chi phí ước tính: ${doc.estimated_cost?.toLocaleString()} VND, thời gian thực hiện: ${doc.execution_time}.`,
                  type: 'info',
                  priority: 'normal',
                  is_read: false,
                  related_technology: doc.technology,
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
      options: ['pending', 'accepted', 'rejected'],
      defaultValue: 'pending',
      admin: {
        description: 'Trạng thái',
      },
    },
  ],
  timestamps: true,
}

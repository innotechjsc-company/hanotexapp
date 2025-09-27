import type { CollectionConfig } from 'payload'

export const Demand: CollectionConfig = {
  slug: 'demand',
  admin: {
    useAsTitle: 'title',
    group: 'Quản lý Yêu cầu dịch vụ',
    defaultColumns: ['title', 'trl_level', 'cooperation'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Tiêu đề',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Mô tả',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      label: 'Lĩnh vực',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Người yêu cầu',
    },
    {
      name: 'trl_level',
      type: 'number',
      required: true,
      label: 'TRL',
    },
    {
      name: 'option',
      type: 'textarea',
      label: 'Mô tả yêu cầu mong muốn',
    },
    {
      name: 'option_technology',
      type: 'textarea',
      label: 'Mô tả yêu cầu công nghệ',
    },
    {
      name: 'option_rule',
      type: 'textarea',
      label: 'Mô tả yêu cầu quy tắc',
    },
    {
      name: 'from_price',
      type: 'number',
      label: 'Giá từ',
    },
    {
      name: 'to_price',
      type: 'number',
      label: 'Giá đến',
    },
    {
      name: 'cooperation',
      type: 'text',
      label: 'Hình thức hợp tác',
    },
    {
      name: 'start_date',
      type: 'text',
      label: 'Thời gian dự kiến bắt đầu',
    },
    {
      name: 'end_date',
      type: 'text',
      label: 'Thời gian dự kiến kết thúc',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Chờ duyệt', value: 'pending' },
        { label: 'Đã duyệt', value: 'approved' },
        { label: 'Từ chối', value: 'rejected' },
        { label: 'Hoạt động', value: 'active' },
        { label: 'Không hoạt động', value: 'inactive' },
      ],
      defaultValue: 'pending',
      label: 'Trạng thái',
    },
    {
      name: 'documents',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      label: 'Tài liệu đính kèm',
    },
  ],
  hooks: {
    afterChange: [
      // Hook to send notification on status change
      async ({ doc, previousDoc, operation, req }) => {
        if (operation === 'update' && doc.status !== previousDoc.status) {
          const payload = req.payload

          const userId = doc.user?.id || doc.user

          if (!userId) {
            console.error('User ID not found for demand:', doc.id)
            return
          }

          let statusMessage = ''
          switch (doc.status) {
            case 'approved':
              statusMessage = 'đã được duyệt'
              break
            case 'rejected':
              statusMessage = 'đã bị từ chối'
              break
            case 'active':
              statusMessage = 'đã được duyệt'
              break
            case 'inactive':
              statusMessage = 'đã bị vô hiệu hóa'
              break
            default:
              return // Don't send notifications for other statuses
          }

          try {
            await payload.create({
              collection: 'notifications',
              data: {
                user: userId,
                title: `Cập nhật trạng thái yêu cầu`,
                message: `Yêu cầu "${doc.title}" của bạn ${statusMessage}.`,
                type: 'technology',
                priority: 'normal',
                is_read: false,
                action_url: `demands/${doc.id}`,
              },
            })
          } catch (error) {
            console.error('Failed to create notification:', error)
          }
        }
      },
    ],
  },
  timestamps: true,
}

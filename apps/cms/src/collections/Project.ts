import { CollectionConfig } from 'payload'

export const Project: CollectionConfig = {
  slug: 'project',
  admin: {
    useAsTitle: 'name',
    group: '🔬 Công nghệ & Dự án',
    defaultColumns: ['name', 'description', 'status', 'end_date', 'user'],
    description: 'Quản lý các dự án đầu tư và kêu gọi vốn',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  hooks: {
    afterChange: [
      // Hook to send notification on status change
      async ({ doc, previousDoc, operation, req }) => {
        if (operation === 'update' && doc.status !== previousDoc.status) {
          const payload = req.payload
          const userId = doc.user?.id || doc.user

          if (!userId) {
            console.error('User ID not found for project:', doc.id)
            return
          }

          let statusMessage = ''
          switch (doc.status) {
            case 'active':
              statusMessage = 'đã được phê duyệt và đang hoạt động'
              break
            case 'rejected':
              statusMessage = 'đã bị từ chối'
              break
            case 'completed':
              statusMessage = 'đã hoàn thành'
              break
            case 'cancelled':
              statusMessage = 'đã bị hủy'
              break
            default:
              return // Don't send notifications for other statuses
          }

          try {
            await payload.create({
              collection: 'notifications',
              data: {
                user: userId,
                title: `Cập nhật trạng thái dự án`,
                message: `Dự án "${doc.name}" của bạn ${statusMessage}.`,
                type: 'info',
                priority: 'normal',
                is_read: false,
                action_url: `projects/${doc.id}`,
              },
            })
          } catch (error) {
            console.error('Failed to create notification:', error)
          }
        }
      },
    ],
  },
  fields: [
    // Thông tin dự án
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      hasMany: false,
      label: 'Ảnh đại diện',
      admin: {
        description: 'Ảnh đại diện của dự án',
        position: 'sidebar',
        width: '50%',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Tên dự án',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Mô tả',
    },
    {
      name: 'business_model',
      type: 'textarea',
      label: 'Mô hình kinh doanh',
      admin: {
        description:
          'Mô tả chi tiết về mô hình kinh doanh của dự án, cách thức hoạt động và tạo ra doanh thu',
      },
    },
    {
      name: 'market_data',
      type: 'textarea',
      label: 'Số liệu và thị trường',
      admin: {
        description:
          'Thông tin về thị trường mục tiêu, quy mô thị trường, cạnh tranh và các số liệu liên quan',
      },
    },

    //Thông tin pháp lý và pháp nhân
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Người tạo',
    },
    {
      name: 'technologies',
      type: 'relationship',
      relationTo: 'technologies',
      hasMany: true,
      required: true,
      label: 'Công nghệ',
      admin: {
        description: 'Các công nghệ được sử dụng trong dự án',
      },
      validate: (value) => {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          return 'Phải chọn ít nhất một công nghệ'
        }
        return true
      },
    },
    // quỹ đầu tư
    {
      name: 'investment_fund',
      type: 'relationship',
      relationTo: 'investment-fund',
      hasMany: true,
      label: 'Quỹ đầu tư',
      admin: {
        description: 'Các quỹ đầu tư liên quan đến dự án',
      },
    },

    // Thông tin tài chính
    {
      name: 'revenue',
      type: 'number',
      label: 'Doanh thu (VND)',
      admin: {
        description: 'Doanh thu của dự án (tính bằng VND)',
        step: 1000000, // Bước nhảy 1 triệu VND
      },
      validate: (value: any) => {
        if (value !== undefined && value < 0) {
          return 'Doanh thu không thể âm'
        }
        return true
      },
    },
    {
      name: 'profit',
      type: 'number',
      label: 'Lợi nhuận (VND)',
      admin: {
        description: 'Lợi nhuận của dự án (tính bằng VND)',
        step: 1000000, // Bước nhảy 1 triệu VND
      },
    },
    {
      name: 'assets',
      type: 'number',
      label: 'Tài sản (VND)',
      admin: {
        description: 'Tổng tài sản của dự án (tính bằng VND)',
        step: 1000000, // Bước nhảy 1 triệu VND
      },
      validate: (value: any) => {
        if (value !== undefined && value < 0) {
          return 'Tài sản không thể âm'
        }
        return true
      },
    },
    {
      name: 'documents_finance',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Tài liệu tài chính',
      admin: {
        description:
          'Các tài liệu tài chính liên quan đến dự án (báo cáo tài chính, bảng cân đối kế toán, v.v.)',
      },
    },
    // Profile đội ngũ
    {
      name: 'team_profile',
      type: 'textarea',
      label: 'Profile đội ngũ',
      admin: {
        description:
          'Thông tin chi tiết về đội ngũ thực hiện dự án (kinh nghiệm, kỹ năng, vai trò, v.v.)',
      },
    },
    //Thông tin kêu gọi
    {
      name: 'goal_money',
      type: 'number',
      label: 'Số vốn kêu gọi (VND)',
      admin: {
        description: 'Số tiền vốn mục tiêu kêu gọi từ các nhà đầu tư (tính bằng VND)',
        step: 10000000, // Bước nhảy 10 triệu VND
      },
      validate: (value: any) => {
        if (value !== undefined && value <= 0) {
          return 'Số vốn kêu gọi phải lớn hơn 0'
        }
        return true
      },
    },
    {
      name: 'share_percentage',
      type: 'number',
      label: 'Tỉ lệ cổ phần (%)',
      admin: {
        description: 'Phần trăm cổ phần dự kiến trao đổi cho nhà đầu tư (0-100%)',
        step: 0.1,
      },
      validate: (value: any) => {
        if (value !== undefined && (value < 0 || value > 100)) {
          return 'Tỉ lệ cổ phần phải trong khoảng 0-100%'
        }
        return true
      },
    },
    {
      name: 'goal_money_purpose',
      type: 'textarea',
      label: 'Mục đích kêu gọi và tỉ lệ phân bổ chi tiết',
      admin: {
        description: 'Mô tả chi tiết về mục đích sử dụng số vốn kêu gọi và cách phân bổ',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Trạng thái',
      options: [
        { label: 'Chờ duyệt', value: 'pending' },
        { label: 'Đang hoạt động', value: 'active' },
        { label: 'Đã từ chối', value: 'rejected' },
        { label: 'Hoàn thành', value: 'completed' },
        { label: 'Đã hủy', value: 'cancelled' },
      ],
      defaultValue: 'pending',
      admin: {
        description: 'Trạng thái hiện tại của dự án',
      },
    },
    {
      name: 'open_investment_fund',
      type: 'checkbox',
      label: 'Mở kêu gọi đầu tư',
      defaultValue: false,
      admin: {
        description: 'Đánh dấu nếu dự án đang mở kêu gọi đầu tư từ cộng đồng',
      },
    },
    {
      name: 'end_date',
      type: 'date',
      required: true,
      label: 'Ngày kết thúc',
      admin: {
        description: 'Ngày dự kiến hoàn thành dự án hoặc ngày kết thúc kêu gọi vốn',
      },
      validate: (value) => {
        if (value && new Date(value) <= new Date()) {
          return 'Ngày kết thúc phải lớn hơn ngày hiện tại'
        }
        return true
      },
    },
  ],
  timestamps: true,
}

import type { CollectionConfig } from 'payload'

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    group: 'Quản lý tin tức',
    defaultColumns: ['title', 'hashtags', 'document'],
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
        // Chỉ tạo notification khi tin tức được tạo mới
        if (operation === 'create') {
          try {
            console.log('Tạo thông báo cho tin tức mới:', doc.title)

            // Lấy danh sách tất cả người dùng
            const users = await req.payload.find({
              collection: 'users',
              limit: 1000, // Giới hạn 1000 users để tránh quá tải
              pagination: false,
            })

            if (users.docs && users.docs.length > 0) {
              console.log(`Tìm thấy ${users.docs.length} người dùng để gửi thông báo`)

              // Tạo thông báo cho từng người dùng
              const notificationPromises = users.docs.map(async (user) => {
                try {
                  await req.payload.create({
                    collection: 'notifications',
                    data: {
                      user: '',
                      title: `Tin tức mới: ${doc.title}`,
                      message: `Có tin tức mới được đăng: "${doc.title}". Hãy xem ngay để cập nhật thông tin mới nhất!`,
                      type: 'info',
                      action_url: `news/${doc.id}`,
                      priority: 'normal',
                      is_read: false,
                    },
                  })
                } catch (error) {
                  console.error(`Lỗi khi tạo notification cho user ${user.id}:`, error)
                }
              })

              // Chờ tất cả notifications được tạo
              await Promise.allSettled(notificationPromises)
              console.log('Đã hoàn thành tạo thông báo cho tất cả người dùng')
            } else {
              console.log('Không tìm thấy người dùng nào để gửi thông báo')
            }
          } catch (error) {
            console.error('Lỗi khi tạo notification cho tin tức mới:', error)
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
      label: 'Tiêu đề',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Ảnh đại diện',
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: 'Nội dung',
    },
    {
      name: 'hashtags',
      type: 'text',
      label: 'Hashtags',
    },
    {
      name: 'document',
      type: 'upload',
      relationTo: 'media',
      label: 'Tài liệu',
    },
    {
      name: 'views',
      type: 'number',
      label: 'Lượt xem',
    },
    {
      name: 'likes',
      type: 'number',
      label: 'Lượt thích',
    },
  ],
  timestamps: true,
}

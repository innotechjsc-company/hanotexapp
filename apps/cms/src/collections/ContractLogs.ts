import type { CollectionConfig } from 'payload'

export const ContractLogs: CollectionConfig = {
  slug: 'contract-logs',
  admin: {
    useAsTitle: 'content',
    group: 'Quản lý tiến độ hợp đồng',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'technology_propose',
      type: 'relationship',
      relationTo: 'technology-propose',
      label: 'Đề xuất đầu tư công nghệ',
    },
    {
      name: 'propose',
      type: 'relationship',
      relationTo: 'propose',
      label: 'Đề xuất',
    },
    {
      name: 'project_propose',
      type: 'relationship',
      relationTo: 'project-propose',
      label: 'Đề xuất đầu tư dự án',
    },
    {
      name: 'contract',
      type: 'relationship',
      relationTo: 'contract',
      required: true,
      label: 'Hợp đồng',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Người gửi',
    },
    {
      name: 'content',
      type: 'text',
      required: true,
      label: 'Nội dung',
    },
    {
      name: 'documents',
      type: 'upload',
      relationTo: 'media',
      label: 'Tài liệu',
    },
    {
      name: 'reason',
      type: 'text',
      label: 'Lý do (khi từ chối)',
      admin: {
        condition: (_: any, siblingData: any) => siblingData?.status === 'cancelled',
      },
      validate: (val: any, { siblingData }: any) => {
        if (siblingData?.status === 'cancelled' && !val) {
          return 'Vui lòng nhập lý do khi từ chối'
        }
        return true
      },
    },
    {
      name: 'status',
      type: 'select',
      options: ['pending', 'completed', 'cancelled'],
      defaultValue: 'pending',
      label: 'Trạng thái',
    },
    {
      name: 'is_done_contract',
      type: 'checkbox',
      defaultValue: false,
      label: 'Xác nhận hoàn thành hợp đồng',
    },
  ],
  timestamps: true,
}

import type { CollectionConfig } from 'payload'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

// Quản lý quy trình từng bước của hợp đồng, yêu cầu phê duyệt hai bên ở mỗi bước
export const ContractStep: CollectionConfig = {
  slug: 'contract-step',
  admin: {
    group: 'Hợp đồng',
    useAsTitle: 'step',
    defaultColumns: ['contract', 'step', 'status', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  hooks: {
    beforeValidate: [async ({ data }) => {
      // Bước 1: Ký hợp đồng cần tệp hợp đồng
      if (data?.step === 'sign_contract' && !data?.contract_file) {
        throw new Error('Bước 1 yêu cầu tải lên tệp hợp đồng')
      }
      // Bước 2: Tài liệu kèm theo cần có ít nhất 1 tài liệu
      if (data?.step === 'upload_attachments') {
        const atts = Array.isArray(data?.attachments) ? data.attachments : []
        if (!atts || atts.length === 0) {
          throw new Error('Bước 2 yêu cầu tải lên ít nhất 1 tài liệu kèm theo')
        }
      }
      return data
    }],
    beforeChange: [async ({ data }) => {
      // Tính trạng thái dựa trên approvals
      const approvals = Array.isArray(data?.approvals) ? data.approvals : []
      let status: 'pending' | 'approved' | 'rejected' | 'cancelled' = 'pending'
      if (approvals.some((a: any) => a?.decision === 'rejected')) {
        status = 'rejected'
      } else if (
        approvals.length >= 2 &&
        approvals.every((a: any) => a?.decision === 'approved')
      ) {
        status = 'approved'
      }
      return { ...data, status }
    }],
    afterChange: [
      async ({ doc, operation }) => {
        // Đồng bộ trạng thái hợp đồng tương ứng
        if (!doc?.contract || !doc?.status) return
        try {
          const payload = await getPayload({ config: configPromise })
          const contractId = (doc as any).contract
          if (doc.status === 'rejected') {
            await payload.update({
              collection: 'contract',
              id: contractId,
              data: { status: 'cancelled' },
              overrideAccess: true,
            })
            return
          }

          if (doc.status === 'approved') {
            if (doc.step === 'sign_contract') {
              await payload.update({
                collection: 'contract',
                id: contractId,
                data: { status: 'signed', contract_file: (doc as any)?.contract_file },
                overrideAccess: true,
              })
            } else if (doc.step === 'upload_attachments') {
              const contractDoc: any = await payload.findByID({
                collection: 'contract',
                id: contractId,
              })
              const existingDocs: any[] = Array.isArray(contractDoc?.documents)
                ? contractDoc.documents
                : []
              const newDocs: any[] = Array.isArray((doc as any)?.attachments)
                ? (doc as any).attachments
                : []
              const merged = [...existingDocs, ...newDocs]
              await payload.update({
                collection: 'contract',
                id: contractId,
                data: { documents: merged },
                overrideAccess: true,
              })
            } else if (doc.step === 'complete_contract') {
              await payload.update({
                collection: 'contract',
                id: contractId,
                data: { status: 'completed' },
                overrideAccess: true,
              })
            }
          } else if (doc.status === 'pending' && operation === 'create') {
            await payload.update({
              collection: 'contract',
              id: contractId,
              data: { status: 'in_progress' },
              overrideAccess: true,
            })
          }
        } catch (e) {
          console.error('Failed to sync contract status from ContractStep:', e)
        }
      },
    ],
  },
  fields: [
    {
      name: 'contract',
      type: 'relationship',
      relationTo: 'contract',
      required: true,
      label: 'Hợp đồng',
    },
    {
      name: 'step',
      type: 'select',
      required: true,
      label: 'Bước',
      options: [
        { label: 'Bước 1: Ký hợp đồng', value: 'sign_contract' },
        { label: 'Bước 2: Tài liệu kèm theo', value: 'upload_attachments' },
        { label: 'Bước 3: Hoàn tất hợp đồng', value: 'complete_contract' },
      ],
      defaultValue: 'sign_contract',
    },
    {
      name: 'uploaded_by',
      type: 'relationship',
      relationTo: 'users',
      label: 'Người tải lên',
      admin: {
        condition: (data) => data?.step === 'sign_contract' || data?.step === 'upload_attachments',
      },
    },
    {
      name: 'contract_file',
      type: 'upload',
      relationTo: 'media',
      label: 'Tệp hợp đồng',
      admin: {
        description: 'Tệp hợp đồng (bắt buộc ở Bước 1)',
        condition: (data) => data?.step === 'sign_contract',
      },
    },
    {
      name: 'attachments',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Tài liệu kèm theo',
      admin: {
        description: 'Các tài liệu bổ sung (yêu cầu ở Bước 2)',
        condition: (data) => data?.step === 'upload_attachments',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      label: 'Trạng thái bước',
      defaultValue: 'pending',
      options: [
        { label: 'Chờ duyệt', value: 'pending' },
        { label: 'Đã duyệt', value: 'approved' },
        { label: 'Từ chối', value: 'rejected' },
        { label: 'Hủy', value: 'cancelled' },
      ],
    },
    {
      name: 'approvals',
      type: 'array',
      label: 'Phê duyệt hai bên',
      minRows: 2,
      maxRows: 2,
      validate: (val: any) => {
        const arr = Array.isArray(val) ? val : []
        if (arr.length < 2) return 'Cần đủ 2 phê duyệt (A và B)'
        const parties = new Set(arr.map((x) => x?.party))
        if (!parties.has('A') || !parties.has('B'))
          return 'Phê duyệt phải bao gồm cả Bên A và Bên B'
        return true
      },
      admin: {
        description: 'Cần 2 dòng: đại diện Bên A và Bên B',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'party',
          type: 'select',
          required: true,
          options: [
            { label: 'Bên A', value: 'A' },
            { label: 'Bên B', value: 'B' },
          ],
          label: 'Bên',
        },
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
          label: 'Người duyệt',
        },
        {
          name: 'decision',
          type: 'select',
          required: true,
          defaultValue: 'pending',
          options: [
            { label: 'Chờ duyệt', value: 'pending' },
            { label: 'Đồng ý', value: 'approved' },
            { label: 'Từ chối', value: 'rejected' },
          ],
          label: 'Kết quả',
        },
        {
          name: 'decided_at',
          type: 'date',
          label: 'Thời điểm quyết định',
          admin: {
            date: {
              displayFormat: 'yyyy-MM-dd HH:mm',
            },
          },
        },
        {
          name: 'note',
          type: 'textarea',
          label: 'Ghi chú',
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Ghi chú chung',
    },
  ],
  timestamps: true,
}

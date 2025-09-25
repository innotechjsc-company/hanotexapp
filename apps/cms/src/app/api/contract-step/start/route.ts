// API: Khởi tạo bước xử lý hợp đồng (ContractStep)
// - Endpoint: POST /api/contract-step/start
// - Mục đích: Tạo mới một bước trong quy trình hợp đồng (ký hợp đồng, tải tài liệu kèm theo, hoàn tất hợp đồng)
// - Đầu vào (JSON body):
//   {
//     contract_id: string, // ID hợp đồng bắt buộc
//     step: 'sign_contract' | 'upload_attachments' | 'complete_contract', // Bước cần khởi tạo
//     contract_file?: string, // ID file media cho bước ký hợp đồng (bắt buộc với sign_contract)
//     attachments?: string[], // Danh sách ID media cho bước tải tài liệu kèm theo
//     notes?: string // Ghi chú thêm
//   }
// - Xác thực: Yêu cầu người dùng đăng nhập (sử dụng session/cookie của Payload)
// - Xử lý:
//   1) Kiểm tra input và quyền
//   2) Lấy thông tin hợp đồng (để xác định 2 bên A/B)
//   3) Tạo ContractStep với approvals cho 2 bên ở trạng thái 'pending'
//   4) Trả về bản ghi ContractStep vừa tạo
//   Lưu ý: Các hooks của collection ContractStep sẽ tự đồng bộ trạng thái Contract tương ứng
// - Phản hồi:
//   201: { success: true, contract_step }
//   4xx/5xx: { success: false, error }
// - CORS: Tự động phản hồi preflight và gắn header theo cấu hình payload.config.ts
import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { authenticateUser } from '@/utils/auth-utils'

type StartContractStepBody = {
  contract_id: string
  step: 'sign_contract' | 'upload_attachments' | 'complete_contract'
  contract_file?: string
  attachments?: string[]
  notes?: string
}

// Tạo CORS headers động theo danh sách origin cho phép trong payload.config.ts
const buildCorsHeaders = async (req: Request) => {
  const config = await configPromise
  const origin = req.headers.get('origin') || ''
  const allowedOrigins = (config as any)?.cors || []
  const isAllowed = Array.isArray(allowedOrigins) && allowedOrigins.includes(origin)

  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    Vary: 'Origin',
  }

  if (isAllowed) {
    headers['Access-Control-Allow-Origin'] = origin
    headers['Access-Control-Allow-Credentials'] = 'true'
  }

  return headers
}

// Trả lời preflight CORS
export async function OPTIONS(req: NextRequest) {
  const corsHeaders = await buildCorsHeaders(req)
  return new Response(null, { status: 204, headers: corsHeaders })
}

// Khởi tạo ContractStep mới cho 1 hợp đồng
export async function POST(req: NextRequest) {
  try {
    const corsHeaders = await buildCorsHeaders(req)
    const body = (await req.json()) as StartContractStepBody

    // Validate đầu vào cơ bản
    if (!body?.contract_id) {
      return Response.json({ success: false, error: 'Missing contract_id' }, { status: 400, headers: corsHeaders })
    }
    if (!body?.step) {
      return Response.json({ success: false, error: 'Missing step' }, { status: 400, headers: corsHeaders })
    }

    // Xác thực người dùng
    const user = await authenticateUser(req as any, corsHeaders)
    const payload = await getPayload({ config: configPromise })

    // Lấy hợp đồng và xác định 2 bên tham gia
    const contract = await payload.findByID({ collection: 'contract', id: body.contract_id })
    if (!contract) {
      return Response.json({ success: false, error: 'Contract not found' }, { status: 404, headers: corsHeaders })
    }

    const userA = (contract as any).user_a
    const userB = (contract as any).user_b

    // Dựng dữ liệu tạo ContractStep (2 approvals cho A và B ở trạng thái pending)
    const data: any = {
      contract: body.contract_id,
      step: body.step,
      uploaded_by: (user as any).id,
      approvals: [
        { party: 'A', user: (userA as any)?.id || userA, decision: 'pending' },
        { party: 'B', user: (userB as any)?.id || userB, decision: 'pending' },
      ],
    }

    // Gán thêm file hợp đồng / tài liệu kèm theo theo từng bước
    if (body.notes) data.notes = body.notes
    if (body.step === 'sign_contract' && body.contract_file) data.contract_file = body.contract_file
    if (body.step === 'upload_attachments' && Array.isArray(body.attachments)) data.attachments = body.attachments

    // Tạo ContractStep
    const contractStep = await payload.create({
      collection: 'contract-step',
      data,
      overrideAccess: true,
    })

    return Response.json({ success: true, contract_step: contractStep }, { status: 201, headers: corsHeaders })
  } catch (e: any) {
    const message = e?.message || 'Unknown error'
    if (e instanceof Response) return e
    const corsHeaders = await buildCorsHeaders(req)
    return Response.json({ success: false, error: message }, { status: 500, headers: corsHeaders })
  }
}

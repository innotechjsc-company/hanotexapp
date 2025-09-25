// API: Phê duyệt bước xử lý hợp đồng (ContractStep)
// - Endpoint: POST /api/contract-step/approve
// - Mục đích: Cập nhật quyết định phê duyệt của Bên A/B cho một bước thuộc hợp đồng
// - Đầu vào (JSON body):
//   {
//     step_id: string,                 // ID bản ghi ContractStep cần phê duyệt
//     decision: 'approved'|'rejected', // Quyết định của bên
//     party?: 'A'|'B',                 // Bên đưa ra quyết định (tự xác định nếu bỏ trống dựa vào user đăng nhập)
//     note?: string                    // Ghi chú kèm theo
//   }
// - Xác thực: Yêu cầu đăng nhập (session/cookie Payload)
// - Xử lý:
//   1) Validate đầu vào, tải ContractStep
//   2) Xác định party nếu không truyền (so với user_a/user_b của Contract)
//   3) Cập nhật approvals tương ứng (decision, decided_at, user, note)
//   4) Trả về bản ghi ContractStep đã cập nhật
//   Lưu ý: Hooks của ContractStep sẽ tự tính status và đồng bộ trạng thái Contract
// - Phản hồi:
//   200: { success: true, contract_step }
//   4xx/5xx: { success: false, error }
// - CORS: Hỗ trợ preflight và gắn header theo payload.config.ts
import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { authenticateUser } from '@/utils/auth-utils'

type ApproveContractStepBody = {
  step_id: string
  decision: 'approved' | 'rejected'
  party?: 'A' | 'B'
  note?: string
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

// Cập nhật phê duyệt cho một ContractStep
export async function POST(req: NextRequest) {
  try {
    const corsHeaders = await buildCorsHeaders(req)
    const body = (await req.json()) as ApproveContractStepBody

    // Validate đầu vào cơ bản
    if (!body?.step_id) {
      return Response.json({ success: false, error: 'Missing step_id' }, { status: 400, headers: corsHeaders })
    }
    if (!body?.decision || !['approved', 'rejected'].includes(body.decision)) {
      return Response.json({ success: false, error: 'Invalid decision' }, { status: 400, headers: corsHeaders })
    }

    // Xác thực người dùng
    const user = await authenticateUser(req as any, corsHeaders)
    const payload = await getPayload({ config: configPromise })

    const step: any = await payload.findByID({ collection: 'contract-step', id: body.step_id })
    if (!step) {
      return Response.json({ success: false, error: 'Contract step not found' }, { status: 404, headers: corsHeaders })
    }

    // Xác định bên (A/B) nếu không truyền trong body
    let party: 'A' | 'B' | undefined = body.party
    if (!party) {
      const contract: any = await payload.findByID({ collection: 'contract', id: step.contract })
      const uid = (user as any).id
      if (contract?.user_a && ((contract.user_a as any)?.id || contract.user_a) === uid) party = 'A'
      if (contract?.user_b && ((contract.user_b as any)?.id || contract.user_b) === uid) party = party || 'B'
    }
    if (!party) {
      return Response.json(
        { success: false, error: 'Cannot determine party. Provide party A/B or use a bound account.' },
        { status: 400, headers: corsHeaders },
      )
    }

    const now = new Date().toISOString()
    const approvals: any[] = Array.isArray(step.approvals) ? step.approvals : []
    let found = false
    const updatedApprovals = approvals.map((a) => {
      if (a?.party === party) {
        found = true
        return {
          ...a,
          user: (user as any).id,
          decision: body.decision,
          decided_at: now,
          note: body.note ?? a?.note,
        }
      }
      return a
    })
    if (!found) {
      // Nếu thiếu dòng approvals cho party này, thêm mới
      updatedApprovals.push({
        party,
        user: (user as any).id,
        decision: body.decision,
        decided_at: now,
        note: body.note,
      })
    }

    const updatedStep = await payload.update({
      collection: 'contract-step',
      id: body.step_id,
      data: { approvals: updatedApprovals },
      overrideAccess: true,
    })

    return Response.json({ success: true, contract_step: updatedStep }, { status: 200, headers: corsHeaders })
  } catch (e: any) {
    const message = e?.message || 'Unknown error'
    if (e instanceof Response) return e
    const corsHeaders = await buildCorsHeaders(req)
    return Response.json({ success: false, error: message }, { status: 500, headers: corsHeaders })
  }
}

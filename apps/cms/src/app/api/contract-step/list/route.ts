// API: Danh sách các bước xử lý hợp đồng (ContractStep)
// - Endpoint: GET /api/contract-step/list
// - Mục đích: Lấy danh sách ContractStep theo bộ lọc (hợp đồng/bước/trạng thái)
// - Tham số query:
//   - contract_id?: string  // Lọc theo hợp đồng
//   - step?: string         // Lọc theo bước (sign_contract | upload_attachments | complete_contract)
//   - status?: string       // Lọc theo trạng thái bước (pending | approved | rejected | cancelled)
// - Xác thực: Không bắt buộc (chỉ đọc)
// - Phản hồi:
//   200: { success: true, docs, totalDocs, page, limit, ... } (theo định dạng Payload find)
//   5xx: { success: false, error }
// - CORS: Hỗ trợ preflight và gắn header theo payload.config.ts
import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

// Tạo CORS headers động theo danh sách origin cho phép trong payload.config.ts
const buildCorsHeaders = async (req: Request) => {
  const config = await configPromise
  const origin = req.headers.get('origin') || ''
  const allowedOrigins = (config as any)?.cors || []
  const isAllowed = Array.isArray(allowedOrigins) && allowedOrigins.includes(origin)

  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

export async function GET(req: NextRequest) {
  const corsHeaders = await buildCorsHeaders(req)
  try {
    const { searchParams } = new URL(req.url)
    const contractId = searchParams.get('contract_id') || undefined
    const step = searchParams.get('step') || undefined
    const status = searchParams.get('status') || undefined

    const payload = await getPayload({ config: configPromise })

    const where: any = {}
    if (contractId) where.contract = { equals: contractId }
    if (step) where.step = { equals: step }
    if (status) where.status = { equals: status }

    const result = await payload.find({ collection: 'contract-step', where, sort: '-createdAt' })
    return Response.json({ success: true, ...result }, { status: 200, headers: corsHeaders })
  } catch (e: any) {
    const message = e?.message || 'Unknown error'
    return Response.json({ success: false, error: message }, { status: 500, headers: corsHeaders })
  }
}

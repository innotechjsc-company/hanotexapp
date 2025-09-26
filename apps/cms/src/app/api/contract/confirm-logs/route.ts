import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { authenticateUser } from '@/utils/auth-utils'

type ConfirmContractLogBody = {
  contract_log_id: string
  status?: 'completed' | 'cancelled'
  reason?: string
  is_done_contract?: boolean
}

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

export async function OPTIONS(req: NextRequest) {
  const corsHeaders = await buildCorsHeaders(req)
  return new Response(null, { status: 204, headers: corsHeaders })
}

export async function POST(req: NextRequest) {
  try {
    const corsHeaders = await buildCorsHeaders(req)
    const body = (await req.json()) as ConfirmContractLogBody

    if (!body?.contract_log_id) {
      return Response.json(
        { success: false, error: 'Missing contract_log_id' },
        { status: 400, headers: corsHeaders },
      )
    }

    if (body?.status && !['completed', 'cancelled'].includes(body.status)) {
      return Response.json(
        { success: false, error: 'Invalid status value' },
        { status: 400, headers: corsHeaders },
      )
    }

    if (body?.status === 'cancelled' && !body?.reason) {
      return Response.json(
        { success: false, error: 'Reason is required when cancelling' },
        { status: 400, headers: corsHeaders },
      )
    }

    // Ensure user is authenticated
    await authenticateUser(req as any, corsHeaders)

    const payload = await getPayload({ config: configPromise })

    // 1) Load the contract log
    const log = await payload.findByID({ collection: 'contract-logs', id: body.contract_log_id })
    if (!log) {
      return Response.json(
        { success: false, error: 'Contract log not found' },
        { status: 404, headers: corsHeaders },
      )
    }

    // 2) Update the log status / reason / is_done_contract
    const updateData: Record<string, any> = {}
    if (body.status) updateData.status = body.status
    if (typeof body.is_done_contract === 'boolean')
      updateData.is_done_contract = body.is_done_contract
    if (body.status === 'cancelled' && body.reason) updateData.reason = body.reason

    const updatedLog = await payload.update({
      collection: 'contract-logs',
      id: body.contract_log_id,
      data: updateData,
      overrideAccess: true,
    })

    // 3) If contract is marked done, set related TechnologyPropose to completed
    if (body.is_done_contract === true) {
      try {
        const technologyProposeId = (updatedLog as any)?.technology_propose?.id
          ? (updatedLog as any).technology_propose.id
          : (updatedLog as any).technology_propose

        if (!technologyProposeId) {
          return Response.json(
            {
              success: false,
              error: 'Missing technology_propose relation on contract log',
            },
            { status: 400, headers: corsHeaders },
          )
        }

        const updatedTechnologyPropose = await payload.update({
          collection: 'technology-propose',
          id: String(technologyProposeId),
          data: { status: 'completed' },
          overrideAccess: true,
        })

        return Response.json(
          {
            success: true,
            contract_log: updatedLog,
            technology_propose: updatedTechnologyPropose,
          },
          { status: 200, headers: corsHeaders },
        )
      } catch (err: any) {
        // If updating technology propose fails, return error
        return Response.json(
          { success: false, error: err?.message || 'Failed to update technology-propose' },
          { status: 500, headers: corsHeaders },
        )
      }
    }

    // If not marking contract done, just return updated log
    return Response.json(
      { success: true, contract_log: updatedLog },
      { status: 200, headers: corsHeaders },
    )
  } catch (e: any) {
    if (e instanceof Response) return e
    const corsHeaders = await buildCorsHeaders(req)
    return Response.json(
      { success: false, error: e?.message || 'Unknown error' },
      { status: 500, headers: corsHeaders },
    )
  }
}

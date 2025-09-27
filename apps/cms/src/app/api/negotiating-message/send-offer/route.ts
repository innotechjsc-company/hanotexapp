import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { authenticateUser } from '@/utils/auth-utils'

type SendOfferBody = {
  // Support any single propose type
  technology_propose?: string
  project_propose?: string
  propose?: string
  message?: string
  price: number
  content?: string
}

const buildCorsHeaders = async (req: Request) => {
  const config = await configPromise
  const origin = req.headers.get('origin') || ''
  const allowedOrigins = Array.isArray((config as { cors?: string[] } | undefined)?.cors)
    ? ((config as { cors?: string[] }).cors as string[])
    : []
  const isAllowed = Array.isArray(allowedOrigins) && allowedOrigins.includes(origin)

  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    Vary: 'Origin',
  }

  if (isAllowed) {
    headers['Access-Control-Allow-Origin'] = origin
    // Allow credentials if using cookies/session
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
    const body = (await req.json()) as SendOfferBody

    // Determine which relation is provided (exactly one)
    const providedRelations = ['technology_propose', 'project_propose', 'propose'] as const
    const relationKey = providedRelations.find((k) => (body as Record<string, unknown>)[k])

    if (!relationKey) {
      return Response.json(
        { error: 'Missing relation: provide one of technology_propose, project_propose, propose' },
        { status: 400, headers: corsHeaders },
      )
    }
    // Ensure only one is provided
    const providedCount = providedRelations.filter(
      (k) => (body as Record<string, unknown>)[k],
    ).length
    if (providedCount !== 1) {
      return Response.json(
        { error: 'Provide exactly one of technology_propose, project_propose, propose' },
        { status: 400, headers: corsHeaders },
      )
    }
    if (!body?.message) {
      return Response.json({ error: 'Missing message' }, { status: 400, headers: corsHeaders })
    }
    if (typeof body?.price !== 'number') {
      return Response.json(
        { error: 'Missing or invalid price' },
        { status: 400, headers: corsHeaders },
      )
    }
    if (!body?.content) {
      return Response.json({ error: 'Missing content' }, { status: 400, headers: corsHeaders })
    }

    const user = await authenticateUser(req, corsHeaders)

    const payload = await getPayload({ config: configPromise })

    // 1) Create negotiating message, mark as offer
    const negotiatingMessage = await payload.create({
      collection: 'negotiating-messages',
      data: {
        [relationKey]: (body as Record<string, unknown>)[relationKey],
        message: body.message,
        is_offer: true,
        user: user.id,
      },
      overrideAccess: true,
    })

    // 2) Create offer linked to negotiating message
    const offer = await payload.create({
      collection: 'offer',
      data: {
        [relationKey]: (body as Record<string, unknown>)[relationKey],
        negotiating_messages: (negotiatingMessage as { id: string }).id,
        content: body.content,
        price: body.price,
        // status defaults to 'pending'
      },
      overrideAccess: true,
    })

    // 3) Link offer back to negotiating message
    await payload.update({
      collection: 'negotiating-messages',
      id: (negotiatingMessage as { id: string }).id,
      data: { offer: (offer as { id: string }).id },
      overrideAccess: true,
    })

    return Response.json(
      {
        success: true,
        negotiating_message: negotiatingMessage,
        offer,
      },
      { status: 201, headers: corsHeaders },
    )
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    // If authenticateUser threw a Response with CORS headers, forward it
    if (e instanceof Response) return e
    const corsHeaders = await buildCorsHeaders(req)
    return Response.json({ success: false, error: message }, { status: 500, headers: corsHeaders })
  }
}

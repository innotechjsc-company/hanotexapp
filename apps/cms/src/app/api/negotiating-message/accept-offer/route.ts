import { NextRequest } from 'next/server'
import { getPayload, type CollectionSlug } from 'payload'
import configPromise from '@payload-config'
import { authenticateUser } from '@/utils/auth-utils'

type AcceptOfferBody = {
  offer_id: string
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

    const body = (await req.json()) as AcceptOfferBody
    console.log('body', body)
    if (!body?.offer_id) {
      return Response.json(
        { success: false, error: 'Missing offer_id' },
        { status: 400, headers: corsHeaders },
      )
    }

    // Ensure user is authenticated
    await authenticateUser(req as any, corsHeaders)

    const payload = await getPayload({ config: configPromise })

    // 1) Load the offer
    const offer = await payload.findByID({ collection: 'offer', id: body.offer_id })
    if (!offer) {
      return Response.json(
        { success: false, error: 'Offer not found' },
        { status: 404, headers: corsHeaders },
      )
    }
    if ((offer as any).status === 'accepted') {
      return Response.json(
        { success: false, error: 'Offer already accepted' },
        { status: 400, headers: corsHeaders },
      )
    }

    // 2) Update offer status -> accepted
    const updatedOffer = await payload.update({
      collection: 'offer',
      id: body.offer_id,
      data: { status: 'accepted' },
      overrideAccess: true,
    })

    // 3) Update TechnologyPropose status -> contact_signing
    const technologyProposeId = (offer as any).technology_propose.id
    if (!technologyProposeId) {
      return Response.json(
        { success: false, error: 'Offer missing technology_propose relation' },
        { status: 400, headers: corsHeaders },
      )
    }

    const technologyPropose = await payload.update({
      collection: 'technology-propose',
      id: technologyProposeId,
      data: { status: 'contact_signing' },
      overrideAccess: true,
    })

    // 4) Create contract
    // We need user_a (technology submitter) and user_b (propose user)
    const technologyId = (technologyPropose as any).technology.id
    const proposeUserId = (technologyPropose as any).user

    const technology = await payload.findByID({ collection: 'technologies', id: technologyId })
    const submitterId = (technology as any)?.submitter

    if (!submitterId || !proposeUserId) {
      return Response.json(
        { success: false, error: 'Unable to resolve contract parties' },
        { status: 400, headers: corsHeaders },
      )
    }

    const contract = await payload.create({
      collection: 'contract' as CollectionSlug,
      data: {
        user_a: (submitterId as any)?.id || '',
        user_b: (proposeUserId as any)?.id || '',
        technologies: [technologyId],
        technology_propose: technologyProposeId,
        offer: (updatedOffer as any).id,
        price: (updatedOffer as any).price,
      } as any,
      overrideAccess: true,
    })

    return Response.json(
      { success: true, offer: updatedOffer, technology_propose: technologyPropose, contract },
      { status: 200, headers: corsHeaders },
    )
  } catch (e: any) {
    const message = e?.message || 'Unknown error'
    if (e instanceof Response) return e
    const corsHeaders = await buildCorsHeaders(req)
    return Response.json({ success: false, error: message }, { status: 500, headers: corsHeaders })
  }
}

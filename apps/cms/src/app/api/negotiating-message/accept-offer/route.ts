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
    const offer = await payload.findByID({ collection: 'offer', id: body.offer_id, depth: 1 })
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

    // Detect which propose type the offer belongs to
    const offerAny: any = offer
    const techPropId = offerAny?.technology_propose?.id || offerAny?.technology_propose
    const projPropId = offerAny?.project_propose?.id || offerAny?.project_propose
    const propId = offerAny?.propose?.id || offerAny?.propose

    // Branch: technology-propose
    if (techPropId) {
      const technologyPropose = await payload.update({
        collection: 'technology-propose',
        id: String(techPropId),
        data: { status: 'contact_signing' },
        overrideAccess: true,
      })

      const technologyId = (technologyPropose as any).technology?.id || (technologyPropose as any).technology
      const proposeUserId = (technologyPropose as any).user?.id || (technologyPropose as any).user

      const technology = await payload.findByID({ collection: 'technologies', id: String(technologyId) })
      const submitterId = (technology as any)?.submitter?.id || (technology as any)?.submitter

      if (!submitterId || !proposeUserId) {
        return Response.json(
          { success: false, error: 'Unable to resolve contract parties' },
          { status: 400, headers: corsHeaders },
        )
      }

      const contract = await payload.create({
        collection: 'contract' as CollectionSlug,
        data: {
          user_a: String(submitterId),
          user_b: String(proposeUserId),
          technologies: [String(technologyId)],
          technology_propose: String(techPropId),
          offer: (updatedOffer as any).id,
          price: (updatedOffer as any).price,
        } as any,
        overrideAccess: true,
      })

      return Response.json(
        { success: true, offer: updatedOffer, technology_propose: technologyPropose, contract },
        { status: 200, headers: corsHeaders },
      )
    }

    // Branch: project-propose
    if (projPropId) {
      const projectPropose = await payload.update({
        collection: 'project-propose',
        id: String(projPropId),
        data: { status: 'contact_signing' },
        overrideAccess: true,
      })

      const projectId = (projectPropose as any).project?.id || (projectPropose as any).project
      const proposeUserId = (projectPropose as any).user?.id || (projectPropose as any).user

      const project = await payload.findByID({ collection: 'project', id: String(projectId), depth: 0 })
      const projectOwnerId = (project as any)?.user?.id || (project as any)?.user
      const projectTechs = Array.isArray((project as any)?.technologies)
        ? (project as any).technologies.map((t: any) => (typeof t === 'object' ? t.id : t))
        : []

      if (!projectOwnerId || !proposeUserId || projectTechs.length === 0) {
        return Response.json(
          { success: false, error: 'Unable to resolve project parties or technologies' },
          { status: 400, headers: corsHeaders },
        )
      }

      const contract = await payload.create({
        collection: 'contract' as CollectionSlug,
        data: {
          user_a: String(projectOwnerId),
          user_b: String(proposeUserId),
          technologies: projectTechs.map(String),
          project_propose: String(projPropId),
          offer: (updatedOffer as any).id,
          price: (updatedOffer as any).price,
        } as any,
        overrideAccess: true,
      })

      return Response.json(
        { success: true, offer: updatedOffer, project_propose: projectPropose, contract },
        { status: 200, headers: corsHeaders },
      )
    }

    // Branch: propose (demand -> technology)
    if (propId) {
      const propose = await payload.update({
        collection: 'propose',
        id: String(propId),
        data: { status: 'contact_signing' },
        overrideAccess: true,
      })

      const technologyId = (propose as any).technology?.id || (propose as any).technology
      const demandId = (propose as any).demand?.id || (propose as any).demand

      // Parties: technology.submitter and demand.user
      const technology = await payload.findByID({ collection: 'technologies', id: String(technologyId) })
      const demand = await payload.findByID({ collection: 'demand', id: String(demandId) })
      const submitterId = (technology as any)?.submitter?.id || (technology as any)?.submitter
      const demandOwnerId = (demand as any)?.user?.id || (demand as any)?.user

      if (!submitterId || !demandOwnerId) {
        return Response.json(
          { success: false, error: 'Unable to resolve demand/technology parties' },
          { status: 400, headers: corsHeaders },
        )
      }

      const contract = await payload.create({
        collection: 'contract' as CollectionSlug,
        data: {
          user_a: String(submitterId),
          user_b: String(demandOwnerId),
          technologies: [String(technologyId)],
          propose: String(propId),
          offer: (updatedOffer as any).id,
          price: (updatedOffer as any).price,
        } as any,
        overrideAccess: true,
      })

      return Response.json(
        { success: true, offer: updatedOffer, propose, contract },
        { status: 200, headers: corsHeaders },
      )
    }

    return Response.json(
      { success: false, error: 'Offer has no related proposal' },
      { status: 400, headers: corsHeaders },
    )
  } catch (e: any) {
    const message = e?.message || 'Unknown error'
    if (e instanceof Response) return e
    const corsHeaders = await buildCorsHeaders(req)
    return Response.json({ success: false, error: message }, { status: 500, headers: corsHeaders })
  }
}

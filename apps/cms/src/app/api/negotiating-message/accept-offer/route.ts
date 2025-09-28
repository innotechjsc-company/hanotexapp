import {  NextRequest  } from 'next/server'
import { handleCORSPreflight, corsResponse, corsErrorResponse } from '@/utils/cors'
import { getPayload, type CollectionSlug } from 'payload'
import configPromise from '@payload-config'
import { authenticateUser } from '@/utils/auth-utils'
import type { Offer, TechnologyPropose, ProjectPropose, Propose, Technology } from '@/payload-types'
import { notificationManager } from '@/app/api/createNotification'

type AcceptOfferBody = {
  offer_id: string
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
    await authenticateUser(req, corsHeaders)

    const payload = await getPayload({ config: configPromise })

    // 1) Load the offer
    const offer = (await payload.findByID({
      collection: 'offer',
      id: body.offer_id,
      depth: 1,
    })) as Offer | null
    if (!offer) {
      return Response.json(
        { success: false, error: 'Offer not found' },
        { status: 404, headers: corsHeaders },
      )
    }
    if (offer.status === 'accepted') {
      return Response.json(
        { success: false, error: 'Offer already accepted' },
        { status: 400, headers: corsHeaders },
      )
    }

    // 2) Update offer status -> accepted
    const updatedOffer = (await payload.update({
      collection: 'offer',
      id: body.offer_id,
      data: { status: 'accepted' },
      overrideAccess: true,
    })) as Offer

    // Detect which propose type the offer belongs to
    const techPropRel = offer.technology_propose
    const projPropRel = offer.project_propose
    const propRel = offer.propose
    const techPropId =
      typeof techPropRel === 'object' && techPropRel !== null
        ? techPropRel.id
        : (techPropRel ?? undefined)
    const projPropId =
      typeof projPropRel === 'object' && projPropRel !== null
        ? projPropRel.id
        : (projPropRel ?? undefined)
    const propId =
      typeof propRel === 'object' && propRel !== null ? propRel.id : (propRel ?? undefined)

    // Branch: technology-propose
    if (techPropId) {
      const technologyPropose = (await payload.update({
        collection: 'technology-propose',
        id: String(techPropId),
        data: { status: 'contact_signing' },
        overrideAccess: true,
      })) as TechnologyPropose

      const techRel = technologyPropose.technology
      const userRel = technologyPropose.user
      const technologyId = typeof techRel === 'object' && techRel !== null ? techRel.id : techRel
      const proposeUserId = typeof userRel === 'object' && userRel !== null ? userRel.id : userRel

      const technology = (await payload.findByID({
        collection: 'technologies',
        id: String(technologyId),
      })) as Technology | null
      const submitterRel = technology?.submitter
      const submitterId =
        submitterRel && (typeof submitterRel === 'object' ? submitterRel.id : submitterRel)

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
          offer: updatedOffer.id,
          price: updatedOffer.price,
          status: 'in_progress',
        },
        overrideAccess: true,
      })

      // Tạo notifications sau khi accept offer thành công
      try {
        // Notification cho người đề xuất (proposer)
        const proposerNotification = await notificationManager.createNotification({
          user: String(proposeUserId),
          title: `Offer của bạn đã được chấp nhận`,
          message: `Offer của bạn với giá ${updatedOffer.price?.toLocaleString() || 'N/A'} VNĐ cho công nghệ "${technology?.title || 'N/A'}" đã được chấp nhận. Hợp đồng đã được tạo và sẵn sàng ký kết.`,
          type: 'success',
          action_url: `technologies/negotiations/${contract.id}`,
          priority: 'high',
        })
      } catch (notificationError) {
        console.error('❌ Error creating notifications for technology-propose:', notificationError)
        // Không throw error để không ảnh hưởng đến response chính
      }

      return Response.json(
        { success: true, offer: updatedOffer, technology_propose: technologyPropose, contract },
        { status: 200, headers: corsHeaders },
      )
    }

    // Branch: project-propose
    if (projPropId) {
      const projectPropose = (await payload.update({
        collection: 'project-propose',
        id: String(projPropId),
        data: { status: 'contact_signing' },
        overrideAccess: true,
      })) as ProjectPropose

      const projectRel = projectPropose.project
      const proposeUserRel = projectPropose.user
      const projectId =
        typeof projectRel === 'object' && projectRel !== null ? projectRel.id : projectRel
      const proposeUserId =
        typeof proposeUserRel === 'object' && proposeUserRel !== null
          ? proposeUserRel.id
          : proposeUserRel

      const project = (await payload.findByID({
        collection: 'project',
        id: String(projectId),
        depth: 0,
      })) as {
        user?: string | { id: string }
        technologies?: Array<string | { id: string }>
      } | null
      const projectOwnerRel = project?.user
      const projectOwnerId =
        projectOwnerRel &&
        (typeof projectOwnerRel === 'object' ? projectOwnerRel.id : projectOwnerRel)
      const projectTechs = Array.isArray(project?.technologies)
        ? (project?.technologies as Array<string | { id: string }>).map((t) =>
            typeof t === 'object' ? t.id : t,
          )
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
          offer: updatedOffer.id,
          price: updatedOffer.price,
          status: 'in_progress',
        },
        overrideAccess: true,
      })

      // Tạo notifications sau khi accept offer thành công
      try {
        console.log('🎯 Creating notifications for accept offer (project-propose)...')

        const proposerNotification = await notificationManager.createNotification({
          user: String(proposeUserId),
          title: `Offer của bạn đã được chấp nhận`,
          message: `Offer của bạn với giá ${updatedOffer.price?.toLocaleString() || 'N/A'} VNĐ cho dự án đã được chấp nhận. Hợp đồng đã được tạo và sẵn sàng ký kết.`,
          type: 'success',
          action_url: `technologies/negotiations/${contract.id}`,
          priority: 'high',
        })
      } catch (notificationError) {
        console.error('❌ Error creating notifications for project-propose:', notificationError)
      }

      return Response.json(
        { success: true, offer: updatedOffer, project_propose: projectPropose, contract },
        { status: 200, headers: corsHeaders },
      )
    }

    // Branch: propose (demand -> technology)
    if (propId) {
      const propose = (await payload.update({
        collection: 'propose',
        id: String(propId),
        data: { status: 'contact_signing' },
        overrideAccess: true,
      })) as Propose

      const technologyRel = propose.technology
      const demandRel = propose.demand
      const technologyId =
        typeof technologyRel === 'object' && technologyRel !== null
          ? technologyRel.id
          : technologyRel
      const demandId =
        typeof demandRel === 'object' && demandRel !== null ? demandRel.id : demandRel

      // Parties: technology.submitter and demand.user
      const technology = (await payload.findByID({
        collection: 'technologies',
        id: String(technologyId),
      })) as Technology | null
      const demand = (await payload.findByID({ collection: 'demand', id: String(demandId) })) as {
        user?: string | { id: string }
      } | null
      const submitterRel = technology?.submitter
      const submitterId =
        submitterRel && (typeof submitterRel === 'object' ? submitterRel.id : submitterRel)
      const demandOwnerRel = demand?.user
      const demandOwnerId =
        demandOwnerRel && (typeof demandOwnerRel === 'object' ? demandOwnerRel.id : demandOwnerRel)

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
          offer: updatedOffer.id,
          price: updatedOffer.price,
          status: 'in_progress',
        },
        overrideAccess: true,
      })

      // Tạo notifications sau khi accept offer thành công
      try {
        console.log('🎯 Creating notifications for accept offer (propose)...')

        // Notification cho chủ sở hữu công nghệ (submitter)
        const submitterNotification = await notificationManager.createNotification({
          user: String(submitterId),
          title: `Offer của bạn đã được chấp nhận`,
          message: `Offer của bạn với giá ${updatedOffer.price?.toLocaleString() || 'N/A'} VNĐ cho công nghệ "${technology?.title || 'N/A'}" đã được chấp nhận. Hợp đồng đã được tạo và sẵn sàng ký kết.`,
          type: 'success',
          action_url: `technologies/negotiations/${contract.id}`,
          priority: 'high',
        })
      } catch (notificationError) {
        console.error('❌ Error creating notifications for propose:', notificationError)
        // Không throw error để không ảnh hưởng đến response chính
      }

      return Response.json(
        { success: true, offer: updatedOffer, propose, contract },
        { status: 200, headers: corsHeaders },
      )
    }

    return Response.json(
      { success: false, error: 'Offer has no related proposal' },
      { status: 400, headers: corsHeaders },
    )
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    if (e instanceof Response) return e
    const corsHeaders = await buildCorsHeaders(req)
    return Response.json({ success: false, error: message }, { status: 500, headers: corsHeaders })
  }
}

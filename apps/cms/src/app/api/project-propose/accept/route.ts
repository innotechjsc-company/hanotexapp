import {  NextRequest, NextResponse  } from 'next/server'
import { handleCORSPreflight, corsResponse, corsErrorResponse } from '@/utils/cors'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { ProjectPropose as ProjectProposeType } from '@/payload-types'
import { notificationManager } from '@/app/api/createNotification'

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  })
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const body = await request.json()

    const { projectProposeId, message } = body

    // Validate required fields
    if (!projectProposeId) {
      return NextResponse.json(
        { error: 'Project Propose ID is required' },
        { status: 400, headers: corsHeaders },
      )
    }

    // Get the project propose
    const projectPropose = (await payload.findByID({
      collection: 'project-propose',
      id: projectProposeId,
      depth: 1,
    })) as ProjectProposeType | null

    if (!projectPropose) {
      return NextResponse.json(
        { error: 'Project propose not found' },
        { status: 404, headers: corsHeaders },
      )
    }

    if (!projectPropose.user || typeof projectPropose.user === 'string') {
      return NextResponse.json({ error: 'User not found' }, { status: 404, headers: corsHeaders })
    }

    // Check if status is already negotiating or further
    if (
      projectPropose.status === 'negotiating' ||
      projectPropose.status === 'contract_signed' ||
      projectPropose.status === 'completed'
    ) {
      return NextResponse.json(
        { error: 'Proposal is already in negotiation or completed' },
        { status: 400, headers: corsHeaders },
      )
    }

    // Update project propose status to negotiating
    const updatedProjectPropose = await payload.update({
      collection: 'project-propose',
      id: projectProposeId,
      data: {
        status: 'negotiating',
      },
    })

    // Create the first negotiating message as an offer
    const negotiatingMessage = await payload.create({
      collection: 'negotiating-messages',
      data: {
        project_propose: projectProposeId,
        user:
          typeof projectPropose.user === 'object' ? projectPropose.user.id : projectPropose.user,
        message: message || 'Đã chấp nhận đề xuất và sẵn sàng đàm phán.',
        is_offer: true,
      },
    })

    // Create an offer linked to the negotiating message
    // Use proposal's investment_amount as initial price and the message as content
    const initialPrice =
      (projectPropose as unknown as { investment_amount?: number }).investment_amount || 0
    const offerContent = message || 'Đề xuất ban đầu được tạo khi chấp nhận đề xuất.'

    const offer = await payload.create({
      collection: 'offer',
      data: {
        project_propose: projectProposeId,
        negotiating_messages: (negotiatingMessage as { id: string }).id,
        content: offerContent,
        price: initialPrice,
      },
    })

    // Link the created offer back to the negotiating message
    await payload.update({
      collection: 'negotiating-messages',
      id: (negotiatingMessage as { id: string }).id,
      data: { offer: (offer as { id: string }).id },
    })

    // Tạo notifications sau khi accept project propose thành công
    try {
      console.log('🎯 Creating notifications for accept project propose...')

      // Lấy thông tin project owner
      const projectId =
        typeof projectPropose.project === 'string'
          ? projectPropose.project
          : projectPropose.project?.id
      let projectOwnerId = null
      let projectTitle = 'N/A'

      if (projectId) {
        const project = await payload.findByID({
          collection: 'project',
          id: projectId,
          depth: 1,
        })

        if (project) {
          projectTitle = (project as any).title || (project as any).name || 'N/A'
          projectOwnerId = typeof project.user === 'string' ? project.user : project.user?.id
        }
      }

      const proposeUserId =
        typeof projectPropose.user === 'string' ? projectPropose.user : projectPropose.user?.id

      // Sử dụng NotificationManager để tạo notifications
      const notificationResult = await notificationManager.notifyAcceptPropose({
        proposeId: projectProposeId,
        proposeType: 'project-propose',
        proposeOwnerId: proposeUserId,
        entityOwnerId: projectOwnerId || undefined,
        entityTitle: projectTitle,
        price: initialPrice,
        message:
          message ||
          `Đề xuất của bạn cho dự án "${projectTitle}" đã được chấp nhận và sẵn sàng đàm phán.`,
      })

      console.log(
        `✅ Created ${notificationResult.created} notifications for accept project propose`,
      )
      if (notificationResult.failed > 0) {
        console.log(
          `⚠️ Failed to create ${notificationResult.failed} notifications:`,
          notificationResult.errors,
        )
      }
    } catch (notificationError) {
      console.error(
        '❌ Error creating notifications for accept project propose:',
        notificationError,
      )
      // Không throw error để không ảnh hưởng đến response chính
    }

    return corsResponse({
        success: true,
        project_propose: updatedProjectPropose,
        negotiating_message: negotiatingMessage,
        offer,
        message: 'Proposal accepted and negotiation started successfully',
      },
      { headers: corsHeaders },
    )
  } catch (error) {
    console.error('Accept project proposal error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders },
    )
  }
}

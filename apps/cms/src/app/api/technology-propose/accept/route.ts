import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { TechnologyPropose as TechnologyProposeType } from '@/payload-types'
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

    const { technologyProposeId, message } = body

    // Validate required fields
    if (!technologyProposeId) {
      return NextResponse.json(
        { error: 'Technology Propose ID is required' },
        { status: 400, headers: corsHeaders },
      )
    }

    // Get the technology propose
    const technologyPropose = (await payload.findByID({
      collection: 'technology-propose',
      id: technologyProposeId,
      depth: 1,
    })) as TechnologyProposeType | null

    if (!technologyPropose) {
      return NextResponse.json(
        { error: 'Technology propose not found' },
        { status: 404, headers: corsHeaders },
      )
    }

    if (!technologyPropose.user || typeof technologyPropose.user === 'string') {
      return NextResponse.json({ error: 'User not found' }, { status: 404, headers: corsHeaders })
    }

    // Check if status is already negotiating or further
    if (
      technologyPropose.status === 'negotiating' ||
      technologyPropose.status === 'contract_signed' ||
      technologyPropose.status === 'completed'
    ) {
      return NextResponse.json(
        { error: 'Proposal is already in negotiation or completed' },
        { status: 400, headers: corsHeaders },
      )
    }

    // Update technology propose status to negotiating
    const updatedTechnologyPropose = await payload.update({
      collection: 'technology-propose',
      id: technologyProposeId,
      data: {
        status: 'negotiating',
      },
    })

    // Create the first negotiating message as an offer
    const negotiatingMessage = await payload.create({
      collection: 'negotiating-messages',
      data: {
        technology_propose: technologyProposeId,
        user:
          typeof technologyPropose.user === 'object'
            ? technologyPropose.user.id
            : technologyPropose.user,
        message: message || 'Đã chấp nhận đề xuất và sẵn sàng đàm phán giá.',
        is_offer: true,
      },
    })

    // Also create an offer and link it to this negotiating message
    // Use proposal's budget as initial price and the message as content
    const initialPrice = (technologyPropose as unknown as { budget?: number }).budget || 0
    const offerContent = message || 'Đề xuất giá ban đầu được tạo khi chấp nhận đề xuất.'

    const offer = await payload.create({
      collection: 'offer',
      data: {
        technology_propose: technologyProposeId,
        negotiating_messages: (negotiatingMessage as { id: string }).id,
        content: offerContent,
        price: initialPrice,
        // status defaults to 'pending'
      },
    })

    // Link the created offer back to the negotiating message
    await payload.update({
      collection: 'negotiating-messages',
      id: (negotiatingMessage as { id: string }).id,
      data: { offer: (offer as { id: string }).id },
    })

    // Tạo notifications sau khi accept technology propose thành công
    try {
      console.log('🎯 Creating notifications for accept technology propose...')

      // Lấy thông tin technology owner
      const technologyId =
        typeof technologyPropose.technology === 'string'
          ? technologyPropose.technology
          : technologyPropose.technology?.id
      let technologyOwnerId = null
      let technologyTitle = 'N/A'

      if (technologyId) {
        const technology = await payload.findByID({
          collection: 'technologies',
          id: technologyId,
          depth: 1,
        })

        if (technology) {
          technologyTitle = (technology as any).title || (technology as any).name || 'N/A'
          technologyOwnerId =
            typeof technology.submitter === 'string'
              ? technology.submitter
              : technology.submitter?.id
        }
      }

      const proposeUserId =
        typeof technologyPropose.user === 'string'
          ? technologyPropose.user
          : technologyPropose.user?.id

      // Sử dụng NotificationManager để tạo notifications
      const notificationResult = await notificationManager.notifyAcceptPropose({
        proposeId: technologyProposeId,
        proposeType: 'technology-propose',
        proposeOwnerId: proposeUserId,
        entityOwnerId: technologyOwnerId || undefined,
        entityTitle: technologyTitle,
        price: initialPrice,
        message:
          message ||
          `Đề xuất của bạn cho công nghệ "${technologyTitle}" đã được chấp nhận và sẵn sàng đàm phán.`,
      })

      console.log(
        `✅ Created ${notificationResult.created} notifications for accept technology propose`,
      )
      if (notificationResult.failed > 0) {
        console.log(
          `⚠️ Failed to create ${notificationResult.failed} notifications:`,
          notificationResult.errors,
        )
      }
    } catch (notificationError) {
      console.error(
        '❌ Error creating notifications for accept technology propose:',
        notificationError,
      )
      // Không throw error để không ảnh hưởng đến response chính
    }

    return NextResponse.json(
      {
        success: true,
        technology_propose: updatedTechnologyPropose,
        negotiating_message: negotiatingMessage,
        offer,
        message: 'Proposal accepted and negotiation started successfully',
      },
      { headers: corsHeaders },
    )
  } catch (error) {
    console.error('Accept proposal error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders },
    )
  }
}

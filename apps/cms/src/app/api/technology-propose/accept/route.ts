import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

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
    const technologyPropose = await payload.findByID({
      collection: 'technology-propose',
      id: technologyProposeId,
      depth: 1,
    })

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
        user: (technologyPropose as any).user?.id || (technologyPropose as any).user,
        message: message || 'Đã chấp nhận đề xuất và sẵn sàng đàm phán giá.',
        is_offer: true,
      },
    })

    // Also create an offer and link it to this negotiating message
    // Use proposal's budget as initial price and the message as content
    const initialPrice = (technologyPropose as any).budget || 0
    const offerContent =
      message || 'Đề xuất giá ban đầu được tạo khi chấp nhận đề xuất.'

    const offer = await payload.create({
      collection: 'offer',
      data: {
        technology_propose: technologyProposeId,
        negotiating_messages: (negotiatingMessage as any).id,
        content: offerContent,
        price: initialPrice,
        // status defaults to 'pending'
      },
    })

    // Link the created offer back to the negotiating message
    await payload.update({
      collection: 'negotiating-messages',
      id: (negotiatingMessage as any).id,
      data: { offer: (offer as any).id },
    })

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

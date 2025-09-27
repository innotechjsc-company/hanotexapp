import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Define supported propose types
type ProposeCollection = 'propose' | 'project-propose' | 'technology-propose'

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

    const { proposeId, proposeType, message } = body

    // Validate required fields
    if (!proposeId) {
      return NextResponse.json(
        { error: 'Propose ID is required' },
        { status: 400, headers: corsHeaders },
      )
    }

    if (
      !proposeType ||
      !['propose', 'project-propose', 'technology-propose'].includes(proposeType)
    ) {
      return NextResponse.json(
        {
          error: 'Valid propose type is required (propose, project-propose, or technology-propose)',
        },
        { status: 400, headers: corsHeaders },
      )
    }

    // Get the propose
    const propose = await payload.findByID({
      collection: proposeType as ProposeCollection,
      id: proposeId,
      depth: 1,
    })

    if (!propose) {
      return NextResponse.json(
        { error: 'Propose not found' },
        { status: 404, headers: corsHeaders },
      )
    }

    if (!propose.user || typeof propose.user === 'string') {
      return NextResponse.json({ error: 'User not found' }, { status: 404, headers: corsHeaders })
    }

    // Check if status is already negotiating or further
    if (
      propose.status === 'negotiating' ||
      propose.status === 'contract_signed' ||
      propose.status === 'completed'
    ) {
      return NextResponse.json(
        { error: 'Proposal is already in negotiation or completed' },
        { status: 400, headers: corsHeaders },
      )
    }

    // Update propose status to negotiating
    const updatedPropose = await payload.update({
      collection: proposeType as ProposeCollection,
      id: proposeId,
      data: {
        status: 'negotiating',
      },
    })

    // Create the first negotiating message as an offer
    const negotiatingMessageData: any = {
      user: typeof propose.user === 'object' ? propose.user.id : propose.user,
      message: message || 'Đã chấp nhận đề xuất và sẵn sàng đàm phán.',
      is_offer: true,
    }

    // Set the appropriate propose field based on type
    if (proposeType === 'technology-propose') {
      negotiatingMessageData.technology_propose = proposeId
    } else if (proposeType === 'project-propose') {
      negotiatingMessageData.project_propose = proposeId
    } else if (proposeType === 'propose') {
      negotiatingMessageData.propose = proposeId
    }

    const negotiatingMessage = await payload.create({
      collection: 'negotiating-messages',
      data: negotiatingMessageData,
    })

    // Also create an offer and link it to this negotiating message
    // Use proposal's budget/estimated_cost/investment_amount as initial price
    let initialPrice = 0
    if (proposeType === 'technology-propose') {
      initialPrice = (propose as any).budget || 0
    } else if (proposeType === 'propose') {
      initialPrice = (propose as any).estimated_cost || 0
    } else if (proposeType === 'project-propose') {
      initialPrice = (propose as any).investment_amount || 0
    }

    const offerContent = message || 'Đề xuất giá ban đầu được tạo khi chấp nhận đề xuất.'

    const offerData: any = {
      negotiating_messages: (negotiatingMessage as { id: string }).id,
      content: offerContent,
      price: initialPrice,
      // status defaults to 'pending'
    }

    // Set the appropriate propose field based on type
    if (proposeType === 'technology-propose') {
      offerData.technology_propose = proposeId
    } else if (proposeType === 'project-propose') {
      offerData.project_propose = proposeId
    } else if (proposeType === 'propose') {
      offerData.propose = proposeId
    }

    const offer = await payload.create({
      collection: 'offer',
      data: offerData,
    })

    // Link the created offer back to the negotiating message
    await payload.update({
      collection: 'negotiating-messages',
      id: (negotiatingMessage as { id: string }).id,
      data: { offer: (offer as { id: string }).id },
    })

    return NextResponse.json(
      {
        success: true,
        propose: updatedPropose,
        propose_type: proposeType,
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

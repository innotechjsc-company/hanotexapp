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

    const { projectProposeId, message } = body

    // Validate required fields
    if (!projectProposeId) {
      return NextResponse.json(
        { error: 'Project Propose ID is required' },
        { status: 400, headers: corsHeaders },
      )
    }

    // Get the project propose
    const projectPropose = await payload.findByID({
      collection: 'project-propose',
      id: projectProposeId,
      depth: 1,
    })

    if (!projectPropose) {
      return NextResponse.json(
        { error: 'Project propose not found' },
        { status: 404, headers: corsHeaders },
      )
    }

    if (!projectPropose.user || typeof (projectPropose as any).user === 'string') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers: corsHeaders },
      )
    }

    // Check if status is already negotiating or further
    if (
      (projectPropose as any).status === 'negotiating' ||
      (projectPropose as any).status === 'contract_signed' ||
      (projectPropose as any).status === 'completed'
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
        user: (projectPropose as any).user?.id || (projectPropose as any).user,
        message: message || 'Đã chấp nhận đề xuất và sẵn sàng đàm phán.',
        is_offer: true,
      },
    })

    // Create an offer linked to the negotiating message
    // Use proposal's investment_amount as initial price and the message as content
    const initialPrice = (projectPropose as any).investment_amount || 0
    const offerContent = message || 'Đề xuất ban đầu được tạo khi chấp nhận đề xuất.'

    const offer = await payload.create({
      collection: 'offer',
      data: {
        project_propose: projectProposeId,
        negotiating_messages: (negotiatingMessage as any).id,
        content: offerContent,
        price: initialPrice,
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


import { NextRequest, NextResponse } from 'next/server'
import { notificationManager, NegotiationContext } from '../NotificationManager'

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  })
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 API: Creating notifications for accept offer...')

    const body = await request.json()
    const { negotiationId, offerId, proposerId, acceptorId, price, message } = body

    // Validation
    if (!negotiationId || !offerId || !proposerId || !acceptorId || typeof price !== 'number') {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: negotiationId, offerId, proposerId, acceptorId, price',
        },
        { status: 400, headers: corsHeaders },
      )
    }

    // Create context
    const context: NegotiationContext = {
      negotiationId,
      offerId,
      proposerId,
      acceptorId,
      price,
      message,
    }

    // Create notifications
    const result = await notificationManager.notifyAcceptOffer(context)

    return NextResponse.json(
      {
        success: result.success,
        message: `Successfully created ${result.created} notification(s) for accept offer`,
        data: {
          created: result.created,
          failed: result.failed,
          results: result.results,
        },
        errors: result.errors,
      },
      { status: result.success ? 200 : 207, headers: corsHeaders },
    )
  } catch (error) {
    console.error('❌ Error in acceptOffer notification API:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500, headers: corsHeaders },
    )
  }
}

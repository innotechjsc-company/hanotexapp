import { NextRequest, NextResponse } from 'next/server'
import { notificationManager, ProposeContext } from '../NotificationManager'

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
    console.log('🚀 API: Creating notifications for accept propose...')

    const body = await request.json()
    const { proposeId, proposeType, proposeOwnerId, entityOwnerId, entityTitle, price, message } =
      body

    // Validation
    if (!proposeId || !proposeType || !proposeOwnerId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: proposeId, proposeType, proposeOwnerId',
        },
        { status: 400, headers: corsHeaders },
      )
    }

    if (!['technology-propose', 'project-propose', 'propose'].includes(proposeType)) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Invalid proposeType. Must be one of: technology-propose, project-propose, propose',
        },
        { status: 400, headers: corsHeaders },
      )
    }

    // Create context
    const context: ProposeContext = {
      proposeId,
      proposeType,
      proposeOwnerId,
      entityOwnerId,
      entityTitle,
      price,
      message,
    }

    // Create notifications
    const result = await notificationManager.notifyAcceptPropose(context)

    return NextResponse.json(
      {
        success: result.success,
        message: `Successfully created ${result.created} notification(s) for accept propose`,
        data: {
          created: result.created,
          failed: result.failed,
          results: result.results,
        },
        errors: result.errors,
      },
      { status: result.success ? 200 : 207, headers: corsHeaders }, // 207 for partial success
    )
  } catch (error) {
    console.error('❌ Error in acceptPropose notification API:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500, headers: corsHeaders },
    )
  }
}

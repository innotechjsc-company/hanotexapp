import { NextRequest, NextResponse } from 'next/server'
import { notificationManager, RoomMessageContext } from '../NotificationManager'

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
    console.log('🚀 API: Creating notifications for room message...')

    const body = await request.json()
    const { roomId, messageId, senderId, message, roomTitle } = body

    // Validation
    if (!roomId || !messageId || !senderId || !message) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: roomId, messageId, senderId, message',
        },
        { status: 400, headers: corsHeaders },
      )
    }

    // Create context
    const context: RoomMessageContext = {
      roomId,
      messageId,
      senderId,
      message,
      roomTitle,
    }

    // Create notifications
    const result = await notificationManager.notifyRoomMessage(context)

    return NextResponse.json(
      {
        success: result.success,
        message: `Successfully created ${result.created} notification(s) for room message`,
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
    console.error('❌ Error in roomMessage notification API:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500, headers: corsHeaders },
    )
  }
}

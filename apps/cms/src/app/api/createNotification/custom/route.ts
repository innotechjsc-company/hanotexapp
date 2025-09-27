import { NextRequest, NextResponse } from 'next/server'
import { notificationManager, NotificationType, NotificationPriority } from '../NotificationManager'

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
    console.log('🚀 API: Creating custom notifications...')

    const body = await request.json()
    const { userIds, title, message, type, action_url, priority } = body

    // Validation
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'userIds must be a non-empty array',
        },
        { status: 400, headers: corsHeaders },
      )
    }

    if (!title || !message || !type) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: title, message, type',
        },
        { status: 400, headers: corsHeaders },
      )
    }

    // Validate type
    const validTypes: NotificationType[] = [
      'info',
      'success',
      'warning',
      'error',
      'auction',
      'transaction',
      'technology',
      'system',
      'propose',
      'contract',
      'negotiation',
    ]

    if (!validTypes.includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid type. Must be one of: ${validTypes.join(', ')}`,
        },
        { status: 400, headers: corsHeaders },
      )
    }

    // Validate priority
    const validPriorities: NotificationPriority[] = ['low', 'normal', 'high', 'urgent']
    if (priority && !validPriorities.includes(priority)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid priority. Must be one of: ${validPriorities.join(', ')}`,
        },
        { status: 400, headers: corsHeaders },
      )
    }

    // Create custom notifications
    const result = await notificationManager.notifyCustom(userIds, {
      title,
      message,
      type,
      action_url,
      priority: priority || 'normal',
    })

    return NextResponse.json(
      {
        success: result.success,
        message: `Successfully created ${result.created} custom notification(s)`,
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
    console.error('❌ Error in custom notification API:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500, headers: corsHeaders },
    )
  }
}

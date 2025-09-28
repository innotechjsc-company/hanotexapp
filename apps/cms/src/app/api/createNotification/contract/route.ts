import {  NextRequest, NextResponse  } from 'next/server'
import { handleCORSPreflight, corsResponse, corsErrorResponse } from '@/utils/cors'
import { notificationManager, ContractContext } from '../NotificationManager'

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
    console.log('🚀 API: Creating notifications for contract...')

    const body = await request.json()
    const {
      contractId,
      userAId,
      userBId,
      contractTitle,
      price,
      status,
      action = 'created', // 'created' or 'status_change'
    } = body

    // Validation
    if (!contractId || !userAId || !userBId || !contractTitle || typeof price !== 'number') {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: contractId, userAId, userBId, contractTitle, price',
        },
        { status: 400, headers: corsHeaders },
      )
    }

    // Create context
    const context: ContractContext = {
      contractId,
      userAId,
      userBId,
      contractTitle,
      price,
      status: status || 'in_progress',
    }

    let result

    if (action === 'created') {
      // Create notifications for contract creation
      result = await notificationManager.notifyContractCreated(context)
    } else if (action === 'status_change') {
      // Create notifications for status change
      const { oldStatus } = body
      if (!oldStatus) {
        return NextResponse.json(
          {
            success: false,
            error: 'oldStatus is required for status_change action',
          },
          { status: 400, headers: corsHeaders },
        )
      }
      result = await notificationManager.notifyContractStatusChange(context, oldStatus, status)
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid action. Must be "created" or "status_change"',
        },
        { status: 400, headers: corsHeaders },
      )
    }

    return NextResponse.json(
      {
        success: result.success,
        message: `Successfully created ${result.created} notification(s) for contract ${action}`,
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
    console.error('❌ Error in contract notification API:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500, headers: corsHeaders },
    )
  }
}

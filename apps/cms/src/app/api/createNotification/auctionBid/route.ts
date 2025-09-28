import {  NextRequest, NextResponse  } from 'next/server'
import { handleCORSPreflight, corsResponse, corsErrorResponse } from '@/utils/cors'
import { notificationManager, AuctionContext } from '../NotificationManager'

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
    console.log('🚀 API: Creating notifications for auction bid...')

    const body = await request.json()
    const { auctionId, auctionTitle, bidderId, bidAmount, auctionOwnerId, isWinningBid } = body

    // Validation
    if (
      !auctionId ||
      !auctionTitle ||
      !bidderId ||
      !auctionOwnerId ||
      typeof bidAmount !== 'number'
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Missing required fields: auctionId, auctionTitle, bidderId, auctionOwnerId, bidAmount',
        },
        { status: 400, headers: corsHeaders },
      )
    }

    // Create context
    const context: AuctionContext = {
      auctionId,
      auctionTitle,
      bidderId,
      bidAmount,
      auctionOwnerId,
      isWinningBid: isWinningBid || false,
    }

    // Create notifications
    const result = await notificationManager.notifyAuctionBid(context)

    return NextResponse.json(
      {
        success: result.success,
        message: `Successfully created ${result.created} notification(s) for auction bid`,
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
    console.error('❌ Error in auctionBid notification API:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500, headers: corsHeaders },
    )
  }
}

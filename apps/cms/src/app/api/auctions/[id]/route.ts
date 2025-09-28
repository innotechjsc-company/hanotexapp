import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { authenticateUser } from '@/utils/auth-utils'
import { handleCORSPreflight, corsResponse, corsErrorResponse } from '@/utils/cors'

export async function OPTIONS() {
  return handleCORSPreflight()
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await getPayload({ config })
    const { id } = params

    if (!id) {
      return corsErrorResponse('Auction ID is required', 400)
    }

    // Fetch single auction from Payload CMS
    const auction = await payload.findByID({
      collection: 'auctions',
      id: id,
      depth: 2, // Include related data like seller, technology
    })

    if (!auction) {
      return corsErrorResponse('Auction not found', 404)
    }

    // Transform auction data to match expected API format
    const transformedAuction = {
      id: auction.id,
      title: auction.title || '',
      description: auction.description || '',
      currentBid: auction.current_bid || auction.starting_price || 0,
      minBid: auction.min_bid || auction.starting_price || 0,
      bidIncrement: auction.bid_increment || 100000,
      bidCount: auction.bid_count || 0,
      startTime: auction.start_time || auction.createdAt,
      endTime: auction.end_time,
      timeLeft: calculateTimeLeft(auction.end_time),
      viewers: auction.viewers || 0,
      isActive: auction.status === 'ACTIVE' && new Date() < new Date(auction.end_time),
      status: auction.status || 'unknown',
      location: auction.location || '',
      organizer: {
        name: typeof auction.seller === 'object' && auction.seller 
          ? auction.seller.full_name || auction.seller.email 
          : 'Không rõ',
        email: typeof auction.seller === 'object' && auction.seller 
          ? auction.seller.email 
          : '',
        phone: typeof auction.seller === 'object' && auction.seller 
          ? auction.seller.phone 
          : ''
      },
      documents: auction.documents || [],
      terms: auction.terms || [],
      bids: [] // Bids will be fetched separately via /api/auctions/[id]/bids
    }

    return corsResponse({
      success: true,
      data: transformedAuction,
      ...transformedAuction // For backward compatibility
    })
  } catch (error) {
    console.error('Auction fetch error:', error)
    return corsErrorResponse(
      `Failed to fetch auction: ${error instanceof Error ? error.message : 'Unknown error'}`,
      500
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const user = await authenticateUser(request)
    if (!user) {
      return corsErrorResponse('User not authenticated', 401)
    }

    const payload = await getPayload({ config })
    const { id } = params
    const body = await request.json()

    if (!id) {
      return corsErrorResponse('Auction ID is required', 400)
    }

    // Check if auction exists and user has permission
    const existingAuction = await payload.findByID({
      collection: 'auctions',
      id: id,
    })

    if (!existingAuction) {
      return corsErrorResponse('Auction not found', 404)
    }

    // Check if user is the seller or has admin role
    if (existingAuction.seller !== user.id && !user.roles?.includes('admin')) {
      return corsErrorResponse('Permission denied', 403)
    }

    // Update auction
    const updatedAuction = await payload.update({
      collection: 'auctions',
      id: id,
      data: body,
    })

    return corsResponse({
      success: true,
      data: updatedAuction,
      message: 'Auction updated successfully',
    })
  } catch (error) {
    if (error instanceof Response) {
      return error
    }

    console.error('Auction update error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update auction',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    // Authenticate user
    const user = await authenticateUser(request, corsHeaders)
    if (!user) {
      return corsErrorResponse('User not authenticated', 401)
    }

    const payload = await getPayload({ config })
    const { id } = params

    if (!id) {
      return corsErrorResponse('Auction ID is required', 400)
    }

    // Check if auction exists and user has permission
    const existingAuction = await payload.findByID({
      collection: 'auctions',
      id: id,
    })

    if (!existingAuction) {
      return corsErrorResponse('Auction not found', 404)
    }

    // Check if user is the seller or has admin role
    if (existingAuction.seller !== user.id && !user.roles?.includes('admin')) {
      return corsErrorResponse('Permission denied', 403)
    }

    // Don't allow deletion if auction is active and has bids
    if (existingAuction.status === 'ACTIVE' && (existingAuction.bid_count || 0) > 0) {
      return corsErrorResponse('Cannot delete active auction with bids', 400)
    }

    await payload.delete({
      collection: 'auctions',
      id: id,
    })

    return corsResponse({
      success: true,
      message: 'Auction deleted successfully',
    })
  } catch (error) {
    if (error instanceof Response) {
      return error
    }

    console.error('Auction deletion error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete auction',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

// Helper function to calculate time left
function calculateTimeLeft(endTime: string | Date): string {
  if (!endTime) return 'Không xác định'
  
  const now = new Date().getTime()
  const end = new Date(endTime).getTime()
  const timeLeft = end - now

  if (timeLeft <= 0) return 'Đã kết thúc'

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))

  if (days > 0) {
    return `${days} ngày ${hours} giờ`
  } else if (hours > 0) {
    return `${hours} giờ ${minutes} phút`
  } else {
    return `${minutes} phút`
  }
}
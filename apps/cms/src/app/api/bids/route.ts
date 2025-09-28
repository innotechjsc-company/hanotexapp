import { NextRequest, NextResponse } from 'next/server'
import { handleCORSPreflight, corsResponse, corsErrorResponse } from '@/utils/cors'
import { getPayload } from 'payload'
import config from '@payload-config'
import { authenticateUser } from '@/utils/auth-utils'

export async function OPTIONS() {
  return handleCORSPreflight()
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const auction_id = searchParams.get('auction_id')
    const bidder_id = searchParams.get('bidder_id')
    const status = searchParams.get('status')
    const sort = searchParams.get('sort') || '-createdAt' // Default to newest first

    // Build where clause for filtering
    const where: any = {}

    if (auction_id) {
      where.auction = { equals: auction_id }
    }

    if (bidder_id) {
      where.bidder = { equals: bidder_id }
    }

    if (status) {
      where.status = { equals: status }
    }

    // Fetch from Payload CMS bids collection
    const response = await payload.find({
      collection: 'bids',
      where: Object.keys(where).length > 0 ? where : undefined,
      limit: limit,
      page: page,
      sort: sort,
      depth: 2, // Include related auction data
    })

    // Transform bids data to match expected API format
    const bids = (response.docs || []).map((bid: any) => ({
      id: bid.id,
      auction_id: typeof bid.auction === 'object' && bid.auction ? bid.auction.id : bid.auction,
      auction_title: typeof bid.auction === 'object' && bid.auction ? bid.auction.title : null,
      bidder_id: bid.bidder || null,
      bidder_email: bid.bidder_email || null,
      bidder_name: bid.bidder_name || 'Ẩn danh',
      amount: bid.bid_amount || 0,
      currency: bid.currency || 'VND',
      bid_type: bid.bid_type || 'MANUAL',
      status: bid.status || 'ACTIVE',
      is_winning: Boolean(bid.is_winning),
      bid_time: bid.bid_time,
      created_at: bid.createdAt,
      updated_at: bid.updatedAt,
    }))

    return corsResponse({
      success: true,
      data: bids,
      pagination: {
        page: response.page,
        limit: response.limit,
        total: response.totalDocs,
        totalPages: response.totalPages,
        hasPrevPage: response.hasPrevPage,
        hasNextPage: response.hasNextPage,
        prevPage: response.prevPage,
        nextPage: response.nextPage,
      },
    })
  } catch (error) {
    console.error('Bids API error:', error)
    return corsErrorResponse(
      `Failed to fetch bids: ${error instanceof Error ? error.message : 'Unknown error'}`,
      500,
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await authenticateUser(request, {})
    if (!user) {
      return corsErrorResponse('User not authenticated', 401)
    }

    const payload = await getPayload({ config })
    const body = await request.json()
    const { auction_id, amount, bid_type } = body

    // Basic validation - only check required fields from client
    if (!auction_id) {
      return corsErrorResponse('Auction ID is required', 400)
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      return corsErrorResponse('Valid bid amount is required', 400)
    }
    // Create bid using authenticated user info and minimal client data
    const newBid = await payload.create({
      collection: 'bids',
      data: {
        auction: auction_id,
        bidder: user.id,
        bidder_email: user.email,
        bidder_name: user.full_name || user.email,
        bid_amount: amount,
        currency: 'VND',
        bid_type: bid_type || 'MANUAL',
        status: 'ACTIVE',
        is_winning: false,
        bid_time: new Date().toISOString(),
      },
    })

    // Return simplified response with user info from auth
    return corsResponse({
      success: true,
      data: {
        id: newBid.id,
        auction_id: auction_id,
        bidder_id: user.id,
        bidder_email: user.email,
        bidder_name: user.full_name || user.email,
        amount: amount,
        currency: 'VND',
        bid_type: bid_type || 'MANUAL',
        status: 'ACTIVE',
        is_winning: false,
        bid_time: newBid.bid_time,
        created_at: newBid.createdAt,
        updated_at: newBid.updatedAt,
      },
      message: 'Bid placed successfully',
    })
  } catch (error) {
    // If error is from authentication, return it directly
    if (error instanceof Response) {
      return error
    }

    console.error('Bid creation error:', error)
    return corsErrorResponse(
      `Failed to place bid: ${error instanceof Error ? error.message : 'Unknown error'}`,
      500,
    )
  }
}

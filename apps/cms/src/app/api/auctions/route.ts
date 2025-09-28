import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { authenticateUser } from '@/utils/auth-utils'
import { handleCORSPreflight, corsResponse, corsErrorResponse } from '@/utils/cors'

export async function OPTIONS() {
  return handleCORSPreflight()
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const seller_id = searchParams.get('seller_id')
    const technology_id = searchParams.get('technology_id')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || '-createdAt'

    // Build where clause for filtering
    const where: any = {}

    if (status) {
      where.status = { equals: status }
    }

    if (seller_id) {
      where.seller = { equals: seller_id }
    }

    if (technology_id) {
      where.technology = { equals: technology_id }
    }

    if (search) {
      where.or = [
        { title: { contains: search } },
        { description: { contains: search } }
      ]
    }

    // Fetch from Payload CMS auctions collection
    const response = await payload.find({
      collection: 'auctions',
      where: Object.keys(where).length > 0 ? where : undefined,
      limit: limit,
      page: page,
      sort: sort,
      depth: 2, // Include related data
    })

    // Transform auctions data to match expected API format
    const auctions = (response.docs || []).map((auction: any) => ({
      id: auction.id,
      title: auction.title || '',
      description: auction.description || '',
      currentBid: auction.current_bid || auction.starting_price || 0,
      minBid: auction.min_bid || auction.starting_price || 0,
      bidIncrement: auction.bid_increment || 100000,
      bidCount: auction.bid_count || 0,
      startTime: auction.start_time || auction.createdAt,
      endTime: auction.end_time,
      timeLeft: auction.time_left || 'Không xác định',
      viewers: auction.viewers || 0,
      isActive: auction.status === 'ACTIVE',
      status: auction.status || 'unknown',
      location: auction.location || '',
      organizer: {
        name: typeof auction.seller === 'object' && auction.seller ? auction.seller.full_name || auction.seller.email : 'Không rõ',
        email: typeof auction.seller === 'object' && auction.seller ? auction.seller.email : '',
        phone: typeof auction.seller === 'object' && auction.seller ? auction.seller.phone : ''
      },
      documents: auction.documents || [],
      terms: auction.terms || [],
      bids: [] // Bids will be fetched separately
    }))

    return corsResponse({
      success: true,
      data: auctions,
      docs: auctions,
      totalDocs: response.totalDocs,
      limit: response.limit,
      page: response.page,
      totalPages: response.totalPages,
      hasNextPage: response.hasNextPage,
      hasPrevPage: response.hasPrevPage,
      nextPage: response.nextPage,
      prevPage: response.prevPage
    })
  } catch (error) {
    console.error('Auctions API error:', error)
    return corsErrorResponse(
      `Failed to fetch auctions: ${error instanceof Error ? error.message : 'Unknown error'}`,
      500
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await authenticateUser(request)
    if (!user) {
      return corsErrorResponse('User not authenticated', 401)
    }

    const payload = await getPayload({ config })
    const body = await request.json()
    
    // Basic validation
    if (!body.title || !body.start_time || !body.end_time) {
      return corsErrorResponse('Title, start time and end time are required', 400)
    }

    // Create auction
    const newAuction = await payload.create({
      collection: 'auctions',
      data: {
        ...body,
        seller: user.id,
        status: body.status || 'DRAFT',
        current_bid: body.starting_price || 0,
        bid_count: 0,
        viewers: 0
      },
    })

    return corsResponse({
      success: true,
      data: newAuction,
      message: 'Auction created successfully',
    })
  } catch (error) {
    if (error instanceof Response) {
      return error
    }

    console.error('Auction creation error:', error)
    return corsErrorResponse(
      `Failed to create auction: ${error instanceof Error ? error.message : 'Unknown error'}`,
      500
    )
  }
}
import { NextResponse } from 'next/server'
import { handleCORSPreflight, corsResponse, corsErrorResponse } from '@/utils/cors'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function OPTIONS() {
  return handleCORSPreflight()
}

export async function POST(request: Request) {
  try {
    const payload = await getPayload({ config })
    const url = new URL(request.url)
    // Extract dynamic id from pathname: /api/auctions/{id}/bid
    const segments = url.pathname.split('/').filter(Boolean)
    const auctionId = segments[segments.indexOf('auctions') + 1]
    if (!auctionId) {
      return corsErrorResponse('Missing auction id in path', 400)
    }
    const body = await request.json()
    const { amount, bidder = 'anonymous', bidder_name, bidder_email, bid_type = 'MANUAL' } = body

    console.log('CMS Bid API called:', {
      auctionId,
      amount,
      bidder,
      body,
    })

    if (!amount || amount <= 0) {
      return corsErrorResponse('Invalid bid amount', 400)
    }

    // Get current auction
    const auction = await payload.findByID({
      collection: 'auctions',
      id: auctionId,
    })

    if (!auction) {
      return corsErrorResponse('Auction not found', 404)
    }

    // Validate bid
    const currentBid = auction.currentBid || auction.startingPrice || 0
    const minBid = currentBid + (auction.bidIncrement || 100000)

    if (amount < minBid) {
      return NextResponse.json(
        {
          success: false,
          error: `Bid must be at least ${minBid.toLocaleString()} VNĐ`,
        },
        { status: 400 },
      )
    }

    // Check if auction is still active
    if (new Date() > new Date(auction.endTime)) {
      return corsErrorResponse('Auction has ended', 400)
    }

    // Mark all previous bids as not winning
    const existingBids = await payload.find({
      collection: 'bids',
      where: {
        auction: {
          equals: auctionId,
        },
        is_winning: {
          equals: true,
        },
      },
    })

    // Update existing winning bids to not winning
    for (const bid of existingBids.docs) {
      await payload.update({
        collection: 'bids',
        id: bid.id,
        data: {
          is_winning: false,
        },
      })
    }

    // Create new bid record
    const newBid = await payload.create({
      collection: 'bids',
      data: {
        auction: auctionId,
        bidder: bidder, // TODO: Get from authentication
        bidder_name: bidder_name || 'Ẩn danh',
        bidder_email: bidder_email || null,
        bid_amount: amount,
        currency: 'VND',
        bid_type: bid_type,
        status: 'ACTIVE',
        bid_time: new Date().toISOString(),
        is_winning: true,
      },
    })

    // Update auction with new current bid
    const updatedAuction = await payload.update({
      collection: 'auctions',
      id: auctionId,
      data: {
        currentBid: amount,
      },
    })

    // Get bid count
    const bidCount = await payload.count({
      collection: 'bids',
      where: {
        auction: {
          equals: auctionId,
        },
      },
    })

    console.log('Bid placed successfully:', {
      bidId: newBid.id,
      auctionId,
      amount,
      bidCount: bidCount.totalDocs,
    })

    return corsResponse({
      success: true,
      message: 'Bid placed successfully',
      data: {
        bid: newBid,
        auction: updatedAuction,
        bidCount: bidCount.totalDocs,
      },
    })
  } catch (error) {
    console.error('CMS Bid API error:', error)
    return corsErrorResponse('Internal server error', 500)
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await getPayload({ config })
    const auctionId = params.id

    console.log('CMS Get Bids API called for auction:', auctionId)

    // Get auction to verify it exists
    const auction = await payload.findByID({
      collection: 'auctions',
      id: auctionId,
    })

    if (!auction) {
      return NextResponse.json(
        { success: false, error: 'Auction not found' },
        { status: 404 }
      )
    }

    // Get all bids for this auction
    const bids = await payload.find({
      collection: 'bids',
      where: {
        auction: {
          equals: auctionId
        }
      },
      sort: '-bid_time', // Sort by bid time, newest first
      depth: 1 // Include related data
    })

    // Transform bids for frontend
    const transformedBids = bids.docs.map((bid: any) => ({
      id: bid.id,
      amount: bid.bid_amount,
      bidder: bid.bidder?.name || bid.bidder || 'Ẩn danh',
      timestamp: new Date(bid.bid_time),
      isWinning: bid.is_winning || false,
      createdAt: bid.createdAt,
      updatedAt: bid.updatedAt
    }))

    console.log(`Found ${transformedBids.length} bids for auction ${auctionId}`)

    return NextResponse.json({
      success: true,
      data: {
        bids: transformedBids,
        total: bids.totalDocs,
        page: bids.page,
        totalPages: bids.totalPages
      }
    })

  } catch (error) {
    console.error('CMS Get Bids API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}





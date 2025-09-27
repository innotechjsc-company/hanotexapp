import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payload = await getPayload({ config })
    const auctionId = params.id
    const body = await request.json()
    const { amount, bidder = 'anonymous' } = body

    console.log('CMS Bid API called:', {
      auctionId,
      amount,
      bidder,
      body
    })

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid bid amount' },
        { status: 400 }
      )
    }

    // Get current auction
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

    // Validate bid
    const currentBid = auction.currentBid || auction.startingPrice || 0
    const minBid = currentBid + (auction.bidIncrement || 100000)

    if (amount < minBid) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Bid must be at least ${minBid.toLocaleString()} VNĐ` 
        },
        { status: 400 }
      )
    }

    // Check if auction is still active
    if (new Date() > new Date(auction.endTime)) {
      return NextResponse.json(
        { success: false, error: 'Auction has ended' },
        { status: 400 }
      )
    }

    // Mark all previous bids as not winning
    const existingBids = await payload.find({
      collection: 'bids',
      where: {
        auction: {
          equals: auctionId
        },
        is_winning: {
          equals: true
        }
      }
    })

    // Update existing winning bids to not winning
    for (const bid of existingBids.docs) {
      await payload.update({
        collection: 'bids',
        id: bid.id,
        data: {
          is_winning: false
        }
      })
    }

    // Create new bid record
    const newBid = await payload.create({
      collection: 'bids',
      data: {
        auction: auctionId,
        bidder: bidder, // TODO: Get from authentication
        bid_amount: amount,
        bid_time: new Date().toISOString(),
        is_winning: true
      }
    })

    // Update auction with new current bid
    const updatedAuction = await payload.update({
      collection: 'auctions',
      id: auctionId,
      data: {
        currentBid: amount
      }
    })

    // Get bid count
    const bidCount = await payload.count({
      collection: 'bids',
      where: {
        auction: {
          equals: auctionId
        }
      }
    })

    console.log('Bid placed successfully:', {
      bidId: newBid.id,
      auctionId,
      amount,
      bidCount: bidCount.totalDocs
    })

    return NextResponse.json({
      success: true,
      message: 'Bid placed successfully',
      data: {
        bid: newBid,
        auction: updatedAuction,
        bidCount: bidCount.totalDocs
      }
    })

  } catch (error) {
    console.error('CMS Bid API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}





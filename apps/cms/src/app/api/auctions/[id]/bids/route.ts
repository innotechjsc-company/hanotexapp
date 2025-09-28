import {  NextRequest, NextResponse  } from 'next/server'
import { handleCORSPreflight, corsResponse, corsErrorResponse } from '@/utils/cors'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Bid } from '@/payload-types'

export async function OPTIONS() {
  return handleCORSPreflight()
}

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await getPayload({ config })
    const { id: auctionId } = await ctx.params

    console.log('CMS Get Bids API called for auction:', auctionId)

    // Get auction to verify it exists
    const auction = await payload.findByID({
      collection: 'auctions',
      id: auctionId,
    })

    if (!auction) {
      return corsErrorResponse('Auction not found', 404)
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
    const transformedBids = bids.docs.map((bid: Bid) => ({
      id: bid.id,
      amount: bid.bid_amount,
      bidder_id: bid.bidder || 'anonymous',
      bidder_name: bid.bidder_name || 'Ẩn danh',
      bidder_email: bid.bidder_email || null,
      currency: bid.currency || 'VND',
      bid_type: bid.bid_type || 'MANUAL',
      status: bid.status || 'ACTIVE',
      timestamp: new Date(bid.bid_time),
      isWinning: bid.is_winning || false,
      bid_time: bid.bid_time,
      createdAt: bid.createdAt,
      updatedAt: bid.updatedAt
    }))

    console.log(`Found ${transformedBids.length} bids for auction ${auctionId}`)

    return corsResponse({
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
    return corsErrorResponse('Internal server error', 500)
  }
}

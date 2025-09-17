/**
 * Auction Types for Hanotex CMS
 * Định nghĩa các interface cho Auction collection
 */

import { Technology } from './Technology'
import { Bid } from './Bid'

// Enums cho Auction
export type AuctionType = 'ENGLISH' | 'DUTCH' | 'SEALED_BID'
export type AuctionStatus = 'SCHEDULED' | 'ACTIVE' | 'ENDED' | 'CANCELLED'

// Main Auction Interface
export interface Auction {
  id: string
  technology_id: string | Technology
  auction_type: AuctionType
  start_price?: number
  reserve_price?: number
  current_price?: number
  start_time?: string
  end_time?: string
  status: AuctionStatus

  // Related bids
  bids?: string[] | Bid[]

  // Timestamps
  createdAt: string
  updatedAt: string
}

// Types for form data and API responses
export interface AuctionCreateData
  extends Omit<Auction, 'id' | 'current_price' | 'bids' | 'createdAt' | 'updatedAt'> {}
export interface AuctionUpdateData extends Partial<AuctionCreateData> {}

// Auction summary for lists
export interface AuctionSummary {
  id: string
  technology_id: string | Technology
  auction_type: AuctionType
  current_price?: number
  start_time?: string
  end_time?: string
  status: AuctionStatus
  bid_count?: number
  createdAt: string
  updatedAt: string
}

// Active auction info for real-time updates
export interface ActiveAuctionInfo extends Auction {
  time_remaining?: number
  bid_count: number
  highest_bidder_id?: string
  is_user_bidding?: boolean
}

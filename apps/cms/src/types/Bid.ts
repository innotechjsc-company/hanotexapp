/**
 * Bid Types for Hanotex CMS
 * Định nghĩa các interface cho Bid collection
 */

import { User } from './User'
import { Auction } from './Auction'

// Main Bid Interface
export interface Bid {
  id: string
  auction_id: string | Auction
  bidder_id: string | User
  bid_amount: number
  bid_time: string
  is_winning: boolean

  // Timestamps
  createdAt: string
  updatedAt: string
}

// Types for form data and API responses
export interface BidCreateData extends Omit<Bid, 'id' | 'is_winning' | 'createdAt' | 'updatedAt'> {}
export interface BidUpdateData extends Partial<Pick<Bid, 'is_winning'>> {}

// Bid summary for auction display
export interface BidSummary {
  id: string
  bidder_id: string | User
  bid_amount: number
  bid_time: string
  is_winning: boolean
}

// Real-time bid update
export interface BidUpdate {
  auction_id: string
  new_bid: BidSummary
  previous_highest?: number
  bid_count: number
}

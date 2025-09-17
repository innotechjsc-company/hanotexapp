// Auction and Bid types for HANOTEX platform

import { AuctionType, AuctionStatus } from "./common";

// Auction interfaces
export interface Auction {
  id: string;
  technology_id: string;
  auction_type: AuctionType;
  start_price?: number;
  reserve_price?: number;
  current_price?: number;
  start_time?: Date;
  end_time?: Date;
  status: AuctionStatus;
  created_at: Date;
}

export interface Bid {
  id: string;
  auction_id: string;
  bidder_id: string;
  bid_amount: number;
  bid_time: Date;
  is_winning: boolean;
}

// Bid request
export interface BidRequest {
  auction_id: string;
  bid_amount: number;
}

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Gavel, 
  Clock, 
  Users, 
  DollarSign, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Timer
} from 'lucide-react';
import { useAuctionWebSocket } from '@/hooks/useWebSocket';
import { Auction, Bid } from '@/types';

interface LiveAuctionProps {
  auction: Auction;
  onBidPlaced?: (bid: Bid) => void;
  onAuctionEnd?: (auction: Auction) => void;
}

export default function LiveAuction({ auction, onBidPlaced, onAuctionEnd }: LiveAuctionProps) {
  const { data: session } = useSession();
  const { bids, currentPrice, auctionStatus, placeBid, isConnected } = useAuctionWebSocket(auction.id);
  
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [bidError, setBidError] = useState<string>('');

  // Calculate time remaining
  useEffect(() => {
    if (auction.end_time) {
      const endTime = new Date(auction.end_time).getTime();
      const now = new Date().getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeLeft(`${minutes}m ${seconds}s`);
        }
      } else {
        setTimeLeft('Auction Ended');
        if (onAuctionEnd) {
          onAuctionEnd(auction);
        }
      }
    }
  }, [auction.end_time, onAuctionEnd, auction]);

  // Set minimum bid amount
  useEffect(() => {
    const minBid = currentPrice > 0 ? currentPrice + 1000 : auction.start_price || 0;
    setBidAmount(minBid);
  }, [currentPrice, auction.start_price]);

  const handlePlaceBid = async () => {
    if (!session) {
      setBidError('You must be logged in to place a bid');
      return;
    }

    if (bidAmount <= currentPrice) {
      setBidError('Bid amount must be higher than current price');
      return;
    }

    if (auctionStatus === 'ENDED') {
      setBidError('Auction has ended');
      return;
    }

    setIsPlacingBid(true);
    setBidError('');

    try {
      placeBid(bidAmount);
      
      // Simulate bid placement
      const newBid: Bid = {
        id: Date.now().toString(),
        auction_id: auction.id,
        bidder_id: session.user.id,
        bid_amount: bidAmount,
        bid_time: new Date().toISOString(),
        is_winning: true,
        bidder_email: session.user.email,
        bidder_type: session.user.userType as any,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (onBidPlaced) {
        onBidPlaced(newBid);
      }
    } catch (error) {
      setBidError('Failed to place bid. Please try again.');
    } finally {
      setIsPlacingBid(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-600 bg-green-100';
      case 'ENDED':
        return 'text-red-600 bg-red-100';
      case 'SCHEDULED':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="h-4 w-4" />;
      case 'ENDED':
        return <AlertCircle className="h-4 w-4" />;
      case 'SCHEDULED':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Auction Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <Gavel className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">{auction.technology_title}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(auctionStatus)}`}>
                {getStatusIcon(auctionStatus)}
                <span>{auctionStatus}</span>
              </span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{bids.length} bids</span>
              </div>
              <div className="flex items-center space-x-1">
                <Timer className="h-4 w-4" />
                <span>{timeLeft}</span>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4" />
                <span>TRL {auction.trl_level}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Price & Bidding */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bidding Section */}
          <div>
            <div className="mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Current Highest Bid</p>
                <p className="text-4xl font-bold text-green-600">
                  ${currentPrice.toLocaleString()}
                </p>
                {auction.reserve_price && currentPrice < auction.reserve_price && (
                  <p className="text-sm text-orange-600 mt-2">
                    Reserve: ${auction.reserve_price.toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            {/* Bid Form */}
            {auctionStatus === 'ACTIVE' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Bid Amount
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(parseFloat(e.target.value) || 0)}
                      min={currentPrice + 1000}
                      step="1000"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter bid amount"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum bid: ${(currentPrice + 1000).toLocaleString()}
                  </p>
                </div>

                {bidError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{bidError}</p>
                  </div>
                )}

                <button
                  onClick={handlePlaceBid}
                  disabled={isPlacingBid || !session || !isConnected}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isPlacingBid ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Placing Bid...</span>
                    </>
                  ) : (
                    <>
                      <Gavel className="h-4 w-4" />
                      <span>Place Bid</span>
                    </>
                  )}
                </button>

                {!session && (
                  <p className="text-sm text-gray-600 text-center">
                    <a href="/auth/login" className="text-blue-600 hover:text-blue-800">
                      Sign in
                    </a> to place a bid
                  </p>
                )}

                {!isConnected && (
                  <p className="text-sm text-orange-600 text-center">
                    Connecting to auction...
                  </p>
                )}
              </div>
            )}

            {auctionStatus === 'ENDED' && (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Auction Ended</h3>
                <p className="text-gray-600">
                  Final price: <span className="font-semibold">${currentPrice.toLocaleString()}</span>
                </p>
              </div>
            )}
          </div>

          {/* Bid History */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bid History</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {bids.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No bids yet</p>
              ) : (
                bids.map((bid, index) => (
                  <div
                    key={bid.id}
                    className={`p-3 rounded-lg border ${
                      bid.is_winning 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          ${bid.bid_amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {bid.bidder_email}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {new Date(bid.bid_time).toLocaleTimeString()}
                        </p>
                        {bid.is_winning && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Winning
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Auction Info */}
      <div className="p-6 bg-gray-50 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium text-gray-900">Auction Type</p>
            <p className="text-gray-600 capitalize">{auction.auction_type.toLowerCase().replace('_', ' ')}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Starting Price</p>
            <p className="text-gray-600">${auction.start_price?.toLocaleString() || '0'}</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Submitter</p>
            <p className="text-gray-600">{auction.submitter_email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

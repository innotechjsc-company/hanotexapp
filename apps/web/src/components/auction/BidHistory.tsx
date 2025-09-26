"use client";

import { useState } from "react";
import { Clock, User, TrendingUp } from "lucide-react";

interface Bid {
  id: string;
  amount: number;
  bidder: string;
  timestamp: Date;
  isWinning: boolean;
}

interface BidHistoryProps {
  bids: Bid[];
  currentUser?: string;
}

export default function BidHistory({ bids, currentUser }: BidHistoryProps) {
  const [showAll, setShowAll] = useState(false);
  
  const displayedBids = showAll ? bids : bids.slice(0, 5);
  const hasMoreBids = bids.length > 5;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Lịch sử đấu giá
        </h3>
        <span className="text-sm text-gray-500">
          {bids.length} lượt đấu giá
        </span>
      </div>

      <div className="space-y-3">
        {displayedBids.map((bid, index) => (
          <div
            key={bid.id}
            className={`flex items-center justify-between p-3 rounded-lg ${
              bid.isWinning
                ? "bg-green-50 border border-green-200"
                : "bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="font-medium text-gray-900">
                  {(bid.amount || 0).toLocaleString()} VNĐ
                </span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span className={bid.bidder === currentUser ? "font-medium text-blue-600" : ""}>
                  {bid.bidder === currentUser ? "Bạn" : bid.bidder}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>{bid.timestamp ? new Date(bid.timestamp).toLocaleTimeString() : 'N/A'}</span>
            </div>
          </div>
        ))}

        {hasMoreBids && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full py-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {showAll ? "Ẩn bớt" : `Xem thêm ${bids.length - 5} lượt đấu giá`}
          </button>
        )}

        {bids.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Chưa có lượt đấu giá nào
          </div>
        )}
      </div>
    </div>
  );
}

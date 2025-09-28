"use client";

import React from "react";
import { CheckCircle, Crown, Trophy, Medal, User } from "lucide-react";

interface Bid {
  id: string;
  amount: number;
  bidder: string;
  timestamp: Date;
  isWinning: boolean;
}

interface AuctionResultsListProps {
  bids: Bid[];
}

export default function AuctionResultsList({ bids }: AuctionResultsListProps) {
  // Kiểm tra và lọc bỏ các bids không hợp lệ
  const validBids = bids.filter(
    (bid) =>
      bid &&
      typeof bid.amount === "number" &&
      bid.amount > 0 &&
      bid.bidder &&
      bid.bidder.trim() !== ""
  );

  // Sắp xếp bids theo amount từ cao xuống thấp
  const sortedBids = [...validBids].sort((a, b) => b.amount - a.amount);

  // Lấy top và loại bỏ duplicates (nếu cùng người bid nhiều lần)
  const uniqueBidders = new Map<string, Bid>();
  sortedBids.forEach((bid) => {
    const currentBid = uniqueBidders.get(bid.bidder);
    if (!currentBid || currentBid.amount < bid.amount) {
      uniqueBidders.set(bid.bidder, bid);
    }
  });

  const finalResults = Array.from(uniqueBidders.values()).sort(
    (a, b) => b.amount - a.amount
  );

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Trophy className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <User className="h-6 w-6 text-gray-400" />;
    }
  };

  const getRankBg = (index: number) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200";
      case 1:
        return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200";
      case 2:
        return "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200";
      default:
        return "bg-white border-gray-200";
    }
  };

  const getRankTextColor = (index: number) => {
    switch (index) {
      case 0:
        return "text-yellow-800";
      case 1:
        return "text-gray-800";
      case 2:
        return "text-amber-800";
      default:
        return "text-gray-800";
    }
  };

  if (!bids || bids.length === 0 || validBids.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
        <div className="text-gray-500 mb-4">
          <User className="h-12 w-12 mx-auto mb-4" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Chưa có người tham gia
        </h3>
        <p className="text-gray-600">
          Phiên đấu giá này chưa có ai tham gia đấu giá.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Kết quả đấu giá
            </h2>
            <p className="text-gray-600">
              Phiên đấu giá đã kết thúc với {finalResults.length} người tham gia
            </p>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-sm text-gray-500 mb-1">Giá trúng thầu</div>
            <div className="text-2xl sm:text-2xl font-bold text-green-600">
              {finalResults[0]?.amount?.toLocaleString() || 0} VNĐ
            </div>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="p-4 sm:p-6">
        <div className="space-y-4">
          {finalResults.map((bid, index) => (
            <div
              key={bid.id}
              className={`relative flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg border-2 transition-all space-y-3 sm:space-y-0 ${getRankBg(index)}`}
            >
              {/* Winner Badge */}
              {index === 0 && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-2 shadow-lg">
                  <CheckCircle className="h-4 w-4" />
                </div>
              )}

              <div className="flex items-center space-x-3 sm:space-x-4">
                {/* Rank */}
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border-2 border-gray-200">
                    <span
                      className={`font-bold text-base sm:text-lg ${getRankTextColor(index)}`}
                    >
                      #{index + 1}
                    </span>
                  </div>
                </div>

                {/* Rank Icon */}
                <div className="flex-shrink-0 hidden sm:block">
                  {getRankIcon(index)}
                </div>

                {/* Bidder Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      className={`font-semibold text-base sm:text-lg ${getRankTextColor(index)}`}
                    >
                      {bid.bidder}
                    </h3>
                    {index === 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Thắng cuộc
                      </span>
                    )}
                    {index < 3 && index > 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Top {index + 1}
                      </span>
                    )}
                    {/* Mobile Rank Icon */}
                    <div className="sm:hidden">{getRankIcon(index)}</div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Đấu giá lúc{" "}
                    {new Date(bid.timestamp).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>

              {/* Bid Amount */}
              <div className="text-left sm:text-right flex-shrink-0">
                <div
                  className={`text-lg sm:text-xl font-bold ${
                    index === 0
                      ? "text-green-600"
                      : index < 3
                        ? getRankTextColor(index)
                        : "text-gray-900"
                  }`}
                >
                  {bid.amount.toLocaleString()} VNĐ
                </div>
                {index === 0 && (
                  <div className="text-xs sm:text-sm text-green-600 font-medium">
                    Giá chiến thắng
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        {finalResults.length > 3 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {finalResults.length}
                </div>
                <div className="text-sm text-gray-600">Người tham gia</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {bids.length}
                </div>
                <div className="text-sm text-gray-600">Lượt đấu giá</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {(
                    (finalResults[0]?.amount || 0) -
                    (finalResults[finalResults.length - 1]?.amount || 0)
                  ).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Chênh lệch (VNĐ)</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

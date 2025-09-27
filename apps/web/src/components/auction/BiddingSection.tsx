"use client";

import { useState, useEffect } from "react";
import { Clock, TrendingUp, AlertCircle } from "lucide-react";

interface BiddingSectionProps {
  currentBid: number;
  minBid: number;
  bidIncrement: number;
  timeLeft: string;
  isActive: boolean;
  status?: 'upcoming' | 'active' | 'ended' | 'unknown';
  onBid: (amount: number) => void;
  onAutoBid: (maxAmount: number) => void;
}

export default function BiddingSection({
  currentBid,
  minBid,
  bidIncrement,
  timeLeft,
  isActive,
  status = 'unknown',
  onBid,
  onAutoBid,
}: BiddingSectionProps) {
  const [bidAmount, setBidAmount] = useState(minBid);
  const [autoBidAmount, setAutoBidAmount] = useState(minBid);
  const [showAutoBid, setShowAutoBid] = useState(false);

  const handleBid = () => {
    if (bidAmount >= minBid) {
      onBid(bidAmount);
    }
  };

  const handleAutoBid = () => {
    if (autoBidAmount >= minBid) {
      onAutoBid(autoBidAmount);
      setShowAutoBid(false);
    }
  };

  const quickBidAmounts = [
    minBid,
    minBid + bidIncrement,
    minBid + bidIncrement * 2,
    minBid + bidIncrement * 5,
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-red-500" />
          <span className="text-lg font-semibold text-gray-900">
            {timeLeft}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          <span className="text-sm text-gray-600">
            Giá hiện tại: <span className="font-semibold text-green-600">
              {(currentBid || 0).toLocaleString()} VNĐ
            </span>
          </span>
        </div>
      </div>

      {status === 'upcoming' ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                Đấu giá chưa bắt đầu
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                Đấu giá sẽ bắt đầu vào {timeLeft}. Vui lòng quay lại sau.
              </p>
            </div>
          </div>
        </div>
      ) : status === 'ended' ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Đấu giá đã kết thúc
              </h3>
              <p className="text-sm text-red-700 mt-1">
                Phiên đấu giá này đã hoàn thành.
              </p>
            </div>
          </div>
        </div>
      ) : isActive && status === 'active' ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số tiền đấu giá
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                min={minBid}
                step={bidIncrement}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Tối thiểu ${(minBid || 0).toLocaleString()} VNĐ`}
              />
              <button
                onClick={handleBid}
                disabled={bidAmount < minBid}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Đấu giá
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {quickBidAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setBidAmount(amount)}
                className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                  bidAmount === amount
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {(amount || 0).toLocaleString()} VNĐ
              </button>
            ))}
          </div>

          <div className="border-t pt-4">
            <button
              onClick={() => setShowAutoBid(!showAutoBid)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {showAutoBid ? "Ẩn" : "Hiện"} đấu giá tự động
            </button>

            {showAutoBid && (
              <div className="mt-3 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Đấu giá tự động
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={autoBidAmount}
                    onChange={(e) => setAutoBidAmount(Number(e.target.value))}
                    min={minBid}
                    step={bidIncrement}
                    className="flex-1 px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Số tiền tối đa"
                  />
                  <button
                    onClick={handleAutoBid}
                    disabled={autoBidAmount < minBid}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Kích hoạt
                  </button>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  Hệ thống sẽ tự động đấu giá khi có người khác đấu giá cao hơn
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">Đấu giá đã kết thúc</div>
          <div className="text-2xl font-bold text-gray-900">
            {currentBid.toLocaleString()} VNĐ
          </div>
        </div>
      )}
    </div>
  );
}

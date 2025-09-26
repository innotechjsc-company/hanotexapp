"use client";

import { useState, useEffect } from "react";
import { Clock, Users, Eye, Heart, Share2, Flag } from "lucide-react";

interface AuctionHeaderProps {
  title: string;
  currentBid: number;
  bidCount: number;
  timeLeft: string;
  viewers: number;
  isWatching: boolean;
  onWatch: () => void;
  onShare: () => void;
  onReport: () => void;
}

export default function AuctionHeader({
  title,
  currentBid,
  bidCount,
  timeLeft,
  viewers,
  isWatching,
  onWatch,
  onShare,
  onReport,
}: AuctionHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-red-500" />
              <span className="font-medium text-red-600">{timeLeft}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>{bidCount} lượt đấu giá</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>{viewers} người đang xem</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onWatch}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              isWatching
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Heart className={`h-4 w-4 ${isWatching ? "fill-current" : ""}`} />
            <span>{isWatching ? "Đang theo dõi" : "Theo dõi"}</span>
          </button>

          <button
            onClick={onShare}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Share2 className="h-4 w-4" />
            <span>Chia sẻ</span>
          </button>

          <button
            onClick={onReport}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Flag className="h-4 w-4" />
            <span>Báo cáo</span>
          </button>
        </div>
      </div>
    </div>
  );
}

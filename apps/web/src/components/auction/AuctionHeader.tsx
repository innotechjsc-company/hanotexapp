"use client";

import React from "react";
import { Clock, Users, Eye } from "lucide-react";

interface AuctionHeaderProps {
  title: string;
  bidCount: number;
  timeLeft: string;
  viewers: number;
}

export default function AuctionHeader({
  title,
  bidCount,
  timeLeft,
  viewers,
}: AuctionHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900 mb-2">{title}</h1>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
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
        </div>
      </div>
    </div>
  );
}

"use client";

import { getPricingTypeLabel } from "@/types";

interface PricingCardProps {
  pricing?: any;
}

export default function PricingCard({ pricing }: PricingCardProps) {
  if (!pricing) return null;
  const asking = pricing?.asking_price ?? pricing?.price_from ?? pricing?.price;
  const currency = pricing?.currency;
  const type = pricing?.pricing_type;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Thông tin giá
      </h3>
      <div className="space-y-3">
        {type ? (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              Loại định giá:
            </span>
            <span className="text-sm text-gray-900">
              {getPricingTypeLabel(type)}
            </span>
          </div>
        ) : null}
        {asking ? (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              Giá yêu cầu:
            </span>
            <span className="text-sm font-medium text-gray-900">
              {new Intl.NumberFormat("vi-VN").format(Number(asking))} {currency}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

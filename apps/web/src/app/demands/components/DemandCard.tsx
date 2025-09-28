"use client";

import { Button, Card, Tag } from "antd";
import Link from "next/link";
import { DollarSign, Users, Calendar, ArrowRight, Send } from "lucide-react";
import { Demand } from "@/types/demand";
import { formatPriceRange } from "@/constants/demands";
import { getFullMediaUrl } from "@/utils/mediaUrl";

interface DemandCardProps {
  demand: Demand;
  viewMode: "grid" | "list";
  isAuthenticated: boolean;
  onViewDetails: () => void;
  onPropose: () => void;
}

function getCategoryName(demand: Demand): string {
  if (typeof demand.category === "object" && demand.category?.name) {
    return demand.category.name;
  }
  if (typeof demand.category === "string") {
    return demand.category;
  }
  return "Chưa phân loại";
}

function getOwnerName(demand: Demand): string {
  if (typeof demand.user === "object" && demand.user?.full_name) {
    return demand.user.full_name;
  }
  return "Người dùng";
}

function getStatusColor(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "green";
    case "FULFILLED":
      return "blue";
    case "EXPIRED":
      return "red";
    default:
      return "default";
  }
}

function getStatusText(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "Đang tìm kiếm";
    case "FULFILLED":
      return "Đã tìm thấy";
    case "EXPIRED":
      return "Hết hạn";
    default:
      return status;
  }
}

function getDemandImage(demand: Demand): string | undefined {
  // Try to get image from demand.image field
  if (demand.image) {
    if (typeof demand.image === "string") {
      return getFullMediaUrl(demand.image);
    } else if (typeof demand.image === "object" && demand.image.url) {
      return getFullMediaUrl(demand.image.url);
    }
  }

  // Try to get first image from documents array as fallback
  if (demand.documents && demand.documents.length > 0) {
    const firstDoc = demand.documents[0];
    if (typeof firstDoc === "object" && firstDoc.url) {
      return getFullMediaUrl(firstDoc.url);
    }
  }

  return undefined;
}

export default function DemandCard({
  demand,
  viewMode,
  isAuthenticated,
  onViewDetails,
  onPropose,
}: DemandCardProps) {
  const categoryName = getCategoryName(demand);
  const ownerName = getOwnerName(demand);
  const demandImage = getDemandImage(demand);

  if (viewMode === "list") {
    return (
      <Card hoverable className="w-full" bodyStyle={{ padding: 0 }}>
        <div className="flex flex-col sm:flex-row">
          {/* Image Section - Left */}
          <div className="w-full sm:w-1/3 flex-shrink-0">
            {demandImage ? (
              <img
                src={demandImage}
                alt={demand.title}
                className="w-full h-48 sm:h-full object-cover"
              />
            ) : (
              <div className="w-full h-48 sm:h-full bg-white flex items-center justify-center relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src="/logo.png"
                    alt="Hanotex"
                    className="w-16 h-16 object-contain opacity-60"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            {/* Header with chips - improved layout */}
            <div className="flex flex-col gap-2 mb-3">
              {/* First row: Category and Status on same line */}
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <Tag color="blue" className="w-full">
                    <span className="truncate block" title={categoryName}>
                      {categoryName}
                    </span>
                  </Tag>
                </div>
              </div>

              {/* Second row: TRL and Owner info */}
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-2">
                  {demand.trl_level && (
                    <Tag color="green">TRL {demand.trl_level}</Tag>
                  )}
                  <Tag color="default" className="text-xs">
                    {ownerName}
                  </Tag>
                </div>
              </div>
            </div>

            <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
              <Link
                href={`/demands/${demand.id}`}
                className="hover:text-primary transition-colors"
              >
                {demand.title}
              </Link>
            </h3>

            {demand.description && (
              <p className="text-sm text-default-600 mb-3 line-clamp-2">
                {demand.description}
              </p>
            )}

            {/* Additional info */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center text-sm text-default-500">
                <DollarSign className="h-4 w-4 mr-2" />
                <span>
                  {formatPriceRange(demand.from_price, demand.to_price)}
                </span>
              </div>
              <div className="flex items-center text-sm text-default-500">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Mới đăng</span>
              </div>
            </div>

            <div className="flex items-end justify-between mt-auto">
              <div className="min-w-0">
                <p className="text-sm font-medium text-default-600">
                  {demand.documents?.length || 0} tài liệu
                </p>
              </div>
              <div className="flex gap-2">
                <Button type="primary" size="small" onClick={onViewDetails}>
                  Xem chi tiết
                </Button>
                {isAuthenticated && (
                  <Button
                    size="small"
                    onClick={onPropose}
                    icon={<Send className="h-4 w-4" />}
                  >
                    Đề xuất
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid mode
  return (
    <Card
      hoverable
      className="h-full flex flex-col"
      cover={
        demandImage ? (
          <img
            src={demandImage}
            alt={demand.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-white flex items-center justify-center relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="/logo.png"
                alt="Hanotex"
                className="w-16 h-16 object-contain opacity-60"
              />
            </div>
          </div>
        )
      }
      bodyStyle={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Content wrapper with flex-grow */}
      <div className="flex flex-col flex-1">
        {/* Header with chips - improved layout */}
        <div className="flex flex-col gap-2 mb-3">
          {/* First row: Category and Status */}
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <Tag color="blue" className="w-full">
                <span className="truncate block" title={categoryName}>
                  {categoryName}
                </span>
              </Tag>
            </div>
          </div>

          {/* Second row: TRL and Owner info */}
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              {demand.trl_level && (
                <Tag color="green">TRL {demand.trl_level}</Tag>
              )}
              <Tag color="default" className="text-xs">
                {ownerName}
              </Tag>
            </div>
          </div>
        </div>

        <h3 className="font-semibold text-foreground line-clamp-2 mb-2 min-h-[2.5rem]">
          <Link
            href={`/demands/${demand.id}`}
            className="hover:text-primary transition-colors"
          >
            {demand.title}
          </Link>
        </h3>

        {demand.description && (
          <p className="text-sm text-default-600 mb-3 line-clamp-2">
            {demand.description}
          </p>
        )}

        {/* Additional info */}
        <div className="space-y-2 mb-3 flex-1">
          <div className="flex items-center text-sm text-default-500">
            <DollarSign className="h-4 w-4 mr-2" />
            <span>{formatPriceRange(demand.from_price, demand.to_price)}</span>
          </div>
          <div className="flex items-center text-sm text-default-500">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Mới đăng</span>
          </div>
        </div>
      </div>

      {/* Fixed footer */}
      <div className="p-4 flex items-center justify-between bg-gray-50 border-t -mx-4 -mb-4 mt-auto">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-600">
            {demand.documents?.length || 0} tài liệu
          </p>
        </div>
        <div className="flex gap-2">
          <Button type="primary" size="small" onClick={onViewDetails}>
            Chi tiết
          </Button>
        </div>
      </div>
    </Card>
  );
}

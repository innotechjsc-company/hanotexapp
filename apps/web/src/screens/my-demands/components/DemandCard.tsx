"use client";

import { Button, Card, Tag, Space, Tooltip } from "antd";
import { Eye, Edit, Trash2, FileText } from "lucide-react";
import { Demand } from "@/types/demand";
import { getFullMediaUrl } from "@/utils/mediaUrl";

interface DemandCardProps {
  demand: Demand;
  deletingIds: Set<string>;
  onView: (d: Demand) => void;
  onViewProposals: (d: Demand) => void;
  onEdit: (d: Demand) => void;
  onDelete: (d: Demand) => void;
}

function getCategoryName(demand: Demand): string | undefined {
  return typeof demand.category === "string"
    ? demand.category
    : demand.category?.name || "Chưa phân loại";
}

function getPriceRange(demand: Demand): string {
  const from = demand.from_price
    ? `${demand.from_price.toLocaleString()} VNĐ`
    : null;
  const to = demand.to_price ? `${demand.to_price.toLocaleString()} VNĐ` : null;
  return from && to ? `${from} - ${to}` : from || to || "Chưa xác định";
}

function getThumb(demand: Demand): string | undefined {
  // Try to get image from documents
  if (Array.isArray(demand.documents) && demand.documents.length > 0) {
    const firstDoc = demand.documents[0];
    if (typeof firstDoc === "object" && firstDoc?.url) {
      return firstDoc.url;
    }
  }
  return undefined;
}

export default function DemandCard({
  demand,
  deletingIds,
  onView,
  onViewProposals,
  onEdit,
  onDelete,
}: DemandCardProps) {
  const categoryName = getCategoryName(demand);
  const priceRange = getPriceRange(demand);
  const thumb = getFullMediaUrl(demand.image as string);
  const createdAt = demand.createdAt
    ? new Date(demand.createdAt).toLocaleDateString("vi-VN")
    : "—";

  return (
    <Card hoverable className="w-full" bodyStyle={{ padding: 0 }}>
      <div className="flex flex-col sm:flex-row">
        {/* Image Section - Left */}
        <div className="w-full sm:w-1/3 flex-shrink-0">
          {thumb ? (
            <img
              src={thumb}
              alt={demand.title}
              className="w-full h-48 sm:h-full object-cover"
            />
          ) : (
            <div className="w-full h-48 sm:h-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center relative">
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
            {/* First row: Category and TRL Level */}
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                {categoryName && (
                  <Tag color="blue" className="w-full">
                    <span className="truncate block" title={categoryName}>
                      {categoryName}
                    </span>
                  </Tag>
                )}
              </div>
              <div className="flex-shrink-0">
                <Tag color="default" className="whitespace-nowrap">
                  TRL {demand.trl_level || "N/A"}
                </Tag>
              </div>
            </div>

            {/* Second row: Date */}
            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  Ngày đăng: {createdAt}
                </span>
              </div>
            </div>
          </div>

          <h3 className="font-semibold text-foreground line-clamp-2 mb-2 min-h-[2.5rem]">
            {demand.title}
          </h3>

          {demand.description && (
            <p className="text-sm text-default-600 mb-3 line-clamp-2">
              {demand.description}
            </p>
          )}

          {/* Price information */}
          <div className="mb-3">
            <p className="text-xs text-default-500 mb-1">Giá:</p>
            <p className="text-sm text-default-600">{priceRange}</p>
          </div>

          <div className="flex items-end justify-between mt-auto">
            <div className="min-w-0">
              <p className="text-sm font-medium text-default-600">
                Nhu cầu của bạn
              </p>
            </div>
            <Space>
              <Tooltip title="Xem chi tiết" color="#1677ff">
                <Button
                  type="text"
                  size="small"
                  icon={<Eye className="h-4 w-4" />}
                  onClick={() => onView(demand)}
                />
              </Tooltip>
              <Tooltip title="Xem đề xuất" color="#1677ff">
                <Button
                  type="text"
                  size="small"
                  icon={<FileText className="h-4 w-4" />}
                  onClick={() => onViewProposals(demand)}
                />
              </Tooltip>
              <Tooltip title="Chỉnh sửa" color="#52c41a">
                <Button
                  type="text"
                  size="small"
                  icon={<Edit className="h-4 w-4" />}
                  onClick={() => onEdit(demand)}
                />
              </Tooltip>
              <Tooltip title="Xóa" color="#ff4d4f">
                <Button
                  type="text"
                  size="small"
                  icon={<Trash2 className="h-4 w-4" />}
                  loading={demand.id ? deletingIds.has(demand.id) : false}
                  onClick={() => onDelete(demand)}
                />
              </Tooltip>
            </Space>
          </div>
        </div>
      </div>
    </Card>
  );
}

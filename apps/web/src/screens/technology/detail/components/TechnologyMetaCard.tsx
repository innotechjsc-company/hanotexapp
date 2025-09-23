"use client";

import { TechnologyStatus } from "@/types";

interface TechnologyMetaCardProps {
  trl_level?: number;
  categoryName?: string;
  status?: TechnologyStatus;
  created_at?: string;
  createdAt?: string;
  getStatusLabel: (s: TechnologyStatus) => string;
  getStatusColor: (s: TechnologyStatus) => string;
}

export default function TechnologyMetaCard({
  trl_level,
  categoryName,
  status,
  created_at,
  createdAt,
  getStatusLabel,
  getStatusColor,
}: TechnologyMetaCardProps) {
  const created = created_at || createdAt;
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Chi tiết công nghệ
      </h3>
      <div className="space-y-3">
        {Number.isFinite(trl_level) ? (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              Mức độ TRL:
            </span>
            <span className="text-sm text-gray-900">TRL {trl_level}</span>
          </div>
        ) : null}
        {categoryName ? (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Danh mục:</span>
            <span className="text-sm text-gray-900">{categoryName}</span>
          </div>
        ) : null}
        {status ? (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">
              Trạng thái:
            </span>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                status
              )}`}
            >
              {getStatusLabel(status)}
            </span>
          </div>
        ) : null}
        {created ? (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Ngày tạo:</span>
            <span className="text-sm text-gray-900">
              {new Date(created).toLocaleDateString("vi-VN")}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

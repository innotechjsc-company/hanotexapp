"use client";

import { Building2, MessageCircle, User } from "lucide-react";

interface SidebarContactCardProps {
  owner?: any;
  onContact: () => void;
}

export default function SidebarContactCard({ owner, onContact }: SidebarContactCardProps) {
  const ownerName = owner?.profile?.full_name || owner?.profile?.company_name || owner?.name || "Chưa cập nhật";
  const ownerEmail = owner?.email || owner?.profile?.email;
  const ownerType = String(owner?.user_type || owner?.type || "").toUpperCase();
  const ownerTypeLabel =
    ownerType === "INDIVIDUAL"
      ? "Cá nhân"
      : ownerType === "COMPANY"
        ? "Doanh nghiệp"
        : ownerType === "INSTITUTION" || ownerType === "RESEARCH_INSTITUTION"
          ? "Viện/Trường"
          : undefined;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin liên hệ</h3>
      <div className="space-y-3">
        <div className="flex items-center">
          <User className="h-5 w-5 text-gray-400 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-900">{ownerName}</p>
            {ownerEmail ? (
              <p className="text-sm text-gray-600">{ownerEmail}</p>
            ) : null}
          </div>
        </div>
        {ownerTypeLabel ? (
          <div className="flex items-center">
            <Building2 className="h-5 w-5 text-gray-400 mr-3" />
            <p className="text-sm text-gray-600">{ownerTypeLabel}</p>
          </div>
        ) : null}
      </div>

      <button
        onClick={onContact}
        className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        Liên hệ
      </button>
    </div>
  );
}


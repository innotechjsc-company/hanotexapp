"use client";

import { Building2, MessageCircle, User } from "lucide-react";
import { useAuthStore } from "@/store/auth";

interface SidebarContactCardProps {
  owner?: any;
  onContact: () => void;
  hasContacted?: boolean;
}

export default function SidebarContactCard({
  owner,
  onContact,
  hasContacted = false,
}: SidebarContactCardProps) {
  const { user } = useAuthStore();
  const ownerName = owner?.full_name || "Chưa cập nhật";
  const ownerType = String(owner?.user_type || owner?.type || "").toUpperCase();
  const ownerTypeLabel =
    ownerType === "INDIVIDUAL"
      ? "Cá nhân"
      : ownerType === "COMPANY"
        ? "Doanh nghiệp"
        : ownerType === "INSTITUTION" || ownerType === "RESEARCH_INSTITUTION"
          ? "Viện/Trường"
          : undefined;

  const ownerId = owner?.id || owner?._id;
  const currentUserId = user?.id;
  const isOwnTechnology =
    ownerId && currentUserId && String(ownerId) === String(currentUserId);
  const isAuthenticated = Boolean(currentUserId);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Thông tin liên hệ
      </h3>
      <div className="space-y-3">
        <div className="flex items-center">
          <User className="h-5 w-5 text-gray-400 mr-3" />
          <div>
            <p className="text-sm font-medium text-gray-900">{ownerName}</p>
          </div>
        </div>
        {ownerTypeLabel ? (
          <div className="flex items-center">
            <Building2 className="h-5 w-5 text-gray-400 mr-3" />
            <p className="text-sm text-gray-600">{ownerTypeLabel}</p>
          </div>
        ) : null}
      </div>

      {!isOwnTechnology && isAuthenticated ? (
        hasContacted ? (
          <button
            disabled
            className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg cursor-not-allowed flex items-center justify-center"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Đã gửi đề xuất
          </button>
        ) : (
          <button
            onClick={onContact}
            className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Liên hệ
          </button>
        )
      ) : null}
    </div>
  );
}

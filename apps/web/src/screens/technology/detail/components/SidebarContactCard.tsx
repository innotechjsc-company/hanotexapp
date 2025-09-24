"use client";

import { useState } from "react";
import {
  Building2,
  MessageCircle,
  User,
  Mail,
  X,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { createSimpleRoomChat } from "@/api/roomChat";
import { addUserToRoom } from "@/api/roomUser";
import { sendMessage } from "@/api/roomMessage";

interface SidebarContactCardProps {
  owner?: any;
  onContact: () => void;
}

export default function SidebarContactCard({
  owner,
  onContact,
}: SidebarContactCardProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [showOwnerModal, setShowOwnerModal] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);

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

  // Handle opening owner info modal
  const handleShowOwnerInfo = () => {
    setShowOwnerModal(true);
  };

  // Handle creating chat and navigating to messages
  const handleStartChat = async () => {
    if (!currentUserId || !ownerId) return;

    try {
      setIsCreatingChat(true);

      // 1. Create room chat
      const roomTitle = `Chat với ${ownerName}`;
      const roomChat = await createSimpleRoomChat(roomTitle);

      // 2. Add both users to room
      await addUserToRoom(roomChat.id, currentUserId);
      await addUserToRoom(roomChat.id, ownerId);

      // 3. Send initial message
      await sendMessage(
        roomChat.id,
        currentUserId,
        `Xin chào ${ownerName}, tôi quan tâm đến công nghệ của bạn.`
      );

      // 4. Close modal and navigate to messages page
      setShowOwnerModal(false);
      router.push(`/messages?roomId=${roomChat.id}`);
    } catch (error) {
      console.error("Error creating chat:", error);
      alert("Có lỗi xảy ra khi tạo cuộc trò chuyện. Vui lòng thử lại.");
    } finally {
      setIsCreatingChat(false);
    }
  };

  return (
    <>
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Thông tin liên hệ
        </h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <User className="h-5 w-5 text-gray-400 mr-3" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-900">{ownerName}</p>
                {!isOwnTechnology && isAuthenticated && (
                  <div
                    className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-50 hover:bg-primary-100 cursor-pointer transition-colors group"
                    title="Nhắn tin"
                    onClick={handleShowOwnerInfo}
                  >
                    <Mail className="h-3 w-3 text-primary-500 group-hover:text-primary-600 transition-colors" />
                  </div>
                )}
              </div>
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
          <button
            onClick={onContact}
            className="w-full mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Liên hệ
          </button>
        ) : null}
      </div>

      {/* Owner Info Modal */}
      {showOwnerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Thông tin liên hệ
              </h3>
              <button
                onClick={() => setShowOwnerModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Owner Avatar & Name */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-primary-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {ownerName}
                </h4>
                {ownerTypeLabel && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    <Building2 className="h-4 w-4 mr-1" />
                    {ownerTypeLabel}
                  </span>
                )}
              </div>

              {/* Owner Details */}
              <div className="space-y-4 mb-6">
                {owner?.email && (
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">{owner.email}</span>
                  </div>
                )}
                {owner?.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">{owner.phone}</span>
                  </div>
                )}
                {owner?.address && (
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">
                      {owner.address}
                    </span>
                  </div>
                )}
                {owner?.website && (
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-gray-400 mr-3" />
                    <a
                      href={owner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      {owner.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Chat Button */}
              <button
                onClick={handleStartChat}
                disabled={isCreatingChat}
                className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                {isCreatingChat ? "Đang tạo cuộc trò chuyện..." : "Chat ngay"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

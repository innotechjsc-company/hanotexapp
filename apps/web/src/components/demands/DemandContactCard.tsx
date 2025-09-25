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
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { createSimpleRoomChat } from "@/api/roomChat";
import { addUserToRoom, findRoomBetweenUsers } from "@/api/roomUser";
import { sendMessage } from "@/api/roomMessage";
import { Card, CardBody, Avatar, Link } from "@heroui/react";

interface DemandContactCardProps {
  demandUser?: any;
  demandTitle?: string;
}

export default function DemandContactCard({
  demandUser,
  demandTitle,
}: DemandContactCardProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [showUserModal, setShowUserModal] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);

  const userName = demandUser?.full_name || "Chưa cập nhật";
  const userType = String(
    demandUser?.user_type || demandUser?.type || ""
  ).toUpperCase();
  const userTypeLabel =
    userType === "INDIVIDUAL"
      ? "Cá nhân"
      : userType === "COMPANY"
        ? "Doanh nghiệp"
        : userType === "INSTITUTION" || userType === "RESEARCH_INSTITUTION"
          ? "Viện/Trường"
          : undefined;

  const demandUserId = demandUser?.id || demandUser?._id;
  const currentUserId = user?.id;
  const isOwnDemand =
    demandUserId &&
    currentUserId &&
    String(demandUserId) === String(currentUserId);
  const isAuthenticated = Boolean(currentUserId);

  // Handle opening user info modal
  const handleShowUserInfo = () => {
    setShowUserModal(true);
  };

  // Handle creating chat and navigating to messages
  const handleStartChat = async () => {
    if (!currentUserId || !demandUserId) return;

    try {
      setIsCreatingChat(true);

      // 1. Check if room already exists between these two users
      const existingRoomId = await findRoomBetweenUsers(
        currentUserId,
        demandUserId
      );

      if (existingRoomId) {
        // Room already exists, navigate to existing chat
        setShowUserModal(false);
        router.push(`/messages?roomId=${existingRoomId}`);
        return;
      }

      // 2. No existing room, create new room chat
      const roomTitle = `${userName}`;
      const roomChat = await createSimpleRoomChat(roomTitle);

      // 3. Add both users to room
      await addUserToRoom(roomChat.id, currentUserId);
      await addUserToRoom(roomChat.id, demandUserId);

      // 4. Send initial message
      await sendMessage(
        roomChat.id,
        currentUserId,
        `Xin chào ${userName}, tôi quan tâm đến nhu cầu công nghệ của bạn: "${demandTitle}".`
      );

      // 5. Close modal and navigate to messages page
      setShowUserModal(false);
      router.push(`/messages?roomId=${roomChat.id}`);
    } catch (error) {
      console.error("Error creating/finding chat:", error);
      alert("Có lỗi xảy ra khi tạo cuộc trò chuyện. Vui lòng thử lại.");
    } finally {
      setIsCreatingChat(false);
    }
  };

  return (
    <>
      <Card className="shadow-sm">
        <CardBody className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2 text-primary" />
            Thông tin liên hệ
          </h3>

          <div className="flex items-center space-x-3 mb-4">
            <Avatar size="md" name={userName} className="flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground">{userName}</p>
                {!isOwnDemand && isAuthenticated && (
                  <div
                    className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-50 hover:bg-primary-100 cursor-pointer transition-colors group"
                    title="Nhắn tin"
                    onClick={handleShowUserInfo}
                  >
                    <Mail className="h-3 w-3 text-primary-500 group-hover:text-primary-600 transition-colors" />
                  </div>
                )}
              </div>
              {userTypeLabel && (
                <p className="text-sm text-default-500">{userTypeLabel}</p>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* User Info Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Thông tin người đăng
              </h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* User basic info */}
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{userName}</p>
                  {userTypeLabel && (
                    <p className="text-sm text-gray-500">{userTypeLabel}</p>
                  )}
                </div>
              </div>

              {/* Additional user info */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                {demandUser?.email && (
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">
                      {demandUser.email}
                    </span>
                  </div>
                )}
                {demandUser?.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">
                      {demandUser.phone}
                    </span>
                  </div>
                )}
                {demandUser?.address && (
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-600">
                      {demandUser.address}
                    </span>
                  </div>
                )}
                {demandUser?.website && (
                  <div className="flex items-center">
                    <Globe className="h-5 w-5 text-gray-400 mr-3" />
                    <a
                      href={demandUser.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      {demandUser.website}
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
                {isCreatingChat ? "Đang kiểm tra..." : "Chat ngay"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import React from "react";
import { Avatar, Typography, Button, Space, Badge } from "antd";
import { ArrowLeft, MoreVertical, Phone, Video } from "lucide-react";
import type { TechnologyPropose } from "@/types/technology-propose";

const { Title, Text } = Typography;

interface NegotiationHeaderProps {
  proposal: TechnologyPropose | null;
  onClose: () => void;
}

export const NegotiationHeader: React.FC<NegotiationHeaderProps> = ({
  proposal,
  onClose,
}) => {
  const getUserName = () => {
    if (!proposal?.user) return "Người đề xuất";
    if (typeof proposal.user === "object") {
      return proposal.user.full_name || proposal.user.email || "Người đề xuất";
    }
    return proposal.user;
  };

  const getUserAvatar = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="p-5 border-b border-gray-200 bg-white flex items-center justify-between shadow-sm relative">
      <div className="max-w-screen-2xl w-full mx-auto flex items-center justify-between px-5">
        {/* User Info Section */}
        <div className="flex items-center gap-4">
          <Badge dot color="#52c41a" offset={[-8, 32]}>
            <Avatar
              size={48}
              className="bg-blue-500 shadow-lg shadow-blue-500/30 border-2 border-white"
            >
              {getUserAvatar()}
            </Avatar>
          </Badge>

          <div>
            <Title className="m-0 text-lg font-semibold text-gray-800 leading-tight">
              {getUserName()}
            </Title>
            <Space size={4} className="mt-0.5">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <Text className="text-sm text-green-500 font-medium">
                Đang hoạt động
              </Text>
            </Space>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            type="text"
            icon={<Phone size={18} />}
            className="text-blue-500 bg-blue-50 hover:bg-blue-100 border-none rounded-xl w-11 h-11 flex items-center justify-center"
          />

          <Button
            type="text"
            icon={<Video size={18} />}
            className="text-blue-500 bg-blue-50 hover:bg-blue-100 border-none rounded-xl w-11 h-11 flex items-center justify-center"
          />

          <Button
            type="text"
            icon={<MoreVertical size={18} />}
            className="text-gray-500 bg-gray-100 hover:bg-gray-200 border-none rounded-xl w-11 h-11 flex items-center justify-center"
          />

          <Button
            icon={<ArrowLeft size={18} />}
            onClick={onClose}
            className="text-gray-800 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-xl h-11 px-4 flex items-center gap-2 font-medium"
          >
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
};

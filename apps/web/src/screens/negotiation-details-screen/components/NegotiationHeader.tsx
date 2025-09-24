import React from "react";
import { Avatar, Typography, Button } from "antd";
import { ArrowLeft } from "lucide-react";
import type { TechnologyPropose } from "@/types/technology-propose";

const { Text } = Typography;

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
    <div className="border-b border-gray-200 bg-white flex items-center justify-between shadow-sm relative py-2">
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
        {/* User Info Section */}
        <div className="flex items-center gap-4">
          <Avatar
            size={40}
            className="bg-blue-500 shadow-lg shadow-blue-500/30 border-2 border-white"
          >
            {getUserAvatar()}
          </Avatar>

          <div>
            <Typography.Text
              style={{ fontSize: 20 }}
              className="m-0 text-gray-800"
            >
              {getUserName()}
            </Typography.Text>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
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

import React from "react";
import { Avatar, Typography, Button, Tag } from "antd";
import { ArrowLeft } from "lucide-react";
import type { TechnologyPropose } from "@/types/technology-propose";
import type { Propose } from "@/types/propose";

const { Text } = Typography;

interface NegotiationHeaderProps {
  proposal: TechnologyPropose | Propose | null;
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

  const getStatusInfo = () => {
    if (!proposal) return { label: "", color: "" };

    switch (proposal.status) {
      case "negotiating":
        return { label: "Đang đàm phán", color: "blue" };
      case "contact_signing":
        return { label: "Đang ký hợp đồng", color: "cyan" };
      case "contract_signed":
        return { label: "Đã ký hợp đồng", color: "green" };
      case "pending":
        return { label: "Chờ xác nhận", color: "orange" };
      case "completed":
        return { label: "Hoàn thành", color: "green" };
      case "cancelled":
        return { label: "Đã hủy", color: "red" };
      default:
        return { label: proposal.status, color: "default" };
    }
  };

  const statusInfo = getStatusInfo();

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
            {statusInfo.label && (
              <div className="mt-1">
                <Tag color={statusInfo.color} className="text-xs">
                  {statusInfo.label}
                </Tag>
              </div>
            )}
          </div>
        </div>

        {/* Technology Title and Status */}
        <div className="flex-1 text-center">
          <div>
            <Text strong className="text-lg text-gray-800">
              {proposal?.technology?.title || "Đề xuất công nghệ"}
            </Text>
          </div>
          <div className="mt-1">
            <Text className="text-sm text-gray-600">
              Bước{" "}
              {proposal?.status === "negotiating"
                ? "1"
                : proposal?.status === "contact_signing" ||
                    proposal?.status === "contract_signed"
                  ? "2"
                  : "1"}
              :{" "}
              {proposal?.status === "negotiating"
                ? "Đàm phán"
                : proposal?.status === "contact_signing" ||
                    proposal?.status === "contract_signed"
                  ? "Ký hợp đồng"
                  : "Đàm phán"}
            </Text>
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

import React from "react";
import { Avatar, Typography, Button, Tag } from "antd";
import { ArrowLeft } from "lucide-react";
import type { ProjectPropose } from "@/types/project-propose";

const { Text } = Typography;

interface ProjectNegotiationHeaderProps {
  projectProposal: ProjectPropose;
  onClose: () => void;
}

export const ProjectNegotiationHeader: React.FC<ProjectNegotiationHeaderProps> = ({
  projectProposal,
  onClose,
}) => {
  const getUserName = () => {
    const user = projectProposal.user as any;
    if (!user) return "Người đề xuất";
    if (typeof user === "object") {
      return user.full_name || user.fullName || user.email || "Người đề xuất";
    }
    return user as string;
  };

  const getUserAvatar = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  const getStatusInfo = () => {
    const status = projectProposal.status;
    switch (status) {
      case "negotiating":
        return { label: "Đang đàm phán", color: "blue" } as const;
      case "contact_signing":
        return { label: "Đang ký hợp đồng", color: "cyan" } as const;
      case "contract_signed":
        return { label: "Đã ký hợp đồng", color: "green" } as const;
      case "pending":
        return { label: "Chờ xác nhận", color: "orange" } as const;
      case "completed":
        return { label: "Hoàn thành", color: "green" } as const;
      case "cancelled":
        return { label: "Đã hủy", color: "red" } as const;
      default:
        return { label: "", color: "default" } as const;
    }
  };

  const statusInfo = getStatusInfo();

  const getCenterStep = () => {
    const status = projectProposal.status;
    const stepNumber =
      status === "negotiating" ? "1" :
      status === "contact_signing" || status === "contract_signed" ? "2" : "1";
    const stepLabel =
      status === "negotiating" ? "Đàm phán" :
      status === "contact_signing" || status === "contract_signed" ? "Ký hợp đồng" : "Đàm phán";
    return { stepNumber, stepLabel };
  };

  const center = getCenterStep();

  const getProjectTitle = () => {
    const proj = projectProposal.project as any;
    if (typeof proj === "object") return proj.name || "Dự án";
    return "Dự án";
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
            {statusInfo.label && (
              <div className="mt-1">
                <Tag color={statusInfo.color} className="text-xs">
                  {statusInfo.label}
                </Tag>
              </div>
            )}
          </div>
        </div>

        {/* Project Title and Status */}
        <div className="flex-1 text-center">
          <div>
            <Text strong className="text-lg text-gray-800">
              {getProjectTitle()}
            </Text>
          </div>
          <div className="mt-1">
            <Text className="text-sm text-gray-600">
              Bước {center.stepNumber}: {center.stepLabel}
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

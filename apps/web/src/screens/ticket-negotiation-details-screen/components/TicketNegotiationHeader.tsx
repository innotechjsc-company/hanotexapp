import React from "react";
import { Button, Tag, Space, Typography } from "antd";
import { ArrowLeftOutlined, CloseOutlined } from "@ant-design/icons";
import type { ServiceTicket } from "@/types/service-ticket";
import dayjs from "dayjs";

const { Title, Text } = Typography;

interface TicketNegotiationHeaderProps {
  ticket: ServiceTicket;
  onClose: () => void;
}

export const statusColorMap: Record<string, string> = {
  pending: "gold",
  processing: "blue",
  completed: "green",
  cancelled: "red",
};

export const statusLabelMap: Record<string, string> = {
  pending: "Chờ xử lý",
  processing: "Đang xử lý",
  completed: "Đã hoàn thành",
  cancelled: "Đã hủy",
};

export const TicketNegotiationHeader: React.FC<TicketNegotiationHeaderProps> = ({
  ticket,
  onClose,
}) => {
  const getServiceName = () => {
    if (!ticket.service) return "Không xác định";
    if (typeof ticket.service === "string") {
      return `Dịch vụ #${ticket.service}`;
    }
    return (ticket.service as any)?.name || "Không xác định";
  };

  const getResponsibleUserName = () => {
    if (!ticket.responsible_user) return "Chưa phân công";
    if (typeof ticket.responsible_user === "string") {
      return "Người dùng";
    }
    return (ticket.responsible_user as any)?.full_name || (ticket.responsible_user as any)?.email || "Người dùng";
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={onClose}
            className="flex items-center"
          >
            Quay lại
          </Button>
          
          <div className="border-l border-gray-300 pl-4">
            <div className="flex items-center space-x-3">
              <Title level={4} className="!mb-0">
                Phiếu dịch vụ #{ticket.id}
              </Title>
              <Tag color={statusColorMap[ticket.status] || "default"}>
                {statusLabelMap[ticket.status] || ticket.status}
              </Tag>
            </div>
            
            <div className="mt-1">
              <Space size="large">
                <Text type="secondary">
                  <strong>Dịch vụ:</strong> {getServiceName()}
                </Text>
                <Text type="secondary">
                  <strong>Khách hàng:</strong> {getResponsibleUserName()}
                </Text>
                {ticket.createdAt && (
                  <Text type="secondary">
                    <strong>Ngày tạo:</strong> {dayjs(ticket.createdAt).format("DD/MM/YYYY HH:mm")}
                  </Text>
                )}
              </Space>
            </div>
          </div>
        </div>

        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        />
      </div>
    </div>
  );
};

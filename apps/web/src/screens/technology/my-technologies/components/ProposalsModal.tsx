"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Table,
  Tag,
  Spin,
  Card,
  Space,
  Tooltip,
  message,
  Popconfirm,
  Typography,
  Divider,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  FileText,
  Calendar,
  DollarSign,
  Download,
  Eye,
  MessageSquare,
  X,
  User as UserIcon,
  ExternalLink,
  CheckCircle,
} from "lucide-react";
import { technologyProposeApi } from "@/api/technology-propose";
import type {
  TechnologyPropose,
  TechnologyProposeStatus,
} from "@/types/technology-propose";
import { formatDate, formatCurrency } from "../utils";
import { User } from "@/types";

const { Text } = Typography;

interface ProposalsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  technologyId: string | null;
  technologyTitle: string;
}

export function ProposalsModal({
  isOpen,
  onOpenChange,
  technologyId,
  technologyTitle,
}: ProposalsModalProps) {
  const [proposals, setProposals] = useState<TechnologyPropose[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch proposals when modal opens and technologyId is available
  useEffect(() => {
    if (isOpen && technologyId) {
      fetchProposals();
    }
  }, [isOpen, technologyId]);

  const fetchProposals = async () => {
    if (!technologyId) return;

    setLoading(true);
    setError("");
    try {
      const response = await technologyProposeApi.list(
        { technology: technologyId },
        { limit: 100, sort: "-createdAt" }
      );
      const proposalsList = ((response as any).docs ||
        (response as any).data ||
        []) as TechnologyPropose[];
      setProposals(proposalsList);
    } catch (err) {
      console.error("Failed to fetch proposals:", err);
      setError("Không thể tải danh sách đề xuất");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: TechnologyProposeStatus) => {
    switch (status) {
      case "pending":
        return "orange"; // Màu cam cho trạng thái chờ xử lý
      case "negotiating":
        return "blue"; // Màu xanh dương cho đang đàm phán
      case "contract_signed":
        return "cyan"; // Màu xanh lam cho đã ký hợp đồng
      case "completed":
        return "green"; // Màu xanh lá cho hoàn thành
      case "cancelled":
        return "red"; // Màu đỏ cho đã hủy
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: TechnologyProposeStatus) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "negotiating":
        return "Đang đàm phán";
      case "contract_signed":
        return "Đã ký hợp đồng";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getUserName = (user: User) => {
    if (typeof user === "string") return user;
    return user?.full_name || user?.email || "Không xác định";
  };

  // Handle document viewing/downloading
  const handleViewDocument = (document: any) => {
    if (document?.url) {
      window.open(document.url, "_blank");
    } else {
      message.warning("Không có tài liệu để xem");
    }
  };

  const handleDownloadDocument = (doc: any) => {
    if (doc?.url) {
      const link = window.document.createElement("a");
      link.href = doc.url;
      link.download = doc.filename || "document";
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    } else {
      message.warning("Không có tài liệu để tải xuống");
    }
  };

  // Handle proposal actions
  const handleNegotiate = async (proposalId: string) => {
    setActionLoading(proposalId);
    try {
      await technologyProposeApi.setStatus(proposalId, "negotiating");
      message.success("Đã chuyển sang trạng thái đàm phán");
      fetchProposals(); // Refresh the list
    } catch (error) {
      console.error("Failed to update proposal status:", error);
      message.error("Không thể cập nhật trạng thái đề xuất");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (proposalId: string) => {
    setActionLoading(proposalId);
    try {
      await technologyProposeApi.setStatus(proposalId, "cancelled");
      message.success("Đã từ chối đề xuất");
      fetchProposals(); // Refresh the list
    } catch (error) {
      console.error("Failed to update proposal status:", error);
      message.error("Không thể cập nhật trạng thái đề xuất");
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirm = async (proposalId: string) => {
    setActionLoading(proposalId);
    try {
      await technologyProposeApi.setStatus(proposalId, "contract_signed");
      message.success("Đã xác nhận đề xuất");
      fetchProposals();
    } catch (error) {
      console.error("Failed to confirm proposal:", error);
      message.error("Không thể xác nhận đề xuất");
    } finally {
      setActionLoading(null);
    }
  };

  // Handle opening negotiation details
  const handleViewNegotiationDetails = (proposalId: string) => {
    const url = `/technologies/negotiations/${proposalId}`;
    window.open(url, "_blank");
  };

  const columns: ColumnsType<TechnologyPropose> = [
    {
      title: "Người đề xuất",
      dataIndex: "user",
      key: "user",
      width: 120,
      render: (user: any) => (
        <Space>
          <UserIcon size={16} className="text-gray-400" />
          <Text strong ellipsis className="max-w-[90px]">
            {getUserName(user)}
          </Text>
        </Space>
      ),
    },
    {
      title: "Lời nhắn",
      dataIndex: "description",
      key: "description",
      width: 200,
      render: (description: string) => (
        <Text className="whitespace-pre-wrap break-words">
          {description || "Không có lời nhắn"}
        </Text>
      ),
    },
    {
      title: "Ngân sách",
      dataIndex: "budget",
      key: "budget",
      width: 120,
      render: (budget: number) => (
        <Space>
          <DollarSign size={16} className="text-gray-400" />
          <Text strong>{formatCurrency(budget || 0, "vnd")}</Text>
        </Space>
      ),
    },
    {
      title: "Tài liệu",
      dataIndex: "document",
      key: "document",
      width: 80,
      render: (document: any) => (
        <Space>
          {document ? (
            <>
              <Tooltip title="Xem tài liệu" color="#1677ff">
                <Button
                  type="text"
                  size="small"
                  icon={<Eye size={16} />}
                  onClick={() => handleViewDocument(document)}
                />
              </Tooltip>
              <Tooltip title="Tải xuống" color="#1677ff">
                <Button
                  type="text"
                  size="small"
                  icon={<Download size={16} />}
                  onClick={() => handleDownloadDocument(document)}
                />
              </Tooltip>
            </>
          ) : (
            <Text type="secondary">Không có</Text>
          )}
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: TechnologyProposeStatus) => (
        <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
      ),
    },
    {
      title: "Lần cập nhật gần nhất",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 140,
      render: (updatedAt: string) => (
        <Space>
          <Calendar size={16} className="text-gray-400" />
          <Text className="text-sm">
            {updatedAt ? formatDate(updatedAt) : "Không xác định"}
          </Text>
        </Space>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_, record: any) => {
        const proposalId = record.id || record._id;
        const isLoading = actionLoading === proposalId;
        const isPending = record.status === "pending";
        const canReject = record.status === "pending";
        const canViewNegotiation =
          record.status !== "pending" && record.status !== "cancelled";
        const canConfirm =
          record.status === "pending" || record.status === "negotiating";

        return (
          <Space>
            <Popconfirm
              title="Xác nhận đề xuất"
              description="Bạn có chắc chắn muốn xác nhận đề xuất này?"
              onConfirm={() => handleConfirm(proposalId)}
              okText="Xác nhận"
              cancelText="Hủy"
              disabled={!canConfirm}
            >
              <Tooltip title="Xác nhận" color="#1677ff">
                <Button
                  type="text"
                  size="small"
                  icon={<CheckCircle size={16} />}
                  loading={isLoading}
                  disabled={!canConfirm}
                  className="hover:bg-green-50 hover:text-green-600"
                />
              </Tooltip>
            </Popconfirm>
            {isPending && (
              <Tooltip title="Đàm phán" color="#1677ff">
                <Button
                  type="text"
                  size="small"
                  icon={<MessageSquare size={16} />}
                  loading={isLoading}
                  onClick={() => handleNegotiate(proposalId)}
                  className="hover:bg-blue-50 hover:text-blue-600"
                />
              </Tooltip>
            )}
            {canViewNegotiation && (
              <Tooltip title="Chi tiết đàm phán" color="#1677ff">
                <Button
                  type="text"
                  size="small"
                  icon={<ExternalLink size={16} />}
                  onClick={() => handleViewNegotiationDetails(proposalId)}
                  className="hover:bg-gray-50 hover:text-gray-600"
                />
              </Tooltip>
            )}
            {canReject && (
              <Popconfirm
                title="Từ chối đề xuất"
                description="Bạn có chắc chắn muốn từ chối đề xuất này?"
                onConfirm={() => handleReject(proposalId)}
                okText="Từ chối"
                cancelText="Hủy"
                okType="danger"
              >
                <Tooltip title="Từ chối" color="#ff4d4f">
                  <Button
                    type="text"
                    size="small"
                    icon={<X size={16} color="red" />}
                    loading={isLoading}
                    className="hover:bg-red-50 hover:text-red-600"
                  />
                </Tooltip>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Modal
      title={
        <div>
          <Typography.Title level={4} className="!m-0">
            Danh sách đề xuất
          </Typography.Title>
          <Text type="secondary">Công nghệ: {technologyTitle}</Text>
        </div>
      }
      open={isOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="close" type="primary" onClick={handleCancel}>
          Đóng
        </Button>,
      ]}
      width={1600}
      className="!top-5"
    >
      {loading ? (
        <div className="text-center py-10">
          <Spin size="large" />
          <div className="mt-4">
            <Text>Đang tải...</Text>
          </div>
        </div>
      ) : error ? (
        <Card>
          <div className="text-center py-10">
            <Text type="danger">{error}</Text>
            <div className="mt-4">
              <Button type="primary" onClick={fetchProposals}>
                Thử lại
              </Button>
            </div>
          </div>
        </Card>
      ) : proposals.length === 0 ? (
        <Card>
          <div className="text-center py-10">
            <FileText size={48} className="text-gray-400 mx-auto mb-4" />
            <Text type="secondary">Chưa có đề xuất nào cho công nghệ này</Text>
          </div>
        </Card>
      ) : (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <Text type="secondary">
              Tổng cộng: <Text strong>{proposals.length}</Text> đề xuất
            </Text>
          </div>
          <Divider className="my-4" />
          <Table
            columns={columns}
            dataSource={proposals}
            rowKey={(record) => (record as any).id || (record as any)._id}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} đề xuất`,
            }}
            scroll={{ x: 1200 }}
            size="middle"
            bordered
          />
        </div>
      )}
    </Modal>
  );
}

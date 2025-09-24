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

  const handleDownloadDocument = (document: any) => {
    if (document?.url) {
      const link = document.createElement("a");
      link.href = document.url;
      link.download = document.filename || "document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
      width: 150,
      render: (user: any) => (
        <Space>
          <UserIcon size={16} className="text-gray-400" />
          <Text strong>{getUserName(user)}</Text>
        </Space>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 200,
      render: (description: string) => (
        <Tooltip title={description || "Không có mô tả"}>
          <Text ellipsis style={{ maxWidth: 180 }}>
            {description || "Không có mô tả"}
          </Text>
        </Tooltip>
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
      width: 100,
      render: (document: any) => (
        <Space>
          {document ? (
            <>
              <Tooltip title="Xem tài liệu">
                <Button
                  type="text"
                  size="small"
                  icon={<Eye size={16} />}
                  onClick={() => handleViewDocument(document)}
                />
              </Tooltip>
              <Tooltip title="Tải xuống">
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
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (createdAt: string) => (
        <Space>
          <Calendar size={16} className="text-gray-400" />
          <Text className="text-sm">
            {createdAt ? formatDate(createdAt) : "Không xác định"}
          </Text>
        </Space>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      fixed: "right",
      render: (_, record: any) => {
        const proposalId = record.id || record._id;
        const isLoading = actionLoading === proposalId;
        const isPending = record.status === "pending";
        const canReject = record.status === "pending";
        const canViewNegotiation =
          record.status !== "pending" && record.status !== "cancelled";

        return (
          <Space>
            {isPending && (
              <Tooltip title="Đàm phán">
                <Button
                  type="primary"
                  size="small"
                  icon={<MessageSquare size={16} />}
                  loading={isLoading}
                  onClick={() => handleNegotiate(proposalId)}
                >
                  Đàm phán
                </Button>
              </Tooltip>
            )}
            {canViewNegotiation && (
              <Tooltip title="Chi tiết đàm phán">
                <Button
                  type="default"
                  size="small"
                  icon={<ExternalLink size={16} />}
                  onClick={() => handleViewNegotiationDetails(proposalId)}
                >
                  Chi tiết đàm phán
                </Button>
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
                <Tooltip title="Từ chối">
                  <Button
                    danger
                    size="small"
                    icon={<X size={16} />}
                    loading={isLoading}
                  >
                    Từ chối
                  </Button>
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
          <Typography.Title level={4} style={{ margin: 0 }}>
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
      width={1400}
      style={{ top: 20 }}
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text>Đang tải...</Text>
          </div>
        </div>
      ) : error ? (
        <Card>
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Text type="danger">{error}</Text>
            <div style={{ marginTop: 16 }}>
              <Button type="primary" onClick={fetchProposals}>
                Thử lại
              </Button>
            </div>
          </div>
        </Card>
      ) : proposals.length === 0 ? (
        <Card>
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <FileText
              size={48}
              className="text-gray-400"
              style={{ margin: "0 auto 16px" }}
            />
            <Text type="secondary">Chưa có đề xuất nào cho công nghệ này</Text>
          </div>
        </Card>
      ) : (
        <div>
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text type="secondary">
              Tổng cộng: <Text strong>{proposals.length}</Text> đề xuất
            </Text>
          </div>
          <Divider style={{ margin: "16px 0" }} />
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

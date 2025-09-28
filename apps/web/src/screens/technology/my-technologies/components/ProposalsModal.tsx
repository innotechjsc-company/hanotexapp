"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  X,
  User as UserIcon,
  ExternalLink,
  CheckCircle,
} from "lucide-react";
import downloadService from "@/services/downloadService";
import { technologyProposeApi } from "@/api/technology-propose";
import type {
  TechnologyPropose,
  TechnologyProposeStatus,
} from "@/types/technology-propose";
import { formatDate, formatCurrency } from "../utils";
import { User } from "@/types";
import { useUser } from "@/store/auth";

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
  const router = useRouter();
  const currentUser = useUser();
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
      case "contact_signing":
        return "cyan"; // Màu xanh lam cho đang ký hợp đồng
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
      case "contact_signing":
        return "Đang ký hợp đồng";
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

  const handleDownloadDocument = (doc: any) => {
    if (doc?.url) {
      downloadService.downloadByUrl(doc.url, doc.filename || undefined);
    } else {
      message.warning("Không có tài liệu để tải xuống");
    }
  };

  // Handle proposal actions
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
      if (!currentUser?.id) {
        message.error("Vui lòng đăng nhập để xác nhận đề xuất");
        return;
      }

      await technologyProposeApi.acceptProposal(
        proposalId,
        currentUser.id,
        "Đã chấp nhận đề xuất và sẵn sàng đàm phán giá."
      );
      message.success("Đã xác nhận đề xuất và bắt đầu đàm phán");
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
    router.push(url);
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
          <Text strong>{formatCurrency(budget || 0, "VND")}</Text>
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
          {document && document.url ? (
            <Tooltip title="Tải xuống" color="#1677ff">
              <Button
                type="text"
                size="small"
                icon={<Download size={16} />}
                onClick={() => handleDownloadDocument(document)}
              />
            </Tooltip>
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
        const canViewNegotiation =
          record.status === "negotiating" ||
          record.status === "contact_signing" ||
          record.status === "contract_signed";

        return (
          <Space>
            {isPending && (
              <>
                <Popconfirm
                  title="Xác nhận đề xuất"
                  description="Bạn có chắc chắn muốn xác nhận đề xuất này?"
                  onConfirm={() => handleConfirm(proposalId)}
                  okText="Xác nhận"
                  cancelText="Hủy"
                >
                  <Tooltip title="Xác nhận" color="#1677ff">
                    <Button
                      type="text"
                      size="small"
                      icon={<CheckCircle size={16} />}
                      loading={isLoading}
                      className="hover:bg-green-50 hover:text-green-600"
                    />
                  </Tooltip>
                </Popconfirm>
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
                    />
                  </Tooltip>
                </Popconfirm>
              </>
            )}
            {canViewNegotiation && (
              <Tooltip title="Xem chi tiết" color="#1677ff">
                <Button
                  type="text"
                  size="small"
                  icon={<ExternalLink size={16} />}
                  onClick={() => handleViewNegotiationDetails(proposalId)}
                  className="hover:bg-gray-50 hover:text-gray-600"
                />
              </Tooltip>
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
            <Text type="secondary">{error}</Text>
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

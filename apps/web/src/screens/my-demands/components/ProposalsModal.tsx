"use client";

import { useEffect, useState, useMemo } from "react";
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
import { FileText, Calendar, DollarSign, Download, Eye, User as UserIcon, CheckCircle, X, ExternalLink } from "lucide-react";
import { getProposesByDemand, acceptPropose, rejectPropose } from "@/api/propose";
import type { Propose, ProposeStatus } from "@/types/propose";
import type { User } from "@/types/users";

const { Text } = Typography;

interface ProposalsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  demandId: string | null;
  demandTitle?: string;
}

// Use string index to allow extra statuses like 'contact_signing'
const statusColors: Record<string, string> = {
  pending: "orange",
  negotiating: "blue",
  contact_signing: "cyan",
  contract_signed: "green",
  completed: "green",
  cancelled: "red",
};

const statusLabels: Record<string, string> = {
  pending: "Chờ xem xét",
  negotiating: "Đang đàm phán",
  contact_signing: "Đang ký hợp đồng",
  contract_signed: "Đã ký hợp đồng",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

export default function ProposalsModal({
  isOpen,
  onOpenChange,
  demandId,
  demandTitle,
}: ProposalsModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [proposals, setProposals] = useState<Propose[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && demandId) {
      fetchProposals();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, demandId]);

  const fetchProposals = async () => {
    if (!demandId) return;
    setLoading(true);
    setError("");
    try {
      const response = await getProposesByDemand(demandId, {
        limit: 100,
        sort: "-createdAt",
      });
      const list = ((response as any).docs || (response as any).data || []) as Propose[];
      setProposals(list);
    } catch (err) {
      console.error("Failed to fetch demand proposals:", err);
      setError("Không thể tải danh sách đề xuất");
      setProposals([]);
    } finally {
      setLoading(false);
    }
  };

  // Actions
  const handleAccept = async (proposalId: string) => {
    try {
      setActionLoading(proposalId);
      await acceptPropose(proposalId);
      message.success("Đã xác nhận đề xuất và chuyển sang đàm phán");
      await fetchProposals();
    } catch (err) {
      console.error(err);
      message.error("Không thể xác nhận đề xuất");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (proposalId: string) => {
    try {
      setActionLoading(proposalId);
      await rejectPropose(proposalId);
      message.success("Đã từ chối đề xuất");
      await fetchProposals();
    } catch (err) {
      console.error(err);
      message.error("Không thể từ chối đề xuất");
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewDetails = (proposalId: string) => {
    // Chuyển sang màn đàm phán chi tiết của đề xuất (propose)
    router.push(`/proposes/negotiations/${proposalId}`);
  };

  const getUserName = (user: User | string) => {
    if (typeof user === "string") return user;
    return user?.full_name || user?.email || "Không xác định";
  };

  const columns: ColumnsType<Propose> = useMemo(() => [
    {
      title: "Người đề xuất",
      dataIndex: "user",
      key: "user",
      width: 160,
      render: (user: any) => (
        <Space>
          <UserIcon size={16} className="text-gray-400" />
          <Text strong>{getUserName(user)}</Text>
        </Space>
      ),
    },
    {
      title: "Công nghệ",
      dataIndex: "technology",
      key: "technology",
      width: 240,
      render: (technology: any) => (
        <Text className="whitespace-pre-wrap break-words">
          {typeof technology === "string" ? technology : technology?.title || "Không xác định"}
        </Text>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 280,
      render: (description: string) => (
        <Text className="whitespace-pre-wrap break-words">
          {description || "Không có mô tả"}
        </Text>
      ),
    },
    {
      title: "Chi phí ước tính",
      dataIndex: "estimated_cost",
      key: "estimated_cost",
      width: 140,
      render: (cost: number) => (
        <Space>
          <DollarSign size={16} className="text-gray-400" />
          <Text strong>
            {typeof cost === "number"
              ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(cost)
              : "Chưa xác định"}
          </Text>
        </Space>
      ),
    },
    {
      title: "Thời gian thực hiện",
      dataIndex: "execution_time",
      key: "execution_time",
      width: 140,
      render: (time: string) => <Text>{time || "Chưa xác định"}</Text>,
    },
    {
      title: "Tài liệu",
      dataIndex: "document",
      key: "document",
      width: 120,
      render: (document: any) => (
        <Space>
          {document && document.url ? (
            <>
              <Tooltip title="Xem tài liệu" color="#1677ff">
                <Button type="text" size="small" icon={<Eye size={16} />} onClick={() => window.open(document.url, "_blank")} />
              </Tooltip>
              <Tooltip title="Tải xuống" color="#1677ff">
                <Button
                  type="text"
                  size="small"
                  icon={<Download size={16} />}
                  onClick={() => {
                    const link = window.document.createElement("a");
                    link.href = document.url;
                    link.download = document.filename || "document";
                    window.document.body.appendChild(link);
                    link.click();
                    window.document.body.removeChild(link);
                  }}
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
      width: 140,
      render: (status: ProposeStatus) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: "Lần cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 160,
      render: (updatedAt?: string) => (
        <Space>
          <Calendar size={16} className="text-gray-400" />
          <Text>{updatedAt ? new Date(updatedAt).toLocaleString("vi-VN") : "Không xác định"}</Text>
        </Space>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 160,
      fixed: "right",
      render: (_: any, record: any) => {
        const proposalId = record.id || record._id;
        const isPending = record.status === "pending";
        // Cho phép xem chi tiết ở mọi trạng thái để chuyển sang màn đàm phán đề xuất
        const canViewDetails = true;

        return (
          <Space>
            {isPending && (
              <>
                <Popconfirm
                  title="Xác nhận đề xuất"
                  description="Bạn có chắc chắn muốn xác nhận đề xuất này?"
                  onConfirm={() => handleAccept(proposalId)}
                  okText="Xác nhận"
                  cancelText="Hủy"
                >
                  <Tooltip title="Xác nhận" color="#1677ff">
                    <Button
                      type="text"
                      size="small"
                      loading={actionLoading === proposalId}
                      icon={<CheckCircle size={16} />}
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
                      danger
                      loading={actionLoading === proposalId}
                      icon={<X size={16} color="red" />}
                    />
                  </Tooltip>
                </Popconfirm>
              </>
            )}
            {canViewDetails && (
              <Tooltip title="Xem chi tiết" color="#1677ff">
                <Button
                  type="text"
                  size="small"
                  icon={<ExternalLink size={16} />}
                  onClick={() => handleViewDetails(proposalId)}
                />
              </Tooltip>
            )}
          </Space>
        );
      },
    },
  ], [proposals]);

  const handleClose = () => onOpenChange(false);

  return (
    <Modal
      title={
        <div>
          <Typography.Title level={4} className="!m-0">
            Danh sách đề xuất
          </Typography.Title>
          {demandTitle && (
            <Text type="secondary">Nhu cầu: {demandTitle}</Text>
          )}
        </div>
      }
      open={isOpen}
      onCancel={handleClose}
      footer={[
        <Button key="close" type="primary" onClick={handleClose}>
          Đóng
        </Button>,
      ]}
      width={1400}
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
            <Text type="secondary">Chưa có đề xuất nào cho nhu cầu này</Text>
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
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đề xuất`,
            }}
            scroll={{ x: 1100 }}
            size="middle"
            bordered
          />
        </div>
      )}
    </Modal>
  );
}

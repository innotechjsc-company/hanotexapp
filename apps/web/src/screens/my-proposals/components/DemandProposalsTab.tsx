"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Table,
  Tag,
  Tooltip,
  Space,
  Select,
  Tabs as AntTabs,
  Popconfirm,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { X, Edit, ExternalLink, CheckCircle } from "lucide-react";
import {
  getProposes,
  updatePropose,
  acceptProposeWithMessage,
  rejectProposeWithMessage,
} from "@/api/propose";
import type { Propose, ProposeStatus } from "@/types/propose";
import { formatDateTime, formatCurrency } from "@/lib/utils";
import EditDemandProposalModal from "./EditDemandProposalModal";

const statusColors: Record<ProposeStatus, string> = {
  pending: "orange",
  negotiating: "blue",
  contact_signing: "cyan",
  contract_signed: "green",
  completed: "green",
  cancelled: "red",
};

const statusLabels: Record<ProposeStatus, string> = {
  pending: "Chờ xem xét",
  negotiating: "Đang đàm phán",
  contact_signing: "Đang ký hợp đồng",
  contract_signed: "Đã ký hợp đồng",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

export default function DemandProposalsTab({ userId }: { userId: string }) {
  const router = useRouter();
  const [proposals, setProposals] = useState<Propose[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Filters and pagination
  const [statusFilter, setStatusFilter] = useState<ProposeStatus | "all">(
    "all"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Propose | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"sent" | "received">("sent");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  // no title search

  const pageSize = 10;

  // Fetch proposals
  const fetchProposals = async () => {
    if (!userId) return;

    setLoading(true);
    setError("");

    try {
      const filters: any =
        viewMode === "sent" ? { user: userId } : { receiver: userId };
      if (statusFilter !== "all") filters.status = statusFilter;
      // no title search

      const response = await getProposes(filters, {
        page: currentPage,
        limit: pageSize,
        sort: "-createdAt",
      });

      const data = (response as any).docs || (response as any).data || [];
      const total = (response as any).totalDocs || (response as any).total || 0;

      setProposals(data);
      setTotalItems(total);
    } catch (err) {
      console.error("Failed to fetch demand proposals:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Không thể tải danh sách đề xuất";
      setError(errorMessage);
      setProposals([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
  }, [userId, currentPage, statusFilter, viewMode]);

  const handleStatusFilter = (value: string | undefined) => {
    setStatusFilter((value as ProposeStatus) || "all");
    setCurrentPage(1);
  };

  const handleViewTechnology = (technologyId: string) => {
    window.open(`/technologies/${technologyId}`, "_blank");
  };

  const handleViewNegotiation = (proposal: Propose) => {
    // Navigate to propose negotiation details page
    router.push(`/proposes/negotiations/${proposal.id}`);
  };

  const handleCancelProposal = async (proposal: Propose) => {
    if (!proposal.id) return;

    try {
      // Update status to cancelled
      await updatePropose(proposal.id, { status: "cancelled" });

      // Refresh the list after successful update
      await fetchProposals();

      // TODO: Show success message
      console.log("Proposal cancelled successfully");
    } catch (error) {
      console.error("Failed to cancel proposal:", error);
      // TODO: Show error message
    }
  };

  const handleConfirmReceivedProposal = async (proposal: Propose) => {
    if (!proposal.id) return;

    setActionLoading(proposal.id);
    try {
      const response = await acceptProposeWithMessage(
        proposal.id,
        "Đã chấp nhận đề xuất và sẵn sàng đàm phán giá."
      );

      if (response.success) {
        message.success("Đã xác nhận đề xuất và tạo đàm phán thành công");
        await fetchProposals();
      } else {
        throw new Error("Failed to accept proposal");
      }
    } catch (error) {
      console.error("Failed to confirm proposal:", error);
      message.error("Không thể xác nhận đề xuất");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectReceivedProposal = async (proposal: Propose) => {
    if (!proposal.id) return;

    setActionLoading(proposal.id);
    try {
      await rejectProposeWithMessage(proposal.id, "Đã từ chối đề xuất này.");
      message.success("Đã từ chối đề xuất");
      await fetchProposals();
    } catch (error) {
      console.error("Failed to reject proposal:", error);
      message.error("Không thể từ chối đề xuất");
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditProposal = (proposal: Propose) => {
    // Chỉ cho phép sửa khi trạng thái là 'pending'
    if (proposal.status !== "pending") return;
    setSelectedProposal(proposal);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (updatedData: Partial<Propose>) => {
    if (!selectedProposal?.id) return;

    try {
      // Call API to update proposal
      await updatePropose(selectedProposal.id, updatedData);

      // Refresh the list after successful update
      await fetchProposals();
      setEditModalOpen(false);
      setSelectedProposal(null);

      // TODO: Show success message
      console.log("Proposal updated successfully");
    } catch (error) {
      console.error("Failed to update proposal:", error);
      // TODO: Show error message
    }
  };

  const columns: ColumnsType<Propose> = [
    {
      title: "Tiêu đề đề xuất",
      dataIndex: "title",
      key: "title",
      render: (title: string, record: Propose) => (
        <div>
          <div className="font-semibold">{title}</div>
          {record.description && (
            <div className="text-sm text-gray-500 truncate max-w-xs">
              {record.description}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Nhu cầu",
      dataIndex: "demand",
      key: "demand",
      render: (demand: any) => {
        const demandTitle =
          typeof demand === "string" ? "Nhu cầu" : demand?.title || "Nhu cầu";
        return <span className="text-gray-600">{demandTitle}</span>;
      },
    },
    {
      title: "Công nghệ",
      dataIndex: "technology",
      key: "technology",
      render: (technology: any) => {
        const technologyTitle =
          typeof technology === "string"
            ? "Công nghệ"
            : technology?.title || "Công nghệ";
        const technologyId =
          typeof technology === "string" ? technology : technology?.id;
        return (
          <span
            className="font-medium text-blue-600 hover:underline cursor-pointer"
            onClick={() => technologyId && handleViewTechnology(technologyId)}
          >
            {technologyTitle}
          </span>
        );
      },
    },
    {
      title: "Chi phí ước tính",
      dataIndex: "estimated_cost",
      key: "estimated_cost",
      render: (cost: number) => (
        <span className="text-gray-600">
          {cost ? formatCurrency(cost) : "Chưa xác định"}
        </span>
      ),
    },
    {
      title: "Thời gian thực hiện",
      dataIndex: "execution_time",
      key: "execution_time",
      render: (time: string) => (
        <span className="text-gray-600">{time || "Chưa xác định"}</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: ProposeStatus) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: "Lần sửa đổi gần nhất",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (updatedAt: string) => (
        <span className="text-gray-600">
          {updatedAt ? formatDateTime(updatedAt) : "Không xác định"}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      align: "right" as const,
      render: (_, record: Propose) => {
        const technology = record.technology;
        const technologyId =
          typeof technology === "string" ? technology : technology?.id;

        const proposalId = record.id || "";
        const isPending = record.status === "pending";
        const isCancelled = record.status === "cancelled";
        const loading = actionLoading === proposalId;
        const isReceivedView = viewMode === "received";

        if (isReceivedView) {
          return (
            <Space>
              {isPending && (
                <>
                  <Popconfirm
                    title="Xác nhận đề xuất"
                    description="Bạn có chắc chắn muốn xác nhận đề xuất này?"
                    okText="Xác nhận"
                    cancelText="Hủy"
                    onConfirm={() => handleConfirmReceivedProposal(record)}
                  >
                    <Tooltip title="Xác nhận" color="green">
                      <Button
                        type="text"
                        size="small"
                        icon={<CheckCircle className="h-4 w-4" />}
                        loading={loading}
                        className="hover:text-green-600"
                      />
                    </Tooltip>
                  </Popconfirm>
                  <Popconfirm
                    title="Từ chối đề xuất"
                    description="Bạn có chắc chắn muốn từ chối đề xuất này?"
                    okText="Từ chối"
                    cancelText="Hủy"
                    okType="danger"
                    onConfirm={() => handleRejectReceivedProposal(record)}
                  >
                    <Tooltip title="Từ chối" color="red">
                      <Button
                        type="text"
                        size="small"
                        icon={<X className="h-4 w-4" />}
                        loading={loading}
                        danger
                      />
                    </Tooltip>
                  </Popconfirm>
                </>
              )}
              {!isPending && !isCancelled && (
                <Tooltip title="Xem chi tiết" color="blue">
                  <Button
                    type="text"
                    size="small"
                    icon={<ExternalLink className="h-4 w-4" />}
                    onClick={() => handleViewNegotiation(record)}
                  />
                </Tooltip>
              )}
            </Space>
          );
        }

        return (
          <Space>
            {isPending && (
              <Tooltip title="Sửa đề xuất" color="green">
                <Button
                  type="text"
                  size="small"
                  icon={<Edit className="h-4 w-4" />}
                  onClick={() => handleEditProposal(record)}
                />
              </Tooltip>
            )}
            {!isPending && (
              <Tooltip title="Xem chi tiết" color="blue">
                <Button
                  type="text"
                  size="small"
                  icon={<ExternalLink className="h-4 w-4" />}
                  onClick={() => handleViewNegotiation(record)}
                />
              </Tooltip>
            )}
            {(isPending || isCancelled) && (
              <Tooltip title="Hủy đề xuất" color="red">
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<X className="h-4 w-4" />}
                  onClick={() => handleCancelProposal(record)}
                />
              </Tooltip>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* View Mode Tabs */}
      <div className="mb-4">
        <AntTabs
          activeKey={viewMode}
          onChange={(k) => {
            setViewMode((k as any) || "sent");
            setCurrentPage(1);
          }}
          items={[
            { key: "sent", label: "Đã gửi" },
            { key: "received", label: "Nhận được" },
          ]}
        />
      </div>

      {/* Filters (no search) */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch">
        <Select
          placeholder="Lọc theo trạng thái"
          value={statusFilter !== "all" ? statusFilter : undefined}
          onChange={handleStatusFilter}
          className="w-full sm:w-60"
          allowClear
        >
          <Select.Option value="all">Tất cả trạng thái</Select.Option>
          {Object.entries(statusLabels).map(([key, label]) => (
            <Select.Option key={key} value={key}>
              {label}
            </Select.Option>
          ))}
        </Select>

        <Button
          onClick={() => {
            setStatusFilter("all");
            setCurrentPage(1);
          }}
          className="w-full sm:w-auto"
        >
          Đặt lại bộ lọc
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <p className="text-red-600">{error}</p>
          <Button
            size="small"
            danger
            onClick={fetchProposals}
            loading={loading}
          >
            Thử lại
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="relative overflow-x-auto">
        <Table
          columns={columns}
          dataSource={proposals}
          rowKey={(record) => record.id || Math.random().toString()}
          loading={loading}
          locale={{
            emptyText: loading
              ? "Đang tải..."
              : viewMode === "sent"
                ? "Chưa có đề xuất nhu cầu đã gửi"
                : "Chưa có đề xuất nhu cầu nhận được",
          }}
          pagination={{
            current: currentPage,
            total: totalItems,
            pageSize: pageSize,
            onChange: setCurrentPage,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} đề xuất`,
          }}
          scroll={{ x: 1000 }}
        />
      </div>

      {/* Edit Modal */}
      <EditDemandProposalModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedProposal(null);
        }}
        proposal={selectedProposal}
        onSubmit={handleEditSubmit}
      />
    </div>
  );
}

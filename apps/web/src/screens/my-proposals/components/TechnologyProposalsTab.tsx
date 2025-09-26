"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Table, Tag, Tooltip, Space, Input, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Search, ExternalLink, X, Edit } from "lucide-react";
import { technologyProposeApi } from "@/api/technology-propose";
import type {
  TechnologyPropose,
  TechnologyProposeStatus,
} from "@/types/technology-propose";
import { formatDateTime, formatCurrency } from "@/lib/utils";
import EditTechnologyProposalModal from "./EditTechnologyProposalModal";

const statusColors: Record<TechnologyProposeStatus, string> = {
  pending: "orange",
  negotiating: "blue",
  contact_signing: "cyan",
  contract_signed: "green",
  completed: "green",
  cancelled: "red",
};

const statusLabels: Record<TechnologyProposeStatus, string> = {
  pending: "Chờ xem xét",
  negotiating: "Đang đàm phán",
  contact_signing: "Đang ký hợp đồng",
  contract_signed: "Đã ký hợp đồng",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

export default function TechnologyProposalsTab({ userId }: { userId: string }) {
  const router = useRouter();
  const [proposals, setProposals] = useState<TechnologyPropose[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Filters and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    TechnologyProposeStatus | "all"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] =
    useState<TechnologyPropose | null>(null);

  const pageSize = 10;

  // Fetch proposals
  const fetchProposals = async () => {
    if (!userId) return;

    setLoading(true);
    setError("");

    try {
      const filters: any = {
        user: userId,
      };

      if (statusFilter !== "all") {
        filters.status = statusFilter;
      }

      if (searchTerm.trim()) {
        filters.search = searchTerm.trim();
      }

      const response = await technologyProposeApi.list(filters, {
        page: currentPage,
        limit: pageSize,
        sort: "-createdAt",
      });

      // Handle different response formats
      const data = (response as any).docs || (response as any).data || [];
      const total = (response as any).totalDocs || (response as any).total || 0;

      setProposals(data);
      setTotalItems(total);
    } catch (err) {
      console.error("Failed to fetch technology proposals:", err);
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
  }, [userId, currentPage, statusFilter, searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusFilter = (value: string | undefined) => {
    setStatusFilter((value as TechnologyProposeStatus) || "all");
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleViewTechnology = (technologyId: string) => {
    window.open(`/technologies/${technologyId}`, "_blank");
  };

  const handleViewNegotiation = (proposal: TechnologyPropose) => {
    // Navigate to negotiation details page
    router.push(`/technologies/negotiations/${proposal.id}`);
  };

  const handleCancelProposal = async (proposal: TechnologyPropose) => {
    if (!proposal.id) return;

    try {
      // Update status to cancelled
      await technologyProposeApi.setStatus(proposal.id, "cancelled");

      // Refresh the list after successful update
      await fetchProposals();

      // TODO: Show success message
      console.log("Proposal cancelled successfully");
    } catch (error) {
      console.error("Failed to cancel proposal:", error);
      // TODO: Show error message
    }
  };

  const handleEditProposal = (proposal: TechnologyPropose) => {
    // Chỉ cho phép sửa khi trạng thái là 'pending'
    if (proposal.status !== "pending") return;
    setSelectedProposal(proposal);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (updatedData: Partial<TechnologyPropose>) => {
    if (!selectedProposal?.id) return;

    try {
      // Call API to update proposal
      await technologyProposeApi.update(selectedProposal.id, updatedData);

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

  const columns: ColumnsType<TechnologyPropose> = [
    {
      title: "Công nghệ",
      dataIndex: "technology",
      key: "technology",
      render: (technology: any, record: TechnologyPropose) => {
        const technologyTitle =
          typeof technology === "string"
            ? "Công nghệ"
            : technology?.title || "Công nghệ";
        const technologyId =
          typeof technology === "string" ? technology : technology?.id;
        return (
          <div>
            <div
              className="font-semibold text-blue-600 hover:underline cursor-pointer"
              onClick={() => technologyId && handleViewTechnology(technologyId)}
            >
              {technologyTitle}
            </div>
            {record.description && (
              <div className="text-sm text-gray-500 truncate max-w-xs">
                {record.description}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Ngân sách",
      dataIndex: "budget",
      key: "budget",
      render: (budget: number) => (
        <span className="text-gray-600">
          {budget ? formatCurrency(budget) : "Chưa xác định"}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: TechnologyProposeStatus) => (
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
      render: (_, record: TechnologyPropose) => {
        const technology = record.technology;
        const technologyId =
          typeof technology === "string" ? technology : technology?.id;

        return (
          <Space>
            {record.status === "pending" && (
              <Tooltip title="Sửa đề xuất" color="green">
                <Button
                  type="text"
                  size="small"
                  icon={<Edit className="h-4 w-4" />}
                  onClick={() => handleEditProposal(record)}
                />
              </Tooltip>
            )}
            {record.status !== "pending" && record.status !== "cancelled" && (
              <Tooltip title="Xem đàm phán" color="blue">
                <Button
                  type="text"
                  size="small"
                  icon={<ExternalLink className="h-4 w-4" />}
                  onClick={() => handleViewNegotiation(record)}
                />
              </Tooltip>
            )}
            {record.status !== "completed" && (
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
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Tìm kiếm theo tên công nghệ..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          prefix={<Search className="h-4 w-4 text-gray-400" />}
          className="flex-1"
        />

        <Select
          placeholder="Lọc theo trạng thái"
          value={statusFilter !== "all" ? statusFilter : undefined}
          onChange={handleStatusFilter}
          className="w-full sm:w-48"
          allowClear
        >
          <Select.Option value="all">Tất cả trạng thái</Select.Option>
          {Object.entries(statusLabels).map(([key, label]) => (
            <Select.Option key={key} value={key}>
              {label}
            </Select.Option>
          ))}
        </Select>
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
              : "Chưa có đề xuất chuyển giao công nghệ nào",
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
          scroll={{ x: 800 }}
        />
      </div>

      {/* Edit Modal */}
      <EditTechnologyProposalModal
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

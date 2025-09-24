"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";
import { Button, Table, Tag, Tooltip, Space, Input, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Search, Eye, MessageSquare, Target, X, Edit } from "lucide-react";
import { getProposesByUser, updatePropose } from "@/api/propose";
import type { Propose, ProposeStatus } from "@/types/propose";
import { formatDateTime, formatCurrency } from "@/lib/utils";
import EditDemandProposalModal from "./EditDemandProposalModal";

const statusColors: Record<ProposeStatus, string> = {
  pending: "orange",
  negotiating: "blue",
  contract_signed: "green",
  completed: "green",
  cancelled: "red",
};

const statusLabels: Record<ProposeStatus, string> = {
  pending: "Chờ xem xét",
  negotiating: "Đang đàm phán",
  contract_signed: "Đã ký hợp đồng",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

export default function DemandProposalsTab() {
  const router = useRouter();
  const { user } = useAuth();
  const [proposals, setProposals] = useState<Propose[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Filters and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProposeStatus | "all">(
    "all"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Propose | null>(
    null
  );

  const pageSize = 10;

  // Fetch proposals
  const fetchProposals = async () => {
    if (!user?.id) return;

    setLoading(true);
    setError("");

    try {
      const response = await getProposesByUser(user.id, {
        page: currentPage,
        limit: pageSize,
        sort: "-createdAt",
      });

      // Handle different response formats
      const data = (response as any).docs || (response as any).data || [];
      const total = (response as any).totalDocs || (response as any).total || 0;

      // Apply client-side filtering if needed
      let filteredData = data;

      if (statusFilter !== "all") {
        filteredData = data.filter(
          (proposal: Propose) => proposal.status === statusFilter
        );
      }

      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        filteredData = filteredData.filter(
          (proposal: Propose) =>
            (typeof proposal.technology === "object" &&
              proposal.technology?.title
                ?.toLowerCase()
                .includes(searchLower)) ||
            (typeof proposal.technology === "string" &&
              searchLower.includes("công nghệ"))
        );
      }

      setProposals(filteredData);
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
  }, [user?.id, currentPage]);

  // Re-fetch when filters change
  useEffect(() => {
    if (user?.id) {
      setCurrentPage(1);
      fetchProposals();
    }
  }, [statusFilter, searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value as ProposeStatus | "all");
  };

  const handleViewDemand = (demandId: string) => {
    window.open(`/demands/${demandId}`, "_blank");
  };

  const handleViewTechnology = (technologyId: string) => {
    window.open(`/technologies/${technologyId}`, "_blank");
  };

  const handleViewNegotiation = (proposal: Propose) => {
    // Navigate to negotiation details page
    router.push(`/technologies/negotiations/${proposal.id}`);
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

  const handleEditProposal = (proposal: Propose) => {
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
        return <span className="text-gray-600">{technologyTitle}</span>;
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

        return (
          <Space>
            <Tooltip title="Xem công nghệ">
              <Button
                type="text"
                size="small"
                icon={<Eye className="h-4 w-4" />}
                onClick={() =>
                  technologyId && handleViewTechnology(technologyId)
                }
              />
            </Tooltip>
            <Tooltip title="Sửa đề xuất" color="green">
              <Button
                type="text"
                size="small"
                icon={<Edit className="h-4 w-4" />}
                onClick={() => handleEditProposal(record)}
              />
            </Tooltip>
            {record.status === "negotiating" && (
              <Tooltip title="Xem đàm phán" color="blue">
                <Button
                  type="text"
                  size="small"
                  icon={<MessageSquare className="h-4 w-4" />}
                  onClick={() => handleViewNegotiation(record)}
                />
              </Tooltip>
            )}
            <Tooltip title="Hủy đề xuất" color="red">
              <Button
                type="text"
                size="small"
                danger
                icon={<X className="h-4 w-4" />}
                onClick={() => handleCancelProposal(record)}
              />
            </Tooltip>
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
            emptyText: loading ? "Đang tải..." : "Chưa có đề xuất nhu cầu nào",
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

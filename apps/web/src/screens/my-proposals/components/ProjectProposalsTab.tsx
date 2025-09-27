"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Table, Tag, Tooltip, Space, Input, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Eye, MessageSquare, X } from "lucide-react";
import { projectProposeApi } from "@/api/project-propose";
import type {
  ProjectPropose,
  ProjectProposeStatus,
} from "@/types/project-propose";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import EditProjectProposalModal from "./EditProjectProposalModal";

const statusColors: Record<ProjectProposeStatus, string> = {
  pending: "orange",
  negotiating: "blue",
  contact_signing: "cyan",
  contract_signed: "green",
  completed: "green",
  cancelled: "red",
};

const statusLabels: Record<ProjectProposeStatus, string> = {
  pending: "Chờ xem xét",
  negotiating: "Đang đàm phán",
  contact_signing: "Đang ký hợp đồng",
  contract_signed: "Đã ký hợp đồng",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

export default function ProjectProposalsTab({ userId }: { userId: string }) {
  const router = useRouter();
  const [proposals, setProposals] = useState<ProjectPropose[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Filters and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectProposeStatus | "all">(
    "all"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] =
    useState<ProjectPropose | null>(null);
  const pageSize = 10;

  const fetchProposals = async () => {
    if (!userId) return;

    setLoading(true);
    setError("");

    try {
      const filters: any = { user: userId };
      if (statusFilter !== "all") filters.status = statusFilter;
      if (searchTerm.trim()) filters.search = searchTerm.trim();

      const response = await projectProposeApi.list(filters, {
        page: currentPage,
        limit: pageSize,
        sort: "-createdAt",
      });

      const data = (response as any).docs || (response as any).data || [];
      const total = (response as any).totalDocs || (response as any).total || 0;

      setProposals(data);
      setTotalItems(total);
    } catch (err) {
      console.error("Failed to fetch project proposals:", err);
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
    setCurrentPage(1);
  };

  const handleStatusFilter = (value: string | undefined) => {
    setStatusFilter((value as ProjectProposeStatus) || "all");
    setCurrentPage(1);
  };

  const handleViewProject = (project: any) => {
    if (!project) return;
    window.open(`/funds/fundraising/${project.id}`, "_blank");
  };

  const handleEditProposal = (proposal: ProjectPropose) => {
    // Chỉ cho phép sửa khi trạng thái là 'pending'
    if (proposal.status !== "pending") return;
    setSelectedProposal(proposal);
    setEditModalOpen(true);
  };

  const handleViewNegotiation = (proposal: ProjectPropose) => {
    router.push(`/my-projects/negotiations/${proposal.id}`);
  };

  const handleCancelProposal = async (proposal: ProjectPropose) => {
    if (!proposal.id) return;

    try {
      await projectProposeApi.setStatus(proposal.id, "cancelled" as any);
      await fetchProposals();
      console.log("Proposal cancelled successfully");
    } catch (err) {
      console.error("Failed to cancel proposal:", err);
    }
  };

  const handleEditSubmit = async (updatedData: Partial<ProjectPropose>) => {
    if (!selectedProposal?.id) return;

    try {
      await projectProposeApi.update(selectedProposal.id, updatedData);
      await fetchProposals();
      setEditModalOpen(false);
      setSelectedProposal(null);
    } catch (err) {
      console.error("Failed to update proposal:", err);
    }
  };

  const columns: ColumnsType<ProjectPropose> = [
    {
      title: "Dự án",
      dataIndex: "project",
      key: "project",
      render: (project: any) => {
        const projectName =
          typeof project === "string" ? "Dự án" : project?.name || "Dự án";
        return <span className="font-semibold">{projectName}</span>;
      },
    },
    {
      title: "Số tiền đầu tư",
      dataIndex: "investment_amount",
      key: "investment_amount",
      render: (amount?: number) => (
        <span className="text-gray-600">
          {amount ? formatCurrency(amount) : "Chưa xác định"}
        </span>
      ),
    },
    {
      title: "Tỉ lệ sở hữu (%)",
      dataIndex: "investment_ratio",
      key: "investment_ratio",
      render: (ratio?: number) => (
        <span className="text-gray-600">{ratio ?? "Chưa xác định"}</span>
      ),
    },
    {
      title: "Hình thức đầu tư",
      dataIndex: "investment_type",
      key: "investment_type",
      render: (type?: string) => (
        <span className="text-gray-600">{type || "Chưa xác định"}</span>
      ),
    },
    {
      title: "Lợi ích kỳ vọng",
      dataIndex: "investment_benefits",
      key: "investment_benefits",
      render: (benefits?: string) => (
        <span className="text-gray-600 line-clamp-1 max-w-xs">{benefits || "—"}</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: ProjectProposeStatus) => (
        <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
      ),
    },
    {
      title: "Cập nhật",
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
      render: (_, record: ProjectPropose) => {
        const project = record.project;
        return (
          <Space>
            {record.status === "pending" && (
              <Tooltip title="Sửa đề xuất" color="blue">
              <Button
                type="text"
                size="small"
                icon={<Eye className="h-4 w-4" />}
                  onClick={() => handleEditProposal(record)}
                />
              </Tooltip>
            )}
            {(record.status === "negotiating" ||
              record.status === "contact_signing" ||
              record.status === "contract_signed") && (
              <Tooltip title="Xem đàm phán" color="blue">
                <Button
                  type="text"
                  size="small"
                  icon={<MessageSquare className="h-4 w-4" />}
                  onClick={() => handleViewNegotiation(record)}
                />
              </Tooltip>
            )}
            {(record.status === "pending" || record.status === "cancelled") && (
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
          placeholder="Tìm kiếm theo tên dự án..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
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
          <Button size="small" danger onClick={fetchProposals} loading={loading}>
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
            emptyText: loading ? "Đang tải..." : "Chưa có đề xuất dự án nào",
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
          scroll={{ x: 900 }}
        />
      </div>

      {/* Edit Modal */}
      <EditProjectProposalModal
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

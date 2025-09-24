"use client";

import { Button, Tag, Table, Tooltip, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Edit, Trash2, Eye, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Technology } from "@/types/technologies";
import {
  getStatusColor,
  getStatusLabel,
  getVisibilityModeLabel,
  checkUserAuth,
} from "../utils";
import type { EditableTechnology } from "../hooks/useMyTechnologies";

interface TechnologiesTableProps {
  filteredItems: Technology[];
  isLoading: boolean;
  selectedKeys: Set<string>;
  setSelectedKeys: React.Dispatch<React.SetStateAction<Set<string>>>;
  selectedCount: number;
  setCurrent: React.Dispatch<React.SetStateAction<EditableTechnology | null>>;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onViewProposals: () => void;
  user: any;
}

export function TechnologiesTable({
  filteredItems,
  isLoading,
  selectedKeys,
  setSelectedKeys,
  selectedCount,
  setCurrent,
  onView,
  onEdit,
  onDelete,
  onViewProposals,
  user,
}: TechnologiesTableProps) {
  const router = useRouter();

  const handleView = (item: any) => {
    setCurrent(item);
    onView();
  };

  const handleEdit = (item: any) => {
    if (!checkUserAuth(user, router)) return;
    setCurrent(item);
    onEdit();
  };

  const handleDelete = (item: any) => {
    if (!checkUserAuth(user, router)) return;
    setCurrent(item);
    onDelete();
  };

  const handleViewProposals = (item: any) => {
    setCurrent(item);
    onViewProposals();
  };

  const columns: ColumnsType<any> = [
    {
      title: "Tiêu đề công nghệ",
      dataIndex: "title",
      key: "title",
      render: (title: string, record: any) => (
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-gray-500 truncate max-w-xs">
            {record.description}
          </div>
        </div>
      ),
    },
    {
      title: "Lĩnh vực",
      dataIndex: "category",
      key: "category",
      render: (category: any) => (
        <span className="text-gray-600">{category?.name || "Chưa chọn"}</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: any) => (
        <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
      ),
    },
    {
      title: "Chế độ hiển thị",
      dataIndex: "visibility_mode",
      key: "visibility_mode",
      render: (visibility_mode: string) => (
        <span className="text-gray-600">
          {getVisibilityModeLabel(visibility_mode)}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      align: "right" as const,
      render: (_, record: any) =>
        selectedCount > 0 ? null : (
          <Space>
            <Tooltip
              title="Xem chi tiết"
              color="#1677ff"
              overlayInnerStyle={{ color: "white" }}
            >
              <Button
                type="text"
                size="small"
                icon={<Eye className="h-4 w-4" />}
                onClick={() => handleView(record)}
              />
            </Tooltip>
            <Tooltip
              title="Xem đề xuất"
              color="#1677ff"
              overlayInnerStyle={{ color: "white" }}
            >
              <Button
                type="text"
                size="small"
                icon={<FileText className="h-4 w-4" />}
                onClick={() => handleViewProposals(record)}
              />
            </Tooltip>
            <Tooltip
              title="Chỉnh sửa"
              color="#52c41a"
              overlayInnerStyle={{ color: "white" }}
            >
              <Button
                type="text"
                size="small"
                icon={<Edit className="h-4 w-4" />}
                onClick={() => handleEdit(record)}
              />
            </Tooltip>
            <Tooltip
              title={<span style={{ color: "#ff4d4f" }}>Xóa</span>}
              color="#fff"
              overlayInnerStyle={{
                color: "#ff4d4f",
                border: "1px solid #ff4d4f",
                backgroundColor: "white",
              }}
            >
              <Button
                type="text"
                size="small"
                icon={<Trash2 className="h-4 w-4" />}
                onClick={() => handleDelete(record)}
              />
            </Tooltip>
          </Space>
        ),
    },
  ];

  return (
    <div className="relative overflow-x-auto">
      <Table
        columns={columns}
        dataSource={filteredItems}
        rowKey={(record) => record.id || record._id}
        loading={isLoading}
        locale={{
          emptyText: isLoading ? "Đang tải..." : "Chưa có công nghệ nào",
        }}
        pagination={false}
        scroll={{ x: 800 }}
      />
    </div>
  );
}

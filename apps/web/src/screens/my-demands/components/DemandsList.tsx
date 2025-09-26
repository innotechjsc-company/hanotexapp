"use client";

import { Button, Space, Typography, Spin, Card, Table, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Eye, Edit, Trash2, FileText } from "lucide-react";
import { Demand } from "@/types/demand";

interface DemandsListProps {
  loading: boolean;
  demands: Demand[];
  deletingIds: Set<string>;
  onView: (d: Demand) => void;
  onViewProposals: (d: Demand) => void;
  onEdit: (d: Demand) => void;
  onDelete: (d: Demand) => void;
}

export default function DemandsList({
  loading,
  demands,
  deletingIds,
  onView,
  onViewProposals,
  onEdit,
  onDelete,
}: DemandsListProps) {
  const columns: ColumnsType<Demand> = [
    {
      title: "Tiêu đề nhu cầu",
      dataIndex: "title",
      key: "title",
      render: (title: string, record: Demand) => (
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
        <span className="text-gray-600">
          {typeof category === "string"
            ? category
            : category?.name || "Chưa phân loại"}
        </span>
      ),
    },
    {
      title: "Giá",
      key: "price",
      render: (_: any, record: Demand) => {
        const from = record.from_price
          ? `${record.from_price.toLocaleString()} VNĐ`
          : null;
        const to = record.to_price
          ? `${record.to_price.toLocaleString()} VNĐ`
          : null;
        const value =
          from && to ? `${from} - ${to}` : from || to || "Chưa xác định";
        return <span className="text-gray-600">{value}</span>;
      },
    },
    {
      title: "TRL Level",
      dataIndex: "trl_level",
      key: "trl_level",
      render: (lvl: number) => (
        <span className="text-gray-600">{lvl || "Chưa xác định"}</span>
      ),
    },
    {
      title: "Ngày đăng",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt?: string) => (
        <span className="text-gray-600">
          {createdAt ? new Date(createdAt).toLocaleDateString("vi-VN") : "—"}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      align: "right" as const,
      render: (_: any, record: Demand) => (
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
              onClick={() => onView(record)}
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
              onClick={() => onViewProposals(record)}
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
              onClick={() => onEdit(record)}
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
              loading={record.id ? deletingIds.has(record.id) : false}
              onClick={() => onDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        maxWidth: 1440,
        margin: "0 auto",
        padding: "0 16px 24px",
        marginTop: 16,
      }}
    >
      <Card title={<Typography.Text strong>Danh sách nhu cầu</Typography.Text>}>
        {loading ? (
          <div
            style={{ display: "flex", justifyContent: "center", padding: 48 }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <div className="relative overflow-x-auto">
            <Table
              columns={columns}
              dataSource={demands}
              rowKey={(record) => (record.id as string) || (record as any)._id}
              pagination={false}
              locale={{ emptyText: "Chưa có nhu cầu nào" }}
              scroll={{ x: 800 }}
            />
          </div>
        )}
      </Card>
    </div>
  );
}

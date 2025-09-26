"use client";

import { List, Button, Tag, Space, Typography, Spin, Card } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Demand } from "@/types/demand";

interface DemandsListProps {
  loading: boolean;
  demands: Demand[];
  deletingIds: Set<string>;
  onView: (d: Demand) => void;
  onEdit: (d: Demand) => void;
  onDelete: (d: Demand) => void;
}

export default function DemandsList({
  loading,
  demands,
  deletingIds,
  onView,
  onEdit,
  onDelete,
}: DemandsListProps) {
  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 16px 24px" }}>
      <Card title={<Typography.Text strong>Danh sách nhu cầu</Typography.Text>}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
            <Spin size="large" />
          </div>
        ) : (
          <List
            itemLayout="vertical"
            dataSource={demands}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    key="view"
                    type="text"
                    icon={<EyeOutlined />}
                    onClick={() => onView(item)}
                  >
                    Xem
                  </Button>,
                  <Button
                    key="edit"
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => onEdit(item)}
                  >
                    Sửa
                  </Button>,
                  <Button
                    key="delete"
                    type="text"
                    danger
                    loading={item.id ? deletingIds.has(item.id) : false}
                    icon={<DeleteOutlined />}
                    onClick={() => onDelete(item)}
                  >
                    Xóa
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      <Typography.Text strong>{item.title}</Typography.Text>
                      <Tag color="blue">Đã đăng</Tag>
                    </Space>
                  }
                  description={
                    <Typography.Text type="secondary">
                      {typeof item.category === "string"
                        ? item.category
                        : (item.category as any)?.name || "Chưa phân loại"}
                    </Typography.Text>
                  }
                />

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                  <div>
                    <Typography.Text type="secondary">Giá từ:</Typography.Text>
                    <Typography.Text style={{ marginLeft: 8 }}>
                      {item.from_price
                        ? `${item.from_price.toLocaleString()} VNĐ`
                        : "Chưa xác định"}
                    </Typography.Text>
                  </div>
                  <div>
                    <Typography.Text type="secondary">Giá đến:</Typography.Text>
                    <Typography.Text style={{ marginLeft: 8 }}>
                      {item.to_price
                        ? `${item.to_price.toLocaleString()} VNĐ`
                        : "Chưa xác định"}
                    </Typography.Text>
                  </div>
                  <div>
                    <Typography.Text type="secondary">TRL Level:</Typography.Text>
                    <Typography.Text style={{ marginLeft: 8 }}>
                      {item.trl_level || "Chưa xác định"}
                    </Typography.Text>
                  </div>
                </div>
                <div style={{ marginTop: 8 }}>
                  <Typography.Text type="secondary">Ngày đăng:</Typography.Text>{" "}
                  <Typography.Text>
                    {new Date(item.createdAt || "").toLocaleDateString("vi-VN")}
                  </Typography.Text>
                </div>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
}


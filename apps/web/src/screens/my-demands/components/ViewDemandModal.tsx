"use client";

import { Modal, Typography, Divider, List, Space } from "antd";
import { FileTextOutlined, LinkOutlined } from "@ant-design/icons";
import { Demand } from "@/types/demand";

interface ViewDemandModalProps {
  open: boolean;
  demand: Demand | null;
  onClose: () => void;
  onOpenDocument: (doc: any) => void;
}

export default function ViewDemandModal({
  open,
  demand,
  onClose,
  onOpenDocument,
}: ViewDemandModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Chi tiết nhu cầu"
      width={720}
    >
      {!demand ? null : (
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <div>
            <Typography.Text type="secondary">Tiêu đề</Typography.Text>
            <Typography.Paragraph strong style={{ marginBottom: 0 }}>
              {demand.title}
            </Typography.Paragraph>
          </div>
          <div>
            <Typography.Text type="secondary">Mô tả</Typography.Text>
            <Typography.Paragraph style={{ whiteSpace: "pre-wrap" }}>
              {demand.description}
            </Typography.Paragraph>
          </div>
          <div>
            <Typography.Text type="secondary">Danh mục</Typography.Text>
            <Typography.Paragraph strong style={{ marginBottom: 0 }}>
              {typeof demand.category === "string"
                ? demand.category
                : (demand.category as any)?.name || "Chưa phân loại"}
            </Typography.Paragraph>
          </div>

          <Divider style={{ margin: "8px 0" }} />

          <div>
            <Typography.Text type="secondary">Mong muốn</Typography.Text>
            <Typography.Paragraph>{demand.option || "-"}</Typography.Paragraph>
          </div>
          <div>
            <Typography.Text type="secondary">Yêu cầu công nghệ</Typography.Text>
            <Typography.Paragraph>
              {demand.option_technology || "-"}
            </Typography.Paragraph>
          </div>
          {demand.option_rule && (
            <div>
              <Typography.Text type="secondary">Yêu cầu quy tắc</Typography.Text>
              <Typography.Paragraph>
                {demand.option_rule || "-"}
              </Typography.Paragraph>
            </div>
          )}

          {demand.documents && demand.documents.length > 0 && (
            <div>
              <Typography.Text type="secondary">Tài liệu đính kèm</Typography.Text>
              <List
                dataSource={demand.documents}
                renderItem={(doc: any) => (
                  <List.Item onClick={() => onOpenDocument(doc)} style={{ cursor: "pointer" }}>
                    <List.Item.Meta
                      avatar={<FileTextOutlined />}
                      title={
                        <Space>
                          <Typography.Text>{doc.filename || doc.alt}</Typography.Text>
                          <LinkOutlined />
                        </Space>
                      }
                      description={
                        <Typography.Text type="secondary">
                          {doc.mimeType}
                          {doc.filesize ? ` • ${(doc.filesize / 1024).toFixed(1)} KB` : ""}
                        </Typography.Text>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          )}

          <div>
            <Typography.Text type="secondary">Ngày tạo</Typography.Text>
            <Typography.Paragraph>
              {new Date(demand.createdAt || "").toLocaleDateString("vi-VN")}
            </Typography.Paragraph>
          </div>
        </Space>
      )}
    </Modal>
  );
}


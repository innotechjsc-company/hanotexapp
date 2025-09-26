"use client";

import { Button, Typography, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface HeaderProps {
  onCreateNew: () => void;
}

export default function HeaderSection({ onCreateNew }: HeaderProps) {
  return (
    <div style={{ background: "#fff", borderBottom: "1px solid #f0f0f0" }}>
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "24px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Space direction="vertical" size={4}>
          <Space align="center">
            <Typography.Title level={3} style={{ margin: 0 }}>
              Nhu cầu của tôi
            </Typography.Title>
          </Space>
          <Typography.Text type="secondary">
            Quản lý và theo dõi các nhu cầu công nghệ bạn đã đăng
          </Typography.Text>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreateNew}>
          Đăng nhu cầu mới
        </Button>
      </div>
    </div>
  );
}

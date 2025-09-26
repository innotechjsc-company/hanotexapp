"use client";

import { Card, Statistic, Row, Col, Spin } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  FileTextOutlined,
  AimOutlined,
} from "@ant-design/icons";

interface StatsProps {
  loading: boolean;
  stats: {
    total: number;
    documents: number;
    withPrice: number;
    withDocuments: number;
  };
}

export default function StatsCards({ loading, stats }: StatsProps) {
  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "24px 16px" }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <Card>
            {loading ? (
              <Spin />
            ) : (
              <Statistic
                title="Tổng nhu cầu"
                value={stats.total}
                prefix={<AimOutlined />}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            {loading ? (
              <Spin />
            ) : (
              <Statistic
                title="Tài liệu"
                value={stats.documents}
                prefix={<FileTextOutlined />}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            {loading ? (
              <Spin />
            ) : (
              <Statistic
                title="Có giá cả"
                value={stats.withPrice}
                prefix={<EyeOutlined />}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card>
            {loading ? (
              <Spin />
            ) : (
              <Statistic
                title="Có tài liệu"
                value={stats.withDocuments}
                prefix={<EditOutlined />}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}


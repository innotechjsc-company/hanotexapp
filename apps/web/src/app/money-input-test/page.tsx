"use client";

import { useState } from "react";
import { Card, Typography, Space, Row, Col, Button } from "antd";
import { MoneyInput } from "@/components/input";

const { Title, Paragraph, Text } = Typography;

export default function MoneyInputTestPage() {
  const [vnd, setVnd] = useState<number | null>(1000000);
  const [live, setLive] = useState<number | null>(123456);
  const [usd, setUsd] = useState<number | null>(1234.56);
  const [ranged, setRanged] = useState<number | null>(5000);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-5xl mx-auto space-y-6">
        <Card>
          <Title level={2} className="text-center mb-2">
            MoneyInput Test Page
          </Title>
          <Paragraph className="text-center text-gray-600">
            Thử nghiệm các cấu hình thường dùng cho MoneyInput (định dạng, số chữ số thập phân, min/max, mũi tên tăng giảm,...)
          </Paragraph>
        </Card>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title="VND cơ bản (format on blur)">
              <Space direction="vertical" className="w-full">
                <MoneyInput
                  label="Giá (VND)"
                  placeholder="Nhập giá VND"
                  value={vnd}
                  onChange={setVnd}
                  locale="vi-VN"
                  currency="VND"
                  currencySymbol
                  decimalScale={0}
                  formatOnBlur
                />
                <Text type="secondary">Giá trị: {vnd ?? 'null'}</Text>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title="Định dạng trực tiếp (live format)">
              <Space direction="vertical" className="w-full">
                <MoneyInput
                  label="Giá trị"
                  value={live}
                  onChange={setLive}
                  locale="vi-VN"
                  decimalScale={0}
                  formatOnBlur={false}
                />
                <Text type="secondary">Giá trị: {live ?? 'null'}</Text>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title="USD có thập phân">
              <Space direction="vertical" className="w-full">
                <MoneyInput
                  label="Price (USD)"
                  value={usd}
                  onChange={setUsd}
                  locale="en-US"
                  currency="USD"
                  currencySymbol
                  decimalScale={2}
                />
                <Text type="secondary">Value: {usd ?? 'null'}</Text>
              </Space>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title="Giới hạn min/max + step">
              <Space direction="vertical" className="w-full">
                <MoneyInput
                  label="Số tiền (1,000 - 10,000)"
                  value={ranged}
                  onChange={setRanged}
                  locale="vi-VN"
                  decimalScale={0}
                  min={1000}
                  max={10000}
                  step={500}
                  helperText="Dùng mũi tên lên/xuống để tăng/giảm theo 500"
                />
                <div className="flex gap-2">
                  <Button onClick={() => setRanged(1000)}>Min</Button>
                  <Button onClick={() => setRanged(10000)}>Max</Button>
                  <Button onClick={() => setRanged((r) => (r ?? 0) + 500)}>+500</Button>
                  <Button onClick={() => setRanged((r) => (r ?? 0) - 500)}>-500</Button>
                </div>
                <Text type="secondary">Giá trị: {ranged ?? 'null'}</Text>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}


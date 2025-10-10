import { ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Badge, Button, Card, Space, Typography } from "antd";
import { getStatusConfig, getStatusLabel } from "../utils";

const { Text } = Typography;

interface BreadcrumbProps {
  status: string;
  onBack: () => void;
}

export function Breadcrumb({ status, onBack }: BreadcrumbProps) {
  const statusConfig = getStatusConfig(status);

  return (
    <Card className="mb-6 shadow-sm" bodyStyle={{ padding: "16px 24px" }}>
      <Space
        direction="horizontal"
        align="center"
        className="w-full justify-between"
      >
        <Space>
          <Button icon={<ArrowLeft />} onClick={onBack} type="text" />
          <Link href="/funds/fundraising">
            <Text className="text-green-600 hover:text-green-800">
              Dự án gọi vốn
            </Text>
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          <Text strong>Chi tiết dự án</Text>
        </Space>
        <Badge
          status={statusConfig.color as any}
          text={getStatusLabel(status)}
        />
      </Space>
    </Card>
  );
}

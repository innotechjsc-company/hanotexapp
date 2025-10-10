import { Card, Space, Statistic } from "antd";
import { ArrowUpOutlined, DollarCircleOutlined } from "@ant-design/icons";
import type { Project } from "@/types/project";

interface FinancialInfoProps {
  project: Project;
}

export function FinancialInfo({ project }: FinancialInfoProps) {
  return (
    <Card
      title="Thông tin tài chính"
      bodyStyle={{ padding: 24 }}
      style={{ marginTop: 20 }}
    >
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        {project?.revenue && (
          <Statistic
            title="Doanh thu"
            value={project.revenue}
            prefix={<ArrowUpOutlined style={{ color: "#52c41a" }} />}
          />
        )}
        {project?.profit && (
          <Statistic
            title="Lợi nhuận"
            value={project.profit}
            prefix={<ArrowUpOutlined style={{ color: "#52c41a" }} />}
          />
        )}
        {project?.assets && (
          <Statistic
            title="Tài sản"
            value={project.assets}
            prefix={<DollarCircleOutlined style={{ fontSize: 16 }} />}
          />
        )}
      </Space>
    </Card>
  );
}

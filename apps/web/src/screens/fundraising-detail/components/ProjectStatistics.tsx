import { Target } from "lucide-react";
import { Card, Col, Row, Statistic } from "antd";
import { CalendarOutlined, DollarCircleOutlined } from "@ant-design/icons";
import type { Project } from "@/types/project";
import { formatCurrencyAbbr, formatDate } from "../utils";

interface ProjectStatisticsProps {
  project: Project;
}

export function ProjectStatistics({ project }: ProjectStatisticsProps) {
  return (
    <Row gutter={[16, 16]} align="stretch">
      <Col xs={24} sm={12} md={6}>
        <Card
          size="small"
          className="text-center h-full"
          bodyStyle={{ padding: "20px 16px" }}
        >
          <Statistic
            title="Mục tiêu gọi vốn"
            value={project?.goal_money || 0}
            formatter={(value) => formatCurrencyAbbr(Number(value))}
            prefix={
              <DollarCircleOutlined
                style={{ color: "#52c41a", fontSize: 24 }}
              />
            }
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card
          size="small"
          className="text-center h-full"
          bodyStyle={{ padding: "20px 16px" }}
        >
          <Statistic
            title="Tỷ lệ cổ phần đề xuất"
            value={project?.share_percentage || 0}
            suffix="%"
            prefix={<Target style={{ color: "#1890ff", fontSize: 24 }} />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card
          size="small"
          className="text-center h-full"
          bodyStyle={{ padding: "20px 16px" }}
        >
          <Statistic
            title="Hạn gọi vốn"
            value={formatDate(project?.end_date || "")}
            prefix={
              <CalendarOutlined style={{ color: "#722ed1", fontSize: 24 }} />
            }
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} md={6}>
        <Card
          size="small"
          className="text-center h-full"
          bodyStyle={{ padding: "20px 16px" }}
        >
          <Statistic
            title="Trạng thái"
            value={
              project?.open_investment_fund
                ? "Đang kêu gọi vốn"
                : "Đã kêu gọi vốn"
            }
            prefix={<Target style={{ color: "#fa8c16", fontSize: 24 }} />}
          />
        </Card>
      </Col>
    </Row>
  );
}

import { Card, Descriptions, Typography } from "antd";
import type { Project } from "@/types/project";

const { Text, Paragraph } = Typography;

interface ProjectInfoProps {
  project: Project;
}

export function ProjectInfo({ project }: ProjectInfoProps) {
  return (
    <Card
      title="Thông tin dự án"
      className="mb-6"
      style={{ marginBottom: 20, marginTop: 20 }}
      bodyStyle={{ padding: 24 }}
    >
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Tên dự án">
          <Text strong>{project?.name || "Chưa có tên"}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Mô tả">
          <Paragraph>{project?.description || "Chưa có mô tả"}</Paragraph>
        </Descriptions.Item>
        {project?.business_model && (
          <Descriptions.Item label="Mô hình kinh doanh">
            <Paragraph>{project.business_model}</Paragraph>
          </Descriptions.Item>
        )}
        {project?.market_data && (
          <Descriptions.Item label="Số liệu và thị trường">
            <Paragraph>{project.market_data}</Paragraph>
          </Descriptions.Item>
        )}
        {project?.goal_money_purpose && (
          <Descriptions.Item label="Mục đích kêu gọi vốn">
            <Paragraph>{project.goal_money_purpose}</Paragraph>
          </Descriptions.Item>
        )}
        {project?.team_profile && (
          <Descriptions.Item label="Profile đội ngũ">
            <Paragraph>{project.team_profile}</Paragraph>
          </Descriptions.Item>
        )}
      </Descriptions>
    </Card>
  );
}

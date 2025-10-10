import { Card, Space, Tag } from "antd";
import { ExperimentOutlined } from "@ant-design/icons";
import type { Project } from "@/types/project";

interface TechnologiesSectionProps {
  project: Project;
}

export function TechnologiesSection({ project }: TechnologiesSectionProps) {
  if (
    !Array.isArray(project?.technologies) ||
    project.technologies.length === 0
  ) {
    return null;
  }

  return (
    <Card
      title="Công nghệ sử dụng"
      className="mb-6"
      style={{ marginBottom: 20, marginTop: 20 }}
      bodyStyle={{ padding: 24 }}
    >
      <Space wrap size="middle">
        {project.technologies.map((tech: any, index: number) => (
          <Tag key={`tech-${index}`} color="blue" icon={<ExperimentOutlined />}>
            {typeof tech === "string" ? tech : tech?.title || "Công nghệ"}
          </Tag>
        ))}
      </Space>
    </Card>
  );
}

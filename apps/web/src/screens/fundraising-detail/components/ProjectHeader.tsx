import { TrendingUp } from "lucide-react";
import { Typography } from "antd";
import type { Project } from "@/types/project";
import { getFullMediaUrl } from "@/utils/mediaUrl";

const { Title, Paragraph } = Typography;

interface ProjectHeaderProps {
  project: Project;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <div className="text-center mb-6">
      {/* Project Image */}
      {project?.image &&
      typeof project.image === "object" &&
      project.image.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={getFullMediaUrl(project.image.url)}
          alt={project?.name || "Project"}
          className="object-cover w-full h-64 mb-6 rounded-lg"
        />
      ) : (
        <div className="h-64 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center rounded-lg mb-6">
          <TrendingUp className="w-16 h-16 text-white" />
        </div>
      )}
      <Title level={1} style={{ marginBottom: 16 }}>
        {project?.name || "Dự án"}
      </Title>
      <Paragraph className="text-lg text-gray-600 max-w-3xl mx-auto">
        {project?.description || "Không có mô tả"}
      </Paragraph>
    </div>
  );
}

import { Card, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { Project } from "@/types/project";

const { Title, Text } = Typography;

interface ProjectOwnerCardProps {
  project: Project;
}

export function ProjectOwnerCard({ project }: ProjectOwnerCardProps) {
  return (
    <Card title="Thông tin người đăng" bodyStyle={{ padding: 24 }}>
      <div className="text-center">
        <UserOutlined
          style={{
            fontSize: 48,
            color: "#52c41a",
            marginBottom: 12,
          }}
        />
        <Title level={5} style={{ marginBottom: 8 }}>
          {typeof project?.user === "object" && project.user
            ? (project.user as any)?.full_name ||
              (project.user as any)?.email ||
              "Người đăng"
            : "Người đăng"}
        </Title>
        {typeof project?.user === "object" &&
          project.user &&
          (project.user as any)?.email && (
            <Text type="secondary">{(project.user as any).email}</Text>
          )}
      </div>
    </Card>
  );
}

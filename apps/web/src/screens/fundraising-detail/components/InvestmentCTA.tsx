import Link from "next/link";
import { Button, Card, Space, Typography } from "antd";
import type { Project } from "@/types/project";

const { Title, Paragraph } = Typography;

interface InvestmentCTAProps {
  project: Project;
  currentUserId?: string;
  hasExistingProposal: boolean;
  onSendProposal: () => void;
}

export function InvestmentCTA({
  project,
  currentUserId,
  hasExistingProposal,
  onSendProposal,
}: InvestmentCTAProps) {
  return (
    <Card
      className="bg-gradient-to-r from-green-600 to-teal-600 border-none text-white shadow-sm"
      bodyStyle={{ padding: 32 }}
    >
      <div className="text-center">
        <Title
          level={2}
          className="text-white"
          style={{ marginBottom: 16 }}
        >
          Quan tâm đầu tư vào dự án này?
        </Title>
        <Paragraph
          className="text-lg text-white opacity-90"
          style={{ marginBottom: 24 }}
        >
          Liên hệ với chúng tôi để tìm hiểu thêm về cơ hội đầu tư và hợp
          tác
        </Paragraph>
        <Space size="large">
          {/* Hide proposal button if user is project owner */}
          {typeof project?.user === "object" &&
            project.user &&
            (project.user as any)?.id !== currentUserId && (
              <Button
                type="primary"
                size="large"
                onClick={onSendProposal}
              >
                {hasExistingProposal
                  ? "Xem đề xuất"
                  : "Gửi đề xuất đầu tư"}
              </Button>
            )}
          <Button size="large" type="primary" ghost>
            <Link href="/funds/fundraising">Xem dự án khác</Link>
          </Button>
        </Space>
      </div>
    </Card>
  );
}

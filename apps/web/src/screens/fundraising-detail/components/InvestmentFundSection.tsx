import Link from "next/link";
import { Button, Card, Space, Typography } from "antd";
import type { Project } from "@/types/project";

const { Title, Paragraph } = Typography;

interface InvestmentFundSectionProps {
  project: Project;
}

export function InvestmentFundSection({ project }: InvestmentFundSectionProps) {
  if (
    !Array.isArray(project?.investment_fund) ||
    project.investment_fund.length === 0
  ) {
    return null;
  }

  return (
    <Card
      title="Quỹ đầu tư hỗ trợ"
      className="mb-6"
      style={{ marginBottom: 20, marginTop: 20 }}
      bodyStyle={{ padding: 24 }}
    >
      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        {project.investment_fund.map((fund: any, index: number) => (
          <Card
            key={`fund-${fund?.id || index}`}
            size="small"
            className="hover:shadow-md transition-shadow"
            bodyStyle={{ padding: 16 }}
          >
            <Space className="w-full justify-between items-center">
              <Space direction="vertical" size="small">
                <Title level={5} style={{ margin: 0 }}>
                  {typeof fund === "string" ? fund : fund?.name || "Quỹ đầu tư"}
                </Title>
                {typeof fund === "object" && fund?.description && (
                  <Paragraph className="text-gray-600" style={{ margin: 0 }}>
                    {fund.description}
                  </Paragraph>
                )}
              </Space>
              {typeof fund === "object" && fund?.id && (
                <Button type="link">
                  <Link href={`/funds/investment-funds/${fund.id}`}>
                    Xem chi tiết
                  </Link>
                </Button>
              )}
            </Space>
          </Card>
        ))}
      </Space>
    </Card>
  );
}

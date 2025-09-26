"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  Briefcase,
  Calendar,
  DollarSign,
  Users,
  Building2,
  Clock,
  Target,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { getProjectById } from "@/api/projects";
import { getInvestmentFundById } from "@/api/investment-fund";
import type { Project } from "@/types/project";
import type { InvestmentFund } from "@/types/investment_fund";
import {
  Card,
  Tag,
  Descriptions,
  Button,
  Space,
  Typography,
  Badge,
  Progress,
  Row,
  Col,
  Statistic,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
} from "antd";
import Image from "next/image";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  DollarCircleOutlined,
  PercentageOutlined,
  CalendarOutlined,
  UserOutlined,
  ExperimentOutlined, // Replaced FundProjectionOutlined
  ReadOutlined,
} from "@ant-design/icons";
import { projectProposeApi } from "@/api/project-propose";
import { ProjectProposeStatus } from "@/types/project-propose";
import { useUser } from "@/store/auth";

const { Title, Paragraph, Text } = Typography;

function formatVND(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case "pending":
      return "Chờ duyệt";
    case "active":
      return "Đang hoạt động";
    case "rejected":
      return "Từ chối";
    default:
      return status || "Chưa xác định";
  }
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case "pending":
      return { color: "processing", icon: <ClockCircleOutlined /> };
    case "active":
      return { color: "success", icon: <CheckCircleOutlined /> };
    case "rejected":
      return { color: "error", icon: <CloseCircleOutlined /> };
    default:
      return { color: "default", icon: null };
  }
};

const getDaysRemaining = (endDate: string) => {
  const end = new Date(endDate);
  const now = new Date();
  const diff = Math.ceil(
    (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff;
};

// Format number as VND currency with abbreviations
const formatCurrencyAbbr = (value?: number) => {
  if (typeof value !== "number") return "";
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })}B ₫`;
  } else if (value >= 1_000_000) {
    return `${(value / 1_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 1 })}M ₫`;
  }
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value.toLocaleString("vi-VN")} ₫`;
  }
};

export default function FundraisingProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [investmentFund, setInvestmentFund] = useState<InvestmentFund | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const currentUser = useUser();
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);
  const [form] = Form.useForm();
  const [hasExistingProposal, setHasExistingProposal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) {
        setError("ID dự án không hợp lệ");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        // Fetch project details
        const projectData = await getProjectById(projectId);

        // Check if projectData is valid
        if (!projectData) {
          throw new Error("Không tìm thấy dự án");
        }

        setProject(projectData);

        // Fetch investment fund if exists
        if (
          projectData &&
          projectData.investment_fund &&
          Array.isArray(projectData.investment_fund) &&
          projectData.investment_fund.length > 0
        ) {
          const firstFund = projectData.investment_fund[0];
          const fundId =
            typeof firstFund === "string" ? firstFund : (firstFund as any)?.id;

          if (fundId) {
            try {
              const fundData = await getInvestmentFundById(fundId);
              setInvestmentFund(fundData);
            } catch (fundError) {
              console.warn("Could not fetch investment fund:", fundError);
            }
          }
        }
      } catch (err: any) {
        console.error("Error fetching project details:", err);
        setError(err.message || "Có lỗi xảy ra khi tải thông tin dự án");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  useEffect(() => {
    const checkExistingProposal = async () => {
      try {
        if (!projectId || !currentUser?.id) return;
        const res = await projectProposeApi.list(
          { project: String(projectId), user: String(currentUser.id) },
          { limit: 1 }
        );
        const count = (res.docs?.length || 0) + (Array.isArray(res.data) ? res.data.length : 0);
        setHasExistingProposal(count > 0);
      } catch (err) {
        console.warn("Could not verify existing proposal:", err);
      }
    };
    checkExistingProposal();
  }, [projectId, currentUser?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin dự án...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Không tìm thấy dự án"}
          </h1>
          <Link
            href="/funds/fundraising"
            className="text-green-600 hover:text-green-800 font-medium"
          >
            Quay lại danh sách dự án gọi vốn
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(project.status);
  const daysRemaining = getDaysRemaining(project.end_date);

  function handleSendProposal(): void {
    if (!currentUser?.id) {
      message.warning("Vui lòng đăng nhập để gửi đề xuất đầu tư");
      router.push("/login");
      return;
    }
    if (hasExistingProposal) {
      message.info("Bạn đã gửi đề xuất cho dự án này. Vui lòng chờ phản hồi.");
      return;
    }
    setIsProposalModalOpen(true);
  }

  async function handleSubmitProposal() {
    try {
      const values = await form.validateFields();
      if (!project) {
        message.error("Không tìm thấy thông tin dự án");
        return;
      }
      if (!currentUser?.id) {
        message.error("Bạn cần đăng nhập để tiếp tục");
        return;
      }
      setIsSubmittingProposal(true);
      await projectProposeApi.create({
        project: (project as any).id || projectId,
        user: currentUser.id,
        investor_capacity: values.investor_capacity,
        investment_amount: values.investment_amount ?? project.goal_money,
        investment_ratio: values.investment_ratio ?? project.share_percentage,
        investment_type: values.investment_type,
        investment_benefits: values.investment_benefits,
        status: ProjectProposeStatus.Pending,
      } as any);
      message.success("Gửi đề xuất thành công");
      setIsProposalModalOpen(false);
      setHasExistingProposal(true);
      form.resetFields();
    } catch (err: any) {
      if (err?.errorFields) return; // validation errors already shown
      console.error("Create project propose error:", err);
      message.error(err?.message || "Gửi đề xuất thất bại");
    } finally {
      setIsSubmittingProposal(false);
    }
  }

  return (
    // thêm gap cho các cards để tăng tính đồng bộ
    <div className="min-h-screen bg-gray-50 p-6 gap-16">
      {/* Header with breadcrumb and back button */}
      <Card className="mb-6 shadow-sm">
        <Space
          direction="horizontal"
          align="center"
          className="w-full justify-between"
        >
          <Space>
            <Button
              icon={<ArrowLeft />}
              onClick={() => router.back()}
              type="text"
            />
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
            text={getStatusLabel(project.status)}
          />
        </Space>
      </Card>

      {/* Project Header and Key Statistics */}
      <Card className="mb-6 shadow-sm gap-6">
        <div className="text-center mb-6">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 text-green-600" />
          <Title level={1}>{project.name}</Title>
          <Paragraph className="text-lg text-gray-600 max-w-3xl mx-auto">
            {project.description}
          </Paragraph>
        </div>

        <Row gutter={[16, 16]} align="stretch">
          <Col xs={24} sm={12} md={6}>
            <Card size="small" className="text-center">
              <Statistic
                title="Mục tiêu gọi vốn"
                value={project.goal_money || 0}
                formatter={(value) => formatCurrencyAbbr(Number(value))}
                prefix={
                  <DollarCircleOutlined className="w-6 h-6 text-green-600" />
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" className="text-center">
              <Statistic
                title="Tỷ lệ cổ phần đề xuất"
                value={project.share_percentage || 0}
                suffix="%"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" className="text-center">
              <Statistic
                title="Hạn gọi vốn"
                value={
                  project.end_date
                    ? formatDate(project.end_date)
                    : "Chưa xác định"
                }
                prefix={
                  <CalendarOutlined className="w-6 h-6 text-purple-600" />
                }
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card size="small" className="text-center">
              <Statistic
                title="Trạng thái"
                value={
                  project?.open_investment_fund
                    ? "Đang kêu gọi vốn"
                    : "Đã kêu gọi vốn"
                }
                prefix={<Target className="w-6 h-4 text-orange-600" />}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Project Details */}
      <Row gutter={[16, 16]} align="stretch">
        <Col xs={24} lg={16}>
          {/* Business Information */}
          <Card title="Thông tin dự án" className="mb-6">
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Tên dự án">
                <Text strong>{project.name}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả">
                <Paragraph>{project.description}</Paragraph>
              </Descriptions.Item>
              {project.business_model && (
                <Descriptions.Item label="Mô hình kinh doanh">
                  <Paragraph>{project.business_model}</Paragraph>
                </Descriptions.Item>
              )}
              {project.market_data && (
                <Descriptions.Item label="Số liệu và thị trường">
                  <Paragraph>{project.market_data}</Paragraph>
                </Descriptions.Item>
              )}
              {project.goal_money_purpose && (
                <Descriptions.Item label="Mục đích kêu gọi vốn">
                  <Paragraph>{project.goal_money_purpose}</Paragraph>
                </Descriptions.Item>
              )}
              {project.team_profile && (
                <Descriptions.Item label="Profile đội ngũ">
                  <Paragraph>{project.team_profile}</Paragraph>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          {/* Technologies */}
          {Array.isArray(project.technologies) &&
            project.technologies.length > 0 && (
              <Card title="Công nghệ sử dụng" className="mb-6">
                <Space wrap>
                  {project.technologies.map((tech: any, index: number) => (
                    <Tag key={index} color="blue" icon={<ExperimentOutlined />}>
                      {typeof tech === "string"
                        ? tech
                        : tech?.title || "Công nghệ"}
                    </Tag>
                  ))}
                </Space>
              </Card>
            )}

          {/* Investment Fund Section */}
          {Array.isArray(project.investment_fund) &&
            project.investment_fund.length > 0 && (
              <Card title="Quỹ đầu tư hỗ trợ" className="mb-6">
                <Space direction="vertical" style={{ width: "100%" }}>
                  {project.investment_fund.map((fund: any, index: number) => (
                    <Card
                      key={index}
                      size="small"
                      className="hover:shadow-md transition-shadow"
                    >
                      <Space className="w-full justify-between items-center">
                        <Space direction="vertical">
                          <Title level={5}>
                            {typeof fund === "string"
                              ? fund
                              : fund?.name || "Quỹ đầu tư"}
                          </Title>
                          {typeof fund === "object" && fund?.description && (
                            <Paragraph className="text-gray-600">
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
            )}

          {/* Documents */}
          {Array.isArray(project.documents_finance) &&
            project.documents_finance.length > 0 && (
              <Card title="Tài liệu tài chính" className="mb-6">
                <Row gutter={[16, 16]}>
                  {project.documents_finance.map((doc: any, index: number) => (
                    <Col xs={24} sm={12} md={8} key={index}>
                      <Card
                        size="small"
                        className="text-center hover:shadow-md transition-shadow"
                      >
                        <ReadOutlined className="text-4xl text-green-600 mb-2" />
                        <Space
                          direction="vertical"
                          size={0}
                          className="items-center"
                        >
                          <Text strong>Tài liệu {index + 1}</Text>
                          <Text type="secondary">PDF</Text>
                        </Space>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Card>
            )}
        </Col>

        <Col xs={24} lg={8}>
          {/* Financial Information and Project Owner */}
          <Row gutter={[16, 16]} align="stretch">
            <Col xs={24}>
              <Card title="Thông tin tài chính" className="mb-6">
                <Space
                  direction="vertical"
                  style={{ width: "100%" }}
                  size="large"
                >
                  {project.revenue && (
                    <Statistic
                      title="Doanh thu"
                      value={project.revenue}
                      formatter={(value) => formatCurrencyAbbr(Number(value))}
                      prefix={<ArrowUpOutlined style={{ color: "#52c41a" }} />}
                    />
                  )}
                  {project.profit && (
                    <Statistic
                      title="Lợi nhuận"
                      value={project.profit}
                      formatter={(value) => formatCurrencyAbbr(Number(value))}
                      prefix={<ArrowUpOutlined style={{ color: "#52c41a" }} />}
                    />
                  )}
                  {project.assets && (
                    <Statistic
                      title="Tài sản"
                      value={project.assets}
                      formatter={(value) => formatCurrencyAbbr(Number(value))}
                      prefix={<DollarCircleOutlined className="w-4 h-4" />}
                    />
                  )}
                </Space>
              </Card>
            </Col>
            <Col xs={24}>
              <Card title="Thông tin người đăng" className="mb-6">
                <div className="text-center">
                  <UserOutlined className="w-12 h-12 mx-auto mb-3 text-green-600" />
                  <Title level={5}>
                    {typeof project.user === "object" && project.user
                      ? (project.user as any).full_name ||
                        (project.user as any).email ||
                        "Người đăng"
                      : "Người đăng"}
                  </Title>
                  {typeof project.user === "object" &&
                    project.user &&
                    (project.user as any).email && (
                      <Text type="secondary">
                        {(project.user as any).email}
                      </Text>
                    )}
                </div>
              </Card>
            </Col>
            <Col xs={24}>
              {/* Contact CTA */}
              <Card className="bg-gradient-to-r from-green-600 to-teal-600 border-none text-white shadow-sm mt-8">
                <div className="text-center py-4">
                  <Title level={2} className="text-white mb-4">
                    Quan tâm đầu tư vào dự án này?
                  </Title>
                  <Paragraph className="text-lg mb-6 text-white opacity-90">
                    Liên hệ với chúng tôi để tìm hiểu thêm về cơ hội đầu tư và
                    hợp tác
                  </Paragraph>
                  <Space size="large">
                    <Button type="primary" size="large" onClick={handleSendProposal} disabled={hasExistingProposal}>
                      {hasExistingProposal ? "Đã gửi đề xuất" : "Gửi đề xuất đầu tư"}
                    </Button>
                    <Button size="large" type="primary" ghost>
                      <Link href="/funds/fundraising">Xem dự án khác</Link>
                    </Button>
                  </Space>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      <Modal
        title="Gửi đề xuất đầu tư"
        open={isProposalModalOpen}
        onOk={handleSubmitProposal}
        onCancel={() => setIsProposalModalOpen(false)}
        confirmLoading={isSubmittingProposal}
        okText="Gửi đề xuất"
        cancelText="Hủy"
        width={720}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Năng lực nhà đầu tư" name="investor_capacity">
            <Input.TextArea rows={3} placeholder="Mô tả ngắn về năng lực, kinh nghiệm" />
          </Form.Item>
          <Row gutter={16} wrap={false}>
            <Col xs={24} flex={1} style={{ flex: 1 }}>
              <Form.Item
                label="Số vốn đề xuất (VND)"
                name="investment_amount"
                required
                tooltip="Số vốn đề xuất không được nhỏ hơn mục tiêu gọi vốn của dự án"
                rules={[{ required: true, message: "Vui lòng nhập số vốn đề xuất" }]}
              >
                <InputNumber min={0} className="w-full flex-1" placeholder="Ví dụ: 5.000.000.000" />
              </Form.Item>
            </Col>
            <Col xs={24} flex={1} style={{ flex: 1 }}>
              <Form.Item label="Tỷ lệ sở hữu mong muốn (%)" name="investment_ratio" 
                tooltip="Tỷ lệ sở hữu mong muốn không được lớn hơn 100%"
              >
                <InputNumber min={0} max={100} className="w-full flex-1" placeholder="Ví dụ: 10" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Hình thức đầu tư" name="investment_type">
            <Input.TextArea rows={3} placeholder="Ví dụ: Góp vốn, Mua cổ phần..." />
          </Form.Item>
          <Form.Item label="Lợi ích mang lại" name="investment_benefits">
            <Input.TextArea rows={3} placeholder="Ví dụ: mạng lưới, chuyên gia, thị trường..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

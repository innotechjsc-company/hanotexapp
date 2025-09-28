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
  Target,
  TrendingUp,
  FileText,
  UserCheck,
  PieChart,
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
} from "antd";
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
import { useAuthStore } from "@/store/auth";
import { addUserToRoom, findRoomBetweenUsers } from "@/api/roomUser";
import { createSimpleRoomChat } from "@/api/roomChat";
import { sendMessage } from "@/api/roomMessage";
import downloadService from "@/services/downloadService";
import { getFullMediaUrl } from "@/utils/mediaUrl";

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

const { Title, Paragraph, Text } = Typography;

// Helper function to get status label
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

// Helper function to get status color and icon
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

// Calculate days remaining
const getDaysRemaining = (endDate: string) => {
  const end = new Date(endDate);
  const now = new Date();
  const diff = Math.ceil(
    (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff;
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const { user } = useAuthStore();
  const [demandUser, setDemandUser] = useState<any>(null);

  // Handle creating chat and navigating to messages
  const handleStartChat = async () => {
    const userName = demandUser?.full_name || "Chưa cập nhật";
    const userType = String(
      demandUser?.user_type || demandUser?.type || ""
    ).toUpperCase();
    const userTypeLabel =
      userType === "INDIVIDUAL"
        ? "Cá nhân"
        : userType === "COMPANY"
          ? "Doanh nghiệp"
          : userType === "INSTITUTION" || userType === "RESEARCH_INSTITUTION"
            ? "Viện/Trường"
            : undefined;

    const demandUserId = demandUser?.id || demandUser?._id;
    const currentUserId = user?.id;
    const isOwnDemand =
      demandUserId &&
      currentUserId &&
      String(demandUserId) === String(currentUserId);
    const isAuthenticated = Boolean(currentUserId);
    if (!currentUserId || !demandUserId || !project) return;

    try {
      setIsCreatingChat(true);

      // 1. Check if room already exists between these two users
      const existingRoomId = await findRoomBetweenUsers(
        currentUserId,
        demandUserId
      );

      if (existingRoomId) {
        // Room already exists, navigate to existing chat
        router.push(`/messages?roomId=${existingRoomId}`);
        return;
      }

      // 2. No existing room, create new room chat
      const roomTitle = `${userName}`;
      const roomChat = await createSimpleRoomChat(roomTitle);

      // 3. Add both users to room
      await addUserToRoom(roomChat.id, currentUserId);
      await addUserToRoom(roomChat.id, demandUserId);

      // 4. Send initial message
      await sendMessage(
        roomChat.id,
        currentUserId,
        `Xin chào ${userName}, tôi quan tâm đến dự án của bạn: "${project?.name}".`
      );

      router.push(`/messages?roomId=${roomChat.id}`);
    } catch (error) {
      console.error("Error creating/finding chat:", error);
      alert("Có lỗi xảy ra khi tạo cuộc trò chuyện. Vui lòng thử lại.");
    } finally {
      setIsCreatingChat(false);
    }
  };

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
        setDemandUser(projectData.user);
      } catch (err: any) {
        console.error("Error fetching project details:", err);
        setError(err.message || "Có lỗi xảy ra khi tải thông tin dự án");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
            href="/funds/active-projects"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Quay lại danh sách dự án
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(project.status);
  const daysRemaining = getDaysRemaining(project.end_date);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
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
            <Link href="/funds/active-projects">
              <Text className="text-blue-600 hover:text-blue-800">
                Dự án hoạt động
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

      {/* image */}
      {project.image && typeof project.image === 'object' && project.image.url ? (
        <img src={getFullMediaUrl(project.image.url)} alt={project.name} className="object-cover w-full h-64 mb-4" />
      ) : (
        <div className="h-64 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-center">
          <TrendingUp className="w-16 h-16 mx-auto mb-4 text-green-600" />
        </div>
      )}

      <Card title={project.name} className="mb-6 shadow-sm">
        <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }}>
          <Descriptions.Item label="Mô tả" span={3}>
            <Paragraph>{project.description}</Paragraph>
          </Descriptions.Item>
          {project.business_model && (
            <Descriptions.Item label="Mô hình kinh doanh" span={3}>
              <Paragraph>{project.business_model}</Paragraph>
            </Descriptions.Item>
          )}
          {project.market_data && (
            <Descriptions.Item label="Số liệu và thị trường" span={3}>
              <Paragraph>{project.market_data}</Paragraph>
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Người đăng">
            <Space>
              <UserOutlined />
              <Text>
                {typeof project.user === "object" && project.user
                  ? (project.user as any).full_name ||
                    (project.user as any).email
                  : "Người đăng"}
              </Text>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái dự án">
            {project.open_investment_fund == false && (
              <Tag color="default" icon={<CloseCircleOutlined />}>
                Đã kêu gọi vốn
              </Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày kết thúc">
            <Space>
              <CalendarOutlined />
              <Text>
                {project.end_date
                  ? formatDate(project.end_date)
                  : "Chưa xác định"}
              </Text>
              {daysRemaining !== undefined && (
                <Text type={daysRemaining >= 0 ? "success" : "danger"}>
                  {daysRemaining >= 0
                    ? `(Còn ${daysRemaining} ngày)`
                    : `(Đã kết thúc ${Math.abs(daysRemaining)} ngày)`}
                </Text>
              )}
            </Space>
          </Descriptions.Item>
          {project.goal_money && (
            <Descriptions.Item label="Mục tiêu vốn">
              <Space>
                <DollarCircleOutlined />
                <Text>{formatVND(project.goal_money)}</Text>
              </Space>
            </Descriptions.Item>
          )}
          {typeof project.share_percentage === "number" && (
            <Descriptions.Item label="Tỷ lệ cổ phần">
              <Space>
                <PercentageOutlined />
                <Text>{project.share_percentage}%</Text>
              </Space>
            </Descriptions.Item>
          )}
          {project.open_investment_fund !== undefined && (
            <Descriptions.Item label="Kêu gọi đầu tư">
              <Tag color={project.open_investment_fund ? "success" : "default"}>
                {project.open_investment_fund ? "Đang mở" : "Đã đóng"}
              </Tag>
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* Technologies */}
      {Array.isArray(project.technologies) &&
        project.technologies.length > 0 && (
          <Card title="Công nghệ sử dụng" className="mb-6 shadow-sm">
            <Space wrap size={[0, 8]}>
              {project.technologies.map((tech: any, index: number) => (
                <Tag key={index} color="blue" icon={<ExperimentOutlined />}>
                  {typeof tech === "string" ? tech : tech?.title || "Công nghệ"}
                </Tag>
              ))}
            </Space>
          </Card>
        )}

      {/* Financial Information */}
      {(project.revenue || project.profit || project.assets) && (
        <Card title="Thông tin tài chính" className="mb-6 shadow-sm">
          <Descriptions bordered column={1}>
            {project.revenue && (
              <Descriptions.Item label="Doanh thu">
                <Statistic
                  value={project.revenue}
                  formatter={(value) => formatVND(Number(value))}
                  prefix={<ArrowUpOutlined style={{ color: "#52c41a" }} />}
                  valueStyle={{ fontSize: 16 }}
                />
              </Descriptions.Item>
            )}
            {project.profit && (
              <Descriptions.Item label="Lợi nhuận">
                <Statistic
                  value={project.profit}
                  formatter={(value) => formatVND(Number(value))}
                  prefix={<ArrowUpOutlined style={{ color: "#52c41a" }} />}
                  valueStyle={{ fontSize: 16 }}
                />
              </Descriptions.Item>
            )}
            {project.assets && (
              <Descriptions.Item label="Tài sản">
                <Statistic
                  value={project.assets}
                  formatter={(value) => formatVND(Number(value))}
                  prefix={<DollarCircleOutlined />}
                  valueStyle={{ fontSize: 16 }}
                />
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>
      )}

      {/* Investment Fund Section */}
      {Array.isArray(project.investment_fund) &&
        project.investment_fund.length > 0 && (
          <Card title="Quỹ đầu tư" className="mb-6 shadow-sm">
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

      {/* Documents Section */}
      {Array.isArray(project.documents_finance) &&
        project.documents_finance.length > 0 && (
          <Card title="Tài liệu tài chính" className="mb-6 shadow-sm">
            <Row gutter={[16, 16]}>
              {project.documents_finance.map((doc: any, index: number) => (
                <Col xs={24} sm={12} md={8} key={index}>
                  <Card
                    size="small"
                    className="text-center hover:shadow-md transition-shadow"
                    onClick={() => {
                      if (doc.url) {
                        downloadService.downloadByUrl(doc.url, doc.filename);
                      }
                    }}
                  >
                    <Space
                      direction="vertical"
                      size={0}
                      className="items-center"
                    >
                      <Text strong>Tải Tài liệu {index + 1}</Text>
                      <Text type="secondary">{doc.filename}</Text>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        )}

      {/* Team Profile */}
      {project.team_profile && (
        <Card title="Profile đội ngũ" className="mb-6 shadow-sm">
          <Paragraph>{project.team_profile}</Paragraph>
        </Card>
      )}

      {/* Investment Call Progress */}
      {project.goal_money && project.open_investment_fund && (
        <Card title="Tiến độ gọi vốn" className="mb-6 shadow-sm">
          <Progress
            percent={Math.min(
              100,
              ((project.goal_money ?? 0) / 1000000000) * 100
            )} // Example: assuming 1B VND for 100%
            status="active"
            format={(percent) =>
              `${formatVND(project.goal_money ?? 0)} (${percent?.toFixed(0)}%)`
            }
          />
          {project.goal_money_purpose && (
            <div className="mt-4">
              <Title level={5}>Mục đích kêu gọi vốn</Title>
              <Paragraph>{project.goal_money_purpose}</Paragraph>
            </div>
          )}
        </Card>
      )}

      {/* Contact CTA */}
      {user && demandUser && user?.id !== demandUser?.id && (
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-none text-white shadow-sm">
          <div className="text-center py-4">
            <Title level={2} className="text-white mb-4">
              Quan tâm đến dự án này?
            </Title>
            <Paragraph className="text-lg mb-6 text-white opacity-90">
              Liên hệ ngay để tìm hiểu thêm về cơ hội hợp tác và đầu tư
            </Paragraph>
            <Space size="large">
              <Button type="primary" size="large" onClick={handleStartChat}>
                Chat ngay
              </Button>
              <Button size="large" type="primary" ghost>
                <Link href="/funds/active-projects">Xem dự án khác</Link>
              </Button>
            </Space>
          </div>
        </Card>
      )}
    </div>
  );
}

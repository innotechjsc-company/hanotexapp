import React, { useState, useEffect } from "react";
import { Card, Typography, Timeline, Button, Upload, message, Space, Tag, Alert } from "antd";
import { 
  FileTextOutlined, 
  UploadOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  DownloadOutlined,
  UserOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import type { ProjectPropose } from "@/types/project-propose";
import { useUser } from "@/store/auth";

const { Title, Text, Paragraph } = Typography;

interface ContractLog {
  id: string;
  action: string;
  description: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  documents?: any[];
  createdAt: string;
}

interface ContractLogsStepProps {
  projectProposal: ProjectPropose;
}

export const ContractLogsStep: React.FC<ContractLogsStepProps> = ({
  projectProposal,
}) => {
  const currentUser = useUser();
  const [uploading, setUploading] = useState(false);
  const [contractLogs, setContractLogs] = useState<ContractLog[]>([]);
  const [loading, setLoading] = useState(true);

  const isProposalCreator = projectProposal?.user?.id === currentUser?.id;
  const isProjectOwner = typeof projectProposal.project === 'object' && 
    projectProposal.project.user === currentUser?.id;

  useEffect(() => {
    fetchContractLogs();
  }, []);

  const fetchContractLogs = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call to fetch contract logs
      // const logs = await contractLogsApi.getByProjectPropose(projectProposal.id);
      
      // Mock data for demonstration
      const mockLogs: ContractLog[] = [
        {
          id: "1",
          action: "contract_uploaded",
          description: "Hợp đồng đầu tư đã được tải lên",
          user: {
            id: "user1",
            fullName: "Nguyễn Văn A",
            email: "nguyenvana@example.com"
          },
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          action: "contract_confirmed",
          description: "Hợp đồng đã được xác nhận bởi chủ dự án",
          user: {
            id: "user2",
            fullName: "Trần Thị B",
            email: "tranthib@example.com"
          },
          createdAt: new Date().toISOString(),
        }
      ];
      
      setContractLogs(mockLogs);
    } catch (error) {
      console.error("Failed to fetch contract logs:", error);
      message.error("Không thể tải nhật ký hợp đồng");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalDocumentUpload = async (file: File) => {
    try {
      setUploading(true);
      // TODO: Implement final document upload logic
      message.success("Tài liệu hoàn thiện đã được tải lên thành công");
      
      // Refresh logs after upload
      await fetchContractLogs();
    } catch (error) {
      message.error("Không thể tải lên tài liệu");
    } finally {
      setUploading(false);
    }
    return false; // Prevent auto upload
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "contract_uploaded":
        return <UploadOutlined className="text-blue-500" />;
      case "contract_confirmed":
        return <CheckCircleOutlined className="text-green-500" />;
      case "document_uploaded":
        return <FileTextOutlined className="text-purple-500" />;
      default:
        return <ClockCircleOutlined className="text-gray-500" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "contract_uploaded":
        return "blue";
      case "contract_confirmed":
        return "green";
      case "document_uploaded":
        return "purple";
      default:
        return "default";
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <FileTextOutlined className="text-4xl text-green-500 mb-2" />
        <Title level={3}>Hoàn thiện hợp đồng đầu tư</Title>
        <Text type="secondary">
          Theo dõi tiến trình và tải lên các tài liệu hoàn thiện hợp đồng
        </Text>
      </div>

      <Alert
        message="Hợp đồng đã được ký kết"
        description="Hợp đồng đầu tư đã được cả hai bên xác nhận. Bạn có thể tải lên các tài liệu bổ sung và theo dõi tiến trình hoàn thiện."
        type="success"
        showIcon
        className="mb-6"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contract Logs Timeline */}
        <Card
          title={
            <Space>
              <ClockCircleOutlined />
              <span>Nhật ký hợp đồng</span>
            </Space>
          }
          loading={loading}
        >
          <Timeline
            items={contractLogs.map((log) => ({
              dot: getActionIcon(log.action),
              children: (
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Text strong>{log.description}</Text>
                    <Tag color={getActionColor(log.action)} >
                      {log.action}
                    </Tag>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <UserOutlined className="text-xs text-gray-400" />
                    <Text type="secondary" className="text-sm">
                      {log.user.fullName}
                    </Text>
                    <Text type="secondary" className="text-xs">
                      {dayjs(log.createdAt).format("DD/MM/YYYY HH:mm")}
                    </Text>
                  </div>
                  {log.documents && log.documents.length > 0 && (
                    <div className="mt-2">
                      {log.documents.map((doc, index) => (
                        <Button
                          key={index}
                          type="link"
                          size="small"
                          icon={<DownloadOutlined />}
                          onClick={() => window.open(doc.url, '_blank')}
                        >
                          {doc.filename}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ),
            }))}
          />
        </Card>

        {/* Upload Final Documents */}
        <Card
          title={
            <Space>
              <UploadOutlined />
              <span>Tài liệu hoàn thiện</span>
            </Space>
          }
        >
          <Space direction="vertical" className="w-full">
            <Paragraph type="secondary">
              Tải lên các tài liệu bổ sung để hoàn thiện hợp đồng đầu tư.
            </Paragraph>

            <Upload
              beforeUpload={handleFinalDocumentUpload}
              showUploadList={false}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              disabled={uploading}
              multiple
            >
              <Button
                type="primary"
                icon={<UploadOutlined />}
                loading={uploading}
                block
              >
                {uploading ? "Đang tải lên..." : "Tải lên tài liệu"}
              </Button>
            </Upload>

            <Text type="secondary" className="text-xs">
              Định dạng hỗ trợ: PDF, DOC, DOCX, JPG, PNG (tối đa 10MB mỗi file)
            </Text>

            <div className="bg-blue-50 p-3 rounded border border-blue-200 mt-4">
              <Text type="secondary" className="text-sm">
                💡 <strong>Gợi ý tài liệu:</strong>
                <ul className="mt-2 ml-4 text-xs">
                  <li>Giấy phép kinh doanh</li>
                  <li>Báo cáo tài chính</li>
                  <li>Kế hoạch sử dụng vốn</li>
                  <li>Tài liệu pháp lý khác</li>
                </ul>
              </Text>
            </div>
          </Space>
        </Card>
      </div>

      {/* Investment Summary */}
      <Card title="Tóm tắt đầu tư" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded">
            <Text type="secondary" className="block text-sm">Dự án</Text>
            <Text strong className="text-lg">
              {typeof projectProposal.project === 'object' 
                ? projectProposal.project.name 
                : 'Dự án đầu tư'}
            </Text>
          </div>

          <div className="text-center p-4 bg-green-50 rounded">
            <Text type="secondary" className="block text-sm">Số vốn</Text>
            <Text strong className="text-lg">
              {projectProposal.investment_amount 
                ? new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(projectProposal.investment_amount)
                : 'Chưa xác định'}
            </Text>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded">
            <Text type="secondary" className="block text-sm">Tỷ lệ sở hữu</Text>
            <Text strong className="text-lg">
              {projectProposal.investment_ratio ? `${projectProposal.investment_ratio}%` : 'Chưa xác định'}
            </Text>
          </div>

          <div className="text-center p-4 bg-orange-50 rounded">
            <Text type="secondary" className="block text-sm">Trạng thái</Text>
            <Tag color="success" className="text-sm">
              Hoàn thành
            </Tag>
          </div>
        </div>
      </Card>
    </div>
  );
};

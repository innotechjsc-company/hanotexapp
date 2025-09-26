import React, { useState } from "react";
import { Card, Button, Typography, Space, Alert, Upload, message, Divider } from "antd";
import { FileTextOutlined, UploadOutlined, CheckCircleOutlined, ClockCircleOutlined } from "@ant-design/icons";
import type { ProjectPropose } from "@/types/project-propose";
import { useUser } from "@/store/auth";

const { Title, Text, Paragraph } = Typography;

interface ContractSigningStepProps {
  projectProposal: ProjectPropose;
  onAccept: () => Promise<void>;
  onReject: () => Promise<void>;
}

export const ContractSigningStep: React.FC<ContractSigningStepProps> = ({
  projectProposal,
  onAccept,
  onReject,
}) => {
  const currentUser = useUser();
  const [uploading, setUploading] = useState(false);
  const [confirmingContract, setConfirmingContract] = useState(false);

  const isProposalCreator = projectProposal?.user?.id === currentUser?.id;
  const isProjectOwner = typeof projectProposal.project === 'object' && 
    projectProposal.project.user === currentUser?.id;

  const handleContractUpload = async (file: any) => {
    try {
      setUploading(true);
      // This is a placeholder. In a real app, you would upload the file
      // and associate its ID with the project proposal.
      console.log("Uploading file:", file.name);
      message.success(`File "${file.name}" đã được tải lên thành công.`);
    } catch (error) {
      message.error("Không thể tải lên hợp đồng.");
    } finally {
      setUploading(false);
    }
    return false; // Prevent Ant Design's default upload behavior
  };

  const handleConfirmContract = async () => {
    setConfirmingContract(true);
    await onAccept();
    setConfirmingContract(false);
  };

  const handleRejectContract = async () => {
    setConfirmingContract(true);
    await onReject();
    setConfirmingContract(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <FileTextOutlined className="text-4xl text-blue-500 mb-2" />
        <Title level={3}>Xác nhận hợp đồng đầu tư</Title>
        <Text type="secondary">
          Giai đoạn xác nhận và ký kết hợp đồng đầu tư dự án
        </Text>
      </div>

      <Alert
        message="Thông tin quan trọng"
        description="Hợp đồng đầu tư cần được cả hai bên xác nhận trước khi chuyển sang giai đoạn hoàn thiện."
        type="info"
        showIcon
        className="mb-6"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contract Upload Section */}
        <Card
          title={
            <Space>
              <UploadOutlined />
              <span>Tải lên hợp đồng</span>
            </Space>
          }
          className="h-fit"
        >
          <Space direction="vertical" className="w-full">
            <Paragraph type="secondary">
              {isProjectOwner 
                ? "Bạn là chủ dự án, vui lòng tải lên hợp đồng đầu tư đã soạn thảo."
                : "Chờ chủ dự án tải lên hợp đồng đầu tư."}
            </Paragraph>

            {isProjectOwner && (
              <Upload
                beforeUpload={handleContractUpload}
                showUploadList={false}
                accept=".pdf,.doc,.docx"
                disabled={uploading}
              >
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  loading={uploading}
                  block
                >
                  {uploading ? "Đang tải lên..." : "Tải lên hợp đồng"}
                </Button>
              </Upload>
            )}

            {!isProjectOwner && (
              <Button type="default" disabled block>
                <ClockCircleOutlined />
                Chờ chủ dự án tải lên
              </Button>
            )}

            <Text type="secondary" className="text-xs">
              Định dạng hỗ trợ: PDF, DOC, DOCX (tối đa 10MB)
            </Text>
          </Space>
        </Card>

        {/* Contract Confirmation Section */}
        <Card
          title={
            <Space>
              <CheckCircleOutlined />
              <span>Xác nhận hợp đồng</span>
            </Space>
          }
          className="h-fit"
        >
          <Space direction="vertical" className="w-full">
            <Paragraph type="secondary">
              Sau khi hợp đồng được tải lên, cả hai bên cần xác nhận để chuyển sang giai đoạn tiếp theo.
            </Paragraph>

            <div className="bg-gray-50 p-4 rounded border">
              <Space direction="vertical" className="w-full">
                <div className="flex items-center justify-between">
                  <Text>Chủ dự án:</Text>
                  <Space>
                    {isProjectOwner ? (
                      <CheckCircleOutlined className="text-green-500" />
                    ) : (
                      <ClockCircleOutlined className="text-orange-500" />
                    )}
                    <Text type={isProjectOwner ? "success" : "secondary"}>
                      {isProjectOwner ? "Đã xác nhận" : "Chờ xác nhận"}
                    </Text>
                  </Space>
                </div>

                <div className="flex items-center justify-between">
                  <Text>Nhà đầu tư:</Text>
                  <Space>
                    {isProposalCreator ? (
                      <CheckCircleOutlined className="text-green-500" />
                    ) : (
                      <ClockCircleOutlined className="text-orange-500" />
                    )}
                    <Text type={isProposalCreator ? "success" : "secondary"}>
                      {isProposalCreator ? "Đã xác nhận" : "Chờ xác nhận"}
                    </Text>
                  </Space>
                </div>
              </Space>
            </div>

            <div className="flex space-x-2">
              <Button
                type="primary"
                onClick={handleConfirmContract}
                loading={confirmingContract}
                block
                disabled={(!isProposalCreator && !isProjectOwner) || confirmingContract}
              >
                {confirmingContract ? "Đang xử lý..." : "Xác nhận hợp đồng"}
              </Button>
              <Button
                danger
                onClick={handleRejectContract}
                loading={confirmingContract}
                block
                disabled={(!isProposalCreator && !isProjectOwner) || confirmingContract}
              >
                Từ chối
              </Button>
            </div>

            <Text type="secondary" className="text-xs">
              Bằng cách xác nhận, bạn đồng ý với các điều khoản trong hợp đồng
            </Text>
          </Space>
        </Card>
      </div>

      <Divider />

      {/* Project Investment Details */}
      <Card title="Thông tin đầu tư" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded">
            <Text type="secondary" className="block text-sm">Số vốn đầu tư</Text>
            <Text strong className="text-lg">
              {projectProposal.investment_amount 
                ? new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                  }).format(projectProposal.investment_amount)
                : 'Chưa xác định'}
            </Text>
          </div>

          <div className="text-center p-4 bg-green-50 rounded">
            <Text type="secondary" className="block text-sm">Tỷ lệ sở hữu</Text>
            <Text strong className="text-lg">
              {projectProposal.investment_ratio ? `${projectProposal.investment_ratio}%` : 'Chưa xác định'}
            </Text>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded">
            <Text type="secondary" className="block text-sm">Hình thức đầu tư</Text>
            <Text strong className="text-lg">
              {projectProposal.investment_type || 'Chưa xác định'}
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

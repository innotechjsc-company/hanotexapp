import React from "react";
import { Card, Button, Typography, Space, Divider } from "antd";
import { FileText, Download, CheckCircle } from "lucide-react";
import type { TechnologyPropose } from "@/types/technology-propose";

const { Title, Text, Paragraph } = Typography;

interface ContractSigningStepProps {
  proposal: TechnologyPropose;
  onSignContract?: () => void;
  onDownloadContract?: () => void;
}

export const ContractSigningStep: React.FC<ContractSigningStepProps> = ({
  proposal,
  onSignContract,
  onDownloadContract,
}) => {
  const isContractSigned = proposal.status === "contract_signed";

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="shadow-lg">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {isContractSigned ? (
              <CheckCircle size={64} className="text-green-500" />
            ) : (
              <FileText size={64} className="text-blue-500" />
            )}
          </div>
          <Title level={3} className="mb-2">
            {isContractSigned ? "Hợp đồng đã được ký" : "Ký hợp đồng"}
          </Title>
          <Text className="text-gray-600">
            {isContractSigned
              ? "Hợp đồng đã được ký thành công. Dự án có thể bắt đầu triển khai."
              : "Vui lòng xem xét và ký hợp đồng để hoàn tất quá trình đàm phán."}
          </Text>
        </div>

        <Divider />

        <div className="space-y-6">
          {/* Contract Information */}
          <div>
            <Title level={4}>Thông tin hợp đồng</Title>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <Text strong>Công nghệ:</Text>
                <Text>{proposal.technology?.title || "N/A"}</Text>
              </div>
              <div className="flex justify-between">
                <Text strong>Người đề xuất:</Text>
                <Text>
                  {typeof proposal.user === "object"
                    ? proposal.user.full_name || proposal.user.email
                    : proposal.user}
                </Text>
              </div>
              <div className="flex justify-between">
                <Text strong>Ngân sách:</Text>
                <Text className="text-green-600 font-semibold">
                  {proposal.budget?.toLocaleString("vi-VN")} VND
                </Text>
              </div>
              <div className="flex justify-between">
                <Text strong>Trạng thái:</Text>
                <Text className="text-blue-600">
                  {proposal.status === "contract_signed"
                    ? "Đã ký hợp đồng"
                    : "Đang đàm phán"}
                </Text>
              </div>
            </div>
          </div>

          {/* Contract Document */}
          {proposal.document && (
            <div>
              <Title level={4}>Tài liệu hợp đồng</Title>
              <Card size="small" className="border-dashed">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText size={24} className="text-gray-500" />
                    <div>
                      <Text strong>
                        {proposal.document.filename || "Hợp đồng"}
                      </Text>
                      <br />
                      <Text type="secondary" className="text-sm">
                        {proposal.document.filesize
                          ? `${(proposal.document.filesize / 1024 / 1024).toFixed(2)} MB`
                          : ""}
                      </Text>
                    </div>
                  </div>
                  <Button
                    icon={<Download size={16} />}
                    onClick={onDownloadContract}
                    type="text"
                  >
                    Tải xuống
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Description */}
          <div>
            <Title level={4}>Mô tả đề xuất</Title>
            <Paragraph className="text-gray-700 bg-gray-50 p-4 rounded-lg">
              {proposal.description || "Không có mô tả chi tiết."}
            </Paragraph>
          </div>

          {/* Action Buttons */}
          {!isContractSigned && (
            <div className="text-center pt-6">
              <Space size="large">
                <Button
                  size="large"
                  icon={<Download size={18} />}
                  onClick={onDownloadContract}
                >
                  Tải hợp đồng
                </Button>
                <Button
                  type="primary"
                  size="large"
                  icon={<CheckCircle size={18} />}
                  onClick={onSignContract}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Ký hợp đồng
                </Button>
              </Space>
            </div>
          )}

          {isContractSigned && (
            <div className="text-center pt-6">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-6 py-3 rounded-full">
                <CheckCircle size={20} />
                <Text strong className="text-green-700">
                  Hợp đồng đã được ký thành công
                </Text>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

import React from "react";
import { Card, Descriptions, Tag, Button, Space, Typography, Modal, Form, Input, Alert, message } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, FileTextOutlined, UserOutlined, DownloadOutlined } from "@ant-design/icons";
import type { ServiceTicket } from "@/types/service-ticket";
import type { ServiceTicketLog } from "@/types/service_ticket_logs";
import type { Service } from "@/types/services";
import type { Technology } from "@/types/technologies";
import type { Project } from "@/types/project";
import dayjs from "dayjs";
import downloadService from "@/services/downloadService";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface CompletionStepProps {
  ticket: ServiceTicket;
  logs: ServiceTicketLog[];
  services: Service[];
  userTechnologies: Technology[];
  userProjects: Project[];
  formatFileSize: (bytes: number) => string;
  onStatusUpdate: (status: string, reason?: string) => void;
  updatingStatus: boolean;
  isViewing?: boolean;
}

export const CompletionStep: React.FC<CompletionStepProps> = ({
  ticket,
  logs,
  services,
  userTechnologies,
  userProjects,
  formatFileSize,
  onStatusUpdate,
  updatingStatus,
  isViewing = false,
}) => {
  const [showRejectModal, setShowRejectModal] = React.useState(false);
  const [form] = Form.useForm();

  const getServiceName = () => {
    if (!ticket.service) return "Không xác định";
    if (typeof ticket.service === "string") {
      const service = services.find(s => String(s.id) === String(ticket.service));
      return service?.name || `Dịch vụ #${ticket.service}`;
    }
    return (ticket.service as any)?.name || "Không xác định";
  };

  const getUserName = (user: any) => {
    if (!user) return "Không xác định";
    if (typeof user === "string") return "Người dùng";
    return user?.full_name || user?.email || "Người dùng";
  };

  const handleDownloadDocument = (file: any) => {
    // Access the actual file data from index 0
    const fileData = file?.[0];
    
    if (fileData?.url) {
      downloadService.downloadByUrl(fileData.url, fileData.filename || undefined);
    } else {
      message.warning("Không có tài liệu để tải xuống");
    }
  };

  const getTechnologiesList = () => {
    if (!ticket.technologies || !Array.isArray(ticket.technologies)) return [];
    return ticket.technologies.map((tech: any) => {
      if (typeof tech === "string") {
        const technology = userTechnologies.find(t => String(t.id) === String(tech));
        return technology?.title || tech;
      }
      return tech?.title || "Công nghệ";
    });
  };

  const getProjectName = () => {
    if (!ticket.project) return null;
    if (typeof ticket.project === "string") {
      const project = userProjects.find(p => String(p.id) === String(ticket.project));
      return project?.name || `Dự án #${ticket.project}`;
    }
    return (ticket.project as any)?.name || "Dự án";
  };

  const handleReject = async () => {
    try {
      const values = await form.validateFields();
      await onStatusUpdate("cancelled", values.reason);
      setShowRejectModal(false);
      form.resetFields();
    } catch (error) {
      // Form validation error
    }
  };

  const handleAccept = async () => {
    await onStatusUpdate("completed", "Đã xác nhận hoàn thành");
  };

  const isCompleted = ticket.status === "completed";
  const canConfirm = !isCompleted;

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      {/* Success Result Banner */}
      {isCompleted && (
        <Alert
          message="Phiếu dịch vụ đã hoàn thành thành công!"
          description="Kết quả đã được xác nhận và phiếu dịch vụ đã được đóng."
          type="success"
          showIcon
          icon={<CheckCircleOutlined />}
          className="mb-6"
        />
      )}

      <Card title="Thông tin chốt kết quả thành công" className="shadow-sm">
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Khách hàng liên quan" span={1}>
            <Space>
              <UserOutlined />
              {getUserName(ticket.user)}
            </Space>
          </Descriptions.Item>
          
          <Descriptions.Item label="Loại dịch vụ" span={1}>
            <Space>
              <FileTextOutlined />
              {getServiceName()}
            </Space>
          </Descriptions.Item>
          
          <Descriptions.Item label="Trạng thái" span={1}>
            <Tag color={isCompleted ? "green" : "blue"}>
              {isCompleted ? "Đã hoàn thành" : "Chờ xác nhận"}
            </Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="Ngày hoàn thành" span={1}>
            {isCompleted && ticket.updatedAt 
              ? dayjs(ticket.updatedAt).format("DD/MM/YYYY HH:mm") 
              : "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Sản phẩm / Công nghệ / Dự án liên quan" className="shadow-sm">
        <div className="space-y-4">
          {getTechnologiesList().length > 0 && (
            <div>
              <Title level={5}>Công nghệ liên quan:</Title>
              <Space wrap>
                {getTechnologiesList().map((techName, index) => (
                  <Tag key={index} color="blue">
                    {techName}
                  </Tag>
                ))}
              </Space>
            </div>
          )}
          
          {getProjectName() && (
            <div>
              <Title level={5}>Dự án liên quan:</Title>
              <Tag color="green">
                {getProjectName()}
              </Tag>
            </div>
          )}
        </div>
      </Card>

      <Card title="Lịch sử xử lý" className="shadow-sm">
        <div className="space-y-4">
          {logs.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <FileTextOutlined className="text-4xl mb-2" />
              <div>Chưa có lịch sử xử lý</div>
            </div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                <div className="flex items-center justify-between mb-2">
                  <Text strong>{log.user?.full_name || log.user?.email || "Người dùng"}</Text>
                  <Text type="secondary" className="text-xs">
                    {log.createdAt ? dayjs(log.createdAt).format("DD/MM/YYYY HH:mm") : ""}
                  </Text>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg mb-2">
                  <Text>{log.content}</Text>
                </div>
                {log.document && (
                  <div className="flex items-center justify-between space-x-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <FileTextOutlined />
                      <Text type="secondary" className="text-xs">
                        Đã đính kèm tài liệu
                      </Text>
                    </div>
                    <Button
                      type="link"
                      size="small"
                      icon={<DownloadOutlined />}
                      onClick={() => handleDownloadDocument(log.document)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Tải xuống
                    </Button>
                  </div>
                )}
                {log.status && (
                  <div className="mt-2">
                    <Tag color={log.status === "approved" ? "green" : "red"}>
                      {log.status === "approved" ? "Đã phê duyệt" : "Đã từ chối"}
                    </Tag>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Confirmation Actions */}
      {canConfirm && !isViewing && (
        <Card className="shadow-sm">
          <div className="text-center">
            <Title level={4}>Xác nhận kết quả</Title>
            <Text type="secondary" className="block mb-6">
              Tất cả thành viên cần xác nhận kết quả hoàn thành phiếu dịch vụ
            </Text>
            
            <Space size="large">
              <Button 
                type="primary" 
                size="large"
                icon={<CheckCircleOutlined />}
                onClick={handleAccept}
                loading={updatingStatus}
              >
                Xác nhận hoàn thành
              </Button>
              
              <Button 
                danger
                size="large"
                icon={<CloseCircleOutlined />}
                onClick={() => setShowRejectModal(true)}
                loading={updatingStatus}
              >
                Từ chối kết quả
              </Button>
            </Space>
          </div>
        </Card>
      )}
      
      {isViewing && (
        <Card className="shadow-sm">
          <div className="text-center">
            <Title level={4}>Chế độ xem</Title>
            <Text type="secondary" className="block mb-6">
              Bạn đang xem lại thông tin của bước này. Không thể thực hiện các hành động.
            </Text>
          </div>
        </Card>
      )}

      {/* Reject Modal */}
      <Modal
        title="Từ chối kết quả"
        open={showRejectModal}
        onOk={handleReject}
        onCancel={() => setShowRejectModal(false)}
        okText="Từ chối"
        cancelText="Hủy"
        confirmLoading={updatingStatus}
        okButtonProps={{ danger: true }}
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="reason" 
            label="Lý do từ chối"
            rules={[{ required: true, message: "Vui lòng nhập lý do từ chối" }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Nhập lý do từ chối kết quả..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

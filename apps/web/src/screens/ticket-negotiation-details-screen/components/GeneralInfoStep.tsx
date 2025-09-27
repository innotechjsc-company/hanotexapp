import React from "react";
import { Card, Descriptions, Tag, Button, Space, Typography, Modal, Form, Input } from "antd";
import { LinkOutlined, UserOutlined, FileTextOutlined } from "@ant-design/icons";
import type { ServiceTicket } from "@/types/service-ticket";
import type { Service } from "@/types/services";
import type { Technology } from "@/types/technologies";
import type { Project } from "@/types/project";
import dayjs from "dayjs";
import { statusColorMap, statusLabelMap } from "./TicketNegotiationHeader";
import { useUser } from "@/store/auth";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface GeneralInfoStepProps {
  ticket: ServiceTicket;
  services: Service[];
  userTechnologies: Technology[];
  userProjects: Project[];
  formatFileSize: (bytes: number) => string;
  onStatusUpdate: (status: string, reason?: string) => void;
  updatingStatus: boolean;
  isViewing?: boolean;
}

export const GeneralInfoStep: React.FC<GeneralInfoStepProps> = ({
  ticket,
  services,
  userTechnologies,
  userProjects,
  formatFileSize,
  onStatusUpdate,
  updatingStatus,
  isViewing = false,
}) => {
  const [showDispatchModal, setShowDispatchModal] = React.useState(false);
  const [form] = Form.useForm();
  const currentUser = useUser();

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

  const getResponsibleUserName = () => {
    return getUserName(ticket.responsible_user);
  };

  const getImplementersNames = () => {
    if (!ticket.implementers || !Array.isArray(ticket.implementers)) return [];
    return ticket.implementers.map(impl => getUserName(impl));
  };

  // Kiểm tra xem user hiện tại có trong danh sách implementers không
  const isCurrentUserImplementer = () => {
    if (!currentUser?.id || !ticket.implementers || !Array.isArray(ticket.implementers)) {
      return false;
    }
    
    return ticket.implementers.some(impl => {
      if (typeof impl === "string") {
        return String(impl) === String(currentUser.id);
      }
      return String((impl as any)?.id) === String(currentUser.id);
    });
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

  const handleDispatch = async () => {
    try {
      const values = await form.validateFields();
      await onStatusUpdate("processing", values.reason);
      setShowDispatchModal(false);
      form.resetFields();
    } catch (error) {
      // Form validation error
    }
  };

  const canDispatch = ticket.status === "pending" && isCurrentUserImplementer();

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      <Card title="Thông tin chung" className="shadow-sm">
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Người gửi yêu cầu" span={1}>
            <Space>
              <UserOutlined />
              {getUserName(ticket.user)}
            </Space>
          </Descriptions.Item>
          
          <Descriptions.Item label="Loại dịch vụ đăng ký" span={1}>
            <Space>
              <FileTextOutlined />
              {getServiceName()}
            </Space>
          </Descriptions.Item>
          
          <Descriptions.Item label="Trạng thái hiện tại" span={1}>
          <Tag color={statusColorMap[ticket.status] || "default"}>
                {statusLabelMap[ticket.status] || ticket.status}
              </Tag>
          </Descriptions.Item>
          
          <Descriptions.Item label="Người chịu trách nhiệm (Khách hàng)" span={1}>
            {getResponsibleUserName()}
          </Descriptions.Item>
          
          <Descriptions.Item label="Người thực hiện" span={2}>
            <Space wrap>
              {getImplementersNames().map((name, index) => (
                <Tag key={index} color="blue">{name}</Tag>
              ))}
            </Space>
          </Descriptions.Item>
          
          <Descriptions.Item label="Ngày tạo" span={1}>
            {ticket.createdAt ? dayjs(ticket.createdAt).format("DD/MM/YYYY HH:mm") : "-"}
          </Descriptions.Item>
          
          <Descriptions.Item label="Ngày cập nhật" span={1}>
            {ticket.updatedAt ? dayjs(ticket.updatedAt).format("DD/MM/YYYY HH:mm") : "-"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Nội dung mô tả chi tiết" className="shadow-sm">
        <div className="bg-gray-50 p-4 rounded-lg">
          <Text>{ticket.description || "Không có mô tả"}</Text>
        </div>
      </Card>

      {ticket.document && (
        <Card title="File đính kèm" className="shadow-sm">
          <div className="flex items-center space-x-2">
            <FileTextOutlined />
            <Text>Tài liệu đính kèm</Text>
            <Button 
              type="link" 
              icon={<LinkOutlined />}
              onClick={() => {
                // TODO: Implement document download
                console.log("Download document:", ticket.document);
              }}
            >
              Tải xuống
            </Button>
          </div>
        </Card>
      )}

      <Card title="Danh sách đối tượng liên quan" className="shadow-sm">
        <div className="space-y-4">
          {getTechnologiesList().length > 0 && (
            <div>
              <Title level={5}>Công nghệ liên quan:</Title>
              <Space wrap>
                {getTechnologiesList().map((techName, index) => (
                  <Tag 
                    key={index} 
                    color="blue"
                    className="cursor-pointer hover:bg-blue-100"
                    onClick={() => {
                      // Open in new tab
                      const tech = ticket.technologies?.[index];
                      if (tech) {
                        const techId = typeof tech === "string" ? tech : (tech as any)?.id;
                        window.open(`/technologies/${techId}`, '_blank');
                      }
                    }}
                  >
                    {techName}
                    <LinkOutlined className="ml-1" />
                  </Tag>
                ))}
              </Space>
            </div>
          )}
          
          {getProjectName() && (
            <div>
              <Title level={5}>Dự án liên quan:</Title>
              <Tag 
                color="green"
                className="cursor-pointer hover:bg-green-100"
                onClick={() => {
                  // Open in new tab
                  const projectId = typeof ticket.project === "string" ? ticket.project : (ticket.project as any)?.id;
                  if (projectId) {
                    window.open(`/projects/${projectId}`, '_blank');
                  }
                }}
              >
                {getProjectName()}
                <LinkOutlined className="ml-1" />
              </Tag>
            </div>
          )}
        </div>
      </Card>

      {!isViewing && (
        <Card className="shadow-sm">
          <div className="text-center">
            {canDispatch ? (
              <>
                <Title level={4}>Điều phối phiếu dịch vụ</Title>
                <Text type="secondary" className="block mb-4">
                  Sau khi điều phối, phiếu sẽ chuyển sang trạng thái "Đang thực hiện"
                </Text>
                <Button 
                  type="primary" 
                  size="large"
                  onClick={() => setShowDispatchModal(true)}
                  loading={updatingStatus}
                >
                  Điều phối phiếu
                </Button>
              </>
            ) : ticket.status === "pending" ? (
                <div className="text-sm text-gray-500">
                  <Text>Người thực hiện hiện tại:</Text>
                  <div className="mt-2">
                    {getImplementersNames().length > 0 ? (
                      <Space wrap>
                        {getImplementersNames().map((name, index) => (
                          <Tag key={index} color="blue">{name}</Tag>
                        ))}
                      </Space>
                    ) : (
                      <Text type="secondary">Chưa có người thực hiện</Text>
                    )}
                  </div>
                </div>
            ) : (
              <>
                <Title level={4}>Phiếu đã được xử lý</Title>
                <Text type="secondary" className="block mb-4">
                  Phiếu này đã được điều phối và đang trong quá trình xử lý
                </Text>
              </>
            )}
          </div>
        </Card>
      )}
      
      {isViewing && (
        <Card className="shadow-sm">
          <div className="text-center">
            <Title level={4}>Chế độ xem</Title>
            <Text type="secondary" className="block mb-4">
              Bạn đang xem lại thông tin của bước này. Không thể thực hiện các hành động.
            </Text>
          </div>
        </Card>
      )}

      <Modal
        title="Điều phối phiếu dịch vụ"
        open={showDispatchModal}
        onOk={handleDispatch}
        onCancel={() => setShowDispatchModal(false)}
        okText="Điều phối"
        cancelText="Hủy"
        confirmLoading={updatingStatus}
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="reason" 
            label="Ghi chú điều phối"
            rules={[{ required: true, message: "Vui lòng nhập ghi chú điều phối" }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Nhập ghi chú về việc điều phối phiếu dịch vụ..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

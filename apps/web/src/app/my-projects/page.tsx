"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  Tag,
  Input,
  Select,
  Modal,
  Space,
  Table,
  Tooltip,
  DatePicker,
  Form,
  Row,
  Col,
  Statistic,
  Typography,
  Popconfirm,
  message,
  Descriptions,
  InputNumber,
  Layout,
  Checkbox,
  Divider,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  FolderOpenOutlined,
  CalendarOutlined,
  DollarOutlined,
  TeamOutlined,
  SearchOutlined,
  DownloadOutlined,
  FileOutlined,
} from "@ant-design/icons";
import { FileTextOutlined } from "@ant-design/icons";
import {
  getProjectsByUser,
  createProject,
  updateProject,
  deleteProject,
} from "@/api/projects";
import { getTechnologiesByUser } from "@/api/technologies";
import type { Project } from "@/types/project";
import type { Technology } from "@/types/technologies";
import { Toaster, toast } from "react-hot-toast";
import { useAuthStore } from "@/store/auth";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { getInvestmentFunds } from "@/api/investment-fund";
import type { InvestmentFund } from "@/types/investment_fund";
import { projectProposeApi } from "@/api/project-propose";
import { ProjectProposeStatus } from "@/types/project-propose";
import type { ProjectPropose } from "@/types/project-propose";
import { getServices } from "@/api/services";
import type { Service } from "@/types/services";
import { CheckCircle, ExternalLink, X } from "lucide-react";
import { createServiceTicket } from "@/api/service-ticket";
import { getUserByRoleAdmin } from "@/api/user";
import type { ServiceTicket } from "@/types/service-ticket";
import { FileUpload, type FileUploadItem } from "@/components/input";
import downloadService from "@/services/downloadService";

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;
const { Content } = Layout;

type EditableProject = Partial<Project> & { id?: string };

// Type definition cho Service Ticket data structure
interface ServiceTicketFormData {
  service: string;
  description: string;
}

// Helper functions
const checkUserAuth = (user: any, router: any) => {
  if (!user) {
    toast.error("Vui lòng đăng nhập để tiếp tục");
    router.push("/auth/login");
    return false;
  }
  return true;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN");
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "orange";
    case "active":
      return "green";
    case "rejected":
      return "red";
    default:
      return "default";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "pending":
      return "Chờ duyệt";
    case "active":
      return "Đang hoạt động";
    case "rejected":
      return "Từ chối";
    default:
      return "Không xác định";
  }
};

const getTechnologyTitlesFromValues = (
  value: string[] | Technology[] | undefined,
  list: Technology[]
): string => {
  if (!value || (Array.isArray(value) && value.length === 0))
    return "Chưa chọn";
  return (value as any[])
    .map((v) => {
      if (typeof v === "string") {
        const found = list.find(
          (t) => String((t as any).id || (t as any)._id) === v
        );
        return found?.title || "Không xác định";
      }
      return (v as any).title || "Không xác định";
    })
    .join(", ");
};

const getInvestmentFundTitlesFromValues = (
  value: string[] | any[] | undefined,
  list: any[]
): string => {
  if (!value || (Array.isArray(value) && value.length === 0))
    return "Chưa chọn";
  return (value as any[])
    .map((v) => {
      if (typeof v === "string") {
        const found = list.find(
          (f: any) => String((f as any).id || (f as any)._id) === v
        );
        return (found as any)?.name || "Không xác định";
      }
      return (v as any).name || "Không xác định";
    })
    .join(", ");
};

// Service Ticket Form Component
// Trả về data structure: ServiceTicketFormData[]
// [
//   { service: "service_id_1", description: "mô tả yêu cầu 1" },
//   { service: "service_id_2", description: "mô tả yêu cầu 2" },
//   ...
// ]
function ServiceTicketForm({
  services,
  form,
  fieldName,
}: {
  services: Service[];
  form: any;
  fieldName: string;
}) {
  const getSelectedServices = () => {
    const serviceTickets = form.getFieldValue("service_tickets") || [];
    return serviceTickets.map((ticket: any) => ticket?.service).filter(Boolean);
  };

  const getAvailableServices = (currentIndex: number) => {
    const selectedServices = getSelectedServices();
    return services.filter((service) => {
      const serviceId = String((service as any).id || (service as any)._id);
      // Không hiển thị dịch vụ đã được chọn ở các vị trí khác
      return !selectedServices.some(
        (selectedId: string, index: number) =>
          index !== currentIndex && selectedId === serviceId
      );
    });
  };

  // Helper function để đảm bảo data structure đúng
  const getServiceTicketData = (): ServiceTicketFormData[] => {
    const serviceTickets = form.getFieldValue("service_tickets") || [];
    return serviceTickets
      .map((ticket: any) => ({
        service: ticket?.service || "",
        description: ticket?.description || "",
      }))
      .filter(
        (ticket: ServiceTicketFormData) => ticket.service && ticket.description
      );
  };

  // Debug: Log data structure khi có thay đổi
  useEffect(() => {
    const serviceTickets = form.getFieldValue("service_tickets") || [];
    if (serviceTickets.length > 0) {
      console.log("ServiceTicketForm raw data:", serviceTickets);
      console.log("ServiceTicketForm formatted data:", getServiceTicketData());
      console.log("Data structure example:", [
        { service: "service_id_1", description: "mô tả yêu cầu 1" },
        { service: "service_id_2", description: "mô tả yêu cầu 2" },
      ]);
    }
  }, [form.getFieldValue("service_tickets")]);

  return (
    <Form.List name="service_tickets">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <div
              key={key}
              style={{
                marginBottom: 16,
                padding: 16,
                border: "1px solid #d9d9d9",
                borderRadius: 6,
              }}
            >
              <Row gutter={16} align="middle">
                <Col span={20}>
                  <Form.Item
                    {...restField}
                    name={[name, "service"]}
                    label="Dịch vụ"
                    rules={[
                      { required: true, message: "Vui lòng chọn dịch vụ!" },
                    ]}
                  >
                    <Select
                      placeholder="Chọn dịch vụ"
                      showSearch
                      filterOption={(input, option) =>
                        (option?.children as unknown as string)
                          ?.toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {getAvailableServices(name).map((service) => (
                        <Option
                          key={String(
                            (service as any).id || (service as any)._id
                          )}
                          value={String(
                            (service as any).id || (service as any)._id
                          )}
                        >
                          {service.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: "100%",
                      paddingTop: 8,
                    }}
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => remove(name)}
                    >
                      Xóa
                    </Button>
                  </div>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item
                    {...restField}
                    name={[name, "description"]}
                    label="Mô tả yêu cầu"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập mô tả yêu cầu!",
                      },
                    ]}
                  >
                    <Input.TextArea
                      rows={3}
                      placeholder="Mô tả chi tiết yêu cầu dịch vụ"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          ))}
          <Form.Item>
            <Button
              type="dashed"
              onClick={() => add()}
              block
              icon={<PlusOutlined />}
            >
              Thêm dịch vụ
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
}

// Add Project Modal Component
function AddProjectModal({
  open,
  onCancel,
  onCreate,
  loading,
  technologies,
  funds,
  services,
}: {
  open: boolean;
  onCancel: () => void;
  onCreate: (values: any) => Promise<void>;
  loading?: boolean;
  technologies: Technology[];
  funds: InvestmentFund[];
  services: Service[];
}) {
  const [form] = Form.useForm();
  const [documentsFinance, setDocumentsFinance] = useState<FileUploadItem[]>(
    []
  );

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // Thêm documents_finance từ FileUpload component
      const formData = {
        ...values,
        documents_finance: documentsFinance.map((doc) => String(doc.id)),
      };
      await onCreate(formData);
      form.resetFields();
      setDocumentsFinance([]);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    onCancel();
    form.resetFields();
    setDocumentsFinance([]);
  };

  return (
    <Modal
      title="Thêm dự án mới"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      width="70vw"
      style={{
        top: 0,
        paddingBottom: 0,
      }}
      styles={{
        body: {
          height: "calc(100vh - 110px)",
          overflow: "hidden",
          padding: 0,
        },
      }}
      confirmLoading={loading}
      okText="Tạo dự án"
      cancelText="Hủy"
    >
      <div
        style={{
          height: "100%",
          overflow: "auto",
        }}
      >
        <Form form={form} layout="vertical" scrollToFirstError>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="Tên dự án"
                rules={[
                  { required: true, message: "Vui lòng nhập tên dự án!" },
                ]}
              >
                <Input placeholder="Nhập tên dự án" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Mô tả dự án"
                rules={[
                  { required: true, message: "Vui lòng nhập mô tả dự án!" },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Nhập mô tả chi tiết về dự án"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="technologies"
                label="Công nghệ"
                rules={[
                  { required: true, message: "Vui lòng chọn công nghệ!" },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Chọn công nghệ"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {technologies.map((tech) => (
                    <Option
                      key={String((tech as any).id || (tech as any)._id)}
                      value={String((tech as any).id || (tech as any)._id)}
                    >
                      {tech.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="investment_fund" label="Quỹ đầu tư">
                <Select
                  mode="multiple"
                  placeholder="Chọn quỹ đầu tư"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {funds.map((fund) => (
                    <Option
                      key={String((fund as any).id || (fund as any)._id)}
                      value={String((fund as any).id || (fund as any)._id)}
                    >
                      {(fund as any).name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="business_model" label="Mô hình kinh doanh">
                <Input.TextArea
                  rows={3}
                  placeholder="Mô tả mô hình kinh doanh"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="market_data" label="Số liệu và thị trường">
                <Input.TextArea
                  rows={4}
                  placeholder="Dữ liệu quy mô thị trường mục tiêu; Số lượng khách hàng tiềm năng và các số liệu kinh doanh thực tế (VD doanh số đã bán và doanh số dự kiến"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="team_profile" label="Hồ sơ đội ngũ">
                <Input.TextArea
                  rows={5}
                  placeholder="Thông tin đội ngũ chính"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="revenue" label="Doanh thu (VND)">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập doanh thu"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="profit" label="Lợi nhuận (VND)">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập lợi nhuận"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="assets" label="Tài sản (VND)">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập tổng tài sản"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Tài liệu tài chính">
                <FileUpload
                  value={documentsFinance}
                  onChange={setDocumentsFinance}
                  multiple={true}
                  maxCount={10}
                  allowedTypes={["document", "image"]}
                  maxSize={50 * 1024 * 1024} // 50MB
                  variant="button"
                  buttonText="Chọn tài liệu tài chính"
                  title="Tải lên tài liệu tài chính"
                  description="Chọn các file tài liệu tài chính (PDF, Word, Excel, hình ảnh) - tối đa 50MB mỗi file"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="goal_money" label="Số tiền đầu tư kêu gọi (VND)">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập số tiền"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="share_percentage"
                label="Tỷ lệ cổ phần đề xuất (%)"
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập tỷ lệ cổ phần"
                  min={0}
                  max={100}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="goal_money_purpose" label="Mục đích sử dụng vốn">
                <Input.TextArea
                  rows={3}
                  placeholder="Mô tả cách sử dụng số tiền kêu gọi"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="end_date"
                label="Ngày kết thúc"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày kết thúc!" },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Chọn ngày kết thúc"
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
          </Row>
          {/* <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="open_investment_fund"
              valuePropName="checked"
            >
              <Checkbox>Mở kêu gọi đầu tư</Checkbox>
            </Form.Item>
          </Col>
        </Row> */}
          <Row gutter={16}>
            <Col span={24}>
              <Text strong>Mục dịch vụ (Tùy chọn)</Text>
            </Col>
            <Col span={24}>
              <Text type="secondary">Dịch vụ hỗ trợ các vấn đề của dự án</Text>
            </Col>
          </Row>

          <ServiceTicketForm
            services={services}
            form={form}
            fieldName="service_tickets"
          />
        </Form>
      </div>
    </Modal>
  );
}

// Edit Project Modal Component
function EditProjectModal({
  open,
  onCancel,
  onUpdate,
  loading,
  technologies,
  funds,
  services,
  project,
}: {
  open: boolean;
  onCancel: () => void;
  onUpdate: (values: any) => Promise<void>;
  loading?: boolean;
  technologies: Technology[];
  funds: InvestmentFund[];
  services: Service[];
  project: EditableProject | null;
}) {
  const [form] = Form.useForm();
  const [documentsFinance, setDocumentsFinance] = useState<FileUploadItem[]>(
    []
  );

  useEffect(() => {
    if (project && open) {
      const formValues = {
        ...project,
        technologies: Array.isArray(project.technologies)
          ? (project.technologies as any[]).map((t) =>
              String((t as any).id || (t as any)._id || t)
            )
          : [],
        investment_fund: Array.isArray((project as any).investment_fund)
          ? ((project as any).investment_fund as any[]).map((f: any) =>
              String((f as any).id || (f as any)._id || f)
            )
          : [],
        service_tickets: Array.isArray((project as any).service_tickets)
          ? (project as any).service_tickets
          : [],
        end_date: project.end_date ? dayjs(project.end_date) : null,
      };
      form.setFieldsValue(formValues);

      // Load documents finance if available
      if (
        (project as any).documents_finance &&
        Array.isArray((project as any).documents_finance)
      ) {
        // Convert document IDs to FileUploadItem format
        const docs = (project as any).documents_finance.map((doc: any) => ({
          ...doc,
          id: doc.id,
          filename: `${doc.name ?? doc.filename ?? doc.id}`,
          alt: `Document ${doc.id}`,
          filesize: doc.filesize,
          type: "document" as const,
          uploadStatus: "done" as const,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        }));
        setDocumentsFinance(docs);
      } else {
        setDocumentsFinance([]);
      }
    }
  }, [project, open, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // Thêm documents_finance từ FileUpload component
      const formData = {
        ...values,
        documents_finance: documentsFinance.map((doc) => String(doc.id)),
      };
      await onUpdate(formData);
      form.resetFields();
      setDocumentsFinance([]);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handleCancel = () => {
    onCancel();
    form.resetFields();
    setDocumentsFinance([]);
  };

  return (
    <Modal
      title="Chỉnh sửa dự án"
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      width="70vw"
      style={{
        top: 0,
        paddingBottom: 0,
      }}
      styles={{
        body: {
          height: "calc(100vh - 110px)",
          overflow: "hidden",
          padding: 0,
        },
      }}
      confirmLoading={loading}
      okText="Cập nhật"
      cancelText="Hủy"
    >
      <div
        style={{
          height: "100%",
          overflow: "auto",
          padding: "24px 32px",
        }}
      >
        <Form form={form} layout="vertical" scrollToFirstError>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="Tên dự án"
                rules={[
                  { required: true, message: "Vui lòng nhập tên dự án!" },
                ]}
              >
                <Input placeholder="Nhập tên dự án" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Mô tả dự án"
                rules={[
                  { required: true, message: "Vui lòng nhập mô tả dự án!" },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Nhập mô tả chi tiết về dự án"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="technologies"
                label="Công nghệ"
                rules={[
                  { required: true, message: "Vui lòng chọn công nghệ!" },
                ]}
              >
                <Select
                  mode="multiple"
                  placeholder="Chọn công nghệ"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {technologies.map((tech) => (
                    <Option
                      key={String((tech as any).id || (tech as any)._id)}
                      value={String((tech as any).id || (tech as any)._id)}
                    >
                      {tech.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="investment_fund" label="Quỹ đầu tư">
                <Select
                  mode="multiple"
                  placeholder="Chọn quỹ đầu tư"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.children as unknown as string)
                      ?.toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {funds.map((fund) => (
                    <Option
                      key={String((fund as any).id || (fund as any)._id)}
                      value={String((fund as any).id || (fund as any)._id)}
                    >
                      {(fund as any).name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="business_model" label="Mô hình kinh doanh">
                <Input.TextArea
                  rows={3}
                  placeholder="Mô tả mô hình kinh doanh"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="market_data" label="Số liệu và thị trường">
                <Input.TextArea
                  rows={4}
                  placeholder="Dữ liệu quy mô thị trường mục tiêu; Số lượng khách hàng tiềm năng và các số liệu kinh doanh thực tế (VD doanh số đã bán và doanh số dự kiến"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="team_profile" label="Hồ sơ đội ngũ">
                <Input.TextArea
                  rows={5}
                  placeholder="Thông tin đội ngũ chính"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="revenue" label="Doanh thu (VND)">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập doanh thu"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="profit" label="Lợi nhuận (VND)">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập lợi nhuận"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="assets" label="Tài sản (VND)">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập tổng tài sản"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Tài liệu tài chính">
                <FileUpload
                  value={documentsFinance}
                  onChange={setDocumentsFinance}
                  multiple={true}
                  maxCount={10}
                  allowedTypes={["document", "image"]}
                  maxSize={50 * 1024 * 1024} // 50MB
                  variant="button"
                  buttonText="Chọn tài liệu tài chính"
                  title="Tải lên tài liệu tài chính"
                  description="Chọn các file tài liệu tài chính (PDF, Word, Excel, hình ảnh) - tối đa 50MB mỗi file"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="goal_money" label="Số tiền đầu tư kêu gọi (VND)">
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập số tiền"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value!.replace(/\$\s?|(|,*)/g, "")}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="share_percentage"
                label="Tỷ lệ cổ phần đề xuất (%)"
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập tỷ lệ cổ phần"
                  min={0}
                  max={100}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item name="goal_money_purpose" label="Mục đích sử dụng vốn">
                <Input.TextArea
                  rows={3}
                  placeholder="Mô tả cách sử dụng số tiền kêu gọi"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="end_date"
                label="Ngày kết thúc"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày kết thúc!" },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  placeholder="Chọn ngày kết thúc"
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
          </Row>
          {/* <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="open_investment_fund"
              valuePropName="checked"
            >
              <Checkbox>Mở kêu gọi đầu tư</Checkbox>
            </Form.Item>
          </Col>
        </Row> */}
        </Form>
      </div>
    </Modal>
  );
}

// View Project Modal Component
function ViewProjectModal({
  open,
  onCancel,
  project,
  technologies,
  funds,
  services,
}: {
  open: boolean;
  onCancel: () => void;
  project: EditableProject | null;
  technologies: Technology[];
  funds: InvestmentFund[];
  services: Service[];
}) {
  const getTechnologyNames = (values: string[] | Technology[] | undefined) =>
    getTechnologyTitlesFromValues(values, technologies);
  const getFundNames = (values: string[] | any[] | undefined) =>
    getInvestmentFundTitlesFromValues(values, funds);
  const getServiceName = (serviceId: string) => {
    const found = services.find(
      (s) => String((s as any).id || (s as any)._id) === serviceId
    );
    return found?.name || "Không xác định";
  };

  return (
    <Modal
      title="Thông tin dự án"
      open={open}
      onCancel={onCancel}
      width="70vw"
      style={{
        top: 0,
        paddingBottom: 0,
      }}
      styles={{
        body: {
          height: "calc(100vh - 110px)",
          overflow: "hidden",
          padding: 0,
        },
      }}
      footer={[
        <Button key="close" type="primary" onClick={onCancel}>
          Đóng
        </Button>,
      ]}
    >
      <div
        style={{
          height: "100%",
          overflow: "auto",
          paddingTop: 32,
        }}
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Tên dự án" span={2}>
            <Text strong>{project?.name}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Mô tả" span={2}>
            <Text>{project?.description}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Công nghệ">
            <Text>{getTechnologyNames((project as any)?.technologies)}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Quỹ đầu tư">
            <Text>{getFundNames((project as any)?.investment_fund)}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={getStatusColor((project as any)?.status || "")}>
              {getStatusLabel((project as any)?.status || "")}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Doanh thu">
            <Text>
              {(project as any)?.revenue
                ? formatCurrency((project as any).revenue)
                : "Chưa xác định"}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Lợi nhuận">
            <Text>
              {(project as any)?.profit
                ? formatCurrency((project as any).profit)
                : "Chưa xác định"}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Tài sản">
            <Text>
              {(project as any)?.assets
                ? formatCurrency((project as any).assets)
                : "Chưa xác định"}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Số tiền kêu gọi">
            <Text>
              {(project as any)?.goal_money
                ? formatCurrency((project as any).goal_money)
                : "Chưa xác định"}
            </Text>
          </Descriptions.Item>
          <Descriptions.Item label="Tỷ lệ cổ phần">
            <Text>
              {(project as any)?.share_percentage != null
                ? `${(project as any).share_percentage}%`
                : "Chưa xác định"}
            </Text>
          </Descriptions.Item>
          {(project as any)?.end_date && (
            <Descriptions.Item label="Ngày kết thúc">
              <Text>{formatDate((project as any).end_date)}</Text>
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Mở kêu gọi đầu tư">
            <Text>
              {(project as any)?.open_investment_fund ? "Có" : "Không"}
            </Text>
          </Descriptions.Item>
          {(project as any)?.goal_money_purpose && (
            <Descriptions.Item label="Mục đích sử dụng vốn" span={2}>
              <Text>{(project as any).goal_money_purpose}</Text>
            </Descriptions.Item>
          )}
          {(project as any)?.business_model && (
            <Descriptions.Item label="Mô hình kinh doanh" span={2}>
              <Text>{(project as any).business_model}</Text>
            </Descriptions.Item>
          )}
          {(project as any)?.market_data && (
            <Descriptions.Item label="Dữ liệu thị trường" span={2}>
              <Text>{(project as any).market_data}</Text>
            </Descriptions.Item>
          )}
          {(project as any)?.team_profile && (
            <Descriptions.Item label="Hồ sơ đội ngũ" span={2}>
              <Text>{(project as any).team_profile}</Text>
            </Descriptions.Item>
          )}
          {(project as any)?.documents_finance &&
            Array.isArray((project as any).documents_finance) &&
            (project as any).documents_finance.length > 0 && (
              <Descriptions.Item label="Tài liệu đính kèm" span={2}>
                <div>
                  {(project as any).documents_finance.map(
                    (fileData: any, index: number) => (
                      <div
                        key={index}
                        style={{
                          marginBottom: 12,
                          padding: 12,
                          border: "1px solid #f0f0f0",
                          borderRadius: 6,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            flex: 1,
                          }}
                        >
                          <FileOutlined
                            style={{
                              fontSize: 20,
                              color: "#1890ff",
                              marginRight: 8,
                            }}
                          />
                          <div>
                            <Text strong>
                              {fileData.filename ||
                                fileData.name ||
                                `Tài liệu ${index + 1}`}
                            </Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              {fileData.filesize
                                ? formatFileSize(fileData.filesize)
                                : ""}
                              {fileData.mimeType && ` • ${fileData.mimeType}`}
                              {/* date */}
                              {fileData.createdAt
                                ? ` • ${dayjs(fileData.createdAt).format("DD/MM/YYYY HH:mm")}`
                                : ""}
                            </Text>
                          </div>
                        </div>
                        <Space>
                          {fileData.url && (
                            <Tooltip title="Tải xuống">
                              <Button
                                type="text"
                                size="small"
                                icon={<DownloadOutlined />}
                                onClick={async () => {
                                  try {
                                    await downloadService.downloadByUrl(
                                      fileData.url,
                                      fileData.filename ||
                                        fileData.name ||
                                        undefined
                                    );
                                    message.success(
                                      "Đang tải xuống tài liệu..."
                                    );
                                  } catch (error) {
                                    message.error(
                                      "Không thể tải xuống tài liệu"
                                    );
                                    console.error("Download error:", error);
                                  }
                                }}
                              />
                            </Tooltip>
                          )}
                          {/* {fileData.url && (
                            <Tooltip title="Xem trước">
                              <Button
                                type="text"
                                size="small"
                                icon={<EyeOutlined />}
                                onClick={() => window.open(fileData.url, "_blank")}
                              />
                            </Tooltip>
                          )} */}
                        </Space>
                      </div>
                    )
                  )}
                </div>
              </Descriptions.Item>
            )}
          {(project as any)?.service_tickets &&
            Array.isArray((project as any).service_tickets) &&
            (project as any).service_tickets.length > 0 && (
              <Descriptions.Item label="Phiếu dịch vụ" span={2}>
                <div>
                  {(project as any).service_tickets.map(
                    (ticket: any, index: number) => (
                      <div
                        key={index}
                        style={{
                          marginBottom: 12,
                          padding: 12,
                          border: "1px solid #f0f0f0",
                          borderRadius: 6,
                        }}
                      >
                        <div style={{ marginBottom: 8 }}>
                          <Text strong>Dịch vụ: </Text>
                          <Text>{getServiceName(ticket.service)}</Text>
                        </div>
                        {ticket.description && (
                          <div>
                            <Text strong>Mô tả: </Text>
                            <Text>{ticket.description}</Text>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </Descriptions.Item>
            )}
        </Descriptions>
      </div>
    </Modal>
  );
}

// Project Proposals Modal Component
function ProjectProposalsModal({
  open,
  onCancel,
  project,
}: {
  open: boolean;
  onCancel: () => void;
  project: EditableProject | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [proposals, setProposals] = useState<ProjectPropose[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const currentUser = useAuthStore((state) => state.user);
  useEffect(() => {
    const pid = String((project as any)?.id || (project as any)?._id || "");
    if (open && pid) {
      fetchProposals(pid);
    }
  }, [open, project]);

  const fetchProposals = async (projectId: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await projectProposeApi.list(
        { project: projectId },
        { limit: 100, sort: "-createdAt" }
      );
      const list = ((res as any).docs ||
        (res as any).data ||
        []) as ProjectPropose[];
      setProposals(list);
    } catch (e) {
      console.error(e);
      setError("Không thể tải danh sách đề xuất");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: ProjectProposeStatus) => {
    switch (status) {
      case ProjectProposeStatus.Pending:
        return "orange";
      case ProjectProposeStatus.Negotiating:
      case ProjectProposeStatus.ContactSigning:
      case ProjectProposeStatus.ContractSigned:
        return "cyan";
      case ProjectProposeStatus.Completed:
        return "green";
      case ProjectProposeStatus.Cancelled:
        return "red";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: ProjectProposeStatus) => {
    switch (status) {
      case ProjectProposeStatus.Pending:
        return "Chờ xác nhận";
      case ProjectProposeStatus.Negotiating:
        return "Đang đàm phán";
      case ProjectProposeStatus.ContactSigning:
        return "Đang ký hợp đồng";
      case ProjectProposeStatus.ContractSigned:
        return "Đã ký hợp đồng";
      case ProjectProposeStatus.Completed:
        return "Hoàn thành";
      case ProjectProposeStatus.Cancelled:
        return "Đã hủy";
      default:
        return String(status);
    }
  };

  const handleConfirm = async (proposalId: string) => {
    setActionLoading(proposalId);
    try {
      if (!currentUser?.id) {
        message.error("Vui lòng đăng nhập để xác nhận đề xuất");
        return;
      }
      await projectProposeApi.acceptProposal(
        proposalId,
        "self",
        "Đã chấp nhận đề xuất"
      );
      const pid = String((project as any)?.id || (project as any)?._id || "");
      if (pid) await fetchProposals(pid);
      message.success("Đã xác nhận đề xuất");
    } catch (e) {
      console.error(e);
      message.error("Không thể xác nhận đề xuất");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (proposalId: string) => {
    setActionLoading(proposalId);
    try {
      if (!currentUser?.id) {
        message.error("Vui lòng đăng nhập để từ chối đề xuất");
        return;
      }
      await projectProposeApi.setStatus(
        proposalId,
        ProjectProposeStatus.Cancelled
      );
      const pid = String((project as any)?.id || (project as any)?._id || "");
      if (pid) await fetchProposals(pid);
      message.success("Đã từ chối đề xuất");
    } catch (e) {
      console.error(e);
      message.error("Không thể cập nhật trạng thái đề xuất");
    } finally {
      setActionLoading(null);
    }
  };

  // Handle opening negotiation details
  const handleViewNegotiationDetails = (proposalId: string) => {
    const url = `/my-projects/negotiations/${proposalId}`;
    router.push(url);
  };

  const columns: ColumnsType<ProjectPropose> = [
    {
      title: "Người đề xuất",
      dataIndex: "user",
      key: "user",
      width: 180,
      render: (user: any) => (
        <Text strong>
          {(user && (user.full_name || user.email)) || "Không xác định"}
        </Text>
      ),
    },
    {
      title: "Số tiền đầu tư",
      dataIndex: "investment_amount",
      key: "investment_amount",
      width: 160,
      render: (amount: number) => (
        <Text>{amount ? formatCurrency(amount) : "Không có"}</Text>
      ),
    },
    {
      title: "Tỷ lệ (%)",
      dataIndex: "investment_ratio",
      key: "investment_ratio",
      width: 120,
      render: (ratio: number) => (
        <Text>{ratio != null ? `${ratio}%` : "Không có"}</Text>
      ),
    },
    {
      title: "Lợi ích",
      dataIndex: "investment_benefits",
      key: "investment_benefits",
      width: 240,
      render: (benefits: string) => (
        <Text ellipsis style={{ maxWidth: 220 }}>
          {benefits || "Không có"}
        </Text>
      ),
    },
    {
      title: "Tài liệu",
      dataIndex: "documents",
      key: "documents",
      width: 140,
      render: (docs: any) => (
        <Space>
          {typeof docs === "object" && docs ? (
            <Button
              key={docs.id}
              type="link"
              size="small"
              onClick={() =>
                docs?.url &&
                downloadService.downloadByUrl(docs.url, docs.filename)
              }
            >
              Tài liệu đính kèm
            </Button>
          ) : (
            <Text type="secondary">Không có</Text>
          )}
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status: ProjectProposeStatus) => (
        <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
      ),
    },
    {
      title: "Cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 160,
      render: (date: string) => (
        <Text>{date ? formatDate(date) : "Không xác định"}</Text>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      fixed: "right",
      width: 140,
      render: (_, record: any) => {
        const id = String((record as any).id || (record as any)._id);
        const pending = (record as any).status === ProjectProposeStatus.Pending;
        const loadingKey = actionLoading === id;
        const canViewNegotiation =
          record.status === "negotiating" ||
          record.status === "contact_signing" ||
          record.status === "contract_signed";

        return (
          <Space>
            {pending && (
              <>
                <Popconfirm
                  title="Xác nhận đề xuất"
                  description="Bạn có chắc chắn muốn xác nhận đề xuất này?"
                  onConfirm={() => handleConfirm(id)}
                  okText="Xác nhận"
                  cancelText="Hủy"
                >
                  <Tooltip title="Xác nhận" color="#1677ff">
                    <Button
                      type="text"
                      size="small"
                      icon={<CheckCircle size={16} />}
                      loading={loadingKey}
                      className="hover:bg-green-50 hover:text-green-600"
                    />
                  </Tooltip>
                </Popconfirm>
                <Popconfirm
                  title="Từ chối đề xuất"
                  description="Bạn có chắc chắn muốn từ chối đề xuất này?"
                  onConfirm={() => handleReject(id)}
                  okText="Từ chối"
                  cancelText="Hủy"
                  okType="danger"
                >
                  <Tooltip title="Từ chối" color="#ff4d4f">
                    <Button
                      type="text"
                      size="small"
                      icon={<X size={16} color="red" />}
                      loading={loadingKey}
                    />
                  </Tooltip>
                </Popconfirm>
              </>
            )}
            {canViewNegotiation && (
              <Tooltip title="Xem chi tiết" color="#1677ff">
                <Button
                  type="text"
                  size="small"
                  icon={<ExternalLink size={16} />}
                  onClick={() => handleViewNegotiationDetails(id)}
                  className="hover:bg-gray-50 hover:text-gray-600"
                />
              </Tooltip>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <Modal
      title={
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Danh sách đề xuất
          </Title>
          <Text type="secondary">Dự án: {(project as any)?.name || ""}</Text>
        </div>
      }
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="close" type="primary" onClick={onCancel}>
          Đóng
        </Button>,
      ]}
      width={1200}
      styles={{ body: { paddingTop: 16 } }}
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          Đang tải...
        </div>
      ) : error ? (
        <Card>
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <Text type="danger">{error}</Text>
            <div style={{ marginTop: 16 }}>
              <Button
                type="primary"
                onClick={() => {
                  const pid = String(
                    (project as any)?.id || (project as any)?._id || ""
                  );
                  if (pid) fetchProposals(pid);
                }}
              >
                Thử lại
              </Button>
            </div>
          </div>
        </Card>
      ) : proposals.length === 0 ? (
        <Card>
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <Text type="secondary">Chưa có đề xuất nào cho dự án này</Text>
          </div>
        </Card>
      ) : (
        <Table
          columns={columns as any}
          dataSource={proposals}
          rowKey={(record) => String((record as any).id || (record as any)._id)}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          scroll={{ x: 1000 }}
        />
      )}
    </Modal>
  );
}

// Main Component
export default function MyProjectsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [items, setItems] = useState<Project[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [funds, setFunds] = useState<InvestmentFund[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalDocs, setTotalDocs] = useState<number | undefined>(undefined);

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [proposalsModalOpen, setProposalsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<EditableProject | null>(
    null
  );
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const handleViewProposals = (project: Project) => {
    setCurrentProject(project);
    setProposalsModalOpen(true);
  };

  const filteredItems = useMemo(() => {
    let filtered = items;
    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    return filtered;
  }, [items, search, statusFilter]);

  const fetchList = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const res = await getProjectsByUser(
        String((user as any).id || (user as any)._id),
        { limit, page }
      );
      const list = ((res as any).docs || (res as any).data || []) as Project[];
      const tDocs = (res as any).totalDocs ?? list.length;
      setItems(list);
      setTotalDocs(tDocs);
    } catch (e) {
      console.error(e);
      message.error("Không thể tải danh sách dự án");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTechnologies = async () => {
    try {
      const userTechnologies = await getTechnologiesByUser(
        String((user as any).id || (user as any)._id),
        { limit: 100 }
      );
      const techList = ((userTechnologies as any).docs ||
        (userTechnologies as any).data ||
        []) as Technology[];
      setTechnologies(
        techList?.filter(
          (item) => item.status === "active" || item.status === "approved"
        ) || []
      );
    } catch (e) {
      console.error("Failed to fetch technologies:", e);
    }
  };

  const fetchFunds = async () => {
    try {
      const res = await getInvestmentFunds(
        { user: String((user as any).id || (user as any)._id) },
        { limit: 200 }
      );
      const list = ((res as any).docs ||
        (res as any).data ||
        []) as InvestmentFund[];
      setFunds(list);
    } catch (e) {
      console.error("Failed to fetch investment funds:", e);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await getServices(
        { search: "" },
        { limit: 100, page: 1, sort: "-createdAt" }
      );
      const list =
        (res as any)?.docs ||
        (res as any)?.data ||
        (Array.isArray(res) ? res : []) ||
        [];
      setServices(list as Service[]);
    } catch (e) {
      console.error("Failed to fetch services:", e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchList();
      fetchTechnologies();
      fetchFunds();
      fetchServices();
    }
  }, [page, limit, user]);

  const handleCreate = async (values: any) => {
    if (!checkUserAuth(user, router)) return;

    setActionLoading(true);
    try {
      const obj = {
        ...values,
        end_date: values.end_date
          ? values.end_date.format("YYYY-MM-DD")
          : undefined,
        status: "pending",
        user: user!,
      };
      console.log(obj);
      return;
      const createdProject = await createProject(obj);

      // Tạo service tickets nếu có dịch vụ được chọn
      if (
        values.service_tickets &&
        Array.isArray(values.service_tickets) &&
        values.service_tickets.length > 0
      ) {
        try {
          // Lấy user admin để làm implementer
          const userAdmin = await getUserByRoleAdmin();
          const userAdminList =
            (userAdmin as any)?.docs ||
            (userAdmin as any)?.data ||
            (Array.isArray(userAdmin) ? userAdmin : []) ||
            [];
          const userAdminId = userAdminList[0]?.id;

          // Tạo service ticket cho mỗi dịch vụ được chọn
          const serviceTicketPromises = values.service_tickets.map(
            async (ticketData: any) => {
              const serviceTicketData = {
                service: ticketData.service,
                user: user!.id,
                description:
                  ticketData.description ||
                  `Yêu cầu hỗ trợ dịch vụ cho dự án: ${values.name}`,
                responsible_user: user!.id,
                implementers: userAdminId ? [userAdminId] : [],
                status: "pending" as ServiceTicket["status"],
                project: String(
                  (createdProject as any).id || (createdProject as any)._id
                ),
              };
              return createServiceTicket(serviceTicketData);
            }
          );

          await Promise.all(serviceTicketPromises);
          message.success("Tạo dự án và phiếu dịch vụ thành công");
        } catch (serviceError) {
          console.error("Error creating service tickets:", serviceError);
          message.warning(
            "Tạo dự án thành công nhưng có lỗi khi tạo phiếu dịch vụ"
          );
        }
      } else {
        message.success("Tạo dự án thành công");
      }

      setAddModalOpen(false);
      await fetchList();
    } catch (e) {
      message.error("Tạo dự án thất bại");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (values: any) => {
    if (!currentProject?.id) return;
    if (!checkUserAuth(user, router)) return;

    const id = currentProject.id as string;
    setActionLoading(true);
    try {
      await updateProject(id, {
        ...values,
        end_date: values.end_date
          ? values.end_date.format("YYYY-MM-DD")
          : undefined,
        user: user!,
      });

      // Thông báo về service tickets nếu có thay đổi
      if (
        values.service_tickets &&
        Array.isArray(values.service_tickets) &&
        values.service_tickets.length > 0
      ) {
        message.success(
          "Cập nhật dự án thành công. Lưu ý: Để thay đổi phiếu dịch vụ, vui lòng tạo phiếu dịch vụ mới từ trang 'Phiếu dịch vụ'"
        );
      } else {
        message.success("Cập nhật dự án thành công");
      }

      setEditModalOpen(false);
      setCurrentProject(null);
      await fetchList();
    } catch (e) {
      message.error("Cập nhật dự án thất bại");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!checkUserAuth(user, router)) return;

    setActionLoading(true);
    try {
      await deleteProject(id);
      message.success("Đã xóa dự án");
      await fetchList();
    } catch (e) {
      message.error("Xóa dự án thất bại");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedRowKeys.length) return;
    if (!checkUserAuth(user, router)) return;

    setActionLoading(true);
    try {
      await Promise.allSettled(
        selectedRowKeys.map((id) => deleteProject(String(id)))
      );
      message.success("Đã xóa các dự án đã chọn");
      setSelectedRowKeys([]);
      await fetchList();
    } catch (e) {
      message.error("Xóa hàng loạt thất bại");
    } finally {
      setActionLoading(false);
    }
  };

  // Table columns configuration
  const columns: ColumnsType<Project> = [
    {
      title: "Tên dự án",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Project) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" ellipsis style={{ maxWidth: 200 }}>
            {record.description}
          </Text>
        </div>
      ),
    },
    {
      title: "Công nghệ",
      dataIndex: "technologies",
      key: "technologies",
      render: (techs: any) => (
        <Text ellipsis style={{ maxWidth: 150 }}>
          {getTechnologyTitlesFromValues(techs, technologies)}
        </Text>
      ),
    },
    {
      title: "Quỹ đầu tư",
      dataIndex: "investment_fund",
      key: "investment_fund",
      render: (fundVals: any) => (
        <Text ellipsis style={{ maxWidth: 150 }}>
          {getInvestmentFundTitlesFromValues(fundVals, funds)}
        </Text>
      ),
    },
    {
      title: "Số tiền kêu gọi",
      dataIndex: "goal_money",
      key: "goal_money",
      render: (amount: number) => (
        <Text>{amount ? formatCurrency(amount) : "Chưa xác định"}</Text>
      ),
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      render: (amount: number) => (
        <Text>{amount ? formatCurrency(amount) : "Chưa xác định"}</Text>
      ),
    },
    {
      title: "Lợi nhuận",
      dataIndex: "profit",
      key: "profit",
      render: (amount: number) => (
        <Text>{amount ? formatCurrency(amount) : "Chưa xác định"}</Text>
      ),
    },
    {
      title: "Tỷ lệ cổ phần",
      dataIndex: "share_percentage",
      key: "share_percentage",
      render: (percentage: number) => (
        <Text>{percentage != null ? `${percentage}%` : "Chưa xác định"}</Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
      ),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (date: string) => (
        <Text>{date ? formatDate(date) : "Chưa xác định"}</Text>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      fixed: "right",
      width: 200,
      render: (_, record: Project) => (
        <Space>
          <Tooltip
            title="Xem chi tiết"
            color="#1677ff"
            overlayInnerStyle={{ color: "white" }}
          >
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {
                setCurrentProject(record);
                setViewModalOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip
            title="Xem đề xuất"
            color="#1677ff"
            overlayInnerStyle={{ color: "white" }}
          >
            <Button
              type="text"
              size="small"
              icon={<FileTextOutlined />}
              onClick={() => handleViewProposals(record)}
            />
          </Tooltip>
          <Tooltip
            title="Chỉnh sửa"
            color="#52c41a"
            overlayInnerStyle={{ color: "white" }}
          >
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                if (!checkUserAuth(user, router)) return;
                setCurrentProject(record);
                setEditModalOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip
            title={<span style={{ color: "#ff4d4f" }}>Xóa</span>}
            color="#fff"
            overlayInnerStyle={{
              color: "#ff4d4f",
              border: "1px solid #ff4d4f",
              backgroundColor: "white",
            }}
          >
            <Popconfirm
              title="Xác nhận xóa"
              description={`Bạn có chắc chắn muốn xóa dự án "${record.name}"?`}
              onConfirm={() =>
                handleDelete(String((record as any).id || (record as any)._id))
              }
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <Content style={{ padding: "24px" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <Title
            level={2}
            style={{
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <FolderOpenOutlined style={{ color: "#1890ff" }} />
            Dự án của tôi
          </Title>
          <Text type="secondary">Quản lý các dự án đầu tư của bạn</Text>
        </div>

        {/* Statistics Cards */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Tổng dự án"
                value={totalDocs ?? items.length}
                prefix={<FolderOpenOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Đang hoạt động"
                value={items.filter((item) => item.status === "active").length}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Bị từ chối"
                value={
                  items.filter((item) => item.status === "rejected").length
                }
                prefix={<TeamOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Tổng vốn kêu gọi"
                value={items.reduce(
                  (sum, item) => sum + (item.goal_money || 0),
                  0
                )}
                formatter={(value) => formatCurrency(Number(value))}
                prefix={<DollarOutlined />}
                valueStyle={{ color: "#fa8c16" }}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content Card */}
        <Card>
          {/* Toolbar */}
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <Space wrap>
              <Search
                placeholder="Tìm theo tên, mô tả..."
                allowClear
                style={{ width: 300 }}
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                prefix={<SearchOutlined />}
              />
              <Select
                placeholder="Lọc theo trạng thái"
                allowClear
                style={{ width: 200 }}
                value={statusFilter || undefined}
                onChange={(value) => {
                  setPage(1);
                  setStatusFilter(value || "");
                }}
              >
                <Option value="pending">Chờ duyệt</Option>
                <Option value="active">Đang hoạt động</Option>
                <Option value="rejected">Từ chối</Option>
              </Select>
            </Space>

            <Space>
              {selectedRowKeys.length > 0 ? (
                <Popconfirm
                  title="Xác nhận xóa"
                  description={`Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} dự án đã chọn?`}
                  onConfirm={handleBulkDelete}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    loading={actionLoading}
                  >
                    Xóa đã chọn ({selectedRowKeys.length})
                  </Button>
                </Popconfirm>
              ) : (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    if (!checkUserAuth(user, router)) return;
                    setAddModalOpen(true);
                  }}
                >
                  Thêm dự án mới
                </Button>
              )}
            </Space>
          </div>

          {/* Table */}
          <Table
            columns={columns}
            dataSource={filteredItems}
            rowKey={(record) =>
              String((record as any).id || (record as any)._id)
            }
            rowSelection={rowSelection}
            loading={isLoading}
            pagination={{
              current: page,
              pageSize: limit,
              total: totalDocs,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} mục`,
              onChange: (newPage, newPageSize) => {
                setPage(newPage);
                if (newPageSize !== limit) {
                  setLimit(newPageSize);
                }
              },
            }}
            scroll={{ x: 1200 }}
          />
        </Card>

        {/* Modals */}
        <AddProjectModal
          open={addModalOpen}
          onCancel={() => setAddModalOpen(false)}
          onCreate={handleCreate}
          loading={actionLoading}
          technologies={technologies}
          funds={funds}
          services={services}
        />

        <EditProjectModal
          open={editModalOpen}
          onCancel={() => {
            setEditModalOpen(false);
            setCurrentProject(null);
          }}
          onUpdate={handleUpdate}
          loading={actionLoading}
          technologies={technologies}
          funds={funds}
          services={services}
          project={currentProject}
        />

        <ViewProjectModal
          open={viewModalOpen}
          onCancel={() => {
            setViewModalOpen(false);
            setCurrentProject(null);
          }}
          project={currentProject}
          technologies={technologies}
          funds={funds}
          services={services}
        />

        <ProjectProposalsModal
          open={proposalsModalOpen}
          onCancel={() => {
            setProposalsModalOpen(false);
          }}
          project={currentProject}
        />

        <Toaster />
      </Content>
    </Layout>
  );
}

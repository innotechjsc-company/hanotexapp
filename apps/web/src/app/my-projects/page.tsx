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
  Upload,
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
  UploadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
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
import { uploadFiles } from "@/api/media";
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { getInvestmentFunds } from "@/api/investment-fund";
import type { InvestmentFund } from "@/types/investment_fund";

const { Title, Text } = Typography;
const { Option } = Select;
const { Search } = Input;
const { Content } = Layout;

type EditableProject = Partial<Project> & { id?: string };

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
      return 'Không xác định';
  }
};



const getTechnologyTitlesFromValues = (
  value: string[] | Technology[] | undefined,
  list: Technology[]
): string => {
  if (!value || (Array.isArray(value) && value.length === 0)) return "Chưa chọn";
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
  if (!value || (Array.isArray(value) && value.length === 0)) return "Chưa chọn";
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

// Add Project Modal Component
function AddProjectModal({
  open,
  onCancel,
  onCreate,
  loading,
  technologies,
  funds,
}: {
  open: boolean;
  onCancel: () => void;
  onCreate: (values: any) => Promise<void>;
  loading?: boolean;
  technologies: Technology[];
  funds: InvestmentFund[];
}) {
  const [form] = Form.useForm();
  const [docsUploading, setDocsUploading] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onCreate(values);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    onCancel();
    form.resetFields();
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
          height: 'calc(100vh - 110px)',
          overflow: 'hidden',
          padding: 0,
        },
      }}
      confirmLoading={loading}
      okText="Tạo dự án"  
      cancelText="Hủy"
    >
      <div style={{
        height: '100%',
        overflow: 'auto',
      }}>
        <Form
          form={form}
          layout="vertical"
          scrollToFirstError
        >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Tên dự án"
              rules={[{ required: true, message: 'Vui lòng nhập tên dự án!' }]}
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
              rules={[{ required: true, message: 'Vui lòng nhập mô tả dự án!' }]}
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
              rules={[{ required: true, message: 'Vui lòng chọn công nghệ!' }]}
            >
              <Select
                mode="multiple"
                placeholder="Chọn công nghệ"
                showSearch
                filterOption={(input, option) =>
                  (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
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
            <Form.Item
              name="investment_fund"
              label="Quỹ đầu tư"
            >
              <Select
                mode="multiple"
                placeholder="Chọn quỹ đầu tư"
                showSearch
                filterOption={(input, option) =>
                  (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
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
            <Form.Item
              name="business_model"
              label="Mô hình kinh doanh"
            >
              <Input.TextArea
                rows={3}
                placeholder="Mô tả mô hình kinh doanh"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="market_data"
              label="Số liệu và thị trường"
            >
              <Input.TextArea
                rows={4}
                placeholder="Dữ liệu quy mô thị trường mục tiêu; Số lượng khách hàng tiềm năng và các số liệu kinh doanh thực tế (VD doanh số đã bán và doanh số dự kiến"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="team_profile"
              label="Hồ sơ đội ngũ"
            >
              <Input.TextArea
                rows={5}
                placeholder="Thông tin đội ngũ chính"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="revenue"
              label="Doanh thu (VND)"
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập doanh thu"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="profit"
              label="Lợi nhuận (VND)"
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập lợi nhuận"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="assets"
              label="Tài sản (VND)"
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập tổng tài sản"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="documents_finance"
              label="Tài liệu tài chính"
            >
              <Upload
                multiple
                beforeUpload={() => false}
                onChange={async (info) => {
                  const files = info.fileList.map(file => file.originFileObj).filter(Boolean);
                  if (files.length === 0) return;
                  try {
                    setDocsUploading(true);
                    const uploaded = await uploadFiles(files as File[]);
                    const ids = uploaded.map((m: any) => String(m.id ?? m._id));
                    form.setFieldValue('documents_finance', ids);
                    message.success("Đã upload tài liệu tài chính");
                  } catch (err) {
                    message.error("Upload tài liệu thất bại");
                  } finally {
                    setDocsUploading(false);
                  }
                }}
              >
                <Button icon={<UploadOutlined />} loading={docsUploading}>
                  Chọn tài liệu
                </Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="goal_money"
              label="Số tiền đầu tư kêu gọi (VND)"
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập số tiền"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="share_percentage"
              label="Tỷ lệ cổ phần đề xuất (%)"
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập tỷ lệ cổ phần"
                min={0}
                max={100}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="goal_money_purpose"
              label="Mục đích sử dụng vốn"
            >
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
              rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                placeholder="Chọn ngày kết thúc"
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="open_investment_fund"
              valuePropName="checked"
            >
              <Checkbox>Mở kêu gọi đầu tư</Checkbox>
            </Form.Item>
          </Col>
        </Row>
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
  project,
}: {
  open: boolean;
  onCancel: () => void;
  onUpdate: (values: any) => Promise<void>;
  loading?: boolean;
  technologies: Technology[];
  funds: InvestmentFund[];
  project: EditableProject | null;
}) {
  const [form] = Form.useForm();
  const [docsUploading, setDocsUploading] = useState(false);

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
        end_date: project.end_date ? dayjs(project.end_date) : null,
      };
      form.setFieldsValue(formValues);
    }
  }, [project, open, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onUpdate(values);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleCancel = () => {
    onCancel();
    form.resetFields();
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
          height: 'calc(100vh - 110px)',
          overflow: 'hidden',
          padding: 0,
        },
      }}
      confirmLoading={loading}
      okText="Cập nhật"
      cancelText="Hủy"
    >
      <div style={{
        height: '100%',
        overflow: 'auto',
        padding: '24px 32px'
      }}>
        <Form
          form={form}
          layout="vertical"
          scrollToFirstError
        >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="name"
              label="Tên dự án"
              rules={[{ required: true, message: 'Vui lòng nhập tên dự án!' }]}
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
              rules={[{ required: true, message: 'Vui lòng nhập mô tả dự án!' }]}
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
              rules={[{ required: true, message: 'Vui lòng chọn công nghệ!' }]}
            >
              <Select
                mode="multiple"
                placeholder="Chọn công nghệ"
                showSearch
                filterOption={(input, option) =>
                  (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
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
            <Form.Item
              name="investment_fund"
              label="Quỹ đầu tư"
            >
              <Select
                mode="multiple"
                placeholder="Chọn quỹ đầu tư"
                showSearch
                filterOption={(input, option) =>
                  (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
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
            <Form.Item
              name="business_model"
              label="Mô hình kinh doanh"
            >
              <Input.TextArea
                rows={3}
                placeholder="Mô tả mô hình kinh doanh"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="market_data"
              label="Số liệu và thị trường"
            >
              <Input.TextArea
                rows={4}
                placeholder="Dữ liệu quy mô thị trường mục tiêu; Số lượng khách hàng tiềm năng và các số liệu kinh doanh thực tế (VD doanh số đã bán và doanh số dự kiến"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="team_profile"
              label="Hồ sơ đội ngũ"
            >
              <Input.TextArea
                rows={5}
                placeholder="Thông tin đội ngũ chính"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="revenue"
              label="Doanh thu (VND)"
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập doanh thu"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="profit"
              label="Lợi nhuận (VND)"
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập lợi nhuận"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="assets"
              label="Tài sản (VND)"
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập tổng tài sản"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="documents_finance"
              label="Tài liệu tài chính"
            >
              <Upload
                multiple
                beforeUpload={() => false}
                onChange={async (info) => {
                  const files = info.fileList.map(file => file.originFileObj).filter(Boolean);
                  if (files.length === 0) return;
                  try {
                    setDocsUploading(true);
                    const uploaded = await uploadFiles(files as File[]);
                    const ids = uploaded.map((m: any) => String(m.id ?? m._id));
                    form.setFieldValue('documents_finance', ids);
                    message.success("Đã upload tài liệu tài chính");
                  } catch (err) {
                    message.error("Upload tài liệu thất bại");
                  } finally {
                    setDocsUploading(false);
                  }
                }}
              >
                <Button icon={<UploadOutlined />} loading={docsUploading}>
                  Chọn tài liệu
                </Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="goal_money"
              label="Số tiền đầu tư kêu gọi (VND)"
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập số tiền"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value!.replace(/\$\s?|(|,*)/g, '')}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="share_percentage"
              label="Tỷ lệ cổ phần đề xuất (%)"
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập tỷ lệ cổ phần"
                min={0}
                max={100}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="goal_money_purpose"
              label="Mục đích sử dụng vốn"
            >
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
              rules={[{ required: true, message: 'Vui lòng chọn ngày kết thúc!' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                placeholder="Chọn ngày kết thúc"
                format="YYYY-MM-DD"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="open_investment_fund"
              valuePropName="checked"
            >
              <Checkbox>Mở kêu gọi đầu tư</Checkbox>
            </Form.Item>
          </Col>
        </Row>
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
}: {
  open: boolean;
  onCancel: () => void;
  project: EditableProject | null;
  technologies: Technology[];
  funds: InvestmentFund[];
}) {
  const getTechnologyNames = (values: string[] | Technology[] | undefined) =>
    getTechnologyTitlesFromValues(values, technologies);
  const getFundNames = (values: string[] | any[] | undefined) =>
    getInvestmentFundTitlesFromValues(values, funds);

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
          height: 'calc(100vh - 110px)',
          overflow: 'hidden',
          padding: 0,
        },
      }}
      footer={[
        <Button key="close" type="primary" onClick={onCancel}>
          Đóng
        </Button>
      ]}
    >
      <div style={{
        height: '100%',
        overflow: 'auto',
        paddingTop: 32,
      }}>
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
          <Text>{(project as any)?.open_investment_fund ? 'Có' : 'Không'}</Text>
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
        </Descriptions>
      </div>
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
  const [currentProject, setCurrentProject] = useState<EditableProject | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const filteredItems = useMemo(() => {
    let filtered = items;
    if (search) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(item => item.status === statusFilter);
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
      setTechnologies(techList?.filter((item) => item.status === "active" || item.status === "approved") || []);
    } catch (e) {
      console.error("Failed to fetch technologies:", e);
    }
  };

  const fetchFunds = async () => {
    try {
      const res = await getInvestmentFunds({ user: String((user as any).id || (user as any)._id) }, { limit: 200 });
      const list = ((res as any).docs || (res as any).data || []) as InvestmentFund[];
      setFunds(list); 
    } catch (e) {
      console.error("Failed to fetch investment funds:", e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchList();
      fetchTechnologies();
      fetchFunds();
    }
  }, [page, limit, user]);

  const handleCreate = async (values: any) => {
    if (!checkUserAuth(user, router)) return;

    setActionLoading(true);
    try {
      const obj = {
        ...values,
        end_date: values.end_date ? values.end_date.format('YYYY-MM-DD') : undefined,
        status: "pending",
        user: user!,
      };
      console.log(obj);
      await createProject(obj);
      message.success("Tạo dự án thành công");
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
        end_date: values.end_date ? values.end_date.format('YYYY-MM-DD') : undefined,
        user: user!,
      });
      message.success("Cập nhật dự án thành công");
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
      title: 'Tên dự án',
      dataIndex: 'name',
      key: 'name',
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
      title: 'Công nghệ',
      dataIndex: 'technologies',
      key: 'technologies',
      render: (techs: any) => (
        <Text ellipsis style={{ maxWidth: 150 }}>
          {getTechnologyTitlesFromValues(techs, technologies)}
        </Text>
      ),
    },
    {
      title: 'Quỹ đầu tư',
      dataIndex: 'investment_fund',
      key: 'investment_fund',
      render: (fundVals: any) => (
        <Text ellipsis style={{ maxWidth: 150 }}>
          {getInvestmentFundTitlesFromValues(fundVals, funds)}
        </Text>
      ),
    },
    {
      title: 'Số tiền kêu gọi',
      dataIndex: 'goal_money',
      key: 'goal_money',
      render: (amount: number) => (
        <Text>{amount ? formatCurrency(amount) : 'Chưa xác định'}</Text>
      ),
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (amount: number) => (
        <Text>{amount ? formatCurrency(amount) : 'Chưa xác định'}</Text>
      ),
    },
    {
      title: 'Lợi nhuận',
      dataIndex: 'profit',
      key: 'profit',
      render: (amount: number) => (
        <Text>{amount ? formatCurrency(amount) : 'Chưa xác định'}</Text>
      ),
    },
    {
      title: 'Tỷ lệ cổ phần',
      dataIndex: 'share_percentage',
      key: 'share_percentage',
      render: (percentage: number) => (
        <Text>{percentage != null ? `${percentage}%` : 'Chưa xác định'}</Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusLabel(status)}
        </Tag>
      ),
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'end_date',
      key: 'end_date',
      render: (date: string) => (
        <Text>{date ? formatDate(date) : 'Chưa xác định'}</Text>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      fixed: 'right',
      width: 150,
      render: (_, record: Project) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                setCurrentProject(record);
                setViewModalOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                if (!checkUserAuth(user, router)) return;
                setCurrentProject(record);
                setEditModalOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Xác nhận xóa"
              description={`Bạn có chắc chắn muốn xóa dự án "${record.name}"?`}
              onConfirm={() => handleDelete(String((record as any).id || (record as any)._id))}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button
                type="text"
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
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Content style={{ padding: '24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
            <FolderOpenOutlined style={{ color: '#1890ff' }} />
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
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Đang hoạt động"
                value={items.filter(item => item.status === 'active').length}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Bị từ chối"
                value={items.filter(item => item.status === 'rejected').length}
                prefix={<TeamOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Tổng vốn kêu gọi"
                value={items.reduce((sum, item) => sum + (item.goal_money || 0), 0)}
                formatter={(value) => formatCurrency(Number(value))}
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content Card */}
        <Card>
          {/* Toolbar */}
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
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
            rowKey={(record) => String((record as any).id || (record as any)._id)}
            rowSelection={rowSelection}
            loading={isLoading}
            pagination={{
              current: page,
              pageSize: limit,
              total: totalDocs,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
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
        />

        <Toaster />
      </Content>
    </Layout>
  );
}

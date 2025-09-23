'use client';

import React, { useState } from 'react';
import {
  Button,
  Card,
  Input,
  Select,
  DatePicker,
  Table,
  Tag,
  Space,
  Divider,
  Row,
  Col,
  Alert,
  Modal,
  Form,
  InputNumber,
  Switch,
  Radio,
  Checkbox,
  Upload,
  Progress,
  Spin,
  Tooltip,
  Popconfirm,
  notification,
  message,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  SettingOutlined,
  BellOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Tên',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Tuổi',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Địa chỉ',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Hành động',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <Button type="link" icon={<EditOutlined />} size="small">
          Sửa
        </Button>
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa?"
          onConfirm={() => message.success('Đã xóa thành công!')}
          okText="Có"
          cancelText="Không"
        >
          <Button type="link" danger icon={<DeleteOutlined />} size="small">
            Xóa
          </Button>
        </Popconfirm>
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    key: '1',
    name: 'Nguyễn Văn A',
    age: 32,
    address: 'Hà Nội, Việt Nam',
    tags: ['developer', 'cool'],
  },
  {
    key: '2',
    name: 'Trần Thị B',
    age: 42,
    address: 'Hồ Chí Minh, Việt Nam',
    tags: ['designer'],
  },
  {
    key: '3',
    name: 'Lê Văn C',
    age: 32,
    address: 'Đà Nẵng, Việt Nam',
    tags: ['manager', 'developer', 'cool', 'teacher'],
  },
];

export default function AntdDemoPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      console.log('Form values:', values);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setIsModalVisible(false);
        form.resetFields();
        notification.success({
          message: 'Thành công!',
          description: 'Dữ liệu đã được lưu thành công.',
        });
      }, 2000);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const showNotification = () => {
    notification.info({
      message: 'Thông báo',
      description: 'Đây là một thông báo demo từ Ant Design.',
      icon: <BellOutlined style={{ color: '#108ee9' }} />,
    });
  };

  const showMessage = () => {
    message.success('Đây là một message thành công!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ant Design Demo
          </h1>
          <p className="text-gray-600">
            Trang demo các component Ant Design được tích hợp với HeroUI và Tailwind CSS
          </p>
        </div>

        {/* Alert Section */}
        <Card title="Alerts" className="mb-6">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Alert message="Thông báo thành công" type="success" showIcon />
            <Alert message="Thông báo cảnh báo" type="warning" showIcon />
            <Alert message="Thông báo lỗi" type="error" showIcon />
            <Alert message="Thông báo thông tin" type="info" showIcon />
          </Space>
        </Card>

        {/* Buttons Section */}
        <Card title="Buttons" className="mb-6">
          <Space wrap>
            <Button type="primary">Primary Button</Button>
            <Button>Default Button</Button>
            <Button type="dashed">Dashed Button</Button>
            <Button type="text">Text Button</Button>
            <Button type="link">Link Button</Button>
            <Button type="primary" danger>
              Danger Button
            </Button>
            <Button type="primary" loading>
              Loading Button
            </Button>
            <Button type="primary" icon={<PlusOutlined />}>
              With Icon
            </Button>
          </Space>
        </Card>

        {/* Form Section */}
        <Row gutter={16}>
          <Col xs={24} lg={12}>
            <Card title="Form Controls" className="mb-6">
              <Form layout="vertical">
                <Form.Item label="Tên người dùng">
                  <Input prefix={<UserOutlined />} placeholder="Nhập tên người dùng" />
                </Form.Item>
                <Form.Item label="Email">
                  <Input prefix={<MailOutlined />} placeholder="Nhập email" />
                </Form.Item>
                <Form.Item label="Số điện thoại">
                  <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
                </Form.Item>
                <Form.Item label="Địa chỉ">
                  <TextArea rows={3} placeholder="Nhập địa chỉ" />
                </Form.Item>
                <Form.Item label="Thành phố">
                  <Select placeholder="Chọn thành phố">
                    <Option value="hanoi">Hà Nội</Option>
                    <Option value="hcm">Hồ Chí Minh</Option>
                    <Option value="danang">Đà Nẵng</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Ngày sinh">
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="Khoảng thời gian">
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Form>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Other Controls" className="mb-6">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <label className="block text-sm font-medium mb-2">Số lượng:</label>
                  <InputNumber min={1} max={10} defaultValue={3} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Bật/Tắt:</label>
                  <Switch defaultChecked />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Radio Group:</label>
                  <Radio.Group defaultValue="a">
                    <Radio value="a">Tùy chọn A</Radio>
                    <Radio value="b">Tùy chọn B</Radio>
                    <Radio value="c">Tùy chọn C</Radio>
                  </Radio.Group>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Checkbox Group:</label>
                  <Checkbox.Group>
                    <Checkbox value="1">Tùy chọn 1</Checkbox>
                    <Checkbox value="2">Tùy chọn 2</Checkbox>
                    <Checkbox value="3">Tùy chọn 3</Checkbox>
                  </Checkbox.Group>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Upload:</label>
                  <Upload>
                    <Button icon={<UploadOutlined />}>Tải lên file</Button>
                  </Upload>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Progress:</label>
                  <Progress percent={70} />
                  <Progress percent={100} status="success" />
                  <Progress percent={50} status="exception" />
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Interactive Section */}
        <Card title="Interactive Elements" className="mb-6">
          <Space wrap>
            <Button type="primary" onClick={showModal}>
              Mở Modal
            </Button>
            <Button onClick={showNotification}>
              Hiển thị Notification
            </Button>
            <Button onClick={showMessage}>
              Hiển thị Message
            </Button>
            <Tooltip title="Đây là một tooltip">
              <Button>Hover để xem Tooltip</Button>
            </Tooltip>
            <Spin>
              <Button>Loading Spin</Button>
            </Spin>
          </Space>
        </Card>

        {/* Table Section */}
        <Card title="Data Table" className="mb-6">
          <Table columns={columns} dataSource={data} />
        </Card>

        {/* Modal */}
        <Modal
          title="Form Modal"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          confirmLoading={loading}
          okText="Lưu"
          cancelText="Hủy"
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="Tên"
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Mô tả" name="description">
              <TextArea rows={4} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

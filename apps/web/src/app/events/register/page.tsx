"use client";

import { useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Divider,
  message,
  Steps,
  Result,
  Upload,
} from "antd";
import {
  CalendarOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  UserOutlined,
  SendOutlined,
  CheckCircleOutlined,
  UploadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { createEvent } from "@/api/events";
import { Event } from "@/types/event";
import { uploadFile } from "@/api/media";
import { Media, MediaType } from "@/types/media1";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function EventRegisterPage() {
  const [form] = Form.useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  const eventTypes = [
    "Hội thảo",
    "Triển lãm",
    "Workshop",
    "Hội nghị",
    "Sự kiện networking",
    "Khác",
  ];

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      console.log("Event registration:", values);

      // Upload image first if provided
      let uploadedImage: Media | undefined;
      if (values.eventImage && values.eventImage.length > 0) {
        const imageFile = values.eventImage[0];
        if (imageFile.originFileObj) {
          console.log("Uploading image:", imageFile.name);
          uploadedImage = await uploadFile(imageFile.originFileObj, {
            alt: `Ảnh đại diện sự kiện: ${values.eventName}`,
            type: MediaType.IMAGE,
            caption: values.eventName,
          });
          console.log("Image uploaded:", uploadedImage);
        }
      }

      // Map form values to Event type
      const eventData: Partial<Event> = {
        title: values.eventName,
        content: values.description,
        hashtags: values.eventType, // Use event type as hashtag
        start_date: values.date,
        end_date: values.endDate,
        location: values.location,
        status: "pending", // New events start as pending
        url: values.eventUrl || "", // Optional URL
        image: uploadedImage, // Add uploaded image
      };

      // Call API to create event
      const createdEvent = await createEvent(eventData);
      console.log("Created event:", createdEvent);

      message.success("Đăng ký sự kiện thành công!");
      setIsSubmitted(true);

      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        form.resetFields();
        setFileList([]);
      }, 5000);
    } catch (error: any) {
      console.error("Error creating event:", error);
      message.error(
        error?.message || "Có lỗi xảy ra khi tạo sự kiện, vui lòng thử lại!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setFileList([]);
    message.info("Đã đặt lại form");
  };

  // Upload handlers
  const handleUploadChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file: any) => {
    const isJpgOrPng =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/webp";
    if (!isJpgOrPng) {
      message.error("Chỉ có thể upload file JPG/PNG/WEBP!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Ảnh phải nhỏ hơn 2MB!");
      return false;
    }
    return false; // Prevent auto upload, we'll handle it manually
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Hero Section */}
      <div
        style={{
          background:
            "linear-gradient(135deg, #1890ff 0%, #096dd9 50%, #0050b3 100%)",
          color: "white",
          padding: "80px 0",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <Title
            level={1}
            style={{ color: "white", fontSize: "3.5rem", marginBottom: 24 }}
          >
            Đăng ký sự kiện
          </Title>
          <Paragraph
            style={{
              color: "rgba(255, 255, 255, 0.85)",
              fontSize: "1.25rem",
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            Đăng ký tổ chức sự kiện trên nền tảng HANOTEX
          </Paragraph>
        </div>
      </div>

      {/* Form Section */}
      <div style={{ padding: "80px 0" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px" }}>
          {isSubmitted ? (
            <Result
              status="success"
              title="Đăng ký thành công!"
              subTitle="Chúng tôi đã nhận được thông tin đăng ký sự kiện của bạn. Đội ngũ của chúng tôi sẽ liên hệ lại trong thời gian sớm nhất."
              extra={[
                <div key="processing-time" style={{ marginTop: 16 }}>
                  <Paragraph type="secondary">
                    Thời gian xử lý: 3-5 ngày làm việc
                  </Paragraph>
                </div>,
              ]}
            />
          ) : (
            <Card style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
              <div style={{ textAlign: "center", padding: "24px 24px 0" }}>
                <Title level={2} style={{ marginBottom: 16 }}>
                  Thông tin sự kiện
                </Title>
                <Paragraph style={{ color: "#666", marginBottom: 0 }}>
                  Điền đầy đủ thông tin để đăng ký sự kiện của bạn
                </Paragraph>
              </div>

              <div style={{ padding: "24px" }}>
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  size="large"
                  requiredMark={false}
                >
                  {/* Event Basic Info */}
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="eventName"
                        label="Tên sự kiện"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập tên sự kiện!",
                          },
                        ]}
                      >
                        <Input placeholder="Nhập tên sự kiện" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="eventType"
                        label="Loại sự kiện"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn loại sự kiện!",
                          },
                        ]}
                      >
                        <Select placeholder="Chọn loại sự kiện">
                          {eventTypes.map((type) => (
                            <Option key={type} value={type}>
                              {type}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="description"
                    label="Mô tả sự kiện"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập mô tả sự kiện!",
                      },
                    ]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="Mô tả chi tiết về sự kiện, mục tiêu, nội dung..."
                    />
                  </Form.Item>

                  {/* Event Image */}
                  <Form.Item
                    name="eventImage"
                    label="Ảnh đại diện sự kiện"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng chọn ảnh đại diện!",
                      },
                    ]}
                    valuePropName="fileList"
                    getValueFromEvent={(e) => {
                      if (Array.isArray(e)) {
                        return e;
                      }
                      return e?.fileList;
                    }}
                  >
                    <Upload
                      listType="picture-card"
                      fileList={fileList}
                      onChange={handleUploadChange}
                      beforeUpload={beforeUpload}
                      maxCount={1}
                    >
                      {fileList.length >= 1 ? null : uploadButton}
                    </Upload>
                  </Form.Item>

                  {/* Event Details */}
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="date"
                        label="Ngày bắt đầu"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn ngày bắt đầu!",
                          },
                        ]}
                      >
                        <Input type="date" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="endDate"
                        label="Ngày kết thúc"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng chọn ngày kết thúc!",
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              const startDate = getFieldValue("date");
                              if (!value || !startDate) {
                                return Promise.resolve();
                              }
                              if (new Date(value) < new Date(startDate)) {
                                return Promise.reject(
                                  new Error(
                                    "Ngày kết thúc phải sau ngày bắt đầu!"
                                  )
                                );
                              }
                              return Promise.resolve();
                            },
                          }),
                        ]}
                      >
                        <Input type="date" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item name="eventUrl" label="URL sự kiện (tùy chọn)">
                        <Input placeholder="https://example.com/event" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="maxParticipants"
                        label="Số lượng tham gia tối đa"
                      >
                        <Input type="number" placeholder="100" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="location"
                    label="Địa điểm tổ chức"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập địa điểm tổ chức!",
                      },
                    ]}
                  >
                    <Input placeholder="Địa chỉ chi tiết nơi tổ chức sự kiện" />
                  </Form.Item>

                  {/* Contact Info */}
                  <Row gutter={16}>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="contactEmail"
                        label="Email liên hệ"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập email liên hệ!",
                          },
                          { type: "email", message: "Email không hợp lệ!" },
                        ]}
                      >
                        <Input placeholder="contact@company.com" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item
                        name="contactPhone"
                        label="Số điện thoại liên hệ"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập số điện thoại!",
                          },
                        ]}
                      >
                        <Input placeholder="0123456789" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item name="requirements" label="Yêu cầu đặc biệt">
                    <TextArea
                      rows={3}
                      placeholder="Các yêu cầu đặc biệt về thiết bị, không gian, hỗ trợ..."
                    />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Button
                        type="default"
                        size="large"
                        block
                        onClick={handleReset}
                      >
                        Đặt lại
                      </Button>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Button
                        type="primary"
                        size="large"
                        block
                        htmlType="submit"
                        loading={loading}
                        icon={<SendOutlined />}
                      >
                        Đăng ký sự kiện
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div style={{ padding: "80px 0", backgroundColor: "white" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <Title level={2} style={{ marginBottom: 16 }}>
              Quy trình xử lý
            </Title>
            <Paragraph
              style={{
                fontSize: "1.125rem",
                color: "#666",
                maxWidth: 600,
                margin: "0 auto",
              }}
            >
              Quy trình đơn giản để đăng ký và tổ chức sự kiện trên HANOTEX
            </Paragraph>
          </div>

          <Steps
            current={-1}
            items={[
              {
                title: "Đăng ký",
                description: "Điền thông tin và gửi yêu cầu đăng ký",
                icon: <CalendarOutlined />,
              },
              {
                title: "Xét duyệt",
                description: "Chúng tôi sẽ xem xét và phản hồi trong 3-5 ngày",
                icon: <CheckCircleOutlined />,
              },
              {
                title: "Công bố",
                description: "Sự kiện được công bố và mở đăng ký tham gia",
                icon: <UserOutlined />,
              },
              {
                title: "Tổ chức",
                description: "Hỗ trợ tổ chức và quản lý sự kiện",
                icon: <EnvironmentOutlined />,
              },
            ]}
            responsive={false}
            style={{ marginTop: 32 }}
          />
        </div>
      </div>
    </div>
  );
}

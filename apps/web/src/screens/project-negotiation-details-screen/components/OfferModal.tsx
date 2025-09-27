import React from "react";
import { Modal, Form, Input, InputNumber, Typography, Divider } from "antd";
import { DollarSign, FileText } from "lucide-react";

const { Text, Title } = Typography;
const { TextArea } = Input;

interface OfferModalProps {
  open: boolean;
  onOk: (values: OfferFormData) => Promise<void>;
  onCancel: () => void;
  confirmLoading: boolean;
  uploadingFiles?: boolean;
}

export interface OfferFormData {
  message?: string;
  content?: string;
  price: number;
}

export const OfferModal: React.FC<OfferModalProps> = ({
  open,
  onOk,
  onCancel,
  confirmLoading,
  uploadingFiles = false,
}) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onOk(values);
      form.resetFields();
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <DollarSign size={20} className="text-blue-500" />
          </div>
          <Title level={4} className="mb-0">
            Gửi đề xuất giá
          </Title>
        </div>
      }
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={confirmLoading || uploadingFiles}
      okText={
        uploadingFiles
          ? "Đang tải lên..."
          : confirmLoading
            ? "Đang gửi..."
            : "Gửi đề xuất"
      }
      cancelText="Hủy"
      width={600}
      className="offer-modal"
    >
      <div className="py-4">
        <Text className="text-gray-600 mb-4 block">
          Gửi đề xuất giá cụ thể cho dự án này. Chủ dự án sẽ xem xét và phản
          hồi đề xuất của bạn.
        </Text>

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          className="space-y-4"
        >
          {/* Message (optional) */}
          <Form.Item
            name="message"
            label={
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-gray-500" />
                <Text className="font-medium">Tin nhắn kèm theo</Text>
              </div>
            }
            rules={[]}
          >
            <TextArea
              placeholder="Nhập tin nhắn giải thích về đề xuất của bạn..."
              rows={3}
              className="resize-none"
            />
          </Form.Item>

          <Divider className="my-4" />

          {/* Offer Content (optional) */}
          <Form.Item
            name="content"
            label={
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-gray-500" />
                <Text className="font-medium">Nội dung đề xuất</Text>
              </div>
            }
            rules={[]}
          >
            <TextArea
              placeholder="Mô tả chi tiết về đề xuất của bạn (điều kiện, yêu cầu, cam kết...)..."
              rows={4}
              className="resize-none"
            />
          </Form.Item>

          {/* Offer Price */}
          <Form.Item
            name="price"
            label={
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-gray-500" />
                <Text className="font-medium">Giá đề xuất (VND)</Text>
              </div>
            }
            rules={[
              {
                required: true,
                message: "Vui lòng nhập giá đề xuất",
              },
              {
                type: "number",
                min: 0,
                message: "Giá đề xuất phải lớn hơn 0",
              },
            ]}
          >
            <InputNumber
              placeholder="Nhập giá đề xuất..."
              style={{ width: "100%" }}
              className="w-full"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) =>
                Number(value!.replace(/\$\s?|(,*)/g, "")) as any
              }
              min={0}
              step={1000000}
            />
          </Form.Item>
        </Form>

        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <Text className="text-amber-700 text-sm">
            <strong>Lưu ý:</strong> Sau khi gửi đề xuất, bạn sẽ cần chờ chủ dự án
            xác nhận. Trong thời gian chờ, bạn không thể gửi đề xuất mới.
          </Text>
        </div>
      </div>
    </Modal>
  );
};
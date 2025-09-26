import React from "react";
import { Modal, Form, Input, InputNumber, Typography, Space, Divider } from "antd";
import { DollarOutlined } from "@ant-design/icons";

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

export interface OfferFormData {
  price: number;
  content: string;
  message: string;
}

interface OfferModalProps {
  open: boolean;
  onOk: (offerData: OfferFormData) => Promise<void>;
  onCancel: () => void;
  confirmLoading: boolean;
  uploadingFiles: boolean;
}

export const OfferModal: React.FC<OfferModalProps> = ({
  open,
  onOk,
  onCancel,
  confirmLoading,
  uploadingFiles,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
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
        <Space>
          <DollarOutlined />
          <span>Gửi đề xuất đầu tư</span>
        </Space>
      }
      open={open}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={confirmLoading || uploadingFiles}
      okText="Gửi đề xuất"
      cancelText="Hủy"
      width={600}
      maskClosable={false}
    >
      <div className="py-4">
        <div className="bg-blue-50 p-3 rounded border border-blue-200 mb-4">
          <Text type="secondary" className="text-sm">
            💡 <strong>Lưu ý:</strong> Đề xuất đầu tư sẽ được gửi kèm theo tin nhắn đàm phán. 
            Chủ dự án sẽ có thể chấp nhận hoặc từ chối đề xuất của bạn.
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="price"
            label="Số tiền đầu tư (VND)"
            rules={[
              { required: true, message: "Vui lòng nhập số tiền đầu tư" },
              { type: "number", min: 1, message: "Số tiền phải lớn hơn 0" },
            ]}
          >
            <InputNumber
              placeholder="Nhập số tiền đầu tư"
              className="w-full"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
              addonAfter="VND"
            />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung đề xuất"
            rules={[
              { required: true, message: "Vui lòng nhập nội dung đề xuất" },
              { min: 10, message: "Nội dung đề xuất phải có ít nhất 10 ký tự" },
            ]}
          >
            <TextArea
              placeholder="Mô tả chi tiết về đề xuất đầu tư của bạn..."
              rows={4}
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item
            name="message"
            label="Tin nhắn kèm theo"
            rules={[
              { required: true, message: "Vui lòng nhập tin nhắn kèm theo" },
            ]}
          >
            <TextArea
              placeholder="Tin nhắn gửi kèm với đề xuất đầu tư..."
              rows={3}
              showCount
              maxLength={300}
            />
          </Form.Item>
        </Form>

        <Divider />

        <div className="bg-amber-50 p-3 rounded border border-amber-200">
          <Text type="secondary" className="text-sm">
            ⚠️ <strong>Chú ý:</strong> Sau khi gửi đề xuất, bạn sẽ không thể chỉnh sửa. 
            Vui lòng kiểm tra kỹ thông tin trước khi gửi.
          </Text>
        </div>
      </div>
    </Modal>
  );
};

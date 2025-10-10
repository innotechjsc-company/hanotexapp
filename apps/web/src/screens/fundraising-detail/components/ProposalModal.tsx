import {
  Modal,
  Form,
  Input,
  InputNumber,
  Row,
  Col,
  Space,
  Typography,
  message,
} from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import { FileUpload, type FileUploadItem } from "@/components/input";
import type { FormInstance } from "antd";

const { Text } = Typography;

interface ProposalModalProps {
  open: boolean;
  form: FormInstance;
  isSubmitting: boolean;
  proposalFiles: FileUploadItem[];
  onSubmit: () => void;
  onCancel: () => void;
  onFilesChange: (files: FileUploadItem[]) => void;
}

export function ProposalModal({
  open,
  form,
  isSubmitting,
  proposalFiles,
  onSubmit,
  onCancel,
  onFilesChange,
}: ProposalModalProps) {
  return (
    <Modal
      title={
        <Space>
          <FileTextOutlined style={{ color: "#1890ff" }} />
          <span>Gửi đề xuất đầu tư</span>
        </Space>
      }
      open={open}
      onOk={onSubmit}
      onCancel={onCancel}
      confirmLoading={isSubmitting}
      okText="Gửi đề xuất"
      cancelText="Hủy"
      width={720}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Năng lực nhà đầu tư" name="investor_capacity">
          <Input.TextArea
            rows={3}
            placeholder="Mô tả ngắn về năng lực, kinh nghiệm"
          />
        </Form.Item>
        <Row gutter={16} wrap={false}>
          <Col xs={24} flex={1} style={{ flex: 1 }}>
            <Form.Item
              label="Số vốn đề xuất (VND)"
              name="investment_amount"
              required
              tooltip="Số vốn đề xuất không được nhỏ hơn mục tiêu gọi vốn của dự án"
              rules={[
                { required: true, message: "Vui lòng nhập số vốn đề xuất" },
              ]}
            >
              <InputNumber
                min={0}
                style={{ width: 200 }}
                size="middle"
                className="w-full flex-1"
                placeholder="Ví dụ: 5.000.000.000"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) =>
                  Number(value!.replace(/\$\s?|(,*)/g, "")) as any
                }
              />
            </Form.Item>
          </Col>
          <Col xs={24} flex={1} style={{ flex: 1 }}>
            <Form.Item
              label="Tỷ lệ sở hữu mong muốn (%)"
              name="investment_ratio"
              tooltip="Tỷ lệ sở hữu mong muốn không được lớn hơn 100%"
            >
              <InputNumber
                min={0}
                style={{ width: 100 }}
                size="middle"
                max={100}
                className="w-full flex-1"
                placeholder="Ví dụ: 10"
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="Hình thức đầu tư" name="investment_type">
          <Input.TextArea
            rows={3}
            placeholder="Ví dụ: Góp vốn, Mua cổ phần..."
          />
        </Form.Item>
        <Form.Item label="Lợi ích mang lại" name="investment_benefits">
          <Input.TextArea
            rows={3}
            placeholder="Ví dụ: mạng lưới, chuyên gia, thị trường..."
          />
        </Form.Item>

        {/* File Upload Section */}
        <Form.Item label="Tài liệu đính kèm">
          <FileUpload
            value={proposalFiles}
            onChange={onFilesChange}
            multiple={true}
            maxCount={5}
            allowedTypes={["document", "image"]}
            maxSize={50 * 1024 * 1024}
            title="Tải lên tài liệu"
            description="Chọn tài liệu hỗ trợ cho đề xuất đầu tư (PDF, Word, Excel, PowerPoint, hình ảnh)"
            onUploadSuccess={(file) => {
              message.success(`Tải lên thành công: ${file.name}`);
            }}
            onUploadError={(file, error) => {
              message.error(`Tải lên thất bại: ${file.name} - ${error}`);
            }}
          />
          <Text type="secondary" className="text-xs">
            Hỗ trợ: PDF, Word, Excel, PowerPoint, hình ảnh. Tối đa 5 file, mỗi
            file 50MB
          </Text>
        </Form.Item>
      </Form>
    </Modal>
  );
}

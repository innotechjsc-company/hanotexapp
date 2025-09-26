"use client";

import {
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Button,
  Upload,
  Typography,
  Space,
  Divider,
} from "antd";
import {
  SaveOutlined,
  CloseOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Demand } from "@/types/demand";
import { Category } from "@/types/categories";

interface EditDemandModalProps {
  open: boolean;
  data: Partial<Demand> & { category?: string };
  categories: Category[];
  existingDocuments: any[];
  selectedFiles: File[];
  uploadingFiles: boolean;
  editLoading: boolean;
  deletingFileIds: Set<number>;
  onClose: () => void;
  onSubmit: () => void;
  onChange: (e: { target: { name: string; value: any } }) => void;
  onSelectCategory: (value: string) => void;
  onSelectFiles: (files: File[]) => void;
  onRemoveExistingDocument: (id: number) => void;
  onRestoreOriginalDocuments: () => void;
}

export default function EditDemandModal({
  open,
  data,
  categories,
  existingDocuments,
  selectedFiles,
  uploadingFiles,
  editLoading,
  deletingFileIds,
  onClose,
  onSubmit,
  onChange,
  onSelectCategory,
  onSelectFiles,
  onRemoveExistingDocument,
  onRestoreOriginalDocuments,
}: EditDemandModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Chỉnh sửa nhu cầu"
      width={760}
      footer={null}
      destroyOnClose
    >
      <Form layout="vertical" onFinish={onSubmit} initialValues={{ ...data }}>
        <Form.Item label="Tiêu đề" required>
          <Input
            name="title"
            value={data.title || ""}
            onChange={(e) => onChange({ target: { name: "title", value: e.target.value } })}
          />
        </Form.Item>

        <Form.Item label="Mô tả" required>
          <Input.TextArea
            rows={4}
            name="description"
            value={data.description || ""}
            onChange={(e) =>
              onChange({ target: { name: "description", value: e.target.value } })
            }
          />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="Danh mục" required>
              <Select
                showSearch
                placeholder="Chọn danh mục"
                value={data.category || ""}
                onChange={(value) => onSelectCategory(value)}
                options={categories.map((c) => ({ label: c.name, value: c.id }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="TRL Level" required>
              <Select
                value={data.trl_level || 1}
                onChange={(value) => onChange({ target: { name: "trl_level", value } })}
                options={[1, 2, 3, 4, 5, 6, 7, 8, 9].map((v) => ({
                  label: `TRL ${v}`,
                  value: v,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="Giá từ (VNĐ)">
              <Input
                type="number"
                name="from_price"
                value={(data.from_price as any) ?? ""}
                onChange={(e) =>
                  onChange({ target: { name: "from_price", value: e.target.value } })
                }
                min={0}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Giá đến (VNĐ)">
              <Input
                type="number"
                name="to_price"
                value={(data.to_price as any) ?? ""}
                onChange={(e) =>
                  onChange({ target: { name: "to_price", value: e.target.value } })
                }
                min={0}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Hình thức hợp tác">
          <Input
            name="cooperation"
            value={data.cooperation || ""}
            onChange={(e) =>
              onChange({ target: { name: "cooperation", value: e.target.value } })
            }
          />
        </Form.Item>

        <Form.Item label="Yêu cầu mong muốn">
          <Input.TextArea
            rows={3}
            name="option"
            value={data.option || ""}
            onChange={(e) => onChange({ target: { name: "option", value: e.target.value } })}
          />
        </Form.Item>

        <Form.Item label="Yêu cầu công nghệ">
          <Input.TextArea
            rows={3}
            name="option_technology"
            value={data.option_technology || ""}
            onChange={(e) =>
              onChange({ target: { name: "option_technology", value: e.target.value } })
            }
          />
        </Form.Item>

        <Form.Item label="Yêu cầu quy tắc">
          <Input.TextArea
            rows={3}
            name="option_rule"
            value={data.option_rule || ""}
            onChange={(e) =>
              onChange({ target: { name: "option_rule", value: e.target.value } })
            }
          />
        </Form.Item>

        <Divider />

        {/* Documents section */}
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          {existingDocuments && existingDocuments.length > 0 && (
            <div>
              <Typography.Text strong>File hiện có</Typography.Text>
              <Space direction="vertical" size={8} style={{ width: "100%", marginTop: 8 }}>
                {existingDocuments.map((doc: any) => (
                  <div
                    key={doc.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      background: "#fafafa",
                      border: "1px solid #f0f0f0",
                      borderRadius: 8,
                    }}
                  >
                    <div>
                      <Typography.Text>{doc.filename || doc.alt}</Typography.Text>
                      {doc.mimeType && (
                        <Typography.Text type="secondary" style={{ marginLeft: 8 }}>
                          {doc.mimeType}
                        </Typography.Text>
                      )}
                    </div>
                    <Button
                      icon={<DeleteOutlined />}
                      danger
                      loading={deletingFileIds.has(doc.id)}
                      onClick={() => onRemoveExistingDocument(doc.id)}
                    >
                      Xóa
                    </Button>
                  </div>
                ))}
              </Space>
              <Button style={{ marginTop: 8 }} onClick={onRestoreOriginalDocuments}>
                Khôi phục danh sách file ban đầu
              </Button>
            </div>
          )}

          <div>
            <Typography.Text strong>Thay thế file (chọn để thay thế)</Typography.Text>
            <Upload.Dragger
              multiple
              beforeUpload={() => false}
              fileList={(selectedFiles || []).map((f, idx) => ({
                uid: `${idx}`,
                name: f.name,
                status: "done",
                originFileObj: f as any,
              }))}
              onChange={(info) => {
                const files = (info.fileList || [])
                  .map((uf) => uf.originFileObj)
                  .filter(Boolean) as File[];
                onSelectFiles(files);
              }}
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">Nhấn hoặc kéo thả file vào đây</p>
              <p className="ant-upload-hint">Chấp nhận nhiều file, thay thế hoàn toàn file hiện có</p>
            </Upload.Dragger>
          </div>
        </Space>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
          <Button icon={<CloseOutlined />} onClick={onClose}>Hủy</Button>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SaveOutlined />}
            loading={editLoading || uploadingFiles}
          >
            {uploadingFiles ? "Đang tải file lên..." : editLoading ? "Đang cập nhật..." : "Chỉnh sửa"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

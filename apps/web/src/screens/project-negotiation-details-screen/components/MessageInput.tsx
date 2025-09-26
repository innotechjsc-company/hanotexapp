import React from "react";
import { Form, Input, Button, Upload, Space, Tag, Tooltip } from "antd";
import {
  SendOutlined,
  PaperClipOutlined,
  DeleteOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import type { FormInstance } from "antd/es/form";

const { TextArea } = Input;

interface MessageInputProps {
  form: FormInstance;
  attachments: File[];
  sendingMessage: boolean;
  uploadingFiles: boolean;
  onSendMessage: (values: { message: string }) => Promise<void>;
  onFileUpload: (file: File) => boolean;
  onRemoveAttachment: (index: number) => void;
  formatFileSize: (bytes: number) => string;
  onSendOffer: () => void;
  canSendOffer: boolean;
  hasPendingOffer: boolean;
  isProposalCreator: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  form,
  attachments,
  sendingMessage,
  uploadingFiles,
  onSendMessage,
  onFileUpload,
  onRemoveAttachment,
  formatFileSize,
  onSendOffer,
  canSendOffer,
  hasPendingOffer,
  isProposalCreator,
}) => {
  const handleSubmit = async (values: { message: string }) => {
    if (!values.message?.trim() && attachments.length === 0) {
      return;
    }
    await onSendMessage(values);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.submit();
    }
  };

  return (
    <div className="p-4 bg-white border-t">
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        {/* Attachments display */}
        {attachments.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <Tag
                  key={index}
                  closable
                  onClose={() => onRemoveAttachment(index)}
                  closeIcon={<DeleteOutlined />}
                  className="flex items-center space-x-1 px-2 py-1"
                >
                  <PaperClipOutlined className="text-xs" />
                  <span className="text-xs">
                    {file.name} ({formatFileSize(file.size)})
                  </span>
                </Tag>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-end space-x-2">
          {/* Message input */}
          <div className="flex-1">
            <Form.Item name="message" className="mb-0">
              <TextArea
                placeholder="Nhập nội dung đàm phán đầu tư..."
                autoSize={{ minRows: 1, maxRows: 4 }}
                onKeyPress={handleKeyPress}
                disabled={sendingMessage || uploadingFiles}
              />
            </Form.Item>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            {/* File upload */}
            <Upload
              beforeUpload={onFileUpload}
              showUploadList={false}
              multiple
              disabled={sendingMessage || uploadingFiles}
            >
              <Tooltip title="Đính kèm file">
                <Button
                  type="text"
                  icon={<PaperClipOutlined />}
                  loading={uploadingFiles}
                  disabled={sendingMessage}
                />
              </Tooltip>
            </Upload>

            {/* Send offer button - only for proposal creators */}
            {canSendOffer && (
              <Tooltip 
                title={
                  hasPendingOffer 
                    ? "Đã có đề xuất đang chờ xử lý" 
                    : "Gửi đề xuất giá đầu tư"
                }
              >
                <Button
                  type="default"
                  icon={<DollarOutlined />}
                  onClick={onSendOffer}
                  disabled={hasPendingOffer || sendingMessage || uploadingFiles}
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  Đề xuất
                </Button>
              </Tooltip>
            )}

            {/* Send message button */}
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              loading={sendingMessage}
              disabled={uploadingFiles}
            >
              Gửi
            </Button>
          </div>
        </div>
      </Form>

      {/* Helper text */}
      <div className="mt-2 text-xs text-gray-500">
        <Space split={<span>•</span>}>
          <span>Nhấn Enter để gửi, Shift+Enter để xuống dòng</span>
          {isProposalCreator && (
            <span>Bạn có thể gửi đề xuất giá đầu tư</span>
          )}
        </Space>
      </div>
    </div>
  );
};

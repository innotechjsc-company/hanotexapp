import React from "react";
import { Modal, Typography, Space, Tag, Divider } from "antd";
import { PaperClipOutlined, SendOutlined } from "@ant-design/icons";

const { Text, Paragraph } = Typography;

interface ConfirmationModalProps {
  open: boolean;
  onOk: () => Promise<void>;
  onCancel: () => void;
  confirmLoading: boolean;
  uploadingFiles: boolean;
  pendingMessage: {
    message: string;
    attachments: File[];
  };
  formatFileSize: (bytes: number) => string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onOk,
  onCancel,
  confirmLoading,
  uploadingFiles,
  pendingMessage,
  formatFileSize,
}) => {
  return (
    <Modal
      title={
        <Space>
          <SendOutlined />
          <span>Xác nhận gửi tin nhắn đàm phán</span>
        </Space>
      }
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading || uploadingFiles}
      okText={uploadingFiles ? "Đang tải file..." : "Gửi tin nhắn"}
      cancelText="Hủy"
      width={600}
      maskClosable={false}
    >
      <div className="py-4">
        <Text type="secondary">
          Bạn có chắc chắn muốn gửi tin nhắn đàm phán này không?
        </Text>

        <Divider />

        {/* Message content preview */}
        {pendingMessage.message && (
          <div className="mb-4">
            <Text strong className="block mb-2">
              Nội dung tin nhắn:
            </Text>
            <div className="bg-gray-50 p-3 rounded border">
              <Paragraph className="mb-0 whitespace-pre-wrap">
                {pendingMessage.message}
              </Paragraph>
            </div>
          </div>
        )}

        {/* Attachments preview */}
        {pendingMessage.attachments.length > 0 && (
          <div className="mb-4">
            <Text strong className="block mb-2">
              File đính kèm ({pendingMessage.attachments.length}):
            </Text>
            <div className="space-y-2">
              {pendingMessage.attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-gray-50 p-2 rounded border"
                >
                  <PaperClipOutlined className="text-gray-500" />
                  <div className="flex-1 min-w-0">
                    <Text className="text-sm" ellipsis={{ tooltip: file.name }}>
                      {file.name}
                    </Text>
                    <Text type="secondary" className="text-xs block">
                      {formatFileSize(file.size)}
                    </Text>
                  </div>
                  <Tag color="blue" className="text-xs">
                    {file.type.split('/')[0] || 'file'}
                  </Tag>
                </div>
              ))}
            </div>
          </div>
        )}

        {uploadingFiles && (
          <div className="text-center py-2">
            <Text type="secondary">
              Đang tải lên {pendingMessage.attachments.length} file...
            </Text>
          </div>
        )}

        <div className="bg-blue-50 p-3 rounded border border-blue-200">
          <Text type="secondary" className="text-sm">
            💡 <strong>Lưu ý:</strong> Sau khi gửi, tin nhắn sẽ được hiển thị trong cuộc đàm phán 
            và không thể chỉnh sửa. Vui lòng kiểm tra kỹ nội dung trước khi gửi.
          </Text>
        </div>
      </div>
    </Modal>
  );
};

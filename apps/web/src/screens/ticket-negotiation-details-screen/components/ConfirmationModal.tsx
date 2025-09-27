import React from "react";
import { Modal, Typography, Space, List, Tag } from "antd";
import { FileTextOutlined, LoadingOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface ConfirmationModalProps {
  open: boolean;
  onOk: () => void;
  onCancel: () => void;
  confirmLoading: boolean;
  uploadingFiles: boolean;
  pendingMessage: {
    content: string;
    attachments: File[];
  } | null;
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
  if (!pendingMessage) return null;

  return (
    <Modal
      title="Xác nhận gửi tin nhắn"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText="Gửi tin nhắn"
      cancelText="Hủy"
      confirmLoading={confirmLoading || uploadingFiles}
      width={600}
    >
      <div className="space-y-4">
        <div>
          <Text strong>Nội dung tin nhắn:</Text>
          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
            <Text>{pendingMessage.content}</Text>
          </div>
        </div>

        {pendingMessage.attachments.length > 0 && (
          <div>
            <Text strong>File đính kèm:</Text>
            <List
              className="mt-2"
              size="small"
              dataSource={pendingMessage.attachments}
              renderItem={(file, index) => (
                <List.Item>
                  <Space>
                    <FileTextOutlined />
                    <Text>{file.name}</Text>
                    <Tag color="blue">{formatFileSize(file.size)}</Tag>
                    {uploadingFiles && <LoadingOutlined />}
                  </Space>
                </List.Item>
              )}
            />
          </div>
        )}

        <div className="text-center text-gray-500 text-sm">
          {uploadingFiles ? "Đang tải lên file..." : "Bạn có chắc chắn muốn gửi tin nhắn này?"}
        </div>
      </div>
    </Modal>
  );
};

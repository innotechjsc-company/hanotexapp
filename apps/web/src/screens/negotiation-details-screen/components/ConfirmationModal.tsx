import React from "react";
import { Modal, Typography, List } from "antd";
import { FileText } from "lucide-react";

interface ConfirmationModalProps {
  open: boolean;
  onOk: () => Promise<void>;
  onCancel: () => void;
  confirmLoading: boolean;
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
  pendingMessage,
  formatFileSize,
}) => {
  return (
    <Modal
      title="Xác nhận gửi đàm phán"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText="Gửi"
      cancelText="Hủy"
      confirmLoading={confirmLoading}
    >
      <div>
        <Typography.Text strong>Nội dung đàm phán:</Typography.Text>
        <div className="p-2 bg-gray-100 rounded-md m-2">
          {pendingMessage.message || (
            <Typography.Text type="secondary">
              Không có nội dung đàm phán
            </Typography.Text>
          )}
        </div>

        {pendingMessage.attachments.length > 0 && (
          <>
            <Typography.Text strong>File đính kèm:</Typography.Text>
            <List
              size="small"
              dataSource={pendingMessage.attachments}
              renderItem={(file) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<FileText size={16} />}
                    title={file.name}
                    description={formatFileSize(file.size)}
                  />
                </List.Item>
              )}
            />
          </>
        )}

        <Typography.Text type="secondary">
          Bạn có chắc chắn muốn gửi tin nhắn này không?
        </Typography.Text>
      </div>
    </Modal>
  );
};

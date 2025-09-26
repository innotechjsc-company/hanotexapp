"use client";

import { Modal, Typography } from "antd";
import { Demand } from "@/types/demand";

interface DeleteDemandModalProps {
  open: boolean;
  demand: Demand | null;
  confirmLoading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteDemandModal({
  open,
  demand,
  confirmLoading,
  onCancel,
  onConfirm,
}: DeleteDemandModalProps) {
  return (
    <Modal
      open={open}
      title="Xác nhận xóa"
      okText="Đồng ý"
      cancelText="Hủy"
      onCancel={onCancel}
      onOk={onConfirm}
      confirmLoading={confirmLoading}
    >
      <Typography.Paragraph>
        Bạn có chắc chắn muốn xóa nhu cầu này?
      </Typography.Paragraph>
      <Typography.Text type="secondary">"{demand?.title}"</Typography.Text>
      <Typography.Paragraph>Hành động này không thể hoàn tác.</Typography.Paragraph>
    </Modal>
  );
}


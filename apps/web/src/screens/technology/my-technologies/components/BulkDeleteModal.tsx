"use client";

import { Button, Modal } from "antd";
import { Trash2 } from "lucide-react";

interface BulkDeleteModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
  onConfirm: () => void;
  loading: boolean;
}

export function BulkDeleteModal({
  isOpen,
  onOpenChange,
  selectedCount,
  onConfirm,
  loading,
}: BulkDeleteModalProps) {
  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleOk = () => {
    onConfirm();
  };

  return (
    <Modal
      title="Xác nhận xóa hàng loạt"
      open={isOpen}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Button
          key="confirm"
          type="primary"
          danger
          loading={loading}
          icon={<Trash2 className="h-4 w-4" />}
          onClick={handleOk}
        >
          Xóa tất cả
        </Button>,
      ]}
      width={400}
    >
      <p>
        Bạn có chắc muốn xóa {selectedCount} công nghệ đã chọn? Hành động này
        không thể hoàn tác.
      </p>
    </Modal>
  );
}

"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
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
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="sm"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Xác nhận xóa hàng loạt</ModalHeader>
            <ModalBody>
              Bạn có chắc muốn xóa {selectedCount} công nghệ đã chọn? Hành
              động này không thể hoàn tác.
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Hủy
              </Button>
              <Button
                color="danger"
                onPress={onConfirm}
                variant="bordered"
                startContent={<Trash2 className="h-4 w-4" />}
                isLoading={loading}
              >
                Xóa tất cả
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

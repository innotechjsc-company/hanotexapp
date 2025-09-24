"use client";

import React from "react";
import { Spin, Alert, Button, Form } from "antd";
import { Typography } from "antd";
import { useNegotiation } from "./hooks/useNegotiation";
import { NegotiationHeader } from "./components/NegotiationHeader";
import { NegotiationChat } from "./components/NegotiationChat";
import { MessageInput } from "./components/MessageInput";
import { ConfirmationModal } from "./components/ConfirmationModal";

const { Text } = Typography;

interface NegotiationDetailsScreenProps {
  proposalId: string;
}

export const NegotiationDetailsScreen: React.FC<
  NegotiationDetailsScreenProps
> = ({ proposalId }) => {
  const [form] = Form.useForm();

  const {
    // Data
    proposal,
    messages,
    attachments,
    pendingMessage,

    // Loading states
    loading,
    sendingMessage,
    showConfirmModal,

    // Error state
    error,

    // Actions
    handleSendMessage,
    confirmSendMessage,
    handleFileUpload,
    removeAttachment,
    setShowConfirmModal,

    // Utilities
    formatFileSize,
  } = useNegotiation({ proposalId });

  const handleClose = () => {
    window.close();
  };

  const onSendMessage = async (values: { message: string }) => {
    await handleSendMessage(values);
  };

  const onConfirmSend = async () => {
    await confirmSendMessage();
    form.resetFields();
  };

  if (loading) {
    return (
      <div className="text-center py-24">
        <Spin size="large" />
        <div className="mt-4">
          <Text>Đang tải thông tin đàm phán...</Text>
        </div>
      </div>
    );
  }

  console.log("proposal", proposal);
  console.log("error", error);
  if (error || !proposal) {
    return (
      <div className="p-10">
        <Alert
          message="Lỗi"
          description={error || "Không tìm thấy thông tin đề xuất"}
          type="error"
          showIcon
          action={<Button onClick={handleClose}>Đóng cửa sổ</Button>}
        />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header - Fixed at top */}
      <NegotiationHeader proposal={proposal} onClose={handleClose} />

      {/* Chat area - Takes remaining space */}
      <div className="flex-1 min-h-0">
        <NegotiationChat messages={messages} formatFileSize={formatFileSize} />
      </div>

      {/* Message Input - Fixed at bottom */}
      <MessageInput
        form={form}
        attachments={attachments}
        sendingMessage={sendingMessage}
        onSendMessage={onSendMessage}
        onFileUpload={handleFileUpload}
        onRemoveAttachment={removeAttachment}
        formatFileSize={formatFileSize}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showConfirmModal}
        onOk={onConfirmSend}
        onCancel={() => setShowConfirmModal(false)}
        confirmLoading={sendingMessage}
        pendingMessage={pendingMessage}
        formatFileSize={formatFileSize}
      />
    </div>
  );
};

"use client";

import React from "react";
import { Spin, Alert, Button, Form, Steps } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { useNegotiation } from "@/screens/negotiation-details-screen/hooks/useNegotiation";
import { NegotiationHeader } from "@/screens/negotiation-details-screen/components/NegotiationHeader";
import { NegotiationChat } from "@/screens/negotiation-details-screen/components/NegotiationChat";
import { MessageInput } from "@/screens/negotiation-details-screen/components/MessageInput";
import { ConfirmationModal } from "@/screens/negotiation-details-screen/components/ConfirmationModal";
import { useRouter } from "next/navigation";

const { Text } = Typography;

interface ProposeNegotiationDetailsScreenProps {
  proposalId: string;
}

// Propose-only negotiation screen (no technology-only features like offers/contracts)
export const ProposeNegotiationDetailsScreen: React.FC<
  ProposeNegotiationDetailsScreenProps
> = ({ proposalId }) => {
  const [form] = Form.useForm();
  const router = useRouter();

  const {
    // Data
    proposal,
    messages,
    attachments,
    pendingMessage,

    // Loading states
    loading,
    sendingMessage,
    uploadingFiles,
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
  } = useNegotiation({ proposalId, forceType: 'propose' });

  const handleClose = () => {
    try {
      router.back();
    } catch {
      window.history.back();
    }
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

  // Propose screen shows only negotiation step
  const steps = [
    {
      title: "Đàm phán",
      description: "Thảo luận và thương lượng điều kiện",
      icon: <MessageOutlined />,
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Header - Fixed at top */}
      <div className="flex-shrink-0">
        <NegotiationHeader proposal={proposal} onClose={handleClose} />
      </div>

      {/* Steps Indicator */}
      <div className="flex-shrink-0 bg-gray-50 border-b">
        <div className="max-w-2xl mx-auto w-full px-6 py-3">
          <Steps
            current={0}
            size="small"
            labelPlacement="vertical"
            progressDot
            items={steps.map((s) => ({
              title: s.title,
              description: (
                <span className="text-xs text-gray-500">{s.description}</span>
              ),
              icon: s.icon,
            }))}
          />
        </div>
      </div>

      {/* Content area - Chat only */}
      <div className="flex-1 overflow-hidden">
        <NegotiationChat
          messages={messages}
          formatFileSize={formatFileSize}
          messageInputComponent={
            <MessageInput
              form={form}
              attachments={attachments}
              sendingMessage={sendingMessage}
              uploadingFiles={uploadingFiles}
              onSendMessage={onSendMessage}
              onFileUpload={handleFileUpload}
              onRemoveAttachment={removeAttachment}
              formatFileSize={formatFileSize}
              // Do not pass onSendOffer to hide offer actions for propose
              canSendOffer={false}
              hasPendingOffer={false}
              isProposalCreator={false}
            />
          }
        />
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showConfirmModal}
        onOk={onConfirmSend}
        onCancel={() => setShowConfirmModal(false)}
        confirmLoading={sendingMessage}
        uploadingFiles={uploadingFiles}
        pendingMessage={pendingMessage}
        formatFileSize={formatFileSize}
      />
    </div>
  );
};

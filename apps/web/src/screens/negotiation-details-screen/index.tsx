"use client";

import React from "react";
import { Spin, Alert, Button, Form, Steps } from "antd";
import { Typography } from "antd";
import { useNegotiation } from "./hooks/useNegotiation";
import { NegotiationHeader } from "./components/NegotiationHeader";
import { NegotiationChat } from "./components/NegotiationChat";
import { MessageInput } from "./components/MessageInput";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { ContractSigningStep } from "./components/ContractSigningStep";

const { Text } = Typography;
const { Step } = Steps;

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
    handleSignContract,
    handleDownloadContract,

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

  // Determine current step based on status
  const getCurrentStep = () => {
    switch (proposal.status) {
      case "negotiating":
        return 0; // Negotiation step
      case "contract_signed":
        return 1; // Contract signing step
      default:
        return 0; // Default to negotiation
    }
  };

  const currentStep = getCurrentStep();

  const steps = [
    {
      title: "Đàm phán",
      description: "Thảo luận và thương lượng điều kiện",
      icon: "💬",
    },
    {
      title: "Ký hợp đồng",
      description: "Xem xét và ký kết hợp đồng",
      icon: "📝",
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Header - Fixed at top */}
      <div className="flex-shrink-0">
        <NegotiationHeader proposal={proposal} onClose={handleClose} />
      </div>

      {/* Steps Indicator */}
      <div className="flex-shrink-0 px-6 py-4 bg-gray-50 border-b">
        <Steps current={currentStep} size="small">
          {steps.map((step, index) => (
            <Step
              key={index}
              title={
                <div className="text-center">
                  <div className="text-lg mb-1">{step.icon}</div>
                  <div className="text-sm font-medium">{step.title}</div>
                </div>
              }
              description={
                <div className="text-xs text-gray-500 text-center">
                  {step.description}
                </div>
              }
            />
          ))}
        </Steps>
      </div>

      {/* Content area - Takes remaining space with proper scrolling */}
      <div className="flex-1 overflow-hidden">
        {currentStep === 0 ? (
          /* Negotiation Step - Chat Interface */
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
              />
            }
          />
        ) : (
          /* Contract Signing Step */
          <div className="h-full overflow-auto">
            <ContractSigningStep
              proposal={proposal}
              onSignContract={handleSignContract}
              onDownloadContract={handleDownloadContract}
            />
          </div>
        )}
      </div>

      {/* Confirmation Modal - Only show in negotiation step */}
      {currentStep === 0 && (
        <ConfirmationModal
          open={showConfirmModal}
          onOk={onConfirmSend}
          onCancel={() => setShowConfirmModal(false)}
          confirmLoading={sendingMessage}
          uploadingFiles={uploadingFiles}
          pendingMessage={pendingMessage}
          formatFileSize={formatFileSize}
        />
      )}
    </div>
  );
};

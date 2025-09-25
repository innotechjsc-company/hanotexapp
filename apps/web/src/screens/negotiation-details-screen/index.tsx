"use client";

import React from "react";
import { Spin, Alert, Button, Form, Steps } from "antd";
import { MessageOutlined, FileTextOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { useNegotiation } from "./hooks/useNegotiation";
import { NegotiationHeader } from "./components/NegotiationHeader";
import { NegotiationChat } from "./components/NegotiationChat";
import { MessageInput } from "./components/MessageInput";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { OfferModal } from "./components/OfferModal";
import { ContractCompletionStep } from "./components/ContractCompletionStep";

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
    latestOffer,

    // Loading states
    loading,
    sendingMessage,
    uploadingFiles,
    showConfirmModal,
    showOfferModal,
    sendingOffer,

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
    handleSendOffer,
    confirmSendOffer,
    setShowOfferModal,
    handleCompleteContract,

    // Offer utilities
    canSendOffer,
    hasPendingOffer,
    isProposalCreator,

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
      icon: <MessageOutlined />,
    },
    {
      title: "Hoàn thiện hợp đồng",
      description: "Tải hợp đồng đã ký và hoàn tất",
      icon: <FileTextOutlined />,
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
        <div className="max-w-4xl mx-auto w-full px-6 py-3">
          <Steps
            current={currentStep}
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

      {/* Content area - Takes remaining space with proper scrolling */}
      <div className="flex-1 overflow-hidden">
        {currentStep === 0 ? (
          /* Negotiation Step - Chat Interface */
          <NegotiationChat
            messages={messages}
            formatFileSize={formatFileSize}
            messageInputComponent={
              isProposalCreator && hasPendingOffer ? (
                <div className="px-4 py-3 text-center bg-amber-50 text-amber-700">
                  Bạn đã gửi đề xuất, vui lòng chờ xác nhận
                </div>
              ) : (
                <MessageInput
                  form={form}
                  attachments={attachments}
                  sendingMessage={sendingMessage}
                  uploadingFiles={uploadingFiles}
                  onSendMessage={onSendMessage}
                  onFileUpload={handleFileUpload}
                  onRemoveAttachment={removeAttachment}
                  formatFileSize={formatFileSize}
                  onSendOffer={handleSendOffer}
                  canSendOffer={canSendOffer}
                  hasPendingOffer={hasPendingOffer}
                  isProposalCreator={isProposalCreator}
                />
              )
            }
          />
        ) : (
          /* Contract Signing Step */
          <div className="h-full overflow-auto">
            <ContractCompletionStep
              proposal={proposal}
              onCompleteContract={handleCompleteContract}
            />
          </div>
        )}
      </div>

      {/* Confirmation Modal - Only show in negotiation step */}
      {currentStep === 0 && (
        <>
          <ConfirmationModal
            open={showConfirmModal}
            onOk={onConfirmSend}
            onCancel={() => setShowConfirmModal(false)}
            confirmLoading={sendingMessage}
            uploadingFiles={uploadingFiles}
            pendingMessage={pendingMessage}
            formatFileSize={formatFileSize}
          />

          <OfferModal
            open={showOfferModal}
            onOk={confirmSendOffer}
            onCancel={() => setShowOfferModal(false)}
            confirmLoading={sendingOffer}
            uploadingFiles={uploadingFiles}
          />
        </>
      )}
    </div>
  );
};

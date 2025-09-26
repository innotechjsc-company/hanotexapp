"use client";

import React from "react";
import { Spin, Alert, Button, Form, Steps } from "antd";
import { MessageOutlined, FileTextOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { useProjectNegotiation } from "./hooks/useProjectNegotiation";
import { ProjectNegotiationHeader } from "./components/ProjectNegotiationHeader";
import { useRouter } from "next/navigation";
import { ProjectNegotiationChat } from "./components/ProjectNegotiationChat";
import { MessageInput } from "./components/MessageInput";
import { ContractSigningStep } from "./components/ContractSigningStep";
import { ContractLogsStep } from "./components/ContractLogsStep";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { OfferModal } from "./components/OfferModal";

const { Text } = Typography;

interface ProjectNegotiationDetailsScreenProps {
  projectProposeId: string;
}

export const ProjectNegotiationDetailsScreen: React.FC<
  ProjectNegotiationDetailsScreenProps
> = ({ projectProposeId }) => {
  const [form] = Form.useForm();
  const router = useRouter();

  const {
    // Data
    projectProposal,
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
    handleSendOffer,
    confirmSendOffer,
    setShowOfferModal,

    // Offer utilities
    canSendOffer,
    hasPendingOffer,
    isProposalCreator,

    // Utilities
    formatFileSize,

    // Actions
    handleAcceptProposal,
    handleRejectProposal,
  } = useProjectNegotiation({ projectProposeId });

  const handleClose = () => {
    try {
      router.back();
    } catch {
      // Fallback if router.back fails in some environments
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
          <Text>Đang tải thông tin đàm phán dự án...</Text>
        </div>
      </div>
    );
  }

  console.log("projectProposal", projectProposal);
  console.log("error", error);
  if (error || !projectProposal) {
    return (
      <div className="p-10">
        <Alert
          message="Lỗi"
          description={error || "Không tìm thấy thông tin đề xuất dự án"}
          type="error"
          showIcon
          action={<Button onClick={handleClose}>Đóng cửa sổ</Button>}
        />
      </div>
    );
  }

  // Determine current step based on status
  const getCurrentStep = () => {
    switch (projectProposal.status) {
      case "negotiating":
        return 0; // Bước 1: Đàm phán
      case "contact_signing":
        return 1; // Bước 2: Xác nhận hợp đồng
      case "contract_signed":
      case "completed":
        return 2; // Bước 3: Hoàn thiện hợp đồng
      default:
        return 0; // Mặc định về đàm phán
    }
  };

  const currentStep = getCurrentStep();

  const steps = [
    {
      title: "Đàm phán",
      description: "Thảo luận và thương lượng điều kiện đầu tư",
      icon: <MessageOutlined />,
    },
    {
      title: "Xác nhận hợp đồng",
      description: "Hai bên xác nhận hợp đồng đầu tư",
      icon: <FileTextOutlined />,
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
        <ProjectNegotiationHeader projectProposal={projectProposal} onClose={handleClose} />
      </div>

      {/* Steps Indicator */}
      <div className="flex-shrink-0 bg-gray-50 border-b">
        <div className="max-w-2xl mx-auto w-full px-6 py-3">
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
        {currentStep === 0 && (
          /* Negotiation Step - Chat Interface */
          <ProjectNegotiationChat
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
        )}
        {currentStep === 1 && (
          /* Contract Confirmation Step */
          <div className="h-full overflow-auto">
            <ContractSigningStep
              projectProposal={projectProposal}
              onAccept={handleAcceptProposal}
              onReject={handleRejectProposal}
            />
          </div>
        )}
        {currentStep === 2 && (
          /* Contract Completion Logs Step */
          <div className="h-full overflow-auto">
            <ContractLogsStep projectProposal={projectProposal} />
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

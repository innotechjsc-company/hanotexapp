"use client";

import React, { useState } from "react";
import { Spin, Alert, Button, Form, Steps } from "antd";
import { MessageOutlined, FileTextOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Typography } from "antd";
import { useTicketNegotiation } from "./hooks/useTicketNegotiation";
import { TicketNegotiationHeader } from "./components/TicketNegotiationHeader";
import { useRouter } from "next/navigation";
import { GeneralInfoStep } from "./components/GeneralInfoStep";
import { ProcessingStep } from "./components/ProcessingStep";
import { ConfirmationModal } from "./components/ConfirmationModal";
import { CompletionStep } from "./components/CompletionStep";

const { Text } = Typography;

interface TicketNegotiationDetailsScreenProps {
  ticketId: string;
}

export const TicketNegotiationDetailsScreen: React.FC<
  TicketNegotiationDetailsScreenProps
> = ({ ticketId }) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [viewingStep, setViewingStep] = useState<number | null>(null);
  const [isReloading, setIsReloading] = useState(false);

  const {
    // Data
    ticket,
    logs,
    attachments,
    pendingMessage,
    services,
    userTechnologies,
    userProjects,

    // Loading states
    loading,
    sendingMessage,
    uploadingFiles,
    showConfirmModal,
    updatingStatus,

    // Error state
    error,

    // Actions
    handleSendMessage,
    confirmSendMessage,
    handleFileUpload,
    removeAttachment,
    setShowConfirmModal,
    handleStatusUpdate,
    confirmStatusUpdate,

    // Utilities
    formatFileSize,
    // Refresh
    reloadTicket,
  } = useTicketNegotiation({ ticketId });

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
          <Text>Đang tải thông tin phiếu dịch vụ...</Text>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="p-10">
        <Alert
          message="Lỗi"
          description={error || "Không tìm thấy thông tin phiếu dịch vụ"}
          type="error"
          showIcon
          action={<Button onClick={handleClose}>Đóng cửa sổ</Button>}
        />
      </div>
    );
  }

  // Determine current step based on status
  const getCurrentStep = () => {
    switch (ticket.status) {
      case "pending":
        return 0; // Bước 1: Thông tin chung
      case "processing":
        return 1; // Bước 2: Đang thực hiện
      case "completed":
        return 2; // Bước 3: Hoàn thành
      case "cancelled":
        return 0; // Trở về bước 1 nếu bị hủy
      default:
        return 0; // Mặc định về thông tin chung
    }
  };

  const currentStep = getCurrentStep();
  const isCompleted = ticket.status === "completed";
  
  // Determine which step to display (either current step or clicked step for viewing)
  const displayStep = viewingStep !== null ? viewingStep : currentStep;
  
  console.log('Render state:', {
    ticketStatus: ticket.status,
    currentStep,
    viewingStep,
    displayStep,
    isCompleted
  });

  const steps = [
    {
      title: "Thông tin chung",
      description: "Thông tin yêu cầu và điều phối",
      icon: <FileTextOutlined />,
    },
    {
      title: "Đang thực hiện",
      description: "Trao đổi và xử lý yêu cầu",
      icon: <MessageOutlined />,
    },
    {
      title: "Hoàn thành",
      description: "Xác nhận kết quả và đóng phiếu",
      icon: <CheckCircleOutlined />,
    },
  ];

  const handleReloadWithLoading = async () => {
    setIsReloading(true);
    try {
      await reloadTicket();
    } finally {
      setIsReloading(false);
    }
  };

  const handleStepClick = (step: number) => {
    console.log('Step clicked:', step, 'Current step:', currentStep, 'Is completed:', isCompleted);
    // Allow clicking on completed steps or current step
    if (step <= currentStep || isCompleted) {
      // If ticket is completed and user can view all step, reload data
      if (isCompleted) {
        console.log('Reloading data for completed ticket step view');
        handleReloadWithLoading();
        setViewingStep(step);
      }
    
      console.log('Setting viewing step to:', step);
    } else {
      console.log('Step click blocked - step not accessible');
    }
  };

  const handleBackToCurrent = () => {
    // If ticket is completed and user can view all step, reload data
    if (isCompleted) {
      console.log('Reloading data when returning to current step');
      handleReloadWithLoading();
    }
    setViewingStep(null);
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Header - Fixed at top */}
      <div className="flex-shrink-0">
        <TicketNegotiationHeader ticket={ticket} onClose={handleClose} />
      </div>

      {/* Steps Indicator */}
      <div className="flex-shrink-0 bg-gray-50 border-b">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-center">
            <div className="w-full max-w-6xl">
              <Steps
                current={viewingStep !== null ? viewingStep : (isCompleted ? steps.length - 1 : currentStep)}
                size="small"
                labelPlacement="horizontal"
                progressDot
                onChange={handleStepClick}
                items={steps.map((s, index) => {
                  // Determine if this step is currently being viewed
                  const isCurrentlyViewing = viewingStep !== null ? viewingStep === index : (isCompleted ? index === steps.length - 1 : index === currentStep);
                  
                  return {
                    title: s.title,
                    description: (
                      <span className="text-sm text-gray-500">{s.description}</span>
                    ),
                    icon: s.icon,
                    // Make steps clickable if they are completed or current
                    status: index <= currentStep ? (isCurrentlyViewing ? 'process' : 'finish') : 'wait',
                    // Add clickable class for better UX
                    className: index <= currentStep || isCompleted ? 'cursor-pointer' : 'cursor-not-allowed',
                  };
                })}
              />
              {isReloading && (
                <div className="flex items-center justify-center space-x-2 text-blue-600 mt-4">
                  <Spin size="small" />
                  <span className="text-sm">Đang tải dữ liệu mới...</span>
                </div>
              )}
              {/* {viewingStep !== null && (
                <div className="flex items-center justify-center mt-4">
                  <Button 
                    type="primary" 
                    size="small"
                    onClick={handleBackToCurrent}
                    className="rounded-lg"
                  >
                    Quay lại bước hiện tại
                  </Button>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>

      {/* Content area - Takes remaining space with proper scrolling */}
      <div className="flex-1 overflow-hidden">
        {isCompleted && viewingStep == null ? (
          <div className="h-full overflow-auto space-y-6">
            <CompletionStep 
              ticket={ticket} 
              logs={logs}
              services={services}
              userTechnologies={userTechnologies}
              userProjects={userProjects}
              formatFileSize={formatFileSize}
              onStatusUpdate={handleStatusUpdate}
              updatingStatus={updatingStatus}
            />
          </div>
        ) : (
          <>
            {displayStep === 0 && (
              <>
                {console.log('Rendering GeneralInfoStep')}
                <GeneralInfoStep
                  ticket={ticket}
                  services={services}
                  userTechnologies={userTechnologies}
                  userProjects={userProjects}
                  formatFileSize={formatFileSize}
                  onStatusUpdate={handleStatusUpdate}
                  updatingStatus={updatingStatus}
                  isViewing={viewingStep !== null}
                />
              </>
            )}
            {displayStep === 1 && (
              <>
                {console.log('Rendering ProcessingStep')}
                <ProcessingStep
                  ticket={ticket}
                  logs={logs}
                  attachments={attachments}
                  form={form}
                  sendingMessage={sendingMessage}
                  uploadingFiles={uploadingFiles}
                  onSendMessage={onSendMessage}
                  onFileUpload={handleFileUpload}
                  onRemoveAttachment={removeAttachment}
                  formatFileSize={formatFileSize}
                  onStatusUpdate={handleStatusUpdate}
                  updatingStatus={updatingStatus}
                  isViewing={viewingStep !== null}
                />
              </>
            )}
            {displayStep === 2 && (
              <>
                {console.log('Rendering CompletionStep')}
                <CompletionStep 
                  ticket={ticket} 
                  logs={logs}
                  services={services}
                  userTechnologies={userTechnologies}
                  userProjects={userProjects}
                  formatFileSize={formatFileSize}
                  onStatusUpdate={handleStatusUpdate}
                  updatingStatus={updatingStatus}
                  isViewing={viewingStep !== null}
                />
              </>
            )}
          </>
        )}
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

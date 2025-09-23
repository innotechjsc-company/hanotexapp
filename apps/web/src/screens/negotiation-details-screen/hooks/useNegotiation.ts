import { useState, useEffect } from "react";
import { message } from "antd";
import { technologyProposeApi } from "@/api/technology-propose";
import type { TechnologyPropose } from "@/types/technology-propose";
import {
  formatDate,
  formatCurrency,
} from "@/screens/technology/my-technologies/utils";

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface NegotiationMessage {
  id: string;
  sender: "owner" | "proposer";
  message: string;
  timestamp: string;
  senderName: string;
  senderAvatar?: string;
  attachments?: MessageAttachment[];
  isOnline?: boolean;
}

export interface UseNegotiationProps {
  proposalId: string;
}

export interface UseNegotiationReturn {
  // Data
  proposal: TechnologyPropose | null;
  messages: NegotiationMessage[];
  attachments: File[];
  pendingMessage: { message: string; attachments: File[] };

  // Loading states
  loading: boolean;
  sendingMessage: boolean;
  showConfirmModal: boolean;

  // Error state
  error: string;

  // Actions
  handleSendMessage: (values: { message: string }) => Promise<void>;
  confirmSendMessage: () => Promise<void>;
  handleFileUpload: (file: File) => boolean;
  removeAttachment: (index: number) => void;
  setShowConfirmModal: (show: boolean) => void;

  // Utilities
  formatFileSize: (bytes: number) => string;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export const useNegotiation = ({
  proposalId,
}: UseNegotiationProps): UseNegotiationReturn => {
  const [proposal, setProposal] = useState<TechnologyPropose | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [messages, setMessages] = useState<NegotiationMessage[]>([]);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<{
    message: string;
    attachments: File[];
  }>({ message: "", attachments: [] });

  useEffect(() => {
    if (proposalId) {
      fetchProposalDetails();
      fetchNegotiationMessages();
    }
  }, [proposalId]);

  const fetchProposalDetails = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Fetching proposal details for ID:", proposalId);
      const data = await technologyProposeApi.getById(proposalId);
      console.log("Received proposal data:", data);

      if (!data) {
        throw new Error("No data received from API");
      }

      setProposal(data);
    } catch (err) {
      console.error("Failed to fetch proposal details:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`Không thể tải thông tin đề xuất: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchNegotiationMessages = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockMessages: NegotiationMessage[] = [
        {
          id: "1",
          sender: "proposer",
          message:
            "Xin chào, tôi quan tâm đến công nghệ xử lý nước thải mà bạn đã đăng. Bạn có thể cung cấp thêm thông tin chi tiết không?",
          timestamp: "2024-01-15T09:30:00Z",
          senderName: "Công ty TNHH ABC",
          senderAvatar: "AB",
          isOnline: false,
        },
        {
          id: "2",
          sender: "owner",
          message:
            "Chào bạn! Cảm ơn bạn đã quan tâm. Tôi sẽ gửi thêm tài liệu kỹ thuật chi tiết qua email.",
          timestamp: "2024-01-15T09:35:00Z",
          senderName: "Bạn",
          senderAvatar: "B",
          isOnline: true,
        },
        {
          id: "3",
          sender: "proposer",
          message:
            "Tuyệt vời! Chúng tôi cũng muốn biết về giá cả và thời gian triển khai.",
          timestamp: "2024-01-15T10:30:00Z",
          senderName: "Công ty TNHH ABC",
          senderAvatar: "AB",
          isOnline: false,
          attachments: [
            {
              id: "att1",
              name: "company-profile.pdf",
              url: "#",
              size: 2048000,
              type: "application/pdf",
            },
          ],
        },
      ];
      setMessages(mockMessages);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  const handleSendMessage = async (values: { message: string }) => {
    if (!values.message.trim() && attachments.length === 0) {
      message.warning("Vui lòng nhập tin nhắn hoặc đính kèm file");
      return;
    }

    // Show confirmation modal
    setPendingMessage({
      message: values.message,
      attachments: [...attachments],
    });
    setShowConfirmModal(true);
  };

  const confirmSendMessage = async () => {
    try {
      setSendingMessage(true);

      // Mock file upload - replace with actual API call
      const uploadedAttachments: MessageAttachment[] = [];
      for (const file of pendingMessage.attachments) {
        uploadedAttachments.push({
          id: Date.now().toString() + Math.random(),
          name: file.name,
          url: URL.createObjectURL(file), // Mock URL
          size: file.size,
          type: file.type,
        });
      }

      // Mock sending message - replace with actual API call
      const newMessage: NegotiationMessage = {
        id: Date.now().toString(),
        sender: "owner",
        message: pendingMessage.message,
        timestamp: new Date().toISOString(),
        senderName: "Bạn",
        senderAvatar: "B",
        isOnline: true,
        attachments:
          uploadedAttachments.length > 0 ? uploadedAttachments : undefined,
      };

      setMessages((prev) => [...prev, newMessage]);
      setAttachments([]);
      setShowConfirmModal(false);
      setPendingMessage({ message: "", attachments: [] });
      message.success("Đã gửi tin nhắn");
    } catch (err) {
      console.error("Failed to send message:", err);
      message.error("Không thể gửi tin nhắn");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleFileUpload = (file: File) => {
    setAttachments((prev) => [...prev, file]);
    return false; // Prevent auto upload
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "orange";
      case "negotiating":
        return "blue";
      case "contract_signed":
        return "cyan";
      case "completed":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "negotiating":
        return "Đang đàm phán";
      case "contract_signed":
        return "Đã ký hợp đồng";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  return {
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
    getStatusColor,
    getStatusLabel,
  };
};

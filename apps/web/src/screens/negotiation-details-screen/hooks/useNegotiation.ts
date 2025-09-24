import { useState, useEffect } from "react";
import { message } from "antd";
import { technologyProposeApi } from "@/api/technology-propose";
import {
  negotiatingMessageApi,
  ApiNegotiatingMessage,
} from "@/api/negotiating-messages";
import { useUser } from "@/store/auth";
import type { TechnologyPropose } from "@/types/technology-propose";

export interface UseNegotiationProps {
  proposalId: string;
}

export interface UseNegotiationReturn {
  // Data
  proposal: TechnologyPropose | null;
  messages: ApiNegotiatingMessage[];
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
  const currentUser = useUser();

  // Create a stable reference to the current user to avoid race conditions
  const [stableUser, setStableUser] = useState(currentUser);

  // Update stable user when currentUser changes, but only if it's not null
  useEffect(() => {
    if (currentUser) {
      setStableUser(currentUser);
    }
  }, [currentUser]);

  const [proposal, setProposal] = useState<TechnologyPropose | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [messages, setMessages] = useState<ApiNegotiatingMessage[]>([]);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<{
    message: string;
    attachments: File[];
  }>({ message: "", attachments: [] });

  useEffect(() => {
    if (proposalId && stableUser) {
      fetchProposalDetails();
      fetchNegotiationMessages();
    }
  }, [proposalId, stableUser]);

  const fetchProposalDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await technologyProposeApi.getById(proposalId);
      if (!data) {
        throw new Error("No data received from API");
      }

      setProposal(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`Không thể tải thông tin đề xuất: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchNegotiationMessages = async () => {
    try {
      // Fetch negotiation data using the API
      const response = await negotiatingMessageApi.getMessages({
        technology_propose: proposalId,
        limit: 100,
        page: 1,
      });

      // Use the messages directly from API without transformation
      const messages =
        (response.docs as unknown as ApiNegotiatingMessage[]) || [];

      console.log("Fetched messages:", messages);
      setMessages(messages);
    } catch (err) {
      console.error("Failed to fetch negotiation data:", err);
      // Fallback to empty array on error
      setMessages([]);
    }
  };

  const handleSendMessage = async (values: { message: string }) => {
    if (!values.message.trim() && attachments.length === 0) {
      message.warning("Vui lòng nhập nội dung đàm phán hoặc đính kèm file");
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

      // Use stable user reference with fallback to currentUser
      const userForSending = stableUser || currentUser;

      console.log("confirmSendMessage - Start - user reference:", {
        stableUserId: stableUser?.id,
        currentUserId: currentUser?.id,
        selectedUserId: userForSending?.id,
        email: userForSending?.email,
        hasUser: !!userForSending,
      });

      // TODO: Upload files first if any attachments exist
      const documentIds: string[] = [];
      if (pendingMessage.attachments.length > 0) {
        // For now, we'll skip file upload and just use empty array
        // In a real implementation, you would upload files to media API first
        console.log("File upload not implemented yet, skipping attachments");
      }

      // Check if user is authenticated - use stable user reference with fallback
      if (!userForSending?.id) {
        console.error(
          "User not authenticated - userForSending:",
          userForSending
        );
        throw new Error("User not authenticated");
      }

      console.log("confirmSendMessage - Before API call - userForSending:", {
        id: userForSending?.id,
        email: userForSending?.email,
      });

      // Send negotiation using API
      const sentMessage = await negotiatingMessageApi.sendMessage({
        propose: "", // Leave empty for now - this might be optional
        technology_propose: proposalId,
        user: userForSending.id,
        message: pendingMessage.message,
        document: documentIds,
      });

      console.log("Negotiation sent successfully:", sentMessage);

      console.log("confirmSendMessage - Before refresh - user reference:", {
        stableUserId: stableUser?.id,
        currentUserId: currentUser?.id,
        selectedUserId: userForSending?.id,
      });

      // Refresh negotiation data to get the latest data from server
      await fetchNegotiationMessages();

      console.log("confirmSendMessage - After refresh - user reference:", {
        stableUserId: stableUser?.id,
        currentUserId: currentUser?.id,
        selectedUserId: userForSending?.id,
      });

      setAttachments([]);
      setShowConfirmModal(false);
      setPendingMessage({ message: "", attachments: [] });
      message.success("Đã gửi đàm phán");
    } catch (err) {
      console.error("Failed to send negotiation:", err);
      message.error("Không thể gửi đàm phán");
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

import { useState, useEffect } from "react";
import { message } from "antd";
import { technologyProposeApi } from "@/api/technology-propose";
import {
  negotiatingMessageApi,
  ApiNegotiatingMessage,
} from "@/api/negotiating-messages";
import { uploadFile } from "@/api/media";
import { useUser } from "@/store/auth";
import type { TechnologyPropose } from "@/types/technology-propose";
import { MediaType } from "@/types/media1";

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
  uploadingFiles: boolean;
  showConfirmModal: boolean;

  // Error state
  error: string;

  // Actions
  handleSendMessage: (values: { message: string }) => Promise<void>;
  confirmSendMessage: () => Promise<void>;
  handleFileUpload: (file: File) => boolean;
  removeAttachment: (index: number) => void;
  setShowConfirmModal: (show: boolean) => void;
  handleSignContract: () => Promise<void>;
  handleDownloadContract: () => Promise<void>;

  // Utilities
  formatFileSize: (bytes: number) => string;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

// Helper function to detect file type based on MIME type or file extension
const detectFileType = (file: File): MediaType => {
  const mimeType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  // Check MIME type first
  if (mimeType.startsWith("image/")) {
    return MediaType.IMAGE;
  }

  if (mimeType.startsWith("video/")) {
    return MediaType.VIDEO;
  }

  // Check by file extension for documents
  const documentExtensions = [
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".ppt",
    ".pptx",
    ".txt",
    ".rtf",
    ".odt",
    ".ods",
    ".odp",
    ".csv",
  ];

  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".webp",
    ".svg",
    ".ico",
  ];

  const videoExtensions = [
    ".mp4",
    ".avi",
    ".mov",
    ".wmv",
    ".flv",
    ".webm",
    ".mkv",
    ".m4v",
  ];

  // Check file extensions
  if (documentExtensions.some((ext) => fileName.endsWith(ext))) {
    return MediaType.DOCUMENT;
  }

  if (imageExtensions.some((ext) => fileName.endsWith(ext))) {
    return MediaType.IMAGE;
  }

  if (videoExtensions.some((ext) => fileName.endsWith(ext))) {
    return MediaType.VIDEO;
  }

  // Default to document for unknown types
  return MediaType.DOCUMENT;
};

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
  const [uploadingFiles, setUploadingFiles] = useState(false);
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

      // Upload files first if any attachments exist
      const documentIds: string[] = [];
      if (pendingMessage.attachments.length > 0) {
        try {
          setUploadingFiles(true);
          console.log("Uploading files:", pendingMessage.attachments.length);

          // Show progress message
          message.loading("Đang tải lên file đính kèm...", 0);

          // Upload files individually with proper type detection
          const uploadPromises = pendingMessage.attachments.map(
            async (file) => {
              const fileType = detectFileType(file);
              const fileName = file.name;

              console.log(`Uploading ${fileName} as ${fileType}`);

              // Generate appropriate alt text based on file type
              let altText = "";
              switch (fileType) {
                case MediaType.IMAGE:
                  altText = `Hình ảnh đính kèm: ${fileName}`;
                  break;
                case MediaType.VIDEO:
                  altText = `Video đính kèm: ${fileName}`;
                  break;
                case MediaType.DOCUMENT:
                  altText = `Tài liệu đính kèm: ${fileName}`;
                  break;
                default:
                  altText = `File đính kèm: ${fileName}`;
              }

              return await uploadFile(file, {
                type: fileType,
                alt: altText,
              });
            }
          );

          const uploadedMedia = await Promise.all(uploadPromises);

          // Extract IDs from uploaded media
          documentIds.push(
            ...uploadedMedia.map((media) => media.id.toString())
          );

          console.log("Files uploaded successfully:", {
            count: uploadedMedia.length,
            ids: documentIds,
          });

          // Hide loading message
          message.destroy();
          message.success(`Đã tải lên ${uploadedMedia.length} file thành công`);
        } catch (uploadError) {
          console.error("Failed to upload files:", uploadError);
          message.destroy();
          message.error("Không thể tải lên file đính kèm");
          return; // Stop execution if file upload fails
        } finally {
          setUploadingFiles(false);
        }
      }

      // Check if user is authenticated - use stable user reference with fallback
      if (!userForSending?.id) {
        throw new Error("User not authenticated");
      }

      // Send negotiation using API
      const sentMessage = await negotiatingMessageApi.sendMessage({
        propose: "", // Leave empty for now - this might be optional
        technology_propose: proposalId,
        user: userForSending.id,
        message: pendingMessage.message,
        documents: documentIds,
      });

      // Refresh negotiation data to get the latest data from server
      await fetchNegotiationMessages();

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

  const handleSignContract = async () => {
    try {
      if (!proposal) return;

      // Update proposal status to contract_signed
      const updatedProposal = await technologyProposeApi.setStatus(
        proposalId,
        "contract_signed"
      );

      setProposal(updatedProposal);
      message.success("Hợp đồng đã được ký thành công!");
    } catch (err) {
      console.error("Failed to sign contract:", err);
      message.error("Không thể ký hợp đồng. Vui lòng thử lại.");
    }
  };

  const handleDownloadContract = async () => {
    try {
      if (!proposal?.document?.url) {
        message.warning("Không tìm thấy tài liệu hợp đồng để tải xuống.");
        return;
      }

      // Create a temporary link to download the file
      const link = document.createElement("a");
      link.href = proposal.document.url;
      link.download = proposal.document.filename || "contract.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      message.success("Đã bắt đầu tải xuống hợp đồng.");
    } catch (err) {
      console.error("Failed to download contract:", err);
      message.error("Không thể tải xuống hợp đồng. Vui lòng thử lại.");
    }
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
    getStatusColor,
    getStatusLabel,
  };
};

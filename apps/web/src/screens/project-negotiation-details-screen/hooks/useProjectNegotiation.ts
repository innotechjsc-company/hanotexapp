import { useState, useEffect } from "react";
import { message } from "antd";
import { projectProposeApi } from "@/api/project-propose";
import {
  negotiatingMessageApi,
  ApiNegotiatingMessage,
} from "@/api/negotiating-messages";
import { offerApi, ApiOffer } from "@/api/offers";
import { uploadFile } from "@/api/media";
import { useUser } from "@/store/auth";
import type { ProjectPropose } from "@/types/project-propose";
import { MediaType } from "@/types/media1";
import { OfferStatus } from "@/types/offer";
import { OfferFormData } from "../components/OfferModal";

export interface UseProjectNegotiationProps {
  projectProposeId: string;
}

export interface UseProjectNegotiationReturn {
  // Data
  projectProposal: ProjectPropose | null;
  messages: ApiNegotiatingMessage[];
  attachments: File[];
  pendingMessage: { message: string; attachments: File[] };
  latestOffer: ApiOffer | null;

  // Loading states
  loading: boolean;
  sendingMessage: boolean;
  uploadingFiles: boolean;
  showConfirmModal: boolean;
  showOfferModal: boolean;
  sendingOffer: boolean;

  // Error state
  error: string;

  // Actions
  handleSendMessage: (values: { message: string }) => Promise<void>;
  confirmSendMessage: () => Promise<void>;
  handleFileUpload: (file: File) => boolean;
  removeAttachment: (index: number) => void;
  setShowConfirmModal: (show: boolean) => void;
  handleSendOffer: () => void;
  confirmSendOffer: (offerData: OfferFormData) => Promise<void>;
  setShowOfferModal: (show: boolean) => void;
  handleAcceptProposal: () => Promise<void>;
  handleRejectProposal: () => Promise<void>;
  handleCompleteProposal: () => Promise<void>;

  // Offer utilities
  canSendOffer: boolean;
  hasPendingOffer: boolean;
  isProposalCreator: boolean;

  // Utilities
  formatFileSize: (bytes: number) => string;
  
  // Refresh
  reloadProposal: () => Promise<void>;
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

export const useProjectNegotiation = ({
  projectProposeId,
}: UseProjectNegotiationProps): UseProjectNegotiationReturn => {
  const currentUser = useUser();

  const [projectProposal, setProjectProposal] = useState<ProjectPropose | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [messages, setMessages] = useState<ApiNegotiatingMessage[]>([]);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [sendingOffer, setSendingOffer] = useState(false);
  const [latestOffer, setLatestOffer] = useState<ApiOffer | null>(null);
  const [pendingMessage, setPendingMessage] = useState<{
    message: string;
    attachments: File[];
  }>({ message: "", attachments: [] });

  useEffect(() => {
    if (projectProposeId && currentUser) {
      fetchProjectProposalDetails();
    }
  }, [projectProposeId, currentUser]);

  // Fetch messages and latest offer after proposal is loaded
  useEffect(() => {
    if (projectProposeId && currentUser && projectProposal) {
      fetchNegotiationMessages();
      fetchLatestOffer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectProposeId, currentUser, projectProposal]);

  const fetchProjectProposalDetails = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await projectProposeApi.getById(projectProposeId);
      setProjectProposal(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`Không thể tải thông tin đề xuất dự án: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchNegotiationMessages = async () => {
    try {
      // Fetch negotiation data using the API for project proposals
      const params: any = { 
        limit: 100, 
        page: 1,
        project_propose: projectProposeId
      };
      const response = await negotiatingMessageApi.getMessages(params);

      // Use the messages directly from API without transformation
      const messages =
        (response.docs as unknown as ApiNegotiatingMessage[]) || [];

      console.log("Fetched project negotiation messages:", messages);
      setMessages(messages);
    } catch (err) {
      console.error("Failed to fetch project negotiation data:", err);
      // Fallback to empty array on error
      setMessages([]);
    }
  };

  const fetchLatestOffer = async () => {
    try {
      // Project proposals may also have offers
      const offer = await offerApi.getLatestForProjectProposal(projectProposeId);
      setLatestOffer(offer || null);
    } catch (err) {
      console.error("Failed to fetch latest offer for project:", err);
      setLatestOffer(null);
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

      // Check if user is authenticated
      if (!currentUser?.id) {
        throw new Error("User not authenticated");
      }

      // Send negotiation using API for project proposals
      const payload: any = {
        user: currentUser.id,
        message: pendingMessage.message,
        documents: documentIds,
        project_propose: projectProposeId,
      };

      await negotiatingMessageApi.sendMessage(payload);

      // Refresh negotiation data to get the latest data from server
      await fetchNegotiationMessages();

      setAttachments([]);
      setShowConfirmModal(false);
      setPendingMessage({ message: "", attachments: [] });
      message.success("Đã gửi đàm phán");
    } catch (err) {
      console.error("Failed to send project negotiation:", err);
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

  const handleSendOffer = () => {
    setShowOfferModal(true);
  };

  const confirmSendOffer = async (offerData: OfferFormData) => {
    try {
      setSendingOffer(true);

      // Send offer using API for project proposals
      await negotiatingMessageApi.sendOffer({
        project_propose: projectProposeId,
        message: offerData.message,
        price: offerData.price,
        content: offerData.content,
      });

      // Refresh data to get the latest information
      await Promise.all([fetchNegotiationMessages(), fetchLatestOffer()]);

      setShowOfferModal(false);
      message.success("Đã gửi đề xuất giá thành công");
    } catch (err) {
      console.error("Failed to send project offer:", err);
      message.error("Không thể gửi đề xuất giá");
    } finally {
      setSendingOffer(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Computed properties for offer functionality
  // Người tạo ProjectPropose (projectProposal.user) là người có thể gửi đề xuất
  // Chủ dự án thì không có nút gửi đề xuất
  const isProposalCreator = projectProposal?.user?.id === currentUser?.id;
  const canSendOffer = isProposalCreator && projectProposal?.status === "negotiating";
  const hasPendingOffer = latestOffer?.status === OfferStatus.PENDING;

  const handleAcceptProposal = async () => {
    if (!projectProposal || !currentUser) return;
    try {
      message.loading("Đang chấp nhận đề xuất...", 0);
      await projectProposeApi.acceptProposal(
        projectProposeId,
        currentUser.id,
        "Đề xuất đã được chấp nhận."
      );
      await fetchProjectProposalDetails(); // Refresh data
      message.destroy();
      message.success("Đề xuất đã được chấp nhận thành công!");
    } catch (err) {
      console.error("Failed to accept proposal:", err);
      message.destroy();
      message.error("Có lỗi xảy ra khi chấp nhận đề xuất.");
    }
  };

  const handleRejectProposal = async () => {
    if (!projectProposal || !currentUser) return;
    try {
      message.loading("Đang từ chối đề xuất...", 0);
      await projectProposeApi.rejectProposal(
        projectProposeId,
        currentUser.id,
        "Đề xuất đã bị từ chối."
      );
      await fetchProjectProposalDetails(); // Refresh data
      message.destroy();
      message.success("Đề xuất đã được từ chối.");
    } catch (err) {
      console.error("Failed to reject proposal:", err);
      message.destroy();
      message.error("Có lỗi xảy ra khi từ chối đề xuất.");
    }
  };

  const handleCompleteProposal = async () => {
    if (!projectProposal) return;
    try {
      message.loading("Đang hoàn tất đề xuất...", 0);
      await projectProposeApi.completeProposal(projectProposeId);
      await fetchProjectProposalDetails(); // Refresh data
      message.destroy();
      message.success("Đề xuất đã được hoàn tất thành công!");
    } catch (err) {
      console.error("Failed to complete proposal:", err);
      message.destroy();
      message.error("Có lỗi xảy ra khi hoàn tất đề xuất.");
    }
  };

  return {
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
    handleCompleteProposal,

    // Refresh
    reloadProposal: fetchProjectProposalDetails,
  };
};

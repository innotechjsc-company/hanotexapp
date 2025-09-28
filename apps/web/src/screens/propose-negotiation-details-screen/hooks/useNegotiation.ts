import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { message } from "antd";
import { getProposeById } from "@/api/propose";
import {
  negotiatingMessageApi,
  ApiNegotiatingMessage,
} from "@/api/negotiating-messages";
import { offerApi, type ApiOffer } from "@/api/offers";
import { uploadFile } from "@/api/media";
import { useUser } from "@/store/auth";
import { MediaType } from "@/types/media1";
import { OfferStatus } from "@/types/offer";
// Local Offer form data shape (not used for propose, kept for typing)
export interface OfferFormData {
  message?: string;
  content?: string;
  price: number;
}

export interface UseNegotiationProps {
  proposalId: string; // Propose ID
  // Backward compat: ignored here, this screen is propose-only
  forceType?: "technology" | "propose";
}

export interface UseNegotiationReturn {
  // Data
  proposal: any | null; // Propose
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

  // Offer utilities
  canSendOffer: boolean;
  hasPendingOffer: boolean;
  isProposalCreator: boolean;

  // Utilities
  formatFileSize: (bytes: number) => string;
  // Context
  // propose-only screen
  // Refresh proposal from server
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

export const useNegotiation = ({
  proposalId,
  forceType,
}: UseNegotiationProps): UseNegotiationReturn => {
  const currentUser = useUser();

  const [proposal, setProposal] = useState<any | null>(null);
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
  // propose-only screen: no technology propose context
  const offerCacheRef = useRef<Map<string, ApiOffer>>(new Map());

  const fetchProposalDetails = useCallback(
    async (options: { silent?: boolean } = {}) => {
      const { silent = false } = options;
      try {
        if (!silent) {
          setLoading(true);
        }
        setError("");
        // This screen is for Propose only
        const p = await getProposeById(proposalId);
        if (!p || !(p as any).id) {
          throw new Error("Không tìm thấy đề xuất");
        }
        setProposal(p as any);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(`Không thể tải thông tin đề xuất: ${errorMessage}`);
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [proposalId]
  );

  const ensureOfferDetails = useCallback(
    async (
      message: ApiNegotiatingMessage,
      options: { forceRefresh?: boolean } = {}
    ): Promise<ApiNegotiatingMessage> => {
      const { forceRefresh = false } = options;
      if (message.is_offer && message.offer) {
        if (typeof message.offer === "object" && message.offer.id) {
          offerCacheRef.current.set(
            message.offer.id,
            message.offer as ApiOffer
          );
          return message;
        }

        if (typeof message.offer === "string") {
          if (!forceRefresh) {
            const cached = offerCacheRef.current.get(message.offer);
            if (cached) {
              return { ...message, offer: cached };
            }
          }

          try {
            const resolvedOffer = await offerApi.getById(message.offer);
            offerCacheRef.current.set(resolvedOffer.id, resolvedOffer);
            return { ...message, offer: resolvedOffer };
          } catch (offerError) {
            console.error(
              "Failed to load offer for negotiation message:",
              offerError
            );
          }
        }
      }

      return message;
    },
    []
  );

  const enrichMessagesWithOffers = useCallback(
    async (
      items: ApiNegotiatingMessage[],
      options: { forceRefresh?: boolean } = {}
    ): Promise<ApiNegotiatingMessage[]> => {
      if (items.length === 0) {
        return items;
      }

      const enriched = await Promise.all(
        items.map((item) => ensureOfferDetails(item, options))
      );
      return enriched;
    },
    [ensureOfferDetails]
  );

  const fetchNegotiationMessages = useCallback(async () => {
    try {
      const params: any = { limit: 100, page: 1, propose: proposalId };
      const response = await negotiatingMessageApi.getMessages(params);
      const rawMessages =
        (response.docs as unknown as ApiNegotiatingMessage[]) || [];
      const normalizedMessages = await enrichMessagesWithOffers(rawMessages, {
        forceRefresh: true,
      });
      setMessages(normalizedMessages);
    } catch (err) {
      // Fallback to empty array on error
      setMessages([]);
    }
  }, [proposalId, enrichMessagesWithOffers]);

  // Fetch latest offer for this propose
  const fetchLatestOffer = useCallback(async () => {
    try {
      const offer = await offerApi.getLatestForPropose(proposalId);
      setLatestOffer(offer);
    } catch (err) {
      setLatestOffer(null);
    }
  }, [proposalId]);

  useEffect(() => {
    if (proposalId && currentUser) {
      fetchProposalDetails();
    }
  }, [proposalId, currentUser, fetchProposalDetails]);

  // Fetch messages and latest offer
  useEffect(() => {
    if (proposalId && currentUser) {
      fetchNegotiationMessages();
      fetchLatestOffer();
    }
  }, [proposalId, currentUser, fetchNegotiationMessages, fetchLatestOffer]);

  useEffect(() => {
    if (!proposalId || !currentUser) {
      return;
    }

    const interval = setInterval(() => {
      fetchNegotiationMessages();
      fetchLatestOffer();
      fetchProposalDetails({ silent: true });
    }, 5000);

    return () => clearInterval(interval);
  }, [
    proposalId,
    currentUser,
    fetchNegotiationMessages,
    fetchLatestOffer,
    fetchProposalDetails,
  ]);

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
          console.log("Starting file upload process:", {
            fileCount: pendingMessage.attachments.length,
            files: pendingMessage.attachments.map(f => ({ name: f.name, size: f.size, type: f.type }))
          });

          // Show progress message
          const loadingMessage = message.loading(
            `Đang tải lên ${pendingMessage.attachments.length} file...`, 
            0
          );

          // Upload files individually with detailed error handling
          const uploadResults = [];
          
          for (let i = 0; i < pendingMessage.attachments.length; i++) {
            const file = pendingMessage.attachments[i];
            const fileType = detectFileType(file);
            const fileName = file.name;
            
            try {
              console.log(`Uploading file ${i + 1}/${pendingMessage.attachments.length}: ${fileName} as ${fileType}`);
              
              // Update progress message
              loadingMessage();
              message.loading(
                `Đang tải lên file ${i + 1}/${pendingMessage.attachments.length}: ${fileName}`, 
                0
              );

              // Generate appropriate alt text and caption based on file type
              let altText = "";
              let caption = "";
              
              switch (fileType) {
                case MediaType.IMAGE:
                  altText = `Hình ảnh đính kèm: ${fileName}`;
                  caption = `Hình ảnh được đính kèm trong tin nhắn đàm phán`;
                  break;
                case MediaType.VIDEO:
                  altText = `Video đính kèm: ${fileName}`;
                  caption = `Video được đính kèm trong tin nhắn đàm phán`;
                  break;
                case MediaType.DOCUMENT:
                  altText = `Tài liệu đính kèm: ${fileName}`;
                  caption = `Tài liệu được đính kèm trong tin nhắn đàm phán`;
                  break;
                default:
                  altText = `File đính kèm: ${fileName}`;
                  caption = `File được đính kèm trong tin nhắn đàm phán`;
              }

              const uploadedMedia = await uploadFile(file, {
                type: fileType,
                alt: altText,
                caption: caption
              });
              
              uploadResults.push({
                file: fileName,
                media: uploadedMedia,
                success: true
              });
              
              console.log(`Successfully uploaded: ${fileName}`, uploadedMedia);
              
            } catch (fileError) {
              console.error(`Failed to upload file: ${fileName}`, fileError);
              uploadResults.push({
                file: fileName,
                error: fileError,
                success: false
              });
              
              // Continue with other files instead of stopping completely
            }
          }
          
          // Process upload results
          const successfulUploads = uploadResults.filter(r => r.success);
          const failedUploads = uploadResults.filter(r => !r.success);
          
          if (successfulUploads.length === 0) {
            throw new Error("Không có file nào được tải lên thành công");
          }
          
          // Extract IDs from successful uploads
          documentIds.push(
            ...successfulUploads.map((result) => (result as any).media.id.toString())
          );

          console.log("Upload process completed:", {
            total: uploadResults.length,
            successful: successfulUploads.length,
            failed: failedUploads.length,
            documentIds: documentIds
          });

          // Hide loading message
          message.destroy();
          
          // Show appropriate success/warning message
          if (failedUploads.length === 0) {
            message.success(`Đã tải lên thành công ${successfulUploads.length} file`);
          } else {
            message.warning(
              `Đã tải lên ${successfulUploads.length}/${uploadResults.length} file. ` +
              `${failedUploads.length} file không thể tải lên.`
            );
            console.warn("Failed uploads:", failedUploads);
          }
          
        } catch (uploadError) {
          console.error("File upload process failed:", uploadError);
          message.destroy();
          const errorMessage = uploadError instanceof Error 
            ? uploadError.message 
            : "Lỗi không xác định khi tải file";
          message.error(`Không thể tải lên file đính kèm: ${errorMessage}`);
          return; // Stop execution if file upload fails
        } finally {
          setUploadingFiles(false);
        }
      }

      // Check if user is authenticated
      if (!currentUser?.id) {
        throw new Error("Ngườđi dùng chưa đăng nhập");
      }

      // Validate proposal ID
      if (!proposalId) {
        throw new Error("Không tìm thấy thông tin đề xuất");
      }

      console.log("Sending negotiation message:", {
        userId: currentUser.id,
        messageLength: pendingMessage.message.length,
        documentsCount: documentIds.length,
        proposalId: proposalId
      });

      // Send negotiation using API
      const payload: any = {
        user: currentUser.id,
        message: pendingMessage.message.trim(),
        documents: documentIds,
        propose: proposalId,
      };
      
      console.log("API payload:", payload);
      
      const sendResult = await negotiatingMessageApi.sendMessage(payload);
      console.log("Message sent successfully:", sendResult);

      // Refresh negotiation data to get the latest data from server
      console.log("Refreshing messages...");
      await fetchNegotiationMessages();

      // Clean up state
      setAttachments([]);
      setShowConfirmModal(false);
      setPendingMessage({ message: "", attachments: [] });
      
      const messageText = documentIds.length > 0 
        ? `Đã gử̉i đàm phán với ${documentIds.length} file đính kèm`
        : "Đã gử̉i đàm phán";
        
      message.success(messageText);
    } catch (err) {
      console.error("Failed to send negotiation:", err);
      
      // Provide more specific error messages
      let errorMessage = "Không thể gử̉i đàm phán";
      
      if (err instanceof Error) {
        if (err.message.includes("network") || err.message.includes("timeout")) {
          errorMessage = "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối và thử lại.";
        } else if (err.message.includes("unauthorized") || err.message.includes("401")) {
          errorMessage = "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.";
        } else if (err.message.includes("forbidden") || err.message.includes("403")) {
          errorMessage = "Bạn không có quyền thực hiện hành động này.";
        } else if (err.message.includes("validation")) {
          errorMessage = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.";
        } else {
          errorMessage = `Lỗi: ${err.message}`;
        }
      }
      
      message.error(errorMessage);
      
      // Reset upload state if error occurs
      if (uploadingFiles) {
        setUploadingFiles(false);
        message.destroy(); // Clear any loading messages
      }
    } finally {
      setSendingMessage(false);
      setUploadingFiles(false);
    }
  };

  const handleFileUpload = (file: File) => {
    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      message.error(`File "${file.name}" quá lớn. Kích thước tối đa cho phép là 50MB.`);
      return false;
    }

    // Validate file type
    const allowedExtensions = [
      '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.rtf',
      '.csv', '.odt', '.ods', '.odp', '.jpg', '.jpeg', '.png', '.gif', '.bmp', 
      '.webp', '.svg', '.ico', '.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', 
      '.mkv', '.m4v'
    ];
    
    const fileName = file.name.toLowerCase();
    const isValidType = allowedExtensions.some(ext => fileName.endsWith(ext));
    
    if (!isValidType) {
      message.error(`Loại file "${file.name}" không được hỗ trợ. Vui lòng chọn file PDF, Word, Excel, PowerPoint, hình ảnh hoặc video.`);
      return false;
    }

    // Check for duplicate files
    const isDuplicate = attachments.some(existing => 
      existing.name === file.name && existing.size === file.size
    );
    
    if (isDuplicate) {
      message.warning(`File "${file.name}" đã được thêm vào danh sách đính kèm.`);
      return false;
    }

    // Limit number of attachments
    if (attachments.length >= 10) {
      message.error('Chỉ có thể đính kèm tối đa 10 file.');
      return false;
    }

    console.log('Adding file to attachments:', {
      name: file.name,
      size: file.size,
      type: file.type,
      detectedType: detectFileType(file)
    });

    setAttachments((prev) => [...prev, file]);
    message.success(`Đã thêm file "${file.name}" vào danh sách đính kèm.`);
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

      // Send offer for propose
      await negotiatingMessageApi.sendOffer({
        propose: proposalId,
        message: offerData.message,
        price: offerData.price,
        content: offerData.content,
      });

      await Promise.all([fetchNegotiationMessages(), fetchLatestOffer()]);

      setShowOfferModal(false);
      message.success("Đã gửi đề xuất giá thành công");
    } catch (err) {
      console.error("Failed to send offer:", err);
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
  const proposalUserId = proposal?.user
    ? typeof proposal.user === "object"
      ? (proposal.user as any).id
      : proposal.user
    : undefined;
  const isProposalCreator =
    String(proposalUserId || "") === String(currentUser?.id || "");
  const canSendOffer =
    proposal?.status === "negotiating" && !!isProposalCreator;
  const hasPendingOffer = latestOffer?.status === OfferStatus.PENDING;

  return {
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
    handleSendOffer,
    confirmSendOffer,
    setShowOfferModal,

    // Offer utilities
    canSendOffer,
    hasPendingOffer,
    isProposalCreator,

    // Utilities
    formatFileSize,
    // Context: propose-only screen
    // Refresh
    reloadProposal: fetchProposalDetails,
  };
};

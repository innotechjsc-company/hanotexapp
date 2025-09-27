import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { message } from "antd";
import { technologyProposeApi } from "@/api/technology-propose";
import { getProposeById } from "@/api/propose";
import {
  negotiatingMessageApi,
  ApiNegotiatingMessage,
} from "@/api/negotiating-messages";
import { offerApi, ApiOffer } from "@/api/offers";
import { uploadFile } from "@/api/media";
import { useUser } from "@/store/auth";
import webSocketManager from "@/lib/websocket";
import { localStorageService } from "@/services/localstorage";
import type { TechnologyPropose } from "@/types/technology-propose";
import { MediaType } from "@/types/media1";
import { OfferStatus } from "@/types/offer";
import type { OfferFormData } from "../components/OfferModal";

export interface UseNegotiationProps {
  proposalId: string; // could be TechnologyPropose ID or Propose ID
  // If provided, force using a specific API context
  // 'technology' => call technology-propose APIs only
  // 'propose' => call propose APIs only
  forceType?: 'technology' | 'propose';
}

export interface UseNegotiationReturn {
  // Data
  proposal: any | null; // TechnologyPropose | Propose
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
  isTechnologyPropose: boolean;
  // Refresh proposal from server
  reloadProposal: () => Promise<void>;
}

type NegotiationSocketMessagePayload = {
  roomId?: string;
  message?: ApiNegotiatingMessage;
};

type NegotiationSocketDeletePayload = {
  roomId?: string;
  messageId?: string;
};

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
  const [isTechnologyPropose, setIsTechnologyPropose] = useState<boolean>(true);
  const offerCacheRef = useRef<Map<string, ApiOffer>>(new Map());

  const negotiationContext = useMemo(() => {
    if (forceType === 'technology' || forceType === 'propose') {
      return forceType;
    }
    return isTechnologyPropose ? 'technology' : 'propose';
  }, [forceType, isTechnologyPropose]);

  const negotiationRoomId = useMemo(() => {
    if (!proposalId || !negotiationContext) return null;
    return `negotiation:${negotiationContext}:${proposalId}`;
  }, [negotiationContext, proposalId]);

  const fetchProposalDetails = useCallback(async (options: { silent?: boolean } = {}) => {
    const { silent = false } = options;
    try {
      if (!silent) {
        setLoading(true);
      }
      setError("");
      // Respect forced type if provided
      if (forceType === 'technology') {
        const data = await technologyProposeApi.getById(proposalId);
        setProposal(data as any);
        setIsTechnologyPropose(true);
      } else if (forceType === 'propose') {
        const p = await getProposeById(proposalId);
        setProposal(p as any);
        setIsTechnologyPropose(false);
      } else {
        // Auto-detect: try technology-propose first; if fails, fallback to propose
        try {
          const data = await technologyProposeApi.getById(proposalId);
          if (!data) throw new Error('No data');
          setProposal(data as any);
          setIsTechnologyPropose(true);
        } catch (e) {
          const p = await getProposeById(proposalId);
          setProposal(p as any);
          setIsTechnologyPropose(false);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`Không thể tải thông tin đề xuất: ${errorMessage}`);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, [forceType, proposalId]);

  const ensureOfferDetails = useCallback(
    async (
      message: ApiNegotiatingMessage,
      options: { forceRefresh?: boolean } = {}
    ): Promise<ApiNegotiatingMessage> => {
      const { forceRefresh = false } = options;
      if (message.is_offer && message.offer) {
        if (typeof message.offer === "object" && message.offer.id) {
          offerCacheRef.current.set(message.offer.id, message.offer as ApiOffer);
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
            console.error("Failed to load offer for negotiation message:", offerError);
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
      // Fetch negotiation data using the API
      const params: any = { limit: 100, page: 1 };
      if (isTechnologyPropose) params.technology_propose = proposalId;
      else params.propose = proposalId;
      const response = await negotiatingMessageApi.getMessages(params);

      // Use the messages directly from API without transformation
      const rawMessages =
        (response.docs as unknown as ApiNegotiatingMessage[]) || [];

      console.log("Fetched messages:", rawMessages);
      const normalizedMessages = await enrichMessagesWithOffers(rawMessages, {
        forceRefresh: true,
      });
      setMessages(normalizedMessages);
    } catch (err) {
      console.error("Failed to fetch negotiation data:", err);
      // Fallback to empty array on error
      setMessages([]);
    }
  }, [isTechnologyPropose, proposalId, enrichMessagesWithOffers]);

  const fetchLatestOffer = useCallback(async () => {
    try {
      if (isTechnologyPropose) {
        const offer = await offerApi.getLatestForProposal(proposalId);
        setLatestOffer(offer);
      } else {
        setLatestOffer(null);
      }
    } catch (err) {
      console.error("Failed to fetch latest offer:", err);
      setLatestOffer(null);
    }
  }, [isTechnologyPropose, proposalId]);

  useEffect(() => {
    if (proposalId && currentUser) {
      fetchProposalDetails();
    }
  }, [proposalId, currentUser, fetchProposalDetails]);

  // Fetch messages and latest offer after type detection
  useEffect(() => {
    if (proposalId && currentUser) {
      fetchNegotiationMessages();
      fetchLatestOffer();
    }
  }, [proposalId, currentUser, isTechnologyPropose, fetchNegotiationMessages, fetchLatestOffer]);

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

  useEffect(() => {
    if (!negotiationRoomId || !currentUser?.id) {
      return;
    }

    const resolveToken = () => {
      const storedToken = localStorageService.get<string | null>(
        "auth_token",
        null
      );
      if (storedToken) return storedToken;
      if (typeof window !== "undefined") {
        return window.localStorage.getItem("payload_token");
      }
      return null;
    };

    const socket = webSocketManager.connect(resolveToken() || undefined);

    const userName =
      currentUser.full_name ||
      currentUser.email ||
      `user:${currentUser.id.slice(0, 6)}`;

    const handleConnect = () => {
      webSocketManager.emit("authenticate", {
        userId: currentUser.id,
        userName,
      });
    };

    const handleAuthenticated = () => {
      webSocketManager.emit("join-room", negotiationRoomId);
    };

    const sortMessages = (items: ApiNegotiatingMessage[]) =>
      [...items].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

    const upsertMessage = async (incoming: ApiNegotiatingMessage) => {
      const normalized = await ensureOfferDetails(incoming);

      setMessages((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === normalized.id);
        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = normalized;
          return sortMessages(updated);
        }
        return sortMessages([...prev, normalized]);
      });

      if (normalized.is_offer) {
        if (normalized.offer && typeof normalized.offer === "object") {
          offerCacheRef.current.set(normalized.offer.id, normalized.offer as ApiOffer);
          setLatestOffer(normalized.offer as ApiOffer);
        } else {
          fetchLatestOffer();
        }
      }
    };

    const handleNewMessage = (payload: NegotiationSocketMessagePayload) => {
      if (!payload?.message || payload.roomId !== negotiationRoomId) return;
      void upsertMessage(payload.message);
    };

    const handleUpdatedMessage = (
      payload: NegotiationSocketMessagePayload
    ) => {
      if (!payload?.message || payload.roomId !== negotiationRoomId) return;
      void upsertMessage(payload.message);
    };

    const handleDeletedMessage = (
      payload: NegotiationSocketDeletePayload
    ) => {
      if (!payload?.messageId || payload.roomId !== negotiationRoomId) return;
      setMessages((prev) =>
        prev.filter((message) => message.id !== payload.messageId)
      );
      fetchLatestOffer();
    };

    if (socket) {
      socket.on("connect", handleConnect);
      socket.on("authenticated", handleAuthenticated);

      if (socket.connected) {
        handleConnect();
      }
    }

    webSocketManager.on("negotiation:new-message", handleNewMessage);
    webSocketManager.on("negotiation:message-updated", handleUpdatedMessage);
    webSocketManager.on("negotiation:message-deleted", handleDeletedMessage);

    return () => {
      webSocketManager.emit("leave-room", negotiationRoomId);
      webSocketManager.off("negotiation:new-message", handleNewMessage);
      webSocketManager.off("negotiation:message-updated", handleUpdatedMessage);
      webSocketManager.off("negotiation:message-deleted", handleDeletedMessage);

      if (socket) {
        socket.off("connect", handleConnect);
        socket.off("authenticated", handleAuthenticated);
      }
    };
  }, [
    negotiationRoomId,
    currentUser?.id,
    currentUser?.email,
    currentUser?.full_name,
    fetchLatestOffer,
    ensureOfferDetails,
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

      // Send negotiation using API
      const payload: any = {
        user: currentUser.id,
        message: pendingMessage.message,
        documents: documentIds,
      };
      if (isTechnologyPropose) payload.technology_propose = proposalId;
      else payload.propose = proposalId;
      await negotiatingMessageApi.sendMessage(payload);

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

  const handleSendOffer = () => {
    if (!isTechnologyPropose) return; // not supported for demand propose
    setShowOfferModal(true);
  };

  const confirmSendOffer = async (offerData: OfferFormData) => {
    try {
      setSendingOffer(true);

      // Send offer using API with new payload shape
      if (!isTechnologyPropose) throw new Error("Offers chỉ hỗ trợ cho đề xuất công nghệ");
      await negotiatingMessageApi.sendOffer({
        technology_propose: proposalId,
        message: offerData.message,
        price: offerData.price,
        content: offerData.content,
      });

      // Refresh data to get the latest information
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
  // Người tạo TechnologyPropose (proposal.user) là người có thể gửi đề xuất
  // Người nhận (chủ công nghệ) thì không có nút gửi đề xuất
  const isProposalCreator = proposal?.user?.id === currentUser?.id;
  const canSendOffer =
    isTechnologyPropose && isProposalCreator && proposal?.status === "negotiating";
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
    // Context
    isTechnologyPropose,
    // Refresh
    reloadProposal: fetchProposalDetails,
  };
};

import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { useAuthStore } from "@/store/auth";
import { 
  getServiceTicketById, 
  updateServiceTicket, 
  createServiceTicketLog,
  getServiceTicketLogs
} from "@/api/service-ticket";
import { getServices } from "@/api/services";
import { getTechnologiesByUser } from "@/api/technologies";
import { getProjectsByUser } from "@/api/projects";
import { uploadFiles } from "@/api/media";
import type { ServiceTicket } from "@/types/service-ticket";
import type { ServiceTicketLog } from "@/types/service_ticket_logs";
import type { Service } from "@/types/services";
import type { Technology } from "@/types/technologies";
import type { Project } from "@/types/project";

interface UseTicketNegotiationProps {
  ticketId: string;
}

interface PendingMessage {
  content: string;
  attachments: File[];
}

export const useTicketNegotiation = ({ ticketId }: UseTicketNegotiationProps) => {
  const user = useAuthStore((state) => state.user);

  // Data states
  const [ticket, setTicket] = useState<ServiceTicket | null>(null);
  const [logs, setLogs] = useState<ServiceTicketLog[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [userTechnologies, setUserTechnologies] = useState<Technology[]>([]);
  const [userProjects, setUserProjects] = useState<Project[]>([]);

  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Message states
  const [pendingMessage, setPendingMessage] = useState<PendingMessage | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);

  // Fetch ticket data
  const fetchTicket = useCallback(async () => {
    if (!ticketId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const ticketData = await getServiceTicketById(ticketId);
      setTicket(ticketData);
      
      // Fetch logs
      const logsData = await getServiceTicketLogs(ticketId);
      const logsList = (logsData as any)?.docs || (logsData as any)?.data || (Array.isArray(logsData) ? logsData : []) || [];
      setLogs(logsList as ServiceTicketLog[]);
      
    } catch (err: any) {
      setError(err?.message || "Không thể tải thông tin phiếu dịch vụ");
      message.error(err?.message || "Không thể tải thông tin phiếu dịch vụ");
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  // Fetch services
  const fetchServices = useCallback(async () => {
    try {
      const res = await getServices({ search: "" }, { limit: 100, page: 1, sort: "-createdAt" });
      const list = (res as any)?.docs || (res as any)?.data || (Array.isArray(res) ? res : []) || [];
      setServices(list as Service[]);
    } catch (err) {
      // ignore quietly
    }
  }, []);

  // Fetch user technologies
  const fetchUserTechnologies = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await getTechnologiesByUser(String(user.id), { limit: 100, page: 1, sort: "-createdAt" });
      const list = (res as any)?.docs || (res as any)?.data || (Array.isArray(res) ? res : []) || [];
      setUserTechnologies(list as Technology[]);
    } catch (err) {
      // ignore quietly
    }
  }, [user?.id]);

  // Fetch user projects
  const fetchUserProjects = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await getProjectsByUser(String(user.id), { limit: 100, page: 1, sort: "-createdAt" });
      const list = (res as any)?.docs || (res as any)?.data || (Array.isArray(res) ? res : []) || [];
      setUserProjects(list as Project[]);
    } catch (err) {
      // ignore quietly
    }
  }, [user?.id]);

  // Send message/log
  const handleSendMessage = useCallback(async (values: { message: string }) => {
    if (!user?.id || !ticket?.id) {
      message.warning("Bạn cần đăng nhập để gửi tin nhắn");
      return;
    }

    setPendingMessage({
      content: values.message,
      attachments: [...attachments],
    });
    setShowConfirmModal(true);
  }, [user?.id, ticket?.id, attachments]);

  // Confirm send message
  const confirmSendMessage = useCallback(async () => {
    if (!pendingMessage || !user?.id || !ticket?.id) return;

    try {
      setSendingMessage(true);
      
      // Upload files if any
      let documentIds: string[] = [];
      if (pendingMessage.attachments.length > 0) {
        const uploaded = await uploadFiles(pendingMessage.attachments);
        documentIds = uploaded.map((file: any) => String(file.id || file._id));
      }

      // Create log entry
      const logData: Partial<ServiceTicketLog> = {
        service_ticket: ticket as any, // Pass the ticket object
        user: user as any, // Pass the user object
        content: pendingMessage.content,
        document: documentIds.length > 0 ? documentIds[0] as any : undefined,
        status: "approved", // Default status
        reason: "",
      };

      await createServiceTicketLog(logData);
      
      message.success("Đã gửi tin nhắn thành công");
      setPendingMessage(null);
      setAttachments([]);
      setShowConfirmModal(false);
      
      // Refresh ticket data
      await fetchTicket();
      
    } catch (err: any) {
      message.error(err?.message || "Gửi tin nhắn thất bại");
    } finally {
      setSendingMessage(false);
    }
  }, [pendingMessage, user?.id, ticket?.id, fetchTicket]);

  // Handle file upload
  const handleFileUpload = useCallback(async (files: File[]) => {
    setAttachments(prev => [...prev, ...files]);
  }, []);

  // Remove attachment
  const removeAttachment = useCallback((index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Handle status update
  const handleStatusUpdate = useCallback(async (newStatus: string, reason?: string) => {
    if (!ticket?.id) return;

    try {
      setUpdatingStatus(true);
      
      const updateData: any = { status: newStatus };
      if (reason) {
        updateData.reason = reason;
      }

      await updateServiceTicket(String(ticket.id), updateData);
      
      message.success("Cập nhật trạng thái thành công");
      
      // Refresh ticket data
      await fetchTicket();
      
    } catch (err: any) {
      message.error(err?.message || "Cập nhật trạng thái thất bại");
    } finally {
      setUpdatingStatus(false);
    }
  }, [ticket?.id, fetchTicket]);

  // Confirm status update
  const confirmStatusUpdate = useCallback(async (newStatus: string, reason?: string) => {
    await handleStatusUpdate(newStatus, reason);
  }, [handleStatusUpdate]);

  // Format file size
  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }, []);

  // Reload ticket
  const reloadTicket = useCallback(() => {
    fetchTicket();
  }, [fetchTicket]);

  // Initial load
  useEffect(() => {
    fetchTicket();
    fetchServices();
    fetchUserTechnologies();
    fetchUserProjects();
  }, [fetchTicket, fetchServices, fetchUserTechnologies, fetchUserProjects]);

  return {
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
    reloadTicket,
  };
};

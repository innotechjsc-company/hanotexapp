"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useAuthStore } from "@/store/auth";
import { Demand } from "@/types/demand";
import { Category } from "@/types/categories";
import { useCategories } from "@/hooks/useCategories";
import { getDemandsByUser, deleteDemand, updateDemand } from "@/api/demands";
import { uploadFile, deleteFile } from "@/api/media";
import { PAYLOAD_API_BASE_URL } from "@/api/config";

export interface UseMyDemandsOptions {
  redirectToLogin?: boolean;
}

export function useMyDemands(options: UseMyDemandsOptions = {}) {
  const { redirectToLogin = true } = options;

  const router = useRouter();
  const user = useUser();
  const { isAuthenticated } = useAuthStore();

  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDemand, setSelectedDemand] = useState<Demand | null>(null);
  const [editFormData, setEditFormData] = useState<
    Partial<Demand> & { category?: string }
  >({});
  const [editLoading, setEditLoading] = useState(false);

  // File management states for edit modal
  const [existingDocuments, setExistingDocuments] = useState<any[]>([]);
  const [originalDocuments, setOriginalDocuments] = useState<any[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [deletingFileIds, setDeletingFileIds] = useState<Set<number>>(
    new Set()
  );

  // Categories
  const { categories } = useCategories();

  const fetchUserDemands = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const response = await getDemandsByUser(user.id as string);
      setDemands(response.docs?.flat() || []);
    } catch (err: any) {
      console.error("Error fetching demands:", err);
      setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  // Modal handlers
  const handleViewDemand = (demand: Demand) => {
    setSelectedDemand(demand);
    setViewModalOpen(true);
  };

  const handleEditDemand = (demand: Demand) => {
    setSelectedDemand(demand);
    setEditFormData({
      title: demand.title,
      description: demand.description,
      category:
        typeof demand.category === "string"
          ? demand.category
          : (demand.category as any)?.id || "",
      trl_level: demand.trl_level,
      option: demand.option,
      option_technology: demand.option_technology,
      option_rule: demand.option_rule,
      from_price: demand.from_price,
      to_price: demand.to_price,
      cooperation: demand.cooperation,
    });

    const documents = demand.documents || [];
    setExistingDocuments(documents);
    setOriginalDocuments(documents);
    setSelectedFiles([]);
    setDeletingFileIds(new Set());
    setEditModalOpen(true);
  };

  const handleDeleteClick = (demand: Demand) => {
    setSelectedDemand(demand);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDemand?.id) return;
    try {
      setDeletingIds((prev) => new Set(prev).add(selectedDemand.id!));
      await deleteDemand(selectedDemand.id);
      setDemands((prev) => prev.filter((d) => d.id !== selectedDemand.id));
      setDeleteModalOpen(false);
      setSelectedDemand(null);
    } catch (err: any) {
      console.error("Error deleting demand:", err);
      setError(err.message || "Có lỗi xảy ra khi xóa nhu cầu");
    } finally {
      setDeletingIds((prev) => {
        const ns = new Set(prev);
        if (selectedDemand?.id) ns.delete(selectedDemand.id);
        return ns;
      });
    }
  };

  // Edit form handlers
  const handleEditSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedDemand?.id) return;
    try {
      setEditLoading(true);

      // Upload new files if any
      let newDocumentIds: number[] = [];
      if (selectedFiles.length > 0) {
        setUploadingFiles(true);
        try {
          const uploadPromises = selectedFiles.map((file) => uploadFile(file));
          const uploadedFiles = await Promise.all(uploadPromises);
          newDocumentIds = uploadedFiles.map((file) => file.id);
        } catch (uploadError) {
          console.error("Error uploading files:", uploadError);
          throw new Error("Lỗi khi tải lên tài liệu");
        } finally {
          setUploadingFiles(false);
        }
      }

      // If user selected new files, replace existing documents, else keep current ones
      const allDocumentIds =
        newDocumentIds.length > 0
          ? newDocumentIds
          : existingDocuments.map((doc) => doc.id);

      const updateData = {
        ...editFormData,
        documents: allDocumentIds as any,
      } as Partial<Demand>;

      await updateDemand(selectedDemand.id, updateData);

      // Reset and refetch
      setEditModalOpen(false);
      setSelectedDemand(null);
      setEditFormData({});
      setSelectedFiles([]);
      setExistingDocuments([]);
      setOriginalDocuments([]);
      await fetchUserDemands();
    } catch (err: any) {
      console.error("Error updating demand:", err);
      setError(err.message || "Lỗi khi cập nhật nhu cầu");
    } finally {
      setEditLoading(false);
      setUploadingFiles(false);
    }
  };

  const handleEditFormChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      | { target: { name: string; value: any } }
  ) => {
    const { name, value } = (e as any).target;
    setEditFormData((prev) => ({
      ...prev,
      [name]:
        name === "trl_level" || name === "from_price" || name === "to_price"
          ? value
            ? parseInt(String(value))
            : 0
          : value,
    }));
  };

  // Files
  const handleFileSelection = (files: File[]) => {
    setSelectedFiles(files);
    setExistingDocuments([]);
  };

  const handleRemoveSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRestoreOriginalDocuments = () => {
    setExistingDocuments(originalDocuments);
    setSelectedFiles([]);
  };

  const handleRemoveExistingDocument = async (documentId: number) => {
    setDeletingFileIds((prev) => new Set(prev).add(documentId));
    try {
      await deleteFile(documentId);
      setExistingDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
    } catch (error) {
      console.error("Error deleting document:", error);
    } finally {
      setDeletingFileIds((prev) => {
        const ns = new Set(prev);
        ns.delete(documentId);
        return ns;
      });
    }
  };

  const handleOpenDocument = (document: any) => {
    if (document?.url) {
      const cmsBaseUrl = PAYLOAD_API_BASE_URL?.replace("/api", "");
      const fullUrl = document.url.startsWith("http")
        ? document.url
        : `${cmsBaseUrl}${document.url}`;
      window.open(fullUrl, "_blank", "noopener,noreferrer");
    }
  };

  const closeModals = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setDeleteModalOpen(false);
  };

  // Auth + data load
  useEffect(() => {
    if (!isAuthenticated) {
      if (redirectToLogin) router.push("/auth/login");
      return;
    }
    if (user?.id) {
      fetchUserDemands();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, isAuthenticated]);

  const stats = useMemo(() => {
    return {
      total: demands.length,
      documents: demands.reduce(
        (sum, d) => sum + (d.documents?.length || 0),
        0
      ),
      withPrice: demands.filter((d) => d.from_price > 0 || d.to_price > 0).length,
      withDocuments: demands.filter((d) => (d.documents?.length || 0) > 0).length,
    };
  }, [demands]);

  return {
    // state
    demands,
    loading,
    error,
    stats,
    selectedDemand,
    viewModalOpen,
    editModalOpen,
    deleteModalOpen,
    editFormData,
    editLoading,
    categories,
    existingDocuments,
    selectedFiles,
    uploadingFiles,
    deletingFileIds,
    deletingIds,

    // actions
    fetchUserDemands,
    handleViewDemand,
    handleEditDemand,
    handleDeleteClick,
    handleConfirmDelete,
    handleEditSubmit,
    handleEditFormChange,
    handleFileSelection,
    handleRemoveSelectedFile,
    handleRestoreOriginalDocuments,
    handleRemoveExistingDocument,
    handleOpenDocument,
    closeModals,
    setViewModalOpen,
    setEditModalOpen,
    setDeleteModalOpen,
    setEditFormData,
  } as const;
}


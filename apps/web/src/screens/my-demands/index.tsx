"use client";

import { Alert } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import HeaderSection from "./components/Header";
import DemandsList from "./components/DemandsList";
import ViewDemandModal from "./components/ViewDemandModal";
import EditDemandModal from "./components/EditDemandModal";
import DeleteDemandModal from "./components/DeleteDemandModal";
import ProposalsModal from "./components/ProposalsModal";
import { useMyDemands } from "./hooks/useMyDemands";

export default function MyDemandsScreen() {
  const router = useRouter();
  const [proposalsModalOpen, setProposalsModalOpen] = useState(false);
  const [proposalsDemand, setProposalsDemand] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const {
    // state
    demands,
    loading,
    error,
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
    handleViewDemand,
    handleEditDemand,
    handleDeleteClick,
    handleConfirmDelete,
    handleEditSubmit,
    handleEditFormChange,
    handleFileSelection,
    handleRestoreOriginalDocuments,
    handleRemoveExistingDocument,
    handleOpenDocument,
    setEditFormData,
    setViewModalOpen,
    setEditModalOpen,
    setDeleteModalOpen,
  } = useMyDemands();

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <HeaderSection onCreateNew={() => router.push("/demands/register")} />

      {error && (
        <div style={{ maxWidth: 1200, margin: "16px auto", padding: "0 16px" }}>
          <Alert type="error" message={error} showIcon closable />
        </div>
      )}

      {/* Stats removed as requested */}

      <DemandsList
        loading={loading}
        demands={demands}
        deletingIds={deletingIds}
        onView={handleViewDemand}
        onViewProposals={(demand) => {
          const id = (demand as any)?.id || (demand as any)?._id;
          const title = (demand as any)?.title || "";
          if (id) {
            setProposalsDemand({ id: String(id), title: String(title) });
            setProposalsModalOpen(true);
          }
        }}
        onEdit={handleEditDemand}
        onDelete={handleDeleteClick}
      />

      <ViewDemandModal
        open={viewModalOpen}
        demand={selectedDemand}
        onClose={() => setViewModalOpen(false)}
        onOpenDocument={handleOpenDocument}
      />

      <EditDemandModal
        open={editModalOpen}
        data={editFormData}
        categories={categories}
        existingDocuments={existingDocuments}
        selectedFiles={selectedFiles}
        uploadingFiles={uploadingFiles}
        editLoading={editLoading}
        deletingFileIds={deletingFileIds}
        onClose={() => setEditModalOpen(false)}
        onSubmit={() => handleEditSubmit()}
        onChange={handleEditFormChange}
        onSelectCategory={(value) =>
          setEditFormData((prev) => ({ ...prev, category: value }))
        }
        onSelectFiles={(files) => handleFileSelection(files)}
        onRemoveExistingDocument={(id) => handleRemoveExistingDocument(id)}
        onRestoreOriginalDocuments={handleRestoreOriginalDocuments}
      />

      <DeleteDemandModal
        open={deleteModalOpen}
        demand={selectedDemand}
        confirmLoading={
          selectedDemand?.id ? deletingIds.has(selectedDemand.id) : false
        }
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <ProposalsModal
        isOpen={proposalsModalOpen}
        onOpenChange={(open) => setProposalsModalOpen(open)}
        demandId={proposalsDemand?.id || null}
        demandTitle={proposalsDemand?.title}
      />
    </div>
  );
}

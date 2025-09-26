"use client";

import { Alert } from "antd";
import { useRouter } from "next/navigation";
import HeaderSection from "./components/Header";
import StatsCards from "./components/StatsCards";
import DemandsList from "./components/DemandsList";
import ViewDemandModal from "./components/ViewDemandModal";
import EditDemandModal from "./components/EditDemandModal";
import DeleteDemandModal from "./components/DeleteDemandModal";
import { useMyDemands } from "./hooks/useMyDemands";

export default function MyDemandsScreen() {
  const router = useRouter();

  const {
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
      <HeaderSection onCreateNew={() => router.push("/demands/register")}/>

      {error && (
        <div style={{ maxWidth: 1120, margin: "16px auto", padding: "0 16px" }}>
          <Alert
            type="error"
            message={error}
            showIcon
            closable
          />
        </div>
      )}

      <StatsCards loading={loading} stats={stats} />

      <DemandsList
        loading={loading}
        demands={demands}
        deletingIds={deletingIds}
        onView={handleViewDemand}
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
        onSelectCategory={(value) => setEditFormData((prev) => ({ ...prev, category: value }))}
        onSelectFiles={(files) => handleFileSelection(files)}
        onRemoveExistingDocument={(id) => handleRemoveExistingDocument(id)}
        onRestoreOriginalDocuments={handleRestoreOriginalDocuments}
      />

      <DeleteDemandModal
        open={deleteModalOpen}
        demand={selectedDemand}
        confirmLoading={selectedDemand?.id ? deletingIds.has(selectedDemand.id) : false}
        onCancel={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

"use client";

import { Card, Divider } from "antd";
import { Toaster } from "react-hot-toast";
import { useMyTechnologies } from "./hooks/useMyTechnologies";
import {
  HeaderSection,
  StatsCard,
  FiltersSection,
  TechnologiesTable,
  PaginationSection,
  BulkDeleteModal,
  ProposalsModal,
  AddTechnologyModal,
  EditTechnologyModal,
  ViewTechnologyModal,
  DeleteTechnologyModal,
} from "./components";

export default function MyTechnologiesScreen() {
  const {
    // Data state
    items,
    categories,
    current,
    setCurrent,

    // Loading states
    isLoading,
    actionLoading,

    // Filters and pagination
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    limit,
    setLimit,
    totalDocs,
    totalPages,

    // Selection state
    selectedCount,

    // Computed data
    filteredItems,

    // Modal disclosures
    addDisclosure,
    editDisclosure,
    viewDisclosure,
    deleteDisclosure,
    bulkDeleteDisclosure,
    proposalsDisclosure,

    // Actions
    handleCreate,
    handleUpdate,
    handleDelete,
    handleBulkDelete,

    // User data
    user,
  } = useMyTechnologies();

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderSection
        selectedCount={selectedCount}
        user={user}
        onBulkDelete={bulkDeleteDisclosure.onOpen}
      />

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-6">
          <Card>
            <div className="flex flex-col gap-3 p-6">
              <div className="flex items-center justify-between w-full">
                <StatsCard totalDocs={totalDocs} items={items} />
                <FiltersSection
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  search={search}
                  setSearch={setSearch}
                  setPage={setPage}
                />
              </div>
            </div>
            <Divider />
            <div className="p-6">
              <TechnologiesTable
                filteredItems={filteredItems}
                isLoading={isLoading}
                selectedCount={selectedCount}
                setCurrent={setCurrent}
                onView={viewDisclosure.onOpen}
                onEdit={editDisclosure.onOpen}
                onDelete={deleteDisclosure.onOpen}
                onViewProposals={proposalsDisclosure.onOpen}
                user={user}
              />
            </div>
          </Card>

          <PaginationSection
            items={items}
            totalDocs={totalDocs}
            totalPages={totalPages}
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Modals */}
      <AddTechnologyModal
        disclosure={addDisclosure}
        current={current}
        setCurrent={setCurrent}
        onCreate={handleCreate}
        loading={actionLoading}
        categories={categories}
      />
      <EditTechnologyModal
        disclosure={editDisclosure}
        current={current}
        setCurrent={setCurrent}
        onUpdate={handleUpdate}
        loading={actionLoading}
        categories={categories}
      />
      <ViewTechnologyModal
        disclosure={viewDisclosure as any}
        current={current}
        categories={categories}
      />
      <DeleteTechnologyModal
        disclosure={deleteDisclosure}
        current={current}
        onDelete={handleDelete}
        loading={actionLoading}
      />
      <BulkDeleteModal
        isOpen={bulkDeleteDisclosure.isOpen}
        onOpenChange={bulkDeleteDisclosure.onOpenChange}
        selectedCount={selectedCount}
        onConfirm={handleBulkDelete}
        loading={actionLoading}
      />
      <ProposalsModal
        isOpen={proposalsDisclosure.isOpen}
        onOpenChange={proposalsDisclosure.onOpenChange}
        technologyId={current?.id || (current as any)?._id || null}
        technologyTitle={current?.title || ""}
      />

      <Toaster position="top-right" />
    </div>
  );
}

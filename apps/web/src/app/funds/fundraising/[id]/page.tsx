"use client";

import { useParams, useRouter } from "next/navigation";
import { Card, Col, Row, Space } from "antd";
import { useUser } from "@/store/auth";
import {
  LoadingState,
  ErrorState,
  Breadcrumb,
  ProjectHeader,
  ProjectStatistics,
  ProjectInfo,
  TechnologiesSection,
  InvestmentFundSection,
  FinancialDocuments,
  FinancialInfo,
  ProjectOwnerCard,
  InvestmentCTA,
  ProposalModal,
} from "@/screens/fundraising-detail/components";
import {
  useFundraisingProject,
  useProposalStatus,
  useProposalSubmission,
} from "@/screens/fundraising-detail/hooks";

export default function FundraisingProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const currentUser = useUser();

  // Custom hooks for data fetching and state management
  const { project, isLoading, error } = useFundraisingProject(projectId);
  const { hasExistingProposal, setHasExistingProposal } = useProposalStatus(
    projectId,
    currentUser?.id
  );
  const {
    form,
    isProposalModalOpen,
    isSubmittingProposal,
    proposalFiles,
    setProposalFiles,
    handleSendProposal,
    handleSubmitProposal,
    handleCancelProposal,
  } = useProposalSubmission({
    project,
    projectId,
    currentUserId: currentUser?.id,
    hasExistingProposal,
    setHasExistingProposal,
  });

  // Loading and error states
  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !project) {
    return <ErrorState error={error} />;
  }

  // Main render
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Breadcrumb */}
      <Breadcrumb status={project?.status || ""} onBack={() => router.back()} />

      {/* Project Header and Statistics */}
      <Card
        className="mb-6 shadow-sm"
        bodyStyle={{ padding: 24 }}
        style={{ marginTop: 20 }}
      >
        <ProjectHeader project={project} />
        <ProjectStatistics project={project} />
      </Card>

      {/* Project Details */}
      <Row gutter={[24, 24]} align="stretch">
        <Col xs={24} lg={16}>
          <ProjectInfo project={project} />
          <TechnologiesSection project={project} />
          <InvestmentFundSection project={project} />
          <FinancialDocuments project={project} />
        </Col>

        <Col xs={24} lg={8}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <FinancialInfo project={project} />
            <ProjectOwnerCard project={project} />
            <InvestmentCTA
              project={project}
              currentUserId={currentUser?.id}
              hasExistingProposal={hasExistingProposal}
              onSendProposal={handleSendProposal}
            />
          </Space>
        </Col>
      </Row>

      {/* Investment Proposal Modal */}
      <ProposalModal
        open={isProposalModalOpen}
        form={form}
        isSubmitting={isSubmittingProposal}
        proposalFiles={proposalFiles}
        onSubmit={handleSubmitProposal}
        onCancel={handleCancelProposal}
        onFilesChange={setProposalFiles}
      />
    </div>
  );
}

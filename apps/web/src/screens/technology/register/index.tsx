"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useIsAuthenticated, useIsLoading } from "@/store/auth";
import { useMasterData } from "@/hooks/useMasterData";
import { ArrowLeft, Save, Eye, AlertCircle } from "lucide-react";
import {
  // Import từ store mới
  useRegisterTechnologyStore,
  useFormData,
  useOwners,
  useIPDetails,
  useDocuments,
  useLegalTerritory,
  usePricing,
  useInvestmentTransfer,
  useConfirmUpload,
  useShowOptionalFields,
  useSubmitLoading,
  useOCRLoading,
  useIPSaveLoading,
  useSubmitError,
  useSubmitSuccess,
  useOCRError,
  useOCRResult,
  useRegisterActions,
} from "@/store/registerTechnology";
import {
  BasicInfoSection,
  TechnologyOwnersSection,
  IPSection,
  LegalTerritorySection,
  InvestmentTransferSection,
  PricingDesiredSection,
  VisibilityNDASection,
} from "./components";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Spinner,
  Checkbox,
} from "@heroui/react";

export default function RegisterTechnologyPage() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const authLoading = useIsLoading();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // Master Data
  const {
    masterData,
    loading: masterDataLoading,
    error: masterDataError,
  } = useMasterData();

  // Store state selectors
  const formData = useFormData();
  const owners = useOwners();
  const ipDetails = useIPDetails();
  const documents = useDocuments();
  const legalTerritory = useLegalTerritory();
  const pricing = usePricing();
  const investmentTransfer = useInvestmentTransfer();
  const confirmUpload = useConfirmUpload();
  const showOptionalFields = useShowOptionalFields();

  // Loading states
  const submitLoading = useSubmitLoading();
  const ocrLoading = useOCRLoading();
  const ipSaveLoading = useIPSaveLoading();

  // Error & Success states
  const submitError = useSubmitError();
  const submitSuccess = useSubmitSuccess();
  const ocrError = useOCRError();
  const ocrResult = useOCRResult();

  // Store actions
  const actions = useRegisterActions();

  // File upload handler with OCR processing
  const handleFileUploadWithOCR = (files: FileList | null) => {
    actions.handleFileUpload(
      files,
      undefined, // Success callback already handled in store
      (error) => {
        console.error("File upload error:", error);
        actions.setSubmitError(error.message as string | null);
      }
    );
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    actions.clearMessages();

    // Submit technology using store action
    const success = await actions.submitTechnology();

    if (success) {
      // Navigate to success page or dashboard
      setTimeout(() => {
        router.push("/technologies");
      }, 3000);
    }
  };

  // Debug auth state
  useEffect(() => {
    console.log("Auth State Debug:", {
      isAuthenticated,
      authLoading,
      hasCheckedAuth,
    });
  }, [isAuthenticated, authLoading, hasCheckedAuth]);

  // Authentication check with proper loading handling
  useEffect(() => {
    // Wait for auth to finish loading
    if (!authLoading) {
      setHasCheckedAuth(true);
      if (!isAuthenticated) {
        console.log("User not authenticated, redirecting to home");
        router.push("/");
      }
    }
  }, [authLoading, isAuthenticated, router]);

  // Load IP draft data on component mount
  useEffect(() => {
    if (hasCheckedAuth && isAuthenticated) {
      const draftData = actions.loadIPFromDraft();
      if (draftData.length > 0) {
        console.log("Loaded IP draft data:", draftData);
      }
    }
  }, [hasCheckedAuth, isAuthenticated]);

  // Show loading while auth is being checked
  if (authLoading || !hasCheckedAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" className="mb-4" />
          <p className="text-gray-600">Đang kiểm tra xác thực...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" className="mb-4" />
          <p className="text-gray-600">Đang chuyển hướng về trang chủ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button
                isIconOnly
                variant="light"
                onClick={() => router.back()}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Đăng ký công nghệ
                </h1>
                <p className="text-gray-600">
                  Đăng ký công nghệ mới lên sàn giao dịch HANOTEX
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="bordered"
                startContent={<Eye className="h-4 w-4" />}
                className="text-gray-700"
              >
                Xem trước
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Messages */}
          {(submitError || masterDataError || ocrError) && (
            <Card className="bg-red-50 border-red-200">
              <CardBody className="flex flex-row items-center text-red-600">
                <AlertCircle className="h-5 w-5 mr-2" />
                {submitError || masterDataError || ocrError}
              </CardBody>
            </Card>
          )}

          {/* Loading Messages */}
          {masterDataLoading && (
            <Card className="bg-blue-50 border-blue-200">
              <CardBody className="flex flex-row items-center text-blue-600">
                <Spinner size="sm" color="primary" className="mr-2" />
                Đang tải dữ liệu...
              </CardBody>
            </Card>
          )}

          {/* Success Messages */}
          {submitSuccess && (
            <Card className="bg-green-50 border-green-200">
              <CardBody className="text-green-600">{submitSuccess}</CardBody>
            </Card>
          )}

          {/* 1. Basic Information */}
          <BasicInfoSection
            formData={formData}
            masterData={masterData as any}
            masterDataLoading={masterDataLoading}
            showOptionalFields={showOptionalFields}
            setShowOptionalFields={actions.setShowOptionalFields}
            ocrLoading={ocrLoading}
            ocrResult={ocrResult}
            onChange={actions.handleFieldChange}
            onFileUpload={handleFileUploadWithOCR}
            onRemoveDocument={actions.removeDocument}
          />

          {/* 2. Technology Owners */}
          <TechnologyOwnersSection
            owners={owners}
            onAddOwner={actions.addOwner}
            onRemoveOwner={actions.removeOwner}
            onUpdateOwner={actions.updateOwner}
          />

          {/* 3. IP Details */}
          <IPSection
            ipDetails={ipDetails}
            masterData={masterData as any}
            masterDataLoading={masterDataLoading}
            onAddIPDetail={actions.addIPDetail}
            onRemoveIPDetail={actions.removeIPDetail}
            onUpdateIPDetail={actions.updateIPDetail}
            onSaveAsDraft={async () => actions.saveIPAsDraft()}
            onLoadFromDraft={actions.loadIPFromDraft}
            ipSaveLoading={ipSaveLoading}
          />

          {/* 4. Legal Territory */}
          <LegalTerritorySection
            legalTerritory={legalTerritory}
            masterData={masterData as any}
            masterDataLoading={masterDataLoading}
            onProtectionTerritoryChange={actions.handleTerritoryChange}
            onCertificationChange={actions.handleCertificationChange}
            onFileUpload={(files) => {
              if (files) {
                Array.from(files).forEach((file) => {
                  actions.addLocalCertificationFile(file);
                });
              }
            }}
            onRemoveFile={actions.removeLocalCertificationFile}
          />

          {/* 6. Investment & Transfer (Optional) */}
          <InvestmentTransferSection
            investmentTransfer={investmentTransfer}
            masterData={masterData as any}
            masterDataLoading={masterDataLoading}
            onCommercializationChange={
              actions.handleCommercializationMethodChange
            }
            onTransferMethodChange={actions.handleTransferMethodChange}
          />

          {/* 7. Pricing & Desired Price (Optional) */}
          <PricingDesiredSection
            pricing={pricing}
            investmentStage={investmentTransfer.investmentStage}
            onChange={actions.handleFieldChange}
          />

          {/* 8. Visibility & NDA (Optional) */}
          <VisibilityNDASection
            visibilityMode={formData.visibilityMode}
            onChange={actions.handleFieldChange as any}
          />

          {/* Confirmation checkbox */}
          <Card>
            <CardBody className="p-4">
              <Checkbox
                isSelected={confirmUpload}
                onValueChange={actions.setConfirmUpload}
                classNames={{ label: "text-sm text-gray-700" }}
              >
                Tôi xác nhận sẽ tải lên và cung cấp thông tin sản phẩm công nghệ
                theo đúng quy định.
              </Checkbox>
            </CardBody>
          </Card>

          {/* Submit Button - only visible when confirmed */}
          {confirmUpload && (
            <div className="flex justify-end space-x-3">
              <Button variant="bordered" onClick={() => router.back()}>
                Hủy
              </Button>
              <Button
                type="submit"
                color="primary"
                isLoading={submitLoading}
                startContent={!submitLoading && <Save className="h-4 w-4" />}
                isDisabled={submitLoading}
              >
                {submitLoading ? "Đang xử lý..." : "Đăng ký công nghệ"}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

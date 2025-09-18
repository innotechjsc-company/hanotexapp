"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useIsAuthenticated, useIsLoading } from "@/store/auth";
import { useMasterData } from "@/hooks/useMasterData";
import { ArrowLeft, Save, Eye, AlertCircle } from "lucide-react";
import { useFormData, useRegisterTechnology, useOCR } from "./hooks";
import {
  BasicInfoSection,
  TechnologyOwnersSection,
  IPSection,
} from "./components";
import { Card, CardBody, CardHeader, Button, Spinner } from "@heroui/react";

export default function RegisterTechnologyPage() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const authLoading = useIsLoading();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const {
    masterData,
    loading: masterDataLoading,
    error: masterDataError,
  } = useMasterData();

  // Custom hooks for form management
  const formManager = useFormData();
  const {
    loading: submitLoading,
    error: submitError,
    success: submitSuccess,
    showOptionalFields,
    setShowOptionalFields,
    submitTechnology,
    handleFileUpload,
    clearMessages,
  } = useRegisterTechnology();

  const {
    loading: ocrLoading,
    result: ocrResult,
    error: ocrError,
    processOCR,
  } = useOCR();

  // File upload handler with OCR processing
  const handleFileUploadWithOCR = useCallback(
    async (files: FileList | null) => {
      if (!files) return;

      handleFileUpload(
        files,
        (file) => {
          formManager.addDocument(file);

          // Process OCR for PDF and image files
          if (
            file.type === "application/pdf" ||
            file.type.startsWith("image/")
          ) {
            processOCR(file).then((result) => {
              if (result && result.success && result.extractedData) {
                formManager.updateFormDataFromOCR(result.extractedData);
              }
            });
          }
        },
        (error) => {
          // Handle file upload errors through the form manager or show alerts
          console.error("File upload error:", error);
        }
      );
    },
    [handleFileUpload, formManager, processOCR]
  );

  // Form submission handler
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      clearMessages();

      const success = await submitTechnology(formManager.formData);
      if (success) {
        formManager.resetForm();
      }
    },
    [submitTechnology, formManager, clearMessages]
  );

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
            formData={formManager.formData}
            masterData={masterData as any}
            masterDataLoading={masterDataLoading}
            showOptionalFields={showOptionalFields}
            setShowOptionalFields={setShowOptionalFields}
            ocrLoading={ocrLoading}
            ocrResult={ocrResult}
            onChange={formManager.handleChange}
            onFileUpload={handleFileUploadWithOCR}
            onRemoveDocument={formManager.removeDocument}
          />

          {/* 2. Technology Owners */}
          <TechnologyOwnersSection
            owners={formManager.formData.owners}
            onAddOwner={formManager.addOwner}
            onRemoveOwner={formManager.removeOwner}
            onUpdateOwner={formManager.updateOwner}
          />

          {/* 3. IP Details */}
          <IPSection
            ipDetails={formManager.formData.ipDetails}
            masterData={masterData as any}
            masterDataLoading={masterDataLoading}
            onAddIPDetail={formManager.addIPDetail}
            onRemoveIPDetail={formManager.removeIPDetail}
            onUpdateIPDetail={formManager.updateIPDetail}
          />

          {/* Submit Button */}
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
        </form>
      </div>
    </div>
  );
}

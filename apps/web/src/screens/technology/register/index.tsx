"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useIsAuthenticated, useIsLoading } from "@/store/auth";
import { useMasterData } from "@/hooks/useMasterData";
import { ArrowLeft, Save, Eye, AlertCircle } from "lucide-react";
import { useFormData, useRegisterTechnology, useOCR } from "./hooks";
import {
  SubmitterInfoSection,
  BasicInfoSection,
  TechnologyOwnersSection,
  IPSection,
} from "./components";

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
    console.log('Auth State Debug:', { 
      isAuthenticated, 
      authLoading, 
      hasCheckedAuth 
    });
  }, [isAuthenticated, authLoading, hasCheckedAuth]);

  // Authentication check with proper loading handling
  useEffect(() => {
    // Wait for auth to finish loading
    if (!authLoading) {
      setHasCheckedAuth(true);
      if (!isAuthenticated) {
        console.log('User not authenticated, redirecting to home');
        router.push("/");
      }
    }
  }, [authLoading, isAuthenticated, router]);

  // Show loading while auth is being checked
  if (authLoading || !hasCheckedAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Đang kiểm tra xác thực...
          </p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Đang chuyển hướng về trang chủ...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
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
                <button
                  type="button"
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Xem trước
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Messages */}
          {(submitError || masterDataError || ocrError) && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {submitError || masterDataError || ocrError}
            </div>
          )}

          {/* Loading Messages */}
          {masterDataLoading && (
            <div className="bg-blue-50 border border-blue-200 text-blue-600 px-4 py-3 rounded-md flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
              Đang tải dữ liệu...
            </div>
          )}

          {/* Success Messages */}
          {submitSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
              {submitSuccess}
            </div>
          )}

          {/* 1. Submitter Information */}
          <SubmitterInfoSection
            submitter={formManager.formData.submitter}
            onChange={formManager.handleChange}
          />

          {/* 2. Basic Information */}
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

          {/* 3. Technology Owners */}
          <TechnologyOwnersSection
            owners={formManager.formData.owners}
            onAddOwner={formManager.addOwner}
            onRemoveOwner={formManager.removeOwner}
            onUpdateOwner={formManager.updateOwner}
          />

          {/* 4. IP Details */}
          <IPSection
            ipDetails={formManager.formData.ipDetails}
            masterData={masterData as any}
            masterDataLoading={masterDataLoading}
            onAddIPDetail={formManager.addIPDetail}
            onRemoveIPDetail={formManager.removeIPDetail}
            onUpdateIPDetail={formManager.updateIPDetail}
          />

          {/* Note: For now, I'm including the main sections. The remaining sections 
               (Legal Territory, Investment Transfer, Pricing, Visibility NDA) 
               can be added as separate components later if needed */}

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Đăng ký công nghệ
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

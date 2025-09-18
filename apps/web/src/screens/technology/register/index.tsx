"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useIsAuthenticated, useIsLoading } from "@/store/auth";
import { ArrowLeft, Save, Eye, AlertCircle } from "lucide-react";
import {
  TechnologyOwnersSection,
  LegalTerritorySection,
  InvestmentTransferSection,
  PricingDesiredSection,
  VisibilityNDASection,
  IPSection,
  LegalTerritorySectionRef,
} from "./components";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Spinner,
  Checkbox,
} from "@heroui/react";
import { TechnologyOwnersSectionRef } from "./components/TechnologyOwnersSection";
import { IPSectionRef } from "./components/IPSection";

export default function RegisterTechnologyPage() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const authLoading = useIsLoading();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const ownersRef = useRef<TechnologyOwnersSectionRef>(null);
  const ipRef = useRef<IPSectionRef>(null);
  const legalTerritoryRef = useRef<LegalTerritorySectionRef>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Ngăn chặn hành vi submit form mặc định
    const owners = ownersRef.current?.getOwners();
    console.log("Owners data:", owners);
    const ipDetails = ipRef.current?.getIPDetails();
    console.log("IP details:", ipDetails);
    const legalDetails = legalTerritoryRef.current?.getData();
    console.log("Legal details:", legalDetails);
  };

  // Show loading while auth is being checked
  // if (authLoading || !hasCheckedAuth) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <Spinner size="lg" color="primary" className="mb-4" />
  //         <p className="text-gray-600">Đang kiểm tra xác thực...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // // Redirect if not authenticated
  // if (!isAuthenticated) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <Spinner size="lg" color="primary" className="mb-4" />
  //         <p className="text-gray-600">Đang chuyển hướng về trang chủ...</p>
  //       </div>
  //     </div>
  //   );
  // }

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
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Error Messages */}
          {/* {(submitError || masterDataError || ocrError) && (
            <Card className="bg-red-50 border-red-200">
              <CardBody className="flex flex-row items-center text-red-600">
                <AlertCircle className="h-5 w-5 mr-2" />
                {submitError || masterDataError || ocrError}
              </CardBody>
            </Card>
          )} */}

          {/* Loading Messages */}
          {/* {masterDataLoading && (
            <Card className="bg-blue-50 border-blue-200">
              <CardBody className="flex flex-row items-center text-blue-600">
                <Spinner size="sm" color="primary" className="mr-2" />
                Đang tải dữ liệu...
              </CardBody>
            </Card>
          )} */}

          {/* Success Messages */}
          {/* {submitSuccess && (
            <Card className="bg-green-50 border-green-200">
              <CardBody className="text-green-600">{submitSuccess}</CardBody>
            </Card>
          )} */}

          {/* 1. Basic Information */}
          {/* <BasicInfoSection
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
          /> */}

          {/* 2. Technology Owners */}
          <TechnologyOwnersSection
            ref={ownersRef}
            initialOwners={[]} // Dữ liệu khởi tạo (tùy chọn)
            onChange={(owners) => console.log("Changed:", owners)} // Callback khi có thay đổi (tùy chọn)
          />

          {/* 3. IP Details */}
          <IPSection
            ref={ipRef}
            onChange={(ipDetails) => console.log("Changed:", ipDetails)} // Callback khi có thay đổi (tùy chọn)
          />

          {/* 4. Legal Territory */}
          <LegalTerritorySection
            ref={legalTerritoryRef}
            initialData={{}} // optional
            onChange={(legalDetails) => console.log("Changed:", legalDetails)} // optional
          />

          {/* 6. Investment & Transfer (Optional) */}
          {/* <InvestmentTransferSection
            investmentTransfer={investmentTransfer}
            masterData={masterData as any}
            masterDataLoading={masterDataLoading}
            onCommercializationChange={
              actions.handleCommercializationMethodChange
            }
            onTransferMethodChange={actions.handleTransferMethodChange}
          />

          {/* 7. Pricing & Desired Price (Optional) */}
          {/* <PricingDesiredSection
            pricing={pricing}
            investmentStage={investmentTransfer.investmentStage}
            onChange={actions.handleFieldChange}
          /> */}

          {/* 8. Visibility & NDA (Optional) */}
          {/* <VisibilityNDASection
            visibilityMode={formData.visibilityMode}
            onChange={actions.handleFieldChange as any}
          /> */}

          {/* Confirmation checkbox */}
          {/* <Card>
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
          </Card> */}

          {/* Submit Button - only visible when confirmed */}
          {
            <div className="flex justify-end space-x-3">
              <Button variant="bordered" onClick={() => router.back()}>
                Hủy
              </Button>
              <Button
                type="submit"
                color="primary"
                isLoading={false}
                startContent={!false && <Save className="h-4 w-4" />}
                isDisabled={false}
              >
                {"Đăng ký công nghệ"}
              </Button>
            </div>
          }
        </form>
      </div>
    </div>
  );
}

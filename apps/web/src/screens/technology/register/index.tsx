"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";
import {
  TechnologyOwnersSection,
  LegalTerritorySection,
  InvestmentTransferSection,
  PricingDesiredSection,
  VisibilityNDASection,
  IPSection,
  LegalTerritorySectionRef,
  InvestmentTransferSectionRef,
  PricingDesiredSectionRef,
  VisibilityNDASectionRef,
  BasicInfoSection,
} from "./components";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import { TechnologyOwnersSectionRef } from "./components/TechnologyOwnersSection";
import { IPSectionRef } from "./components/IPSection";
import type { BasicInfoSectionRef } from "./components/BasicInfoSection";
import MediaApi from "@/api/media";
import { createTechnology } from "@/api/technologies";
import { MediaType } from "@/types";

export default function RegisterTechnologyPage({ props }: { props?: any }) {
  const router = useRouter();
  const [confirmUpload, setConfirmUpload] = useState(false);
  const ownersRef = useRef<TechnologyOwnersSectionRef>(null);
  const ipRef = useRef<IPSectionRef>(null);
  const basicRef = useRef<BasicInfoSectionRef>(null);
  const legalTerritoryRef = useRef<LegalTerritorySectionRef>(null);
  const investmentTransferRef = useRef<InvestmentTransferSectionRef>(null);
  const pricingRef = useRef<PricingDesiredSectionRef>(null);
  const visibilityRef = useRef<VisibilityNDASectionRef>(null);

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    (async () => {
      try {
        const basic = basicRef.current?.getData();
        const owners = ownersRef.current?.getOwners();
        const ipDetails = ipRef.current?.getIPDetails();
        const legalDetails = legalTerritoryRef.current?.getData();
        const investmentTransfer = investmentTransferRef.current?.getData();
        const pricingDesired = pricingRef.current?.getData();
        const visibility = visibilityRef.current?.getData();

        // 2. Upload files using MediaApi
        const mediaApi = new MediaApi();
        const techMedia = basic?.documents?.length
          ? await mediaApi.uploadMulti(basic!.documents, {
              type: MediaType.DOCUMENT,
            })
          : [];
        const legalMedia = legalDetails?.files?.length
          ? await mediaApi.uploadMulti(legalDetails!.files, {
              type: MediaType.DOCUMENT,
            })
          : [];

        // 3. Aggregate payload aligned with Technology type
        const payload = {
          title: basic?.title || "",
          category: basic?.category, // ID string
          trl_level: Number(basic?.trl_level) || 0,
          description: basic?.description,
          confidential_detail: basic?.confidential_detail,
          // Relationship fields in Payload expect IDs
          documents: techMedia.map((m) => m.id),
          owners,
          legal_certification: legalDetails
            ? {
                protection_scope: legalDetails.protection_scope,
                standard_certifications: legalDetails.standard_certifications,
                files: legalMedia.map((m) => m.id),
              }
            : undefined,
          investment_desire: investmentTransfer?.investment_desire,
          transfer_type: investmentTransfer?.transfer_type,
          pricing: pricingDesired,
          // Server route will create related IP docs if provided
          intellectual_property:
            ipDetails && ipDetails.length ? ipDetails : undefined,
          visibility_mode: visibility?.visibility_mode,
        };

        const created = await createTechnology(payload as any);
        console.log("Created technology:", created);

        // Show success toast and navigate to technologies page
        toast.success("Đăng ký công nghệ thành công!");
        router.push("/technologies");
      } catch (err: any) {
        console.error("Submit error:", err);
        toast.error(err?.message || "Có lỗi xảy ra khi tạo công nghệ");
      } finally {
        setSubmitting(false);
      }
    })();
  };

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
          </CardHeader>
        </Card>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* 1. Basic Information */}
          <BasicInfoSection
            ref={basicRef}
            onChange={(data) => console.log("Changed:", data)} // optional
          />

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
          <InvestmentTransferSection
            ref={investmentTransferRef}
            onChange={(data) => console.log("Changed:", data)} // optional
          />

          {/* 7. Pricing & Desired Price (Optional) */}
          <PricingDesiredSection ref={pricingRef} />

          {/* 8. Visibility */}
          <VisibilityNDASection ref={visibilityRef} />

          {/* Confirmation checkbox */}
          <Card>
            <CardBody className="p-4">
              <label className="flex items-start gap-3 cursor-pointer p-2 rounded-md transition-colors">
                <input
                  type="checkbox"
                  checked={confirmUpload}
                  onChange={(e) => setConfirmUpload(e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">
                  Tôi xác nhận sẽ tải lên và cung cấp thông tin sản phẩm công
                  nghệ theo đúng quy định.
                </span>
              </label>
            </CardBody>
          </Card>

          {/* Submit Button - only visible when confirmed */}
          {
            <div className="flex justify-end space-x-3">
              <Button variant="bordered" onClick={() => router.back()}>
                Hủy
              </Button>
              <Button
                type="submit"
                color="primary"
                className="bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500"
                isLoading={submitting}
                startContent={<Save className="h-4 w-4" />}
                isDisabled={confirmUpload === false || submitting}
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

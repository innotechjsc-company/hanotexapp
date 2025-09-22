"use client";

import React, { useState, useMemo, useRef } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  Spinner,
} from "@heroui/react";
import { Upload, FileText, Trash2, Plus, Save } from "lucide-react";
import type {
  Technology,
  TechnologyStatus,
  PricingType,
  Currency,
  TechnologyOwner,
  OwnerType,
} from "@/types/technologies";
import type { Category } from "@/types/categories";
import { trlLevels } from "@/constants/technology";
import {
  BasicInfoSectionRef,
  LegalTerritorySectionRef,
  InvestmentTransferSectionRef,
  PricingDesiredSectionRef,
  VisibilityNDASectionRef,
  BasicInfoSection,
  InvestmentTransferSection,
  LegalTerritorySection,
  PricingDesiredSection,
  VisibilityNDASection,
} from "@/screens/technology/register/components";
import {
  IPSection,
  IPSectionRef,
} from "@/screens/technology/register/components/IPSection";
import {
  TechnologyOwnersSection,
  TechnologyOwnersSectionRef,
} from "@/screens/technology/register/components/TechnologyOwnersSection";
import { useRouter } from "next/navigation";
import MediaApi from "@/api/media";
import { createTechnology, updateTechnology } from "@/api/technologies";
import toast from "react-hot-toast";

type EditableTechnology = Partial<Technology> & { id?: string };

type DisclosureLike = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose?: () => void;
};

interface TechnologyModalProps {
  disclosure: DisclosureLike;
  current: EditableTechnology | null;
  setCurrent: React.Dispatch<React.SetStateAction<EditableTechnology | null>>;
  onCreate?: () => Promise<void> | void;
  onUpdate?: () => Promise<void> | void;
  loading?: boolean;
  categories: Category[];
  isEdit?: boolean;
}

export function AddTechnologyModal({
  disclosure,
  current,
  setCurrent,
  onCreate,
  loading,
  categories,
}: TechnologyModalProps) {
  const [confirmUpload, setConfirmUpload] = useState(false);
  const ownersRef = useRef<TechnologyOwnersSectionRef>(null);
  const ipRef = useRef<IPSectionRef>(null);
  const basicRef = useRef<BasicInfoSectionRef>(null);
  const legalTerritoryRef = useRef<LegalTerritorySectionRef>(null);
  const investmentTransferRef = useRef<InvestmentTransferSectionRef>(null);
  const pricingRef = useRef<PricingDesiredSectionRef>(null);
  const visibilityRef = useRef<VisibilityNDASectionRef>(null);

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<TechnologyStatus>("draft");

  const handleSubmit = (event: React.FormEvent, onClose: () => void) => {
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
          ? await mediaApi.uploadMulti(basic!.documents, { type: "document" })
          : [];
        const legalMedia = legalDetails?.files?.length
          ? await mediaApi.uploadMulti(legalDetails!.files, {
              type: "document",
            })
          : [];

        // 3. Aggregate payload aligned with Technology type
        const payload = {
          title: basic?.title || "",
          category: basic?.category, // ID string
          trl_level: basic?.trl_level || "",
          description: basic?.description,
          confidential_detail: basic?.confidential_detail,
          status: status,
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
        onClose?.();
        onCreate?.();
      } catch (err: any) {
        console.error("Submit error:", err);
        toast.error(err?.message || "Có lỗi xảy ra khi tạo công nghệ");
      } finally {
        setSubmitting(false);
      }
    })();
  };

  return (
    <Modal
      isOpen={disclosure.isOpen}
      onOpenChange={disclosure.onOpenChange}
      size="5xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-xl font-bold">
              Thêm công nghệ mới
            </ModalHeader>
            <ModalBody className="space-y-6">
              <form
                className="space-y-6"
                onSubmit={(e) => handleSubmit(e, onClose)}
              >
                {/* 1. Basic Information */}
                <BasicInfoSection
                  ref={basicRef}
                  onChange={(data) => console.log("Changed:", data)} // optional
                />

                <Card>
                  <CardHeader className="px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Trạng thái *
                    </h2>
                  </CardHeader>
                  <CardBody className="p-6 space-y-4">
                    <Select
                      label="Trạng thái"
                      placeholder="Chọn trạng thái"
                      selectedKeys={
                        current?.status ? new Set([current.status]) : new Set()
                      }
                      onSelectionChange={(keys) => {
                        const key = Array.from(keys as Set<string>)[0];
                        setCurrent((p) => ({
                          ...(p || {}),
                          status: key as TechnologyStatus,
                        }));
                        setStatus(key as TechnologyStatus);
                      }}
                      variant="bordered"
                    >
                      <SelectItem key="draft">Bản nháp</SelectItem>
                      <SelectItem key="pending">Chờ duyệt</SelectItem>
                      <SelectItem key="approved">Đã duyệt</SelectItem>
                      <SelectItem key="active">Hoạt động</SelectItem>
                      <SelectItem key="inactive">Không hoạt động</SelectItem>
                      <SelectItem key="rejected">Từ chối</SelectItem>
                    </Select>
                  </CardBody>
                </Card>

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
                  onChange={(legalDetails) =>
                    console.log("Changed:", legalDetails)
                  } // optional
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
                        Tôi xác nhận sẽ tải lên và cung cấp thông tin sản phẩm
                        công nghệ theo đúng quy định.
                      </span>
                    </label>
                  </CardBody>
                </Card>
              </form>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Hủy
              </Button>
              <Button
                type="submit"
                color="primary"
                className="bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500"
                isLoading={submitting}
                startContent={<Save className="h-4 w-4" />}
                isDisabled={confirmUpload === false || submitting}
                onPress={() => handleSubmit(event as any, onClose)}
              >
                {"Đăng ký công nghệ"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export function EditTechnologyModal({
  disclosure,
  current,
  setCurrent,
  onUpdate,
  loading,
  categories,
}: TechnologyModalProps) {
  const ownersRef = useRef<TechnologyOwnersSectionRef>(null);
  const ipRef = useRef<IPSectionRef>(null);
  const basicRef = useRef<BasicInfoSectionRef>(null);
  const legalTerritoryRef = useRef<LegalTerritorySectionRef>(null);
  const investmentTransferRef = useRef<InvestmentTransferSectionRef>(null);
  const pricingRef = useRef<PricingDesiredSectionRef>(null);
  const visibilityRef = useRef<VisibilityNDASectionRef>(null);

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<TechnologyStatus>(
    (current?.status as TechnologyStatus) || "draft"
  );

  const handleSubmit = (event: React.FormEvent, onClose: () => void) => {
    event.preventDefault();
    if (!current?.id && !(current as any)?._id) return;
    setSubmitting(true);
    (async () => {
      try {
        const basic = basicRef.current?.getData();
        const owners = ownersRef.current?.getOwners();
        const ipDetails = ipRef.current?.getIPDetails?.();
        const legalDetails = legalTerritoryRef.current?.getData?.();
        const investmentTransfer = investmentTransferRef.current?.getData?.();
        const pricingDesired = pricingRef.current?.getData?.();
        const visibility = visibilityRef.current?.getData?.();

        const mediaApi = new MediaApi();
        const newTechMedia = basic?.documents?.length
          ? await mediaApi.uploadMulti(basic!.documents, { type: "document" })
          : [];
        const existingDocIds = (current?.documents || []).map((m: any) => m.id);
        const documents = [...existingDocIds, ...newTechMedia.map((m) => m.id)];

        const newLegalMedia = legalDetails?.files?.length
          ? await mediaApi.uploadMulti(legalDetails!.files, {
              type: "document",
            })
          : [];
        const existingLegalIds = (
          current?.legal_certification?.files || []
        ).map((m: any) => m.id);

        const payload = {
          title: basic?.title ?? current?.title ?? "",
          category: basic?.category ?? (current?.category as any),
          trl_level: basic?.trl_level || String(current?.trl_level || ""),
          description: basic?.description ?? current?.description,
          confidential_detail:
            basic?.confidential_detail ?? current?.confidential_detail,
          status: status,
          documents,
          owners: owners ?? current?.owners,
          legal_certification:
            legalDetails || current?.legal_certification
              ? {
                  protection_scope:
                    legalDetails?.protection_scope ??
                    current?.legal_certification?.protection_scope,
                  standard_certifications:
                    legalDetails?.standard_certifications ??
                    current?.legal_certification?.standard_certifications,
                  files: [
                    ...existingLegalIds,
                    ...newLegalMedia.map((m) => m.id),
                  ],
                }
              : undefined,
          investment_desire:
            investmentTransfer?.investment_desire ?? current?.investment_desire,
          transfer_type:
            investmentTransfer?.transfer_type ?? current?.transfer_type,
          pricing: pricingDesired ?? current?.pricing,
          intellectual_property:
            ipDetails && ipDetails.length
              ? ipDetails
              : (current as any)?.intellectual_property,
          visibility_mode:
            visibility?.visibility_mode ?? current?.visibility_mode,
        } as any;

        const id = String((current as any)?.id || (current as any)?._id);
        const updated = await updateTechnology(id, payload);
        console.log("Updated technology:", updated);
        toast.success("Cập nhật công nghệ thành công!");
        onClose?.();
        onUpdate?.();
      } catch (err: any) {
        console.error("Update error:", err);
        toast.error(err?.message || "Có lỗi xảy ra khi cập nhật công nghệ");
      } finally {
        setSubmitting(false);
      }
    })();
  };

  return (
    <Modal
      isOpen={disclosure.isOpen}
      onOpenChange={disclosure.onOpenChange}
      size="5xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-xl font-bold">
              Chỉnh sửa công nghệ
            </ModalHeader>
            <ModalBody className="space-y-6">
              <form
                className="space-y-6"
                onSubmit={(e) => handleSubmit(e, onClose)}
              >
                <BasicInfoSection
                  initialData={current || undefined}
                  ref={basicRef}
                />

                <Card>
                  <CardHeader className="px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Trạng thái *
                    </h2>
                  </CardHeader>
                  <CardBody className="p-6 space-y-4">
                    <Select
                      label="Trạng thái"
                      placeholder="Chọn trạng thái"
                      selectedKeys={
                        current?.status || status
                          ? new Set([String(current?.status || status)])
                          : new Set()
                      }
                      onSelectionChange={(keys) => {
                        const key = Array.from(keys as Set<string>)[0];
                        setCurrent((p) => ({
                          ...(p || {}),
                          status: key as TechnologyStatus,
                        }));
                        setStatus(key as TechnologyStatus);
                      }}
                      variant="bordered"
                    >
                      <SelectItem key="draft">Bản nháp</SelectItem>
                      <SelectItem key="pending">Chờ duyệt</SelectItem>
                      <SelectItem key="approved">Đã duyệt</SelectItem>
                      <SelectItem key="active">Hoạt động</SelectItem>
                      <SelectItem key="inactive">Không hoạt động</SelectItem>
                      <SelectItem key="rejected">Từ chối</SelectItem>
                    </Select>
                  </CardBody>
                </Card>

                <TechnologyOwnersSection
                  ref={ownersRef}
                  initialOwners={current?.owners || []}
                  onChange={() => {}}
                />

                <IPSection ref={ipRef} onChange={() => {}} />

                <LegalTerritorySection
                  ref={legalTerritoryRef}
                  initialData={current?.legal_certification as any}
                  onChange={() => {}}
                />

                <InvestmentTransferSection
                  ref={investmentTransferRef}
                  onChange={() => {}}
                  initialData={
                    {
                      investment_desire: current?.investment_desire,
                      transfer_type: current?.transfer_type,
                    } as any
                  }
                />

                <PricingDesiredSection
                  ref={pricingRef}
                  initialData={current?.pricing as any}
                />

                <VisibilityNDASection
                  ref={visibilityRef}
                  initialMode={current?.visibility_mode as any}
                />
              </form>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Hủy
              </Button>
              <Button
                type="submit"
                color="primary"
                className="bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500"
                isLoading={submitting}
                startContent={<Save className="h-4 w-4" />}
                isDisabled={submitting}
                onPress={() => handleSubmit(event as any, onClose)}
              >
                {"Cập nhật"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export function ViewTechnologyModal({
  disclosure,
  current,
  categories,
}: {
  disclosure: DisclosureLike;
  current: EditableTechnology | null;
  categories: Category[];
}) {
  const getCategoryName = (categoryId: string | Category) => {
    if (typeof categoryId === "string") {
      const category = categories.find(
        (c) => String((c as any).id || (c as any)._id) === categoryId
      );
      return category?.name || "Không xác định";
    }
    return categoryId.name || "Không xác định";
  };

  const getStatusColor = (status: TechnologyStatus) => {
    switch (status) {
      case "draft":
        return "default";
      case "pending":
        return "warning";
      case "approved":
      case "active":
        return "success";
      case "rejected":
      case "inactive":
        return "danger";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: TechnologyStatus) => {
    switch (status) {
      case "draft":
        return "Bản nháp";
      case "pending":
        return "Chờ duyệt";
      case "approved":
        return "Đã duyệt";
      case "rejected":
        return "Từ chối";
      case "active":
        return "Hoạt động";
      case "inactive":
        return "Không hoạt động";
      default:
        return status;
    }
  };

  const formatCurrency = (amount: number, currency: Currency = "vnd") => {
    if (currency === "vnd") {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount);
    } else if (currency === "usd") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
    } else if (currency === "eur") {
      return new Intl.NumberFormat("en-EU", {
        style: "currency",
        currency: "EUR",
      }).format(amount);
    }
    return amount.toString();
  };

  const getPricingTypeLabel = (type: PricingType) => {
    switch (type) {
      case "grant_seed":
        return "Grant/Seed (TRL 1–3)";
      case "vc_joint_venture":
        return "VC/Joint Venture (TRL 4–6)";
      case "growth_strategic":
        return "Growth/Strategic (TRL 7–9)";
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <Modal
      isOpen={disclosure.isOpen}
      onOpenChange={disclosure.onOpenChange}
      size="lg"
      scrollBehavior="inside"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader>Thông tin công nghệ</ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">Tiêu đề</div>
                  <div className="font-medium text-lg">{current?.title}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Mô tả</div>
                  <div className="text-gray-700 whitespace-pre-wrap">
                    {current?.description}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Lĩnh vực</div>
                    <div className="font-medium">
                      {current?.category
                        ? getCategoryName(current.category)
                        : "Chưa chọn"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Mức TRL</div>
                    <div className="font-medium">
                      {current?.trl_level || "Chưa xác định"}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Trạng thái</div>
                    <div className="font-medium">
                      {getStatusLabel(current?.status || "draft")}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Chế độ hiển thị</div>
                    <div className="font-medium">
                      {current?.visibility_mode === "public" && "Công khai"}
                      {current?.visibility_mode === "private" && "Riêng tư"}
                      {current?.visibility_mode === "restricted" && "Hạn chế"}
                    </div>
                  </div>
                </div>
                {current?.pricing && (
                  <div>
                    <div className="text-sm text-gray-500">
                      Thông tin định giá
                    </div>
                    <div className="font-medium">
                      {getPricingTypeLabel(current.pricing.pricing_type)}:{" "}
                      {formatCurrency(
                        current.pricing.price_from,
                        current.pricing.currency
                      )}{" "}
                      -{" "}
                      {formatCurrency(
                        current.pricing.price_to,
                        current.pricing.currency
                      )}
                    </div>
                  </div>
                )}
                {current?.createdAt && (
                  <div>
                    <div className="text-sm text-gray-500">Ngày tạo</div>
                    <div className="font-medium">
                      {formatDate(current.createdAt)}
                    </div>
                  </div>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onPress={() => disclosure.onClose && disclosure.onClose()}
              >
                Đóng
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export function DeleteTechnologyModal({
  disclosure,
  current,
  onDelete,
  loading,
}: {
  disclosure: DisclosureLike;
  current: EditableTechnology | null;
  onDelete: () => Promise<void> | void;
  loading?: boolean;
}) {
  return (
    <Modal
      isOpen={disclosure.isOpen}
      onOpenChange={disclosure.onOpenChange}
      size="sm"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Xác nhận xóa</ModalHeader>
            <ModalBody>
              Bạn có chắc chắn muốn xóa công nghệ "{current?.title}"? Hành động
              này không thể hoàn tác.
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Hủy
              </Button>
              <Button
                color="danger"
                onPress={onDelete}
                variant="bordered"
                startContent={<Trash2 className="h-4 w-4" />}
                isLoading={!!loading}
              >
                Xóa
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

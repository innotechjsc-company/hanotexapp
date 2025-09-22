"use client";

import React, { useState, useMemo } from "react";
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
import { Upload, FileText, Trash2, Plus } from "lucide-react";
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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [owners, setOwners] = useState<TechnologyOwner[]>([]);
  const [parentCategoryId, setParentCategoryId] = useState<string>("");
  const [childCategoryId, setChildCategoryId] = useState<string>("");

  // Parent categories (no parent)
  const parentCategories = useMemo(() => {
    return categories.filter((category) => !category.parent);
  }, [categories]);

  // Helper to get children by parent id
  const getChildCategories = useMemo(() => {
    return (parentId: string) =>
      categories.filter((category) => {
        if (typeof category.parent === "string") {
          return String(category.parent) === String(parentId);
        }
        if (category.parent && typeof category.parent === "object") {
          return String(category.parent.id) === String(parentId);
        }
        return false;
      });
  }, [categories]);

  const childCategories = useMemo(() => {
    if (!parentCategoryId) return [];
    return getChildCategories(parentCategoryId);
  }, [parentCategoryId, getChildCategories]);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveDocument = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddOwner = () => {
    setOwners((prev) => [
      ...prev,
      {
        owner_type: "individual" as OwnerType,
        owner_name: "",
        ownership_percentage: 0,
      },
    ]);
  };

  const handleRemoveOwner = (index: number) => {
    setOwners((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateOwner = (index: number, field: string, value: string) => {
    setOwners((prev) => {
      const newOwners = [...prev];
      const owner = { ...newOwners[index] };

      if (field === "ownerType") {
        owner.owner_type = value as OwnerType;
      } else if (field === "ownerName") {
        owner.owner_name = value;
      } else if (field === "ownershipPercentage") {
        owner.ownership_percentage = parseFloat(value) || 0;
      }

      newOwners[index] = owner;
      return newOwners;
    });
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
              {/* 1. Basic Information */}
              <Card>
                <CardHeader className="px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    1. Thông tin cơ bản *
                  </h3>
                </CardHeader>
                <CardBody className="p-6 space-y-4">
                  <Input
                    label="Tên sản phẩm Khoa học/ Công nghệ *"
                    placeholder="Nhập tên sản phẩm khoa học/công nghệ"
                    value={current?.title || ""}
                    onChange={(e) =>
                      setCurrent((p) => ({
                        ...(p || {}),
                        title: e.target.value,
                      }))
                    }
                    isRequired
                    variant="bordered"
                    classNames={{
                      label: "text-sm font-medium text-gray-700 mb-1",
                      input: "text-sm",
                    }}
                  />

                  {/* Upload tài liệu */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tài liệu minh chứng (PDF, Ảnh, Video)
                    </label>
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                      onClick={() =>
                        document.getElementById("file-upload-add")?.click()
                      }
                    >
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Kéo thả tài liệu vào đây hoặc{" "}
                        <span className="text-blue-600">
                          click để chọn file
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Hỗ trợ: PDF, JPG, PNG, MP4 (Tối đa 10MB mỗi file)
                      </p>
                      <input
                        id="file-upload-add"
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.mp4"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files)}
                      />
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <Card
                            key={`${file.name}-${index}`}
                            className="bg-gray-50"
                          >
                            <CardBody className="p-2 flex flex-row items-center justify-between">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 text-gray-500 mr-2" />
                                <span className="text-sm text-gray-700">
                                  {file.name}
                                </span>
                              </div>
                              <Button
                                isIconOnly
                                size="sm"
                                color="danger"
                                variant="light"
                                onClick={() => handleRemoveDocument(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </CardBody>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Phân loại - Lĩnh vực */}
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div className="space-y-4">
                      {/* Parent Category Selection */}
                      <Select
                        label="Lĩnh vực chính *"
                        placeholder="Chọn lĩnh vực chính"
                        selectedKeys={
                          parentCategoryId ? [parentCategoryId] : []
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          setParentCategoryId(value);
                          setChildCategoryId("");
                          setCurrent((p) => ({
                            ...(p || {}),
                            category: value,
                          }));
                        }}
                        isRequired
                        variant="bordered"
                        classNames={{
                          label: "text-sm font-medium text-gray-700 mb-1",
                        }}
                      >
                        {parentCategories && parentCategories.length > 0 ? (
                          parentCategories.map((category) =>
                            category.id && category.name ? (
                              <SelectItem key={String(category.id)}>
                                {category.name}
                              </SelectItem>
                            ) : null
                          )
                        ) : (
                          <SelectItem key="no-data" isDisabled>
                            Không có dữ liệu
                          </SelectItem>
                        )}
                      </Select>

                      {/* Child Category Selection - Only show if parent is selected */}
                      {parentCategoryId && (
                        <Select
                          label="Lĩnh vực con"
                          placeholder="Chọn lĩnh vực con (tùy chọn)"
                          selectedKeys={
                            childCategoryId ? [childCategoryId] : []
                          }
                          onChange={(e) => {
                            setChildCategoryId(e.target.value);
                            setCurrent((p) => ({
                              ...(p || {}),
                              category: e.target.value,
                            }));
                          }}
                          variant="bordered"
                          classNames={{
                            label: "text-sm font-medium text-gray-700 mb-1",
                          }}
                        >
                          {childCategories && childCategories.length > 0 ? (
                            childCategories.map((category) =>
                              category.id && category.name ? (
                                <SelectItem key={String(category.id)}>
                                  {category.name}
                                </SelectItem>
                              ) : null
                            )
                          ) : (
                            <SelectItem key="no-children" isDisabled>
                              Không có lĩnh vực con
                            </SelectItem>
                          )}
                        </Select>
                      )}
                    </div>
                  </div>

                  {/* TRL */}
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    <div>
                      <Select
                        label="Mức độ phát triển (TRL) *"
                        placeholder="Chọn mức độ TRL"
                        selectedKeys={
                          current?.trl_level ? [String(current.trl_level)] : []
                        }
                        onChange={(e) =>
                          setCurrent((p) => ({
                            ...(p || {}),
                            trl_level: parseInt(e.target.value) || 1,
                          }))
                        }
                        isRequired
                        variant="bordered"
                        classNames={{
                          label: "text-sm font-medium text-gray-700 mb-1",
                        }}
                      >
                        {trlLevels.map((trl) => (
                          <SelectItem key={String(trl.value)}>
                            {trl.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <Textarea
                    label="Tóm tắt công khai *"
                    placeholder="Mô tả ngắn gọn về công nghệ (sẽ hiển thị công khai)"
                    value={current?.description || ""}
                    onChange={(e) =>
                      setCurrent((p) => ({
                        ...(p || {}),
                        description: e.target.value,
                      }))
                    }
                    isRequired
                    minRows={4}
                    variant="bordered"
                    classNames={{
                      label: "text-sm font-medium text-gray-700 mb-1",
                      input: "text-sm",
                    }}
                  />

                  <Textarea
                    label="Chi tiết bảo mật"
                    placeholder="Mô tả chi tiết về công nghệ (chỉ hiển thị cho người có quyền truy cập)"
                    value={current?.confidential_detail || ""}
                    onChange={(e) =>
                      setCurrent((p) => ({
                        ...(p || {}),
                        confidential_detail: e.target.value,
                      }))
                    }
                    minRows={6}
                    variant="bordered"
                    classNames={{
                      label: "text-sm font-medium text-gray-700 mb-1",
                      input: "text-sm",
                    }}
                  />
                </CardBody>
              </Card>

              {/* 2. Technology Owners */}
              <Card>
                <CardHeader className="px-6 py-4">
                  <div className="flex items-center justify-between w-full">
                    <h3 className="text-lg font-semibold text-gray-900">
                      2. Chủ sở hữu công nghệ *
                    </h3>
                    <Button
                      variant="flat"
                      color="primary"
                      size="sm"
                      startContent={<Plus className="h-4 w-4" />}
                      onClick={handleAddOwner}
                    >
                      Thêm chủ sở hữu
                    </Button>
                  </div>
                </CardHeader>
                <CardBody className="p-6 space-y-4">
                  {owners.length === 0 && (
                    <div className="text-center p-4 text-gray-500">
                      Chưa có thông tin chủ sở hữu. Vui lòng thêm chủ sở hữu.
                    </div>
                  )}
                  {owners.map((owner, index) => (
                    <Card key={index} className="bg-gray-50">
                      <CardBody className="p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">
                            Chủ sở hữu {index + 1}
                          </h4>
                          <Button
                            isIconOnly
                            size="sm"
                            color="danger"
                            variant="light"
                            onClick={() => handleRemoveOwner(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Select
                            label="Loại chủ sở hữu"
                            placeholder="Chọn loại"
                            selectedKeys={
                              owner.owner_type ? [owner.owner_type] : []
                            }
                            onChange={(e) =>
                              handleUpdateOwner(
                                index,
                                "ownerType",
                                e.target.value
                              )
                            }
                            variant="bordered"
                            size="sm"
                          >
                            <SelectItem key="individual">Cá nhân</SelectItem>
                            <SelectItem key="company">Công ty</SelectItem>
                            <SelectItem key="research_institution">
                              Viện/Trường
                            </SelectItem>
                          </Select>
                          <Input
                            label="Tên chủ sở hữu"
                            placeholder="Nhập tên"
                            value={owner.owner_name}
                            onChange={(e) =>
                              handleUpdateOwner(
                                index,
                                "ownerName",
                                e.target.value
                              )
                            }
                            variant="bordered"
                            size="sm"
                          />
                          <Input
                            label="Tỷ lệ sở hữu (%)"
                            type="number"
                            placeholder="0-100"
                            value={
                              owner.ownership_percentage
                                ? String(owner.ownership_percentage)
                                : ""
                            }
                            onChange={(e) =>
                              handleUpdateOwner(
                                index,
                                "ownershipPercentage",
                                e.target.value
                              )
                            }
                            min={0}
                            max={100}
                            variant="bordered"
                            size="sm"
                          />
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </CardBody>
              </Card>

              {/* 3. Pricing & Status */}
              <Card>
                <CardHeader className="px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    3. Định giá & Trạng thái
                  </h3>
                </CardHeader>
                <CardBody className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Loại định giá"
                      placeholder="Chọn loại định giá"
                      selectedKeys={
                        current?.pricing?.pricing_type
                          ? [current.pricing.pricing_type]
                          : []
                      }
                      onChange={(e) =>
                        setCurrent((p) => ({
                          ...(p || {}),
                          pricing: {
                            ...(p?.pricing || {}),
                            pricing_type: e.target.value as PricingType,
                            price_from: p?.pricing?.price_from || 0,
                            price_to: p?.pricing?.price_to || 0,
                            currency: p?.pricing?.currency || "vnd",
                          },
                        }))
                      }
                      variant="bordered"
                    >
                      <SelectItem key="grant_seed">
                        Grant/Seed (TRL 1–3)
                      </SelectItem>
                      <SelectItem key="vc_joint_venture">
                        VC/Joint Venture (TRL 4–6)
                      </SelectItem>
                      <SelectItem key="growth_strategic">
                        Growth/Strategic (TRL 7–9)
                      </SelectItem>
                    </Select>
                    <Select
                      label="Tiền tệ"
                      placeholder="Chọn tiền tệ"
                      selectedKeys={
                        current?.pricing?.currency
                          ? [current.pricing.currency]
                          : ["vnd"]
                      }
                      onChange={(e) =>
                        setCurrent((p) => ({
                          ...(p || {}),
                          pricing: {
                            ...(p?.pricing || {}),
                            pricing_type:
                              p?.pricing?.pricing_type || "grant_seed",
                            price_from: p?.pricing?.price_from || 0,
                            price_to: p?.pricing?.price_to || 0,
                            currency: e.target.value as Currency,
                          },
                        }))
                      }
                      variant="bordered"
                    >
                      <SelectItem key="vnd">VND</SelectItem>
                      <SelectItem key="usd">USD</SelectItem>
                      <SelectItem key="eur">EUR</SelectItem>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Giá từ"
                      type="number"
                      placeholder="Nhập giá từ"
                      value={
                        current?.pricing?.price_from
                          ? String(current.pricing.price_from)
                          : ""
                      }
                      onChange={(e) =>
                        setCurrent((p) => ({
                          ...(p || {}),
                          pricing: {
                            ...(p?.pricing || {}),
                            pricing_type:
                              p?.pricing?.pricing_type || "grant_seed",
                            price_from: parseInt(e.target.value) || 0,
                            price_to: p?.pricing?.price_to || 0,
                            currency: p?.pricing?.currency || "vnd",
                          },
                        }))
                      }
                      variant="bordered"
                    />
                    <Input
                      label="Giá đến"
                      type="number"
                      placeholder="Nhập giá đến"
                      value={
                        current?.pricing?.price_to
                          ? String(current.pricing.price_to)
                          : ""
                      }
                      onChange={(e) =>
                        setCurrent((p) => ({
                          ...(p || {}),
                          pricing: {
                            ...(p?.pricing || {}),
                            pricing_type:
                              p?.pricing?.pricing_type || "grant_seed",
                            price_from: p?.pricing?.price_from || 0,
                            price_to: parseInt(e.target.value) || 0,
                            currency: p?.pricing?.currency || "vnd",
                          },
                        }))
                      }
                      variant="bordered"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Trạng thái"
                      placeholder="Chọn trạng thái"
                      selectedKeys={
                        current?.status
                          ? new Set([current.status])
                          : new Set(["draft"])
                      }
                      onSelectionChange={(keys) => {
                        const key = Array.from(keys as Set<string>)[0];
                        setCurrent((p) => ({
                          ...(p || {}),
                          status: key as TechnologyStatus,
                        }));
                      }}
                      variant="bordered"
                    >
                      <SelectItem key="draft">Bản nháp</SelectItem>
                      <SelectItem key="pending">Chờ duyệt</SelectItem>
                      <SelectItem key="approved">Đã duyệt</SelectItem>
                      <SelectItem key="active">Hoạt động</SelectItem>
                      <SelectItem key="inactive">Không hoạt động</SelectItem>
                    </Select>
                    <Select
                      label="Chế độ hiển thị"
                      placeholder="Chọn chế độ hiển thị"
                      selectedKeys={
                        current?.visibility_mode
                          ? new Set([current.visibility_mode])
                          : new Set(["public"])
                      }
                      onSelectionChange={(keys) => {
                        const key = Array.from(keys as Set<string>)[0];
                        setCurrent((p) => ({
                          ...(p || {}),
                          visibility_mode: key as any,
                        }));
                      }}
                      variant="bordered"
                    >
                      <SelectItem key="public">Công khai</SelectItem>
                      <SelectItem key="private">Riêng tư</SelectItem>
                      <SelectItem key="restricted">Hạn chế</SelectItem>
                    </Select>
                  </div>
                </CardBody>
              </Card>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Hủy
              </Button>
              <Button
                color="primary"
                variant="bordered"
                onPress={onCreate}
                isDisabled={
                  !current?.title ||
                  !current?.description ||
                  !current?.category ||
                  !current?.trl_level ||
                  owners.length === 0 ||
                  loading
                }
                isLoading={!!loading}
              >
                Tạo công nghệ
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
  // Similar structure to AddTechnologyModal but for editing
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
              {/* Similar form structure as AddTechnologyModal but with edit-specific logic */}
              <Card>
                <CardHeader className="px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    1. Thông tin cơ bản *
                  </h3>
                </CardHeader>
                <CardBody className="p-6 space-y-4">
                  <Input
                    label="Tên sản phẩm Khoa học/ Công nghệ *"
                    placeholder="Nhập tên sản phẩm khoa học/công nghệ"
                    value={current?.title || ""}
                    onChange={(e) =>
                      setCurrent((p) => ({
                        ...(p || {}),
                        title: e.target.value,
                      }))
                    }
                    isRequired
                    variant="bordered"
                    classNames={{
                      label: "text-sm font-medium text-gray-700 mb-1",
                      input: "text-sm",
                    }}
                  />

                  <Textarea
                    label="Tóm tắt công khai *"
                    placeholder="Mô tả ngắn gọn về công nghệ (sẽ hiển thị công khai)"
                    value={current?.description || ""}
                    onChange={(e) =>
                      setCurrent((p) => ({
                        ...(p || {}),
                        description: e.target.value,
                      }))
                    }
                    isRequired
                    minRows={4}
                    variant="bordered"
                    classNames={{
                      label: "text-sm font-medium text-gray-700 mb-1",
                      input: "text-sm",
                    }}
                  />

                  <Select
                    label="Lĩnh vực"
                    placeholder="Chọn lĩnh vực"
                    selectedKeys={
                      current?.category
                        ? new Set([String(current.category)])
                        : new Set()
                    }
                    onSelectionChange={(keys) => {
                      const key = Array.from(keys as Set<string>)[0];
                      setCurrent((p) => ({ ...(p || {}), category: key }));
                    }}
                    isRequired
                    variant="bordered"
                  >
                    {categories.map((category) => (
                      <SelectItem
                        key={String(
                          (category as any).id || (category as any)._id
                        )}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </Select>

                  <Select
                    label="Mức độ phát triển (TRL) *"
                    placeholder="Chọn mức độ TRL"
                    selectedKeys={
                      current?.trl_level ? [String(current.trl_level)] : []
                    }
                    onChange={(e) =>
                      setCurrent((p) => ({
                        ...(p || {}),
                        trl_level: parseInt(e.target.value) || 1,
                      }))
                    }
                    isRequired
                    variant="bordered"
                    classNames={{
                      label: "text-sm font-medium text-gray-700 mb-1",
                    }}
                  >
                    {trlLevels.map((trl) => (
                      <SelectItem key={String(trl.value)}>
                        {trl.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <Textarea
                    label="Chi tiết bảo mật"
                    placeholder="Mô tả chi tiết về công nghệ (chỉ hiển thị cho người có quyền truy cập)"
                    value={current?.confidential_detail || ""}
                    onChange={(e) =>
                      setCurrent((p) => ({
                        ...(p || {}),
                        confidential_detail: e.target.value,
                      }))
                    }
                    minRows={6}
                    variant="bordered"
                    classNames={{
                      label: "text-sm font-medium text-gray-700 mb-1",
                      input: "text-sm",
                    }}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Select
                      label="Chế độ hiển thị"
                      placeholder="Chọn chế độ hiển thị"
                      selectedKeys={
                        current?.visibility_mode
                          ? new Set([current.visibility_mode])
                          : new Set()
                      }
                      onSelectionChange={(keys) => {
                        const key = Array.from(keys as Set<string>)[0];
                        setCurrent((p) => ({
                          ...(p || {}),
                          visibility_mode: key as any,
                        }));
                      }}
                      variant="bordered"
                    >
                      <SelectItem key="public">Công khai</SelectItem>
                      <SelectItem key="private">Riêng tư</SelectItem>
                      <SelectItem key="restricted">Hạn chế</SelectItem>
                    </Select>
                  </div>
                </CardBody>
              </Card>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Hủy
              </Button>
              <Button
                color="primary"
                variant="bordered"
                onPress={onUpdate}
                isDisabled={
                  !current?.title ||
                  !current?.description ||
                  !current?.category ||
                  !current?.trl_level ||
                  loading
                }
                isLoading={!!loading}
              >
                Cập nhật
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

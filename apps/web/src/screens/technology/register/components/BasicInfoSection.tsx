import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  forwardRef,
} from "react";
import { Upload, FileText, Trash2, AlertCircle } from "lucide-react";
import { getTRLSuggestions } from "../utils";
import { useCategories } from "@/hooks/useCategories";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Select,
  SelectItem,
  Textarea,
  Button,
  Spinner,
} from "@heroui/react";
import type { Technology } from "@/types/technologies";
import { trlLevels } from "@/constants/technology";

interface BasicInfoSectionProps {
  initialData?: Partial<Technology>;
  onChange?: (data: ReturnType<BasicInfoSectionRef["getData"]>) => void;
  // keep optional props for compatibility, but not used here
}

export interface BasicInfoSectionRef {
  getData: () => {
    title: string;
    category?: string; // ID of selected category (child if selected, else parent)
    trl_level: string; // ID of TRL
    description?: string;
    confidential_detail?: string;
    documents: File[]; // raw files to be uploaded separately
  };
  reset: () => void;
}

export const BasicInfoSection = forwardRef<
  BasicInfoSectionRef,
  BasicInfoSectionProps
>(({ initialData, onChange }, ref) => {
  // Local state aligned to Technology type
  const [title, setTitle] = useState<string>(initialData?.title || "");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [parentCategoryId, setParentCategoryId] = useState<string>("");
  const [childCategoryId, setChildCategoryId] = useState<string>("");
  const [trlLevel, setTrlLevel] = useState<string>(
    (typeof initialData?.trl_level === "number"
      ? String(initialData?.trl_level)
      : "") || ""
  );
  const [description, setDescription] = useState<string>(
    initialData?.description || ""
  );
  const [confidentialDetail, setConfidentialDetail] = useState<string>(
    initialData?.confidential_detail || ""
  );

  // Categories from API
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  // Initialize category selection from initialData when categories are loaded
  useEffect(() => {
    if (!categories.length) return;
    const initialCategoryId =
      typeof initialData?.category === "string"
        ? (initialData?.category as string)
        : (initialData?.category as any)?.id;
    if (!initialCategoryId) return;
    const cat = categories.find(
      (c) => String(c.id) === String(initialCategoryId)
    );
    if (!cat) return;
    const parentId =
      typeof cat.parent === "object"
        ? String(cat.parent?.id)
        : String(cat.parent || "");
    if (parentId) {
      setParentCategoryId(parentId);
      setChildCategoryId(String(cat.id));
    } else {
      setParentCategoryId(String(cat.id));
      setChildCategoryId("");
    }
  }, [categories, initialData?.category]);

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

  // Expose data for parent submit
  useImperativeHandle(ref, () => ({
    getData: () => ({
      title: title.trim(),
      category: childCategoryId || parentCategoryId || undefined,
      trl_level: trlLevel,
      description: description.trim() || undefined,
      confidential_detail: confidentialDetail.trim() || undefined,
      documents: uploadedFiles,
    }),
    reset: () => {
      setTitle("");
      setUploadedFiles([]);
      setParentCategoryId("");
      setChildCategoryId("");
      setTrlLevel("");
      setDescription("");
      setConfidentialDetail("");
    },
  }));

  // Notify optional onChange consumer
  useEffect(() => {
    if (!onChange) return;
    onChange({
      title: title.trim(),
      category: childCategoryId || parentCategoryId || undefined,
      trl_level: trlLevel,
      description: description.trim() || undefined,
      confidential_detail: confidentialDetail.trim() || undefined,
      documents: uploadedFiles,
    });
  }, [
    onChange,
    title,
    parentCategoryId,
    childCategoryId,
    trlLevel,
    description,
    confidentialDetail,
    uploadedFiles,
  ]);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveDocument = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader className="px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">
          1. Thông tin cơ bản *
        </h2>
      </CardHeader>
      <CardBody className="p-6 space-y-4">
        <Input
          label="Tên sản phẩm Khoa học/ Công nghệ *"
          placeholder="Nhập tên sản phẩm khoa học/công nghệ"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Kéo thả tài liệu vào đây hoặc{" "}
              <span className="text-blue-600">click để chọn file</span>
            </p>
            <p className="text-xs text-gray-500">
              Hỗ trợ: PDF, JPG, PNG, MP4 (Tối đa 10MB mỗi file)
            </p>
            <input
              id="file-upload"
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
                <Card key={`${file.name}-${index}`} className="bg-gray-50">
                  <CardBody className="p-2 flex flex-row items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">{file.name}</span>
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
              selectedKeys={parentCategoryId ? [parentCategoryId] : []}
              onChange={(e) => {
                const value = e.target.value;
                setParentCategoryId(value);
                // Clear child when parent changes
                setChildCategoryId("");
              }}
              isRequired
              isDisabled={categoriesLoading}
              variant="bordered"
              classNames={{ label: "text-sm font-medium text-gray-700 mb-1" }}
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
                  {categoriesLoading ? "Đang tải..." : "Không có dữ liệu"}
                </SelectItem>
              )}
            </Select>

            {/* Child Category Selection - Only show if parent is selected */}
            {parentCategoryId && (
              <Select
                label="Lĩnh vực con"
                placeholder="Chọn lĩnh vực con (tùy chọn)"
                selectedKeys={childCategoryId ? [childCategoryId] : []}
                onChange={(e) => setChildCategoryId(e.target.value)}
                variant="bordered"
                classNames={{ label: "text-sm font-medium text-gray-700 mb-1" }}
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

            {/* Categories loading and error state */}
            {categoriesLoading && (
              <div className="flex items-center text-sm text-blue-600">
                <Spinner size="sm" className="mr-2" /> Đang tải danh sách lĩnh
                vực...
              </div>
            )}
            {categoriesError && (
              <Card className="bg-red-50 border-red-200">
                <CardBody className="flex flex-row items-center p-2">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                  <p className="text-xs text-red-600">{categoriesError}</p>
                </CardBody>
              </Card>
            )}
          </div>
        </div>

        {/* TRL */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div>
            <Select
              // ađ init value
              value={trlLevel}
              label="Mức độ phát triển (TRL) *"
              placeholder="Chọn mức độ TRL"
              selectedKeys={trlLevel ? [trlLevel] : []}
              onChange={(e) => setTrlLevel(e.target.value)}
              isRequired
              variant="bordered"
              classNames={{ label: "text-sm font-medium text-gray-700 mb-1" }}
            >
              {trlLevels.map((trl) => (
                <SelectItem key={String(trl.value)}>{trl.label}</SelectItem>
              ))}
            </Select>

            {trlLevel && getTRLSuggestions(trlLevel) && (
              <Card className="mt-2 bg-blue-50 border-blue-200">
                <CardBody className="p-2">
                  <p className="text-xs text-blue-700">
                    <strong>Gợi ý:</strong>{" "}
                    {getTRLSuggestions(trlLevel)?.fields.join(", ")}
                  </p>
                </CardBody>
              </Card>
            )}
          </div>
        </div>

        <Textarea
          label="Tóm tắt công khai *"
          placeholder="Mô tả ngắn gọn về công nghệ (sẽ hiển thị công khai)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
          value={confidentialDetail}
          onChange={(e) => setConfidentialDetail(e.target.value)}
          minRows={6}
          variant="bordered"
          classNames={{
            label: "text-sm font-medium text-gray-700 mb-1",
            input: "text-sm",
          }}
        />
      </CardBody>
    </Card>
  );
});

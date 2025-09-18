import React from "react";
import { Upload, Eye, FileText, Trash2, AlertCircle } from "lucide-react";
import {
  TechnologyFormData,
  FileUpload,
  MasterData,
  OCRResult,
} from "../types";
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
  Chip,
  Spinner,
  Divider,
} from "@heroui/react";

interface BasicInfoSectionProps {
  formData: TechnologyFormData;
  masterData: MasterData | null;
  masterDataLoading: boolean;
  showOptionalFields: boolean;
  setShowOptionalFields: (show: boolean) => void;
  ocrLoading: boolean;
  ocrResult: OCRResult | null;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onFileUpload: (files: FileList | null) => void;
  onRemoveDocument: (index: number) => void;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  formData,
  masterData,
  masterDataLoading,
  showOptionalFields,
  setShowOptionalFields,
  ocrLoading,
  ocrResult,
  onChange,
  onFileUpload,
  onRemoveDocument,
}) => {
  // Fetch categories from API
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError
  } = useCategories();
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
          name="title"
          value={formData.title}
          onChange={onChange}
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
              onChange={(e) => onFileUpload(e.target.files)}
            />
          </div>

          {/* OCR Loading State */}
          {ocrLoading && (
            <Card className="bg-blue-50 border-blue-200">
              <CardBody className="flex flex-row items-center">
                <Spinner size="sm" color="primary" className="mr-3" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Đang xử lý OCR...
                  </p>
                  <p className="text-xs text-blue-600">
                    Vui lòng chờ trong giây lát
                  </p>
                </div>
              </CardBody>
            </Card>
          )}

          {/* OCR Result */}
          {ocrResult && (
            <Card className="bg-green-50 border-green-200">
              <CardBody>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h4 className="text-sm font-medium text-green-800">
                      OCR xử lý thành công!
                    </h4>
                    <div className="mt-2 text-sm text-green-700">
                      <p>
                        <strong>File:</strong> {ocrResult.fileInfo?.name}
                      </p>
                      <p>
                        <strong>Thời gian xử lý:</strong>{" "}
                        {ocrResult.processingTime}
                      </p>
                      {ocrResult.extractedData && (
                        <div className="mt-2">
                          <p>
                            <strong>Thông tin đã trích xuất:</strong>
                          </p>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            {ocrResult.extractedData.title && (
                              <li>Tên: {ocrResult.extractedData.title}</li>
                            )}
                            {ocrResult.extractedData.field && (
                              <li>Lĩnh vực: {ocrResult.extractedData.field}</li>
                            )}
                            {ocrResult.extractedData.trlSuggestion && (
                              <li>
                                TRL gợi ý:{" "}
                                {ocrResult.extractedData.trlSuggestion}
                              </li>
                            )}
                            {ocrResult.extractedData.confidence && (
                              <li>
                                Độ tin cậy:{" "}
                                {Math.round(
                                  ocrResult.extractedData.confidence * 100
                                )}
                                %
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {formData.documents.length > 0 && (
            <div className="mt-3 space-y-2">
              {formData.documents.map((doc, index) => (
                <Card key={index} className="bg-gray-50">
                  <CardBody className="p-2 flex flex-row items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">{doc.name}</span>
                    </div>
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="light"
                      onClick={() => onRemoveDocument(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Thông tin phân loại - Lĩnh vực từ Categories API */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div className="space-y-2">
            <Select
              label="Lĩnh vực *"
              placeholder="Chọn lĩnh vực"
              name="classification.field"
              selectedKeys={
                formData.classification.field
                  ? [formData.classification.field]
                  : []
              }
              onChange={onChange}
              isRequired
              isDisabled={categoriesLoading}
              variant="bordered"
              classNames={{
                label: "text-sm font-medium text-gray-700 mb-1",
              }}
            >
              {categories.map((category) => (
                <SelectItem key={category.value}>{category.label}</SelectItem>
              ))}
            </Select>
            
            {/* Categories loading state */}
            {categoriesLoading && (
              <div className="flex items-center text-sm text-blue-600">
                <Spinner size="sm" className="mr-2" />
                Đang tải danh sách lĩnh vực...
              </div>
            )}
            
            {/* Categories error state */}
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

        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div>
            <Select
              label="Mức độ phát triển (TRL) *"
              placeholder="Chọn mức độ TRL"
              name="trlLevel"
              selectedKeys={formData.trlLevel ? [formData.trlLevel] : []}
              onChange={onChange}
              isRequired
              isDisabled={masterDataLoading}
              variant="bordered"
              classNames={{
                label: "text-sm font-medium text-gray-700 mb-1",
              }}
            >
              {(masterData?.trlLevels || []).map((trl) => (
                <SelectItem key={trl.value}>{trl.label}</SelectItem>
              ))}
            </Select>

            {/* Gợi ý TRL */}
            {formData.trlLevel && getTRLSuggestions(formData.trlLevel) && (
              <Card className="mt-2 bg-blue-50 border-blue-200">
                <CardBody className="p-2">
                  <p className="text-xs text-blue-700">
                    <strong>Gợi ý:</strong>{" "}
                    {getTRLSuggestions(formData.trlLevel)?.fields.join(", ")}
                  </p>
                </CardBody>
              </Card>
            )}
          </div>

        </div>

        <Textarea
          label="Tóm tắt công khai *"
          placeholder="Mô tả ngắn gọn về công nghệ (sẽ hiển thị công khai)"
          name="publicSummary"
          value={formData.publicSummary}
          onChange={onChange}
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
          name="confidentialDetail"
          value={formData.confidentialDetail}
          onChange={onChange}
          minRows={6}
          variant="bordered"
          classNames={{
            label: "text-sm font-medium text-gray-700 mb-1",
            input: "text-sm",
          }}
        />

        <Select
          label="Chế độ hiển thị"
          name="visibilityMode"
          selectedKeys={[formData.visibilityMode]}
          onChange={onChange}
          variant="bordered"
          classNames={{
            label: "text-sm font-medium text-gray-700 mb-1",
          }}
        >
          <SelectItem key="PUBLIC_SUMMARY">Chỉ hiển thị tóm tắt</SelectItem>
          <SelectItem key="PUBLIC_FULL">Hiển thị đầy đủ</SelectItem>
          <SelectItem key="PRIVATE">Riêng tư</SelectItem>
        </Select>

        {/* Thông tin bổ sung (Optional) */}
        <Divider className="my-4" />
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-medium text-gray-900">
              Thông tin bổ sung
            </h3>
            <Button
              variant="flat"
              color="primary"
              size="sm"
              startContent={<Eye className="h-4 w-4" />}
              onClick={() => setShowOptionalFields(!showOptionalFields)}
            >
              {showOptionalFields
                ? "Ẩn thông tin bổ sung"
                : "Hiển thị thông tin bổ sung"}
            </Button>
          </div>
          {showOptionalFields && (
            <div className="space-y-4">
              <Textarea
                label="Đội ngũ / Nhân lực/ Cơ sở hạ tầng"
                placeholder="Mô tả về đội ngũ phát triển, nhân lực chuyên môn..."
                name="optionalInfo.team"
                value={formData.optionalInfo.team}
                onChange={onChange}
                minRows={3}
                variant="bordered"
                classNames={{
                  label: "text-sm font-medium text-gray-700 mb-1",
                  input: "text-sm",
                }}
              />
              <Textarea
                label="Kết quả thử nghiệm / Triển khai"
                placeholder="Mô tả kết quả thử nghiệm, triển khai thực tế..."
                name="optionalInfo.testResults"
                value={formData.optionalInfo.testResults}
                onChange={onChange}
                minRows={3}
                variant="bordered"
                classNames={{
                  label: "text-sm font-medium text-gray-700 mb-1",
                  input: "text-sm",
                }}
              />
              <Textarea
                label="Hiệu quả kinh tế - xã hội"
                placeholder="Mô tả tác động kinh tế, xã hội, môi trường..."
                name="optionalInfo.economicSocialImpact"
                value={formData.optionalInfo.economicSocialImpact}
                onChange={onChange}
                minRows={3}
                variant="bordered"
                classNames={{
                  label: "text-sm font-medium text-gray-700 mb-1",
                  input: "text-sm",
                }}
              />
              <Textarea
                label="Thông tin quỹ tài chính hỗ trợ"
                placeholder="Thông tin về quỹ hỗ trợ, tài trợ, chương trình khuyến khích..."
                name="optionalInfo.financialSupport"
                value={formData.optionalInfo.financialSupport}
                onChange={onChange}
                minRows={3}
                variant="bordered"
                classNames={{
                  label: "text-sm font-medium text-gray-700 mb-1",
                  input: "text-sm",
                }}
              />
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

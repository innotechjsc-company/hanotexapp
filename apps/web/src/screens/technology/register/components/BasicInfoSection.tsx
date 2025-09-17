import React from "react";
import {
  Upload,
  Eye,
  FileText,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { TechnologyFormData, FileUpload, MasterData, OCRResult } from "../types";
import { getTRLSuggestions } from "../utils";

interface BasicInfoSectionProps {
  formData: TechnologyFormData;
  masterData: MasterData | null;
  masterDataLoading: boolean;
  showOptionalFields: boolean;
  setShowOptionalFields: (show: boolean) => void;
  ocrLoading: boolean;
  ocrResult: OCRResult | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
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
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          2. Thông tin cơ bản *
        </h2>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tên sản phẩm Khoa học/ Công nghệ *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formData.title}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nhập tên sản phẩm khoa học/công nghệ"
          />
        </div>

        {/* Upload tài liệu */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tài liệu minh chứng (PDF, Ảnh, Video)
          </label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
            onClick={() =>
              document.getElementById("file-upload")?.click()
            }
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
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Đang xử lý OCR...
                  </p>
                  <p className="text-xs text-blue-600">
                    Vui lòng chờ trong giây lát
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* OCR Result */}
          {ocrResult && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
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
                            <li>
                              Lĩnh vực: {ocrResult.extractedData.field}
                            </li>
                          )}
                          {ocrResult.extractedData.industry && (
                            <li>
                              Ngành: {ocrResult.extractedData.industry}
                            </li>
                          )}
                          {ocrResult.extractedData.specialty && (
                            <li>
                              Chuyên ngành:{" "}
                              {ocrResult.extractedData.specialty}
                            </li>
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
            </div>
          )}

          {formData.documents.length > 0 && (
            <div className="mt-3 space-y-2">
              {formData.documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700">
                      {doc.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveDocument(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Thông tin phân loại */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="classification.field"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Lĩnh vực *
            </label>
            <select
              id="classification.field"
              name="classification.field"
              required
              value={formData.classification.field}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={masterDataLoading}
            >
              <option value="">Chọn lĩnh vực</option>
              {masterData?.fields.map((field) => (
                <option key={field.value} value={field.value}>
                  {field.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="classification.industry"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Ngành *
            </label>
            <select
              id="classification.industry"
              name="classification.industry"
              required
              value={formData.classification.industry}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={masterDataLoading}
            >
              <option value="">Chọn ngành</option>
              {masterData?.industries.map((industry) => (
                <option key={industry.value} value={industry.value}>
                  {industry.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="classification.specialty"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Chuyên ngành *
            </label>
            <select
              id="classification.specialty"
              name="classification.specialty"
              required
              value={formData.classification.specialty}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={masterDataLoading}
            >
              <option value="">Chọn chuyên ngành</option>
              {masterData?.specialties.map((specialty) => (
                <option key={specialty.value} value={specialty.value}>
                  {specialty.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="trlLevel"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mức độ phát triển (TRL) *
            </label>
            <select
              id="trlLevel"
              name="trlLevel"
              required
              value={formData.trlLevel}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={masterDataLoading}
            >
              <option value="">Chọn mức độ TRL</option>
              {masterData?.trlLevels.map((trl) => (
                <option key={trl.value} value={trl.value}>
                  {trl.label}
                </option>
              ))}
            </select>

            {/* Gợi ý TRL */}
            {formData.trlLevel &&
              getTRLSuggestions(formData.trlLevel) && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-700">
                    <strong>Gợi ý:</strong>{" "}
                    {getTRLSuggestions(formData.trlLevel)?.fields.join(
                      ", "
                    )}
                  </p>
                </div>
              )}
          </div>

          <div>
            <label
              htmlFor="categoryId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Danh mục *{" "}
              <span className="text-xs text-gray-500">
                (Phân loại chính thức theo hệ thống HANOTEX)
              </span>
            </label>
            <select
              id="categoryId"
              name="categoryId"
              required
              value={formData.categoryId}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={masterDataLoading}
            >
              <option value="">Chọn danh mục</option>
              {masterData?.categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Danh mục giúp phân loại và tìm kiếm công nghệ dễ dàng hơn
              trên sàn giao dịch
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor="publicSummary"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tóm tắt công khai *
          </label>
          <textarea
            id="publicSummary"
            name="publicSummary"
            required
            rows={4}
            value={formData.publicSummary}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Mô tả ngắn gọn về công nghệ (sẽ hiển thị công khai)"
          />
        </div>

        <div>
          <label
            htmlFor="confidentialDetail"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Chi tiết bảo mật
          </label>
          <textarea
            id="confidentialDetail"
            name="confidentialDetail"
            rows={6}
            value={formData.confidentialDetail}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Mô tả chi tiết về công nghệ (chỉ hiển thị cho người có quyền truy cập)"
          />
        </div>

        <div>
          <label
            htmlFor="visibilityMode"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Chế độ hiển thị
          </label>
          <select
            id="visibilityMode"
            name="visibilityMode"
            value={formData.visibilityMode}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="PUBLIC_SUMMARY">Chỉ hiển thị tóm tắt</option>
            <option value="PUBLIC_FULL">Hiển thị đầy đủ</option>
            <option value="PRIVATE">Riêng tư</option>
          </select>
        </div>

        {/* Thông tin bổ sung (Optional) */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-md font-medium text-gray-900">
              Thông tin bổ sung
            </h3>
            <button
              type="button"
              onClick={() => setShowOptionalFields(!showOptionalFields)}
              className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Eye className="h-4 w-4 mr-2" />
              {showOptionalFields
                ? "Ẩn thông tin bổ sung"
                : "Hiển thị thông tin bổ sung"}
            </button>
          </div>
          {showOptionalFields && (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="optionalInfo.team"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Đội ngũ / Nhân lực/ Cơ sở hạ tầng
                </label>
                <textarea
                  id="optionalInfo.team"
                  name="optionalInfo.team"
                  value={formData.optionalInfo.team}
                  onChange={onChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mô tả về đội ngũ phát triển, nhân lực chuyên môn..."
                />
              </div>
              <div>
                <label
                  htmlFor="optionalInfo.testResults"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Kết quả thử nghiệm / Triển khai
                </label>
                <textarea
                  id="optionalInfo.testResults"
                  name="optionalInfo.testResults"
                  value={formData.optionalInfo.testResults}
                  onChange={onChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mô tả kết quả thử nghiệm, triển khai thực tế..."
                />
              </div>
              <div>
                <label
                  htmlFor="optionalInfo.economicSocialImpact"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Hiệu quả kinh tế - xã hội
                </label>
                <textarea
                  id="optionalInfo.economicSocialImpact"
                  name="optionalInfo.economicSocialImpact"
                  value={formData.optionalInfo.economicSocialImpact}
                  onChange={onChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mô tả tác động kinh tế, xã hội, môi trường..."
                />
              </div>
              <div>
                <label
                  htmlFor="optionalInfo.financialSupport"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Thông tin quỹ tài chính hỗ trợ
                </label>
                <textarea
                  id="optionalInfo.financialSupport"
                  name="optionalInfo.financialSupport"
                  value={formData.optionalInfo.financialSupport}
                  onChange={onChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Thông tin về quỹ hỗ trợ, tài trợ, chương trình khuyến khích..."
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
import React from "react";
import { Upload, FileText, Trash2, Info } from "lucide-react";
import { LegalTerritory, MasterData, FileUpload } from "../types";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Spinner,
  Checkbox,
} from "@heroui/react";

interface LegalTerritorySectionProps {
  legalTerritory: LegalTerritory;
  masterData: MasterData | null;
  masterDataLoading: boolean;
  onProtectionTerritoryChange: (territory: string, checked: boolean) => void;
  onCertificationChange: (certification: string, checked: boolean) => void;
  onFileUpload: (files: FileList | null) => void;
  onRemoveFile: (index: number) => void;
}

export const LegalTerritorySection: React.FC<LegalTerritorySectionProps> = ({
  legalTerritory,
  masterData,
  masterDataLoading,
  onProtectionTerritoryChange,
  onCertificationChange,
  onFileUpload,
  onRemoveFile,
}) => {
  // Fallback data when master data is not available
  const defaultProtectionTerritories = [
    {
      value: "VN",
      label: "VN (Cục SHTT)",
      description: "Việt Nam - Cục Sở hữu trí tuệ",
    },
    {
      value: "PCT",
      label: "PCT (đơn quốc tế)",
      description: "Đơn bằng sáng chế quốc tế",
    },
    {
      value: "EP_EPO",
      label: "EP/EPO (Châu Âu)",
      description: "Văn phòng Sáng chế Châu Âu",
    },
    {
      value: "US_USPTO",
      label: "US/USPTO (Hoa Kỳ)",
      description: "Văn phòng Sáng chế và Nhãn hiệu Hoa Kỳ",
    },
    {
      value: "CN_CNIPA",
      label: "CN/CNIPA (Trung Quốc)",
      description: "Cục Sáng chế Trung Quốc",
    },
    {
      value: "JP_JPO",
      label: "JP/JPO (Nhật Bản)",
      description: "Văn phòng Sáng chế Nhật Bản",
    },
    {
      value: "WO_WIPO",
      label: "WO khác",
      description: "Tổ chức Sở hữu trí tuệ thế giới khác",
    },
  ];

  const defaultCertifications = [
    {
      value: "CE",
      label: "CE Marking (EU)",
      description: "Chứng nhận Conformité Européenne",
    },
    {
      value: "FDA",
      label: "FDA Approval (US)",
      description: "Chứng nhận Cục Quản lý Thực phẩm và Dược phẩm Hoa Kỳ",
    },
    {
      value: "ISO_9001",
      label: "ISO 9001 (QMS)",
      description: "Hệ thống Quản lý Chất lượng ISO 9001",
    },
    {
      value: "ISO_IEC_27001",
      label: "ISO/IEC 27001 (ISMS)",
      description: "Hệ thống Quản lý Bảo mật Thông tin",
    },
    {
      value: "ISO_13485",
      label: "ISO 13485 (Thiết bị y tế)",
      description: "Hệ thống Quản lý Chất lượng cho Thiết bị Y tế",
    },
    {
      value: "IEC_EN",
      label: "IEC/EN (thiết bị điện - điện tử)",
      description: "Tiêu chuẩn Điện kỹ thuật Quốc tế",
    },
  ];

  const protectionTerritories =
    masterData?.protectionTerritories || defaultProtectionTerritories;
  const certifications = masterData?.certifications || defaultCertifications;

  return (
    <Card>
      <CardHeader className="px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">
          5. Pháp lý & Lãnh thổ *
        </h2>
      </CardHeader>
      <CardBody className="p-6 space-y-6">
        {/* Main grid layout with 3 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Protection Territories Column */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Phạm vi bảo hộ/chứng nhận (chọn nhiều)
            </label>
            <div className="space-y-3 border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto">
              {masterDataLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Spinner size="sm" className="mr-2" />
                  <span className="text-sm text-gray-600">Đang tải...</span>
                </div>
              ) : (
                protectionTerritories.map((territory) => (
                  <div key={territory.value} className="w-full">
                    <Checkbox
                      isSelected={legalTerritory.protectionTerritories.includes(
                        territory.value
                      )}
                      onValueChange={(checked) =>
                        onProtectionTerritoryChange(territory.value, checked)
                      }
                      size="sm"
                      classNames={{
                        base: "inline-flex max-w-full w-full bg-content1",
                        wrapper: "flex-shrink-0",
                        label: "text-sm text-gray-700 w-full",
                      }}
                    >
                      <div className="flex flex-col w-full">
                        <span className="font-medium text-sm">{territory.label}</span>
                        {territory.description && (
                          <span className="text-xs text-gray-500 mt-0.5">
                            {territory.description}
                          </span>
                        )}
                      </div>
                    </Checkbox>
                  </div>
                ))
              )}
            </div>
            <p className="text-xs text-gray-500">
              *PCT là đơn quốc tế (chưa là bằng);
              <br />
              EPO/USPTO/JPO là có quan cấp bằng/đơn tương ứng.
            </p>
          </div>

          {/* Certifications Column */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Chứng nhận tiêu chuẩn/quy chuẩn (chọn nhiều)
            </label>
            <div className="space-y-3 border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto">
              {masterDataLoading ? (
                <div className="flex items-center justify-center p-4">
                  <Spinner size="sm" className="mr-2" />
                  <span className="text-sm text-gray-600">Đang tải...</span>
                </div>
              ) : (
                certifications.map((certification) => (
                  <div key={certification.value} className="w-full">
                    <Checkbox
                      isSelected={legalTerritory.certifications.includes(
                        certification.value
                      )}
                      onValueChange={(checked) =>
                        onCertificationChange(certification.value, checked)
                      }
                      size="sm"
                      classNames={{
                        base: "inline-flex max-w-full w-full bg-content1",
                        wrapper: "flex-shrink-0",
                        label: "text-sm text-gray-700 w-full",
                      }}
                    >
                      <div className="flex flex-col w-full">
                        <span className="font-medium text-sm">{certification.label}</span>
                        {certification.description && (
                          <span className="text-xs text-gray-500 mt-0.5">
                            {certification.description}
                          </span>
                        )}
                      </div>
                    </Checkbox>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* File Upload Column */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Upload chứng nhận tiêu chuẩn địa phương (optional)
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors cursor-pointer min-h-[120px] flex flex-col justify-center"
              onClick={() =>
                document.getElementById("certification-upload")?.click()
              }
            >
              <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-1">
                Click để upload PDF/Ảnh
              </p>
              <p className="text-xs text-gray-500">Tối đa 10MB mỗi file</p>
              <input
                id="certification-upload"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => onFileUpload(e.target.files)}
              />
            </div>

            {/* Uploaded files list */}
            {legalTerritory.localCertificationFiles.length > 0 && (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {legalTerritory.localCertificationFiles.map((file, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded p-2 flex items-center justify-between"
                  >
                    <div className="flex items-center min-w-0 flex-1">
                      <FileText className="h-3 w-3 text-gray-500 mr-2 flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="text-xs text-gray-700 truncate block">
                          {file.name}
                        </span>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="light"
                      onClick={() => onRemoveFile(index)}
                      className="ml-2 flex-shrink-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Guidance box moved to bottom */}
        <Card className="bg-blue-50 border-blue-200 mt-6">
          <CardBody className="flex flex-row items-start p-4">
            <Info className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800 mb-2">
                💡 Hướng dẫn chọn lựa:
              </h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>
                  <strong>Phạm vi bảo hộ:</strong> VN (trong nước), PCT (quốc
                  tế), EP/US/CN/JP (từng khu vực)
                </p>
                <p>
                  <strong>Chứng nhận tiêu chuẩn:</strong> CE (Châu Âu), FDA
                  (Mỹ), ISO (quốc tế), IEC (điện tử)
                </p>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                💡 Tip: Hover vào các tùy chọn để xem mô tả chi tiết
              </p>
            </div>
          </CardBody>
        </Card>
      </CardBody>
    </Card>
  );
};

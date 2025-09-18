import React, { useState } from "react";
import { Plus, Trash2, Save, Download, AlertCircle } from "lucide-react";
import { IPDetail, MasterData } from "../types";
import { getIPTypeDescription } from "../utils";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Select,
  SelectItem,
  Button,
  Chip,
  Spinner,
} from "@heroui/react";

interface IPSectionProps {
  ipDetails: IPDetail[];
  masterData: MasterData | null;
  masterDataLoading: boolean;
  onAddIPDetail: () => void;
  onRemoveIPDetail: (index: number) => void;
  onUpdateIPDetail: (index: number, field: string, value: string) => void;
  // New props for API integration
  onSaveAsDraft?: (ipDetails: IPDetail[]) => Promise<boolean>;
  onLoadFromDraft?: () => IPDetail[];
  ipSaveLoading?: boolean;
  ipSaveError?: string;
}

export const IPSection: React.FC<IPSectionProps> = ({
  ipDetails,
  masterData,
  masterDataLoading,
  onAddIPDetail,
  onRemoveIPDetail,
  onUpdateIPDetail,
  onSaveAsDraft,
  onLoadFromDraft,
  ipSaveLoading = false,
  ipSaveError = "",
}) => {
  const [localError, setLocalError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  const handleSaveAsDraft = async () => {
    if (!onSaveAsDraft) return;

    setLocalError("");
    setSaveSuccess("");

    const success = await onSaveAsDraft(ipDetails);
    if (success) {
      setSaveSuccess("Đã lưu bản nháp thành công!");
      setTimeout(() => setSaveSuccess(""), 3000);
    } else {
      setLocalError("Không thể lưu bản nháp. Vui lòng thử lại.");
    }
  };

  const handleLoadFromDraft = () => {
    if (!onLoadFromDraft) return;

    try {
      const draftData = onLoadFromDraft();
      if (draftData.length > 0) {
        // This would trigger parent component to update the form
        setSaveSuccess("Đã tải bản nháp thành công!");
        setTimeout(() => setSaveSuccess(""), 3000);
      } else {
        setLocalError("Không có bản nháp nào được tìm thấy.");
      }
    } catch (error) {
      setLocalError("Không thể tải bản nháp. Vui lòng thử lại.");
    }
  };
  return (
    <Card>
      <CardHeader className="px-6 py-4">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-lg font-semibold text-gray-900">
            4. Sở hữu trí tuệ (IP) *
          </h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="flat"
              color="primary"
              size="sm"
              startContent={<Plus className="h-4 w-4" />}
              onClick={onAddIPDetail}
            >
              Thêm IP
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardBody className="p-6 space-y-4">
        {/* Error Messages */}
        {(ipSaveError || localError) && (
          <Card className="bg-red-50 border-red-200">
            <CardBody className="p-3 flex flex-row items-center text-red-600">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-sm">{ipSaveError || localError}</span>
            </CardBody>
          </Card>
        )}

        {/* Success Messages */}
        {saveSuccess && (
          <Card className="bg-green-50 border-green-200">
            <CardBody className="p-3 flex flex-row items-center text-green-600">
              <span className="text-sm">{saveSuccess}</span>
            </CardBody>
          </Card>
        )}
        {ipDetails.map((ip, index) => (
          <Card key={index} className="border border-gray-200">
            <CardBody className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select
                  label="Loại hình IP"
                  placeholder="Chọn loại hình IP"
                  selectedKeys={ip.ipType ? [ip.ipType] : []}
                  onChange={(e) => {
                    onUpdateIPDetail(index, "ipType", e.target.value);
                  }}
                  isDisabled={masterDataLoading}
                  variant="bordered"
                  classNames={{
                    label: "text-sm font-medium text-gray-700 mb-1",
                  }}
                >
                  {(masterData?.ipTypes || []).map((ipType) => (
                    <SelectItem key={ipType.value}>{ipType.label}</SelectItem>
                  ))}
                </Select>
                <Input
                  label="Số đơn/Số bằng"
                  placeholder="VD: VN1-001234"
                  value={ip.ipNumber}
                  onChange={(e) =>
                    onUpdateIPDetail(index, "ipNumber", e.target.value)
                  }
                  variant="bordered"
                  classNames={{
                    label: "text-sm font-medium text-gray-700 mb-1",
                    input: "text-sm",
                  }}
                />
                <Select
                  label="Tình trạng"
                  placeholder="Chọn tình trạng"
                  selectedKeys={ip.status ? [ip.status] : []}
                  onChange={(e) =>
                    onUpdateIPDetail(index, "status", e.target.value)
                  }
                  isDisabled={masterDataLoading}
                  variant="bordered"
                  classNames={{
                    label: "text-sm font-medium text-gray-700 mb-1",
                  }}
                >
                  {(masterData?.ipStatuses || []).map((status) => (
                    <SelectItem key={status.value}>{status.label}</SelectItem>
                  ))}
                </Select>
                <div className="flex items-end">
                  <Button
                    color="danger"
                    variant="flat"
                    startContent={<Trash2 className="h-4 w-4" />}
                    onClick={() => onRemoveIPDetail(index)}
                  >
                    Xóa
                  </Button>
                </div>
              </div>

              {/* Mô tả IP - nằm dưới grid */}
              {ip.ipType && (
                <Card className="mt-3 bg-blue-50 border-blue-200">
                  <CardBody className="p-2">
                    <p className="text-xs text-blue-700">
                      <strong>💡</strong>{" "}
                      {getIPTypeDescription(ip.ipType, masterData || undefined)}
                    </p>
                  </CardBody>
                </Card>
              )}
            </CardBody>
          </Card>
        ))}
      </CardBody>
    </Card>
  );
};

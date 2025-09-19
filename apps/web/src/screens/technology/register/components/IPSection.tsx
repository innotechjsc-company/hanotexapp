import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Select,
  SelectItem,
  Button,
} from "@heroui/react";
import {
  IntellectualProperty,
  IPType,
  IPStatus,
} from "@/types/IntellectualProperty";

interface IPSectionProps {
  onChange?: (ipDetails: IntellectualProperty[]) => void;
}

export interface IPSectionRef {
  getIPDetails: () => IntellectualProperty[];
  validate: () => boolean;
  addIPDetail: () => void;
  removeIPDetail: (index: number) => void;
}

export const IPSection = forwardRef<IPSectionRef, IPSectionProps>(
  ({ onChange }, ref) => {
    // Local data for IP types and statuses
    const ipTypes = [
      { value: "patent", label: "Bằng sáng chế" },
      { value: "utility_solution", label: "Giải pháp hữu ích" },
      { value: "industrial_design", label: "Kiểu dáng công nghiệp" },
      { value: "trademark", label: "Nhãn hiệu" },
      { value: "copyright", label: "Bản quyền" },
      { value: "trade_secret", label: "Bí mật kinh doanh" },
    ];

    const ipStatuses = [
      { value: "pending", label: "Đang chờ xử lý" },
      { value: "granted", label: "Đã cấp" },
      { value: "expired", label: "Hết hạn" },
      { value: "rejected", label: "Bị từ chối" },
    ];

    const [ipDetails, setIPDetails] = useState<IntellectualProperty[]>([]);

    useEffect(() => {
      if (onChange) {
        onChange(ipDetails);
      }
    }, [ipDetails, onChange]);

    useImperativeHandle(ref, () => ({
      getIPDetails: () => ipDetails,
      validate: () => {
        return (
          ipDetails.length > 0 &&
          ipDetails.every(
            (ip) =>
              ip.type.trim() !== "" &&
              ip.code.trim() !== "" &&
              ip.status.trim() !== ""
          )
        );
      },
      addIPDetail: handleAddIPDetail,
      removeIPDetail: handleRemoveIPDetail,
    }));

    const handleAddIPDetail = () => {
      setIPDetails((prev) => [
        ...prev,
        {
          type: "patent" as IPType,
          code: "",
          status: "pending" as IPStatus,
          technology: "",
        },
      ]);
    };

    const handleRemoveIPDetail = (index: number) => {
      setIPDetails((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpdateIPDetail = (
      index: number,
      field: string,
      value: string
    ) => {
      setIPDetails((prev) => {
        const newIPDetails = [...prev];
        const ip = { ...newIPDetails[index] };

        if (field === "type") {
          ip.type = value as IPType;
        } else if (field === "code") {
          ip.code = value;
        } else if (field === "status") {
          ip.status = value as IPStatus;
        }

        newIPDetails[index] = ip;
        return newIPDetails;
      });
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
                onClick={handleAddIPDetail}
              >
                Thêm IP
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="p-6 space-y-4">
          {ipDetails.length === 0 && (
            <div className="text-center p-4 text-gray-500">
              Chưa có thông tin sở hữu trí tuệ. Vui lòng thêm thông tin IP.
            </div>
          )}
          {ipDetails.map((ip, index) => (
            <Card key={index} className="border border-gray-200">
              <CardBody className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Select
                    label="Loại hình IP"
                    placeholder="Chọn loại hình IP"
                    selectedKeys={ip.type ? [ip.type] : []}
                    onChange={(e) => {
                      handleUpdateIPDetail(index, "type", e.target.value);
                    }}
                    variant="bordered"
                    classNames={{
                      label: "text-sm font-medium text-gray-700 mb-1",
                    }}
                  >
                    {ipTypes.map((ipType) => (
                      <SelectItem key={ipType.value}>{ipType.label}</SelectItem>
                    ))}
                  </Select>
                  <Input
                    label="Số đơn/Số bằng"
                    placeholder="VD: VN1-001234"
                    value={ip.code}
                    onChange={(e) =>
                      handleUpdateIPDetail(index, "code", e.target.value)
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
                      handleUpdateIPDetail(index, "status", e.target.value)
                    }
                    variant="bordered"
                    classNames={{
                      label: "text-sm font-medium text-gray-700 mb-1",
                    }}
                  >
                    {ipStatuses.map((status) => (
                      <SelectItem key={status.value}>{status.label}</SelectItem>
                    ))}
                  </Select>
                  <div className="flex items-end">
                    <Button
                      color="danger"
                      variant="flat"
                      startContent={<Trash2 className="h-4 w-4" />}
                      onClick={() => handleRemoveIPDetail(index)}
                    >
                      Xóa
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </CardBody>
      </Card>
    );
  }
);

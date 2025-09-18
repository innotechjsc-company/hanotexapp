import React from "react";
import { InvestmentTransfer, MasterData } from "../types";
import { Card, CardHeader, CardBody, Checkbox, Spinner } from "@heroui/react";

interface InvestmentTransferSectionProps {
  investmentTransfer: InvestmentTransfer;
  masterData: MasterData | null;
  masterDataLoading: boolean;
  onCommercializationChange: (method: string, checked: boolean) => void;
  onTransferMethodChange: (method: string, checked: boolean) => void;
}

export const InvestmentTransferSection: React.FC<InvestmentTransferSectionProps> = ({
  investmentTransfer,
  masterData,
  masterDataLoading,
  onCommercializationChange,
  onTransferMethodChange,
}) => {
  // Fallback data matching API structure
  const defaultCommercializationMethods = [
    {
      value: "B2B",
      label: "B2B",
      description: "Bán cho doanh nghiệp khác",
    },
    {
      value: "B2C",
      label: "B2C",
      description: "Bán trực tiếp cho người tiêu dùng",
    },
    {
      value: "Licensing",
      label: "Licensing",
      description: "Cấp phép sử dụng công nghệ",
    },
    {
      value: "OEM/ODM",
      label: "OEM/ODM",
      description: "Sản xuất theo đơn đặt hàng",
    },
    {
      value: "Joint Venture",
      label: "Joint Venture",
      description: "Liên doanh với đối tác",
    },
    {
      value: "Spin-off",
      label: "Spin-off",
      description: "Tách ra thành công ty riêng",
    },
  ];

  const defaultTransferMethods = [
    {
      value: "Chuyển nhượng toàn bộ",
      label: "Chuyển nhượng toàn bộ",
      description: "Bán hoàn toàn quyền sở hữu",
    },
    {
      value: "Chuyển nhượng một phần",
      label: "Chuyển nhượng một phần",
      description: "Bán một phần quyền sở hữu",
    },
    {
      value: "License độc quyền",
      label: "License độc quyền",
      description: "Cấp phép độc quyền cho một bên",
    },
    {
      value: "License không độc quyền",
      label: "License không độc quyền",
      description: "Cấp phép cho nhiều bên",
    },
    {
      value: "Sub-license",
      label: "Sub-license",
      description: "Cho phép bên được cấp phép cấp lại",
    },
    {
      value: "Kèm dịch vụ kỹ thuật",
      label: "Kèm dịch vụ kỹ thuật",
      description: "Bao gồm hỗ trợ kỹ thuật, training",
    },
  ];

  const commercializationMethods =
    masterData?.commercializationMethods || defaultCommercializationMethods;
  const transferMethods = masterData?.transferMethods || defaultTransferMethods;

  return (
    <Card>
      <CardHeader className="px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">
          6. Mong muốn đầu tư & Hình thức chuyển giao (Tùy chọn)
        </h2>
      </CardHeader>
      <CardBody className="p-6 space-y-6">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Phương án thương mại hóa (chọn nhiều)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 border border-gray-200 rounded-lg p-4">
            {masterDataLoading ? (
              <div className="col-span-3 flex items-center text-gray-600">
                <Spinner size="sm" className="mr-2" /> Đang tải...
              </div>
            ) : (
              commercializationMethods.map((item) => (
                <div key={item.value} className="w-full">
                  <Checkbox
                    isSelected={investmentTransfer.commercializationMethods.includes(
                      item.value
                    )}
                    onValueChange={(checked) =>
                      onCommercializationChange(item.value, checked)
                    }
                    size="sm"
                    classNames={{
                      base: "inline-flex max-w-full w-full bg-content1",
                      wrapper: "flex-shrink-0",
                      label: "text-sm text-gray-700 w-full",
                    }}
                  >
                    <div className="flex flex-col w-full">
                      <span className="font-medium text-sm">{item.label}</span>
                      {item.description && (
                        <span className="text-xs text-gray-500 mt-0.5">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </Checkbox>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Hình thức chuyển quyền (chọn nhiều)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 border border-gray-200 rounded-lg p-4">
            {masterDataLoading ? (
              <div className="col-span-3 flex items-center text-gray-600">
                <Spinner size="sm" className="mr-2" /> Đang tải...
              </div>
            ) : (
              transferMethods.map((item) => (
                <div key={item.value} className="w-full">
                  <Checkbox
                    isSelected={investmentTransfer.transferMethods.includes(
                      item.value
                    )}
                    onValueChange={(checked) =>
                      onTransferMethodChange(item.value, checked)
                    }
                    size="sm"
                    classNames={{
                      base: "inline-flex max-w-full w-full bg-content1",
                      wrapper: "flex-shrink-0",
                      label: "text-sm text-gray-700 w-full",
                    }}
                  >
                    <div className="flex flex-col w-full">
                      <span className="font-medium text-sm">{item.label}</span>
                      {item.description && (
                        <span className="text-xs text-gray-500 mt-0.5">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </Checkbox>
                </div>
              ))
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};


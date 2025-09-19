import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Card, CardHeader, CardBody, Spinner } from "@heroui/react";
import type { MasterData } from "@/hooks/useMasterData";
import type { InvestmentDesire, TransferType } from "@/types/technologies";

interface InvestmentTransferInitialData {
  investment_desire?: InvestmentDesire[];
  transfer_type?: TransferType[];
}

interface InvestmentTransferSectionProps {
  masterData: MasterData | null;
  masterDataLoading: boolean;
  initialData?: InvestmentTransferInitialData;
  onChange?: (data: Required<InvestmentTransferInitialData>) => void;
}

export interface InvestmentTransferSectionRef {
  getData: () => Required<InvestmentTransferInitialData>;
  reset: () => void;
}

export const InvestmentTransferSection = forwardRef<
  InvestmentTransferSectionRef,
  InvestmentTransferSectionProps
>(({ masterData, masterDataLoading, initialData, onChange }, ref) => {
  // Local state for selections
  const [selectedCommercialization, setSelectedCommercialization] = useState<
    string[]
  >(() => initialData?.investment_desire?.map((i) => i.investment_option) || []);
  const [selectedTransferMethods, setSelectedTransferMethods] = useState<
    string[]
  >(() => initialData?.transfer_type?.map((t) => t.transfer_option) || []);

  // Expose data getter to parent (collect on submit)
  useImperativeHandle(ref, () => ({
    getData: () => ({
      investment_desire: selectedCommercialization.map((value) => ({
        investment_option: value,
      })),
      transfer_type: selectedTransferMethods.map((value) => ({
        transfer_option: value,
      })),
    }),
    reset: () => {
      setSelectedCommercialization([]);
      setSelectedTransferMethods([]);
    },
  }));

  // Notify parent on change if needed (optional)
  useEffect(() => {
    if (!onChange) return;
    onChange({
      investment_desire: selectedCommercialization.map((value) => ({
        investment_option: value,
      })),
      transfer_type: selectedTransferMethods.map((value) => ({
        transfer_option: value,
      })),
    });
  }, [onChange, selectedCommercialization, selectedTransferMethods]);
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

  const handleCommercializationChange = (method: string, checked: boolean) => {
    setSelectedCommercialization((prev) =>
      checked ? [...prev, method] : prev.filter((m) => m !== method)
    );
  };

  const handleTransferMethodChange = (method: string, checked: boolean) => {
    setSelectedTransferMethods((prev) =>
      checked ? [...prev, method] : prev.filter((m) => m !== method)
    );
  };

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
                  <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedCommercialization.includes(item.value)}
                      onChange={(e) =>
                        handleCommercializationChange(item.value, e.target.checked)
                      }
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex flex-col w-full">
                      <span className="font-medium text-sm">{item.label}</span>
                      {item.description && (
                        <span className="text-xs text-gray-500 mt-0.5">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </label>
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
                  <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
                    <input
                      type="checkbox"
                      checked={selectedTransferMethods.includes(item.value)}
                      onChange={(e) =>
                        handleTransferMethodChange(item.value, e.target.checked)
                      }
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex flex-col w-full">
                      <span className="font-medium text-sm">{item.label}</span>
                      {item.description && (
                        <span className="text-xs text-gray-500 mt-0.5">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </label>
                </div>
              ))
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
});

export type { InvestmentTransferSectionRef as InvestmentTransferRef };

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Card, CardHeader, CardBody } from "@heroui/react";
import type { InvestmentDesire, TransferType } from "@/types/technologies";
import {
  commercializationMethods as commercializationConstants,
  transferMethods as transferConstants,
} from "@/constants/technology";

interface InvestmentTransferInitialData {
  investment_desire?: InvestmentDesire[];
  transfer_type?: TransferType[];
}

interface InvestmentTransferSectionProps {
  // Optional for compatibility; not used anymore
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
>(({ initialData, onChange }, ref) => {
  // Local state for selections
  const [selectedCommercialization, setSelectedCommercialization] = useState<
    string[]
  >(
    () => initialData?.investment_desire?.map((i) => i.investment_option) || []
  );
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
  // Use constants (no master data)
  const commercializationMethods = commercializationConstants;
  const transferMethods = transferConstants;

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
          6. Mong muốn đầu tư & Hình thức chuyển giao (Bắt buộc)
        </h2>
      </CardHeader>
      <CardBody className="p-6 space-y-6">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Phương án thương mại hóa (chọn nhiều)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 border border-gray-200 rounded-lg p-4">
            {commercializationMethods.map((item) => (
              <div key={item.value} className="w-full">
                <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedCommercialization.includes(item.value)}
                    onChange={(e) =>
                      handleCommercializationChange(
                        item.value,
                        e.target.checked
                      )
                    }
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="flex flex-col w-full">
                    <span className="font-medium text-sm">{item.value}</span>
                    {item.tooltip && (
                      <span className="text-xs text-gray-500 mt-0.5">
                        {item.tooltip}
                      </span>
                    )}
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Hình thức chuyển quyền (chọn nhiều)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 border border-gray-200 rounded-lg p-4">
            {transferMethods.map((item) => (
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
                    <span className="font-medium text-sm">{item.value}</span>
                    {item.tooltip && (
                      <span className="text-xs text-gray-500 mt-0.5">
                        {item.tooltip}
                      </span>
                    )}
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
});

export type { InvestmentTransferSectionRef as InvestmentTransferRef };

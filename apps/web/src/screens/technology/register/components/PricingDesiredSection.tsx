import React from "react";
import { Pricing } from "../types";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";

interface PricingDesiredSectionProps {
  pricing: Pricing;
  investmentStage: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export const PricingDesiredSection: React.FC<PricingDesiredSectionProps> = ({
  pricing,
  investmentStage,
  onChange,
}) => {
  // Hardcoded options as requested
  const investmentStages = [
    { value: "SEED_TRL_1_3", label: "Seed (TRL 1-3)" },
    { value: "SERIES_A_TRL_4_6", label: "Series A (TRL 4-6)" },
    { value: "SERIES_B_TRL_7_9", label: "Series B (TRL 7-9)" },
  ];

  const currencies = [
    { value: "VND", label: "VND" },
    { value: "USD", label: "USD" },
    { value: "EUR", label: "EUR" },
  ];

  const priceTypes = [
    { value: "INDICATIVE", label: "Indicative (không ràng buộc)" },
    { value: "FIRM", label: "Firm (ràng buộc)" },
  ];

  return (
    <Card>
      <CardHeader className="px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">
          7. Định giá & Giá mong muốn (Tùy chọn)
        </h2>
      </CardHeader>
      <CardBody className="p-6 space-y-6">
        {/* Investment Stage */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Giai đoạn đầu tư mong muốn
          </label>
          <Select
            aria-label="Giai đoạn đầu tư mong muốn"
            selectedKeys={investmentStage ? [investmentStage] : []}
            onChange={onChange as any}
            name="investmentTransfer.investmentStage"
            variant="bordered"
            placeholder="Chọn giai đoạn đầu tư"
            classNames={{
              label: "text-sm font-medium text-gray-700",
            }}
          >
            {investmentStages.map((stg) => (
              <SelectItem key={stg.value} value={stg.value}>
                {stg.label}
              </SelectItem>
            ))}
          </Select>
        </div>

        {/* Desired Pricing */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">
            Thông tin giá mong muốn
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Giá mong muốn"
              placeholder="Nhập số tiền"
              name="pricing.askingPrice"
              value={pricing.askingPrice}
              onChange={onChange}
              type="number"
              variant="bordered"
              classNames={{ label: "text-sm font-medium text-gray-700 mb-1" }}
            />
            <Select
              label="Tiền tệ"
              name="pricing.currency"
              selectedKeys={pricing.currency ? [pricing.currency] : []}
              onChange={onChange as any}
              variant="bordered"
              classNames={{ label: "text-sm font-medium text-gray-700 mb-1" }}
            >
              {currencies.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </Select>
            <Select
              label="Loại giá"
              name="pricing.priceType"
              selectedKeys={pricing.priceType ? [pricing.priceType] : []}
              onChange={onChange as any}
              variant="bordered"
              classNames={{ label: "text-sm font-medium text-gray-700 mb-1" }}
            >
              {priceTypes.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </Select>
          </div>
          <p className="text-xs text-gray-500">
            Khuyến nghị kèm thẩm định để tăng độ tin cậy.
          </p>
        </div>
      </CardBody>
    </Card>
  );
};

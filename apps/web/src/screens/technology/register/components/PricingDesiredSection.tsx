import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import type { PricingInfo, PricingType } from "@/types/technologies";

interface PricingDesiredInitialData {
  pricing?: Partial<PricingInfo>;
  investmentStage?: string;
}

interface PricingDesiredSectionProps {
  initialData?: PricingDesiredInitialData;
  onChange?: (data: { pricing: PricingInfo }) => void;
}

export interface PricingDesiredSectionRef {
  getData: () => PricingInfo;
  reset: () => void;
}

export const PricingDesiredSection = forwardRef<
  PricingDesiredSectionRef,
  PricingDesiredSectionProps
>(({ initialData, onChange }, ref) => {
  const [pricingType, setPricingType] = useState<PricingType>(
    initialData?.pricing?.pricing_type || ("grant_seed" as PricingType)
  );
  const [priceFrom, setPriceFrom] = useState<string>(
    initialData?.pricing?.price_from != null
      ? String(initialData.pricing.price_from)
      : ""
  );
  const [priceTo, setPriceTo] = useState<string>(
    initialData?.pricing?.price_to != null
      ? String(initialData.pricing.price_to)
      : ""
  );
  const [priceType, setPriceType] = useState<"indicative" | "floor" | "firm">(
    (initialData?.pricing as any)?.price_type || "indicative"
  );

  useImperativeHandle(ref, () => ({
    getData: () => ({
      pricing_type: pricingType,
      price_from: priceFrom ? Number(priceFrom) : 0,
      price_to: priceTo ? Number(priceTo) : 0,
      price_type: priceType,
    }),
    reset: () => {
      setPriceFrom("");
      setPriceTo("");
      setPriceType("indicative");
    },
  }));

  useEffect(() => {
    if (!onChange) return;
    onChange({
      pricing: {
        pricing_type: pricingType,
        price_from: priceFrom ? Number(priceFrom) : 0,
        price_to: priceTo ? Number(priceTo) : 0,
        price_type: priceType,
      },
    });
  }, [onChange, pricingType, priceFrom, priceTo, priceType]);

  // Options
  const investmentStages = [
    { value: "grant_seed", label: "Grant/Seed (TRL 1–3)" },
    { value: "vc_joint_venture", label: "VC/Joint Venture (TRL 4–6)" },
    { value: "growth_strategic", label: "Growth/Strategic (TRL 7–9)" },
  ];

  const priceTypes = [
    { value: "indicative", label: "Indicative" },
    { value: "floor", label: "Floor" },
    { value: "firm", label: "Firm" },
  ];

  return (
    <Card>
      <CardHeader className="px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">
          7. Định giá & Giá mong muốn (Tùy chọn)
        </h2>
      </CardHeader>
      <CardBody className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Giai đoạn đầu tư mong muốn
          </label>
          <Select
            aria-label="Giai đoạn đầu tư mong muốn"
            selectedKeys={pricingType ? [pricingType] : []}
            onChange={(e) => setPricingType(e.target.value as PricingType)}
            variant="bordered"
            placeholder="Chọn giai đoạn đầu tư"
            classNames={{
              label: "text-sm font-medium text-gray-700",
            }}
          >
            {investmentStages.map((stg) => (
              <SelectItem key={stg.value}>{stg.label}</SelectItem>
            ))}
          </Select>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-700">
            Thông tin giá mong muốn
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Giá từ"
              placeholder="Nhập giá tối thiểu"
              value={priceFrom}
              onChange={(e) => setPriceFrom(e.target.value)}
              type="number"
              variant="bordered"
              classNames={{ label: "text-sm font-medium text-gray-700 mb-1" }}
            />
            <Input
              label="Đến"
              placeholder="Nhập giá tối đa"
              value={priceTo}
              onChange={(e) => setPriceTo(e.target.value)}
              type="number"
              variant="bordered"
              classNames={{ label: "text-sm font-medium text-gray-700 mb-1" }}
            />
            <Select
              label="Loại giá"
              selectedKeys={priceType ? [priceType] : []}
              onChange={(e) =>
                setPriceType(e.target.value as "indicative" | "floor" | "firm")
              }
              variant="bordered"
              classNames={{ label: "text-sm font-medium text-gray-700 mb-1" }}
            >
              {priceTypes.map((pt) => (
                <SelectItem key={pt.value}>{pt.label}</SelectItem>
              ))}
            </Select>
          </div>
        </div>
      </CardBody>
    </Card>
  );
});

export type { PricingDesiredSectionRef as PricingDesiredRef };

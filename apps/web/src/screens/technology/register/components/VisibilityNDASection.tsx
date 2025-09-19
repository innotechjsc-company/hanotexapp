import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Card, CardHeader, CardBody, Select, SelectItem } from "@heroui/react";
import type { VisibilityMode } from "@/types/technologies";

interface VisibilityNDASectionProps {
  initialMode?: VisibilityMode;
  onChange?: (mode: VisibilityMode) => void;
}

export interface VisibilityNDASectionRef {
  getData: () => { visibility_mode: VisibilityMode };
  reset: () => void;
}

export const VisibilityNDASection = forwardRef<
  VisibilityNDASectionRef,
  VisibilityNDASectionProps
>(({ initialMode = "public", onChange }, ref) => {
  const [mode, setMode] = useState<VisibilityMode>(initialMode);

  useImperativeHandle(ref, () => ({
    getData: () => ({ visibility_mode: mode }),
    reset: () => setMode("public"),
  }));

  const handleChange = (value: VisibilityMode) => {
    setMode(value);
    onChange?.(value);
  };

  return (
    <Card>
      <CardHeader className="px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">
          8. Chế độ hiển thị
        </h2>
      </CardHeader>
      <CardBody className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Chế độ hiển thị công nghệ
          </label>
          <Select
            aria-label="Chế độ hiển thị"
            selectedKeys={mode ? [mode] : []}
            onChange={(e) => handleChange(e.target.value as VisibilityMode)}
            variant="bordered"
            placeholder="Chọn chế độ hiển thị"
          >
            <SelectItem key="public">Công khai</SelectItem>
            <SelectItem key="private">Riêng tư</SelectItem>
            <SelectItem key="restricted">Giới hạn</SelectItem>
          </Select>
        </div>
      </CardBody>
    </Card>
  );
});

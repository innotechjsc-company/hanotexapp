import React, { useMemo } from "react";
import { Card, CardHeader, CardBody, Select, SelectItem } from "@heroui/react";

interface VisibilityNDASectionProps {
  visibilityMode: "PUBLIC_SUMMARY" | "PUBLIC_FULL" | "PRIVATE";
  onChange: (e: any) => void;
}

export const VisibilityNDASection: React.FC<VisibilityNDASectionProps> = ({
  visibilityMode,
  onChange,
}) => {
  const publicFields = [
    { value: "TITLE", label: "Tên công nghệ/sản phẩm" },
    { value: "SHORT_DESC", label: "Mô tả ngắn (2-3 câu)" },
    { value: "TAXONOMY", label: "Lĩnh vực/Ngành/Chuyên ngành" },
    { value: "TRL", label: "TRL" },
    { value: "OWNERS", label: "Chủ sở hữu" },
    { value: "CERT_TYPES", label: "Loại chứng nhận (không hiển thị số)" },
  ];

  const ndaFields = [
    { value: "TECH_DETAIL", label: "Mô tả chi tiết kỹ thuật" },
    { value: "EVIDENCE_DOCS", label: "Tài liệu minh chứng (PDF/Ảnh/Video)" },
    { value: "APPLICATION_NUM", label: "Số đơn/Số bằng" },
    { value: "FINANCE_TEST", label: "Dữ liệu tài chính/kiểm thử chi tiết" },
    { value: "RND_CONTACT", label: "Liên hệ trực tiếp nhóm R&D" },
    { value: "WATERMARK", label: "Watermark tài liệu" },
  ];

  const selected = useMemo(() => {
    switch (visibilityMode) {
      case "PUBLIC_FULL":
        return {
          public: [...publicFields.map((i) => i.value), ...ndaFields.map((i) => i.value)],
          nda: [...ndaFields.map((i) => i.value)],
        };
      case "PRIVATE":
        return {
          public: [],
          nda: [...publicFields.map((i) => i.value), ...ndaFields.map((i) => i.value)],
        };
      case "PUBLIC_SUMMARY":
      default:
        return {
          public: publicFields.map((i) => i.value),
          nda: ndaFields.map((i) => i.value),
        };
    }
  }, [visibilityMode]);

  const publicPreview = useMemo(() => {
    if (!selected.public.length) return "Không công khai.";
    const labels = publicFields
      .filter((i) => selected.public.includes(i.value))
      .map((i) => i.label);
    const show = labels.slice(0, 5).join(", ");
    const more = labels.length > 5 ? ", ..." : "";
    return `${show}${more} (theo lựa chọn trường công khai).`;
  }, [selected.public]);

  return (
    <Card>
      <CardHeader className="px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">
          8. Chính sách hiển thị & NDA (Tùy chọn)
        </h2>
      </CardHeader>
      <CardBody className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Chế độ hiển thị
          </label>
          <Select
            aria-label="Chế độ hiển thị"
            name="visibilityMode"
            selectedKeys={[visibilityMode]}
            // Use onSelectionChange to ensure value flows to parent state
            onSelectionChange={(keys: any) => {
              const value = Array.from(keys)[0] as string;
              onChange({ target: { name: "visibilityMode", value } });
            }}
            variant="bordered"
            placeholder="Chọn chế độ hiển thị"
          >
            <SelectItem key="PUBLIC_SUMMARY">
              Tóm tắt công khai + Chi tiết sau NDA
            </SelectItem>
            <SelectItem key="PUBLIC_FULL">Hoàn toàn công khai</SelectItem>
            <SelectItem key="PRIVATE">Riêng tư (chỉ theo lời mời)</SelectItem>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Trường công khai</h3>
            <div className="border border-gray-200 rounded-lg p-4 space-y-1">
              {publicFields
                .filter((f) => selected.public.includes(f.value))
                .map((f) => (
                  <div key={f.value} className="text-sm text-gray-700">
                    • {f.label}
                  </div>
                ))}
            </div>
            <p className="text-xs text-gray-500">
              Không công khai: số bằng, tài liệu chi tiết, dữ liệu tài chính.
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Trường ẩn sau NDA</h3>
            <div className="border border-gray-200 rounded-lg p-4 space-y-1">
              {ndaFields
                .filter((f) => selected.nda.includes(f.value))
                .map((f) => (
                  <div key={f.value} className="text-sm text-gray-700">
                    • {f.label}
                  </div>
                ))}
            </div>
          </div>
        </div>

        <Card className="bg-blue-50 border-blue-200">
          <CardBody className="p-4 text-blue-800 text-sm">
            <strong>👁️ Xem trước phần CÔNG KHAI:</strong> {publicPreview}
          </CardBody>
        </Card>
      </CardBody>
    </Card>
  );
};

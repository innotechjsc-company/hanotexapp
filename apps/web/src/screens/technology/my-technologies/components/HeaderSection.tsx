"use client";

import { Button } from "antd";
import { Zap, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderSectionProps {
  selectedCount: number;
  user: any;
  onBulkDelete: () => void;
}

export function HeaderSection({
  selectedCount,
  user,
  onBulkDelete,
}: HeaderSectionProps) {
  const router = useRouter();

  const handleAddTechnology = () => {
    if (!user) {
      const toast = require("react-hot-toast").default;
      toast.error("Vui lòng đăng nhập để tiếp tục");
      router.push("/auth/login");
      return;
    }
    // Navigate to the technology registration page
    router.push("/technologies/register");
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Zap className="h-8 w-8 text-blue-600 mr-3" />
              Công nghệ của tôi
            </h1>
            <p className="text-gray-600 mt-2">
              Quản lý các công nghệ bạn đã đăng tải
            </p>
          </div>
          {selectedCount > 0 ? (
            <Button
              danger
              variant="outlined"
              icon={<Trash2 className="h-5 w-5" />}
              onClick={onBulkDelete}
            >
              Xóa đã chọn ({selectedCount})
            </Button>
          ) : (
            <Button
              type="primary"
              variant="outlined"
              icon={<Plus className="h-5 w-5" />}
              onClick={handleAddTechnology}
            >
              Thêm công nghệ mới
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

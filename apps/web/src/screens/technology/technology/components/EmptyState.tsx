"use client";

import { Card, CardBody } from "@heroui/react";
import { Search } from "lucide-react";

export default function EmptyState() {
  return (
    <Card className="py-12">
      <CardBody className="items-center text-center">
        <div className="w-16 h-16 rounded-full bg-content2 flex items-center justify-center mb-3">
          <Search className="text-default-400" size={28} />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1">Không tìm thấy công nghệ nào</h3>
        <p className="text-default-600">Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
      </CardBody>
    </Card>
  );
}


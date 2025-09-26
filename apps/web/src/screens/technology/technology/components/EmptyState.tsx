"use client";

import { Card, Empty } from "antd";

export default function EmptyState() {
  return (
    <Card className="py-12 text-center">
      <Empty
        description={
          <div>
            <h3 className="mb-1 text-base font-semibold text-foreground">
              Không tìm thấy công nghệ nào
            </h3>
            <p className="text-default-600">
              Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </p>
          </div>
        }
      />
    </Card>
  );
}

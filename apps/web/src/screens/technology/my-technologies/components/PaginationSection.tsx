"use client";

import { Pagination, Select } from "antd";
import type { Technology } from "@/types/technologies";

const { Option } = Select;

interface PaginationSectionProps {
  items: Technology[];
  totalDocs: number | undefined;
  totalPages: number | undefined;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
}

export function PaginationSection({
  items,
  totalDocs,
  totalPages,
  page,
  setPage,
  limit,
  setLimit,
  isLoading,
}: PaginationSectionProps) {
  const handleLimitChange = (value: string) => {
    const val = parseInt(value || "10", 10);
    setPage(1);
    setLimit(val);
  };

  // Calculate pagination info
  const start = totalDocs ? (page - 1) * limit + 1 : items.length ? 1 : 0;
  const end = totalDocs ? Math.min(page * limit, totalDocs) : items.length;
  const total = totalDocs ?? items.length;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="text-sm text-gray-600">
        {`${start}–${end} của ${total}`}
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Số dòng:</span>
          <Select
            size="small"
            value={String(limit)}
            onChange={handleLimitChange}
            style={{ width: 80 }}
            disabled={isLoading}
          >
            {[10, 20, 50].map((n) => (
              <Option key={String(n)} value={String(n)}>
                {n}
              </Option>
            ))}
          </Select>
        </div>
        <Pagination
          total={totalDocs || items.length}
          current={page}
          pageSize={limit}
          onChange={(p) => setPage(p)}
          showSizeChanger={false}
          disabled={isLoading}
          showQuickJumper
          showTotal={(total, range) => `${range[0]}-${range[1]} của ${total}`}
        />
      </div>
    </div>
  );
}

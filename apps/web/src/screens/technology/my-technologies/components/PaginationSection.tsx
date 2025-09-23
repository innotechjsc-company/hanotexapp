"use client";

import { Pagination, Select, SelectItem } from "@heroui/react";
import type { Technology } from "@/types/technologies";

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
  const handleLimitChange = (keys: any) => {
    const key = Array.from(keys as Set<string>)[0];
    const val = parseInt(key || "10", 10);
    setPage(1);
    setLimit(val);
  };

  // Calculate pagination info
  const start = totalDocs
    ? (page - 1) * limit + 1
    : items.length
      ? 1
      : 0;
  const end = totalDocs
    ? Math.min(page * limit, totalDocs)
    : items.length;
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
            size="sm"
            selectedKeys={new Set([String(limit)])}
            onSelectionChange={handleLimitChange}
            className="w-24"
            disabled={isLoading}
          >
            {[10, 20, 50].map((n) => (
              <SelectItem key={String(n)}>{n}</SelectItem>
            ))}
          </Select>
        </div>
        <Pagination
          total={totalPages || 1}
          page={page}
          onChange={(p) => setPage(p)}
          showControls
          isDisabled={isLoading}
        />
      </div>
    </div>
  );
}

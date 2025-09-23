"use client";

import { Input, Select, SelectItem } from "@heroui/react";

interface FiltersSectionProps {
  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

export function FiltersSection({
  statusFilter,
  setStatusFilter,
  search,
  setSearch,
  setPage,
}: FiltersSectionProps) {
  const handleStatusFilterChange = (keys: any) => {
    const key = Array.from(keys as Set<string>)[0];
    setPage(1);
    setStatusFilter(key || "");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setSearch(e.target.value);
  };

  return (
    <div className="flex items-center gap-3">
      <Select
        placeholder="Lọc theo trạng thái"
        selectedKeys={
          statusFilter ? new Set([statusFilter]) : new Set()
        }
        onSelectionChange={handleStatusFilterChange}
        className="max-w-xs"
      >
        <SelectItem key="">Tất cả trạng thái</SelectItem>
        <SelectItem key="draft">Bản nháp</SelectItem>
        <SelectItem key="pending">Chờ duyệt</SelectItem>
        <SelectItem key="approved">Đã duyệt</SelectItem>
        <SelectItem key="active">Hoạt động</SelectItem>
        <SelectItem key="inactive">Không hoạt động</SelectItem>
        <SelectItem key="rejected">Từ chối</SelectItem>
      </Select>
      <Input
        placeholder="Tìm theo tiêu đề, mô tả..."
        value={search}
        onChange={handleSearchChange}
        className="max-w-sm"
      />
    </div>
  );
}

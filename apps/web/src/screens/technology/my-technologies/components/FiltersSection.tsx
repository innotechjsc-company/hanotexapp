"use client";

import { Input, Select } from "antd";

const { Option } = Select;

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
  const handleStatusFilterChange = (value: string) => {
    setPage(1);
    setStatusFilter(value || "");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setSearch(e.target.value);
  };

  return (
    <div className="flex items-center gap-3">
      <Select
        placeholder="Lọc theo trạng thái"
        value={statusFilter || undefined}
        onChange={handleStatusFilterChange}
        style={{ width: 200 }}
        allowClear
      >
        <Option value="">Tất cả trạng thái</Option>
        <Option value="draft">Bản nháp</Option>
        <Option value="pending">Chờ duyệt</Option>
        <Option value="approved">Đã duyệt</Option>
        <Option value="active">Hoạt động</Option>
        <Option value="inactive">Không hoạt động</Option>
        <Option value="rejected">Từ chối</Option>
      </Select>
      <Input
        placeholder="Tìm theo tiêu đề, mô tả..."
        value={search}
        onChange={handleSearchChange}
        style={{ width: 300 }}
      />
    </div>
  );
}

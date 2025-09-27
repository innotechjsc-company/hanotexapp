"use client";

import { Button, Card, Input, Select } from "antd";
import { trlLevels } from "@/constants/technology";
import { Search } from "lucide-react";

interface FiltersProps {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  onClear: () => void;
  showClear: boolean;

  categories: Array<{ id: string; name: string }>;
  categorySelectedKeys: Set<string>;
  onCategoryChange: (keys: any) => void;

  trlSelectedKeys: Set<string>;
  onTrlChange: (keys: any) => void;

  // removed status filter
}

export default function Filters(props: FiltersProps) {
  const {
    searchQuery,
    onSearchChange,
    onSubmit,
    onClear,
    showClear,
    categories,
    categorySelectedKeys,
    onCategoryChange,
    trlSelectedKeys,
    onTrlChange,
    // removed status filter
  } = props;

  const categoryValue = Array.from(categorySelectedKeys)[0] ?? undefined;
  const trlValue = Array.from(trlSelectedKeys)[0] ?? undefined;

  return (
    <Card className="mb-8">
      <form onSubmit={onSubmit} className="space-y-4 p-5">
        <div className="flex gap-3 items-start flex-col md:flex-row">
          <Input
            className="flex-1"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm công nghệ..."
            prefix={<Search size={16} className="text-default-400" />}
            onPressEnter={(e) => onSubmit(e as any)}
            allowClear
          />
          <div className="flex gap-2">
            <Button type="primary" htmlType="submit">
              Tìm kiếm
            </Button>
            {showClear && (
              <Button onClick={onClear}>Xóa bộ lọc</Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Danh mục</label>
            <Select
              allowClear
              placeholder="Tất cả danh mục"
              value={categoryValue}
              onChange={(val) =>
                onCategoryChange(val ? new Set([String(val)]) : new Set())
              }
              options={categories.map((c) => ({ label: c.name, value: c.id }))}
              showSearch
              filterOption={(input, option) =>
                (option?.label as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">TRL Level</label>
            <Select
              allowClear
              placeholder="Tất cả TRL"
              value={trlValue}
              onChange={(val) =>
                onTrlChange(val ? new Set([String(val)]) : new Set())
              }
              options={trlLevels.map((t) => ({
                label: t.label,
                value: String(t.value),
              }))}
              showSearch
              filterOption={(input, option) =>
                (option?.label as string)
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </div>
        </div>
      </form>
    </Card>
  );
}

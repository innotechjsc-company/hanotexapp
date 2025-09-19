"use client";

import { Button, ButtonGroup } from "@heroui/react";
import { Grid, List, SortAsc, SortDesc } from "lucide-react";
import type { ViewMode } from "../hooks/useTechnologyList";

interface ListHeaderProps {
  total: number;
  sortBy: string;
  sortOrder: "ASC" | "DESC";
  onSort: (field: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export default function ListHeader(props: ListHeaderProps) {
  const { total, sortBy, sortOrder, onSort, viewMode, onViewModeChange } = props;

  return (
    <div className="flex items-center justify-between mb-6">
      <p className="text-sm text-default-600">
        Tìm thấy <span className="font-semibold text-foreground">{total}</span> công nghệ
      </p>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2">
          <Button
            size="sm"
            variant={sortBy === "created_at" ? "solid" : "light"}
            color={sortBy === "created_at" ? "primary" : "default"}
            onPress={() => onSort("created_at")}
            startContent={sortBy === "created_at" ? (sortOrder === "ASC" ? <SortAsc size={16} /> : <SortDesc size={16} />) : null}
          >
            Ngày cập nhật
          </Button>
          <Button
            size="sm"
            variant={sortBy === "trl_level" ? "solid" : "light"}
            color={sortBy === "trl_level" ? "primary" : "default"}
            onPress={() => onSort("trl_level")}
            startContent={sortBy === "trl_level" ? (sortOrder === "ASC" ? <SortAsc size={16} /> : <SortDesc size={16} />) : null}
          >
            TRL Level
          </Button>
        </div>

        <ButtonGroup size="sm" variant="bordered">
          <Button isDisabled={viewMode === "grid"} onPress={() => onViewModeChange("grid")} startContent={<Grid size={16} />}>
            Lưới
          </Button>
          <Button isDisabled={viewMode === "list"} onPress={() => onViewModeChange("list")} startContent={<List size={16} />}>
            Danh sách
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}


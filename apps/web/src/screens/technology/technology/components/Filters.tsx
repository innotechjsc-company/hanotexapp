"use client";

import {
  Button,
  Card,
  CardBody,
  Input,
  Autocomplete,
  AutocompleteItem,
} from "@heroui/react";
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

  return (
    <Card className="mb-8">
      <CardBody className="space-y-5">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex gap-3 items-start flex-col md:flex-row">
            <Input
              className="flex-1"
              value={searchQuery}
              onValueChange={onSearchChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSubmit(e as any);
              }}
              variant="bordered"
              placeholder="Tìm kiếm công nghệ..."
              startContent={<Search size={16} className="text-default-400" />}
            />
            <div className="flex gap-2">
              <Button color="primary" type="submit">
                Tìm kiếm
              </Button>
              {showClear && (
                <Button variant="flat" onPress={onClear}>
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Autocomplete
              label="Danh mục"
              placeholder="Tất cả danh mục"
              selectedKey={Array.from(categorySelectedKeys)[0] ?? null}
              onSelectionChange={(key) =>
                onCategoryChange(key ? new Set([String(key)]) : new Set())
              }
              isClearable
              defaultItems={categories}
            >
              {(item) => (
                <AutocompleteItem key={item.id} textValue={item.name}>
                  {item.name}
                </AutocompleteItem>
              )}
            </Autocomplete>

            <Autocomplete
              label="TRL Level"
              placeholder="Tất cả TRL"
              selectedKey={Array.from(trlSelectedKeys)[0] ?? null}
              onSelectionChange={(key) =>
                onTrlChange(key ? new Set([String(key)]) : new Set())
              }
              isClearable
              defaultItems={trlLevels}
            >
              {(item) => (
                <AutocompleteItem
                  key={String(item.value)}
                  textValue={item.label}
                >
                  {item.label}
                </AutocompleteItem>
              )}
            </Autocomplete>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

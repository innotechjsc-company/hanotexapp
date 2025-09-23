"use client";

import {
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@heroui/react";
import { Edit, Trash2, Eye, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Technology } from "@/types/technologies";
import {
  getStatusColor,
  getStatusLabel,
  getVisibilityModeLabel,
  checkUserAuth,
} from "../utils";
import type { EditableTechnology } from "../hooks/useMyTechnologies";

interface TechnologiesTableProps {
  filteredItems: Technology[];
  isLoading: boolean;
  selectedKeys: Set<string>;
  setSelectedKeys: React.Dispatch<React.SetStateAction<Set<string>>>;
  selectedCount: number;
  setCurrent: React.Dispatch<React.SetStateAction<EditableTechnology | null>>;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onViewProposals: () => void;
  user: any;
}

export function TechnologiesTable({
  filteredItems,
  isLoading,
  selectedKeys,
  setSelectedKeys,
  selectedCount,
  setCurrent,
  onView,
  onEdit,
  onDelete,
  onViewProposals,
  user,
}: TechnologiesTableProps) {
  const router = useRouter();

  const handleSelectionChange = (keys: any) => {
    if (keys === "all") {
      const all = new Set(
        (filteredItems as any[]).map((it) => String(it.id || it._id))
      );
      setSelectedKeys(all);
    } else {
      setSelectedKeys(new Set(Array.from(keys as Set<any>).map(String)));
    }
  };

  const handleView = (item: any) => {
    setCurrent(item);
    onView();
  };

  const handleEdit = (item: any) => {
    if (!checkUserAuth(user, router)) return;
    setCurrent(item);
    onEdit();
  };

  const handleDelete = (item: any) => {
    if (!checkUserAuth(user, router)) return;
    setCurrent(item);
    onDelete();
  };

  const handleViewProposals = (item: any) => {
    setCurrent(item);
    onViewProposals();
  };

  return (
    <div className="relative overflow-x-auto">
      <Table
        aria-label="Danh sách công nghệ"
        removeWrapper
        selectionMode="multiple"
        selectedKeys={selectedKeys as unknown as Set<any>}
        onSelectionChange={handleSelectionChange}
      >
        <TableHeader>
          <TableColumn className="sticky backdrop-blur z-20">
            Tiêu đề công nghệ
          </TableColumn>
          <TableColumn className="sticky backdrop-blur z-20">
            Lĩnh vực
          </TableColumn>
          <TableColumn className="sticky backdrop-blur z-20">
            Trạng thái
          </TableColumn>
          <TableColumn className="sticky backdrop-blur z-20">
            Chế độ hiển thị
          </TableColumn>
          <TableColumn className="sticky backdrop-blur right-0" align="end">
            Hành động
          </TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={isLoading ? "Đang tải..." : "Chưa có công nghệ nào"}
          items={filteredItems as any}
        >
          {(item: any) => (
            <TableRow key={item.id || item._id}>
              <TableCell className="font-medium">
                <div>
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {item.description}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-gray-600">
                {item.category?.name || "Chưa chọn"}
              </TableCell>
              <TableCell>
                <Chip color={getStatusColor(item.status)} size="sm">
                  {getStatusLabel(item.status)}
                </Chip>
              </TableCell>
              <TableCell className="text-gray-600">
                {getVisibilityModeLabel(item.visibility_mode)}
              </TableCell>
              <TableCell className="sticky backdrop-blur z-10 right-0 text-right justify-end">
                {selectedCount > 0 ? null : (
                  <div className="flex items-center gap-2 justify-end">
                    <Tooltip content="Xem chi tiết">
                      <Button
                        variant="flat"
                        size="sm"
                        startContent={<Eye className="h-4 w-4" />}
                        onPress={() => handleView(item)}
                      />
                    </Tooltip>
                    <Tooltip content="Xem đề xuất">
                      <Button
                        variant="flat"
                        size="sm"
                        startContent={<FileText className="h-4 w-4" />}
                        onPress={() => handleViewProposals(item)}
                      />
                    </Tooltip>
                    <Tooltip content="Chỉnh sửa">
                      <Button
                        variant="flat"
                        size="sm"
                        startContent={<Edit className="h-4 w-4" />}
                        onPress={() => handleEdit(item)}
                      />
                    </Tooltip>
                    <Tooltip content="Xóa">
                      <Button
                        variant="flat"
                        size="sm"
                        startContent={<Trash2 className="h-4 w-4" />}
                        onPress={() => handleDelete(item)}
                      />
                    </Tooltip>
                  </div>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

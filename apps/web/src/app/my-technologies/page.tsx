"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Zap,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  DollarSign,
  Users,
  Upload,
  FileText,
  AlertCircle,
} from "lucide-react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Input,
  Pagination,
  Select,
  SelectItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spacer,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
  useDisclosure,
  Tooltip,
  Spinner,
} from "@heroui/react";
import {
  getTechnologiesByUser,
  createTechnology,
  updateTechnology,
  deleteTechnology,
} from "@/api/technologies";
import { getCategories } from "@/api/categories";
import type {
  Technology,
  TechnologyStatus,
  PricingType,
  Currency,
  TechnologyOwner,
  OwnerType,
} from "@/types/technologies";
import type { Category } from "@/types/categories";
import { Toaster, toast } from "react-hot-toast";
import { useAuthStore } from "@/store/auth";
import { trlLevels } from "@/constants/technology";
import {
  AddTechnologyModal,
  EditTechnologyModal,
  ViewTechnologyModal,
  DeleteTechnologyModal,
} from "./components/TechnologyModals";

type EditableTechnology = Partial<Technology> & { id?: string };

type DisclosureLike = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose?: () => void;
};

// Helper function to check user authentication
const checkUserAuth = (user: any, router: any) => {
  if (!user) {
    toast.error("Vui lòng đăng nhập để tiếp tục");
    router.push("/auth/login");
    return false;
  }
  return true;
};

// Helper function to format currency
const formatCurrency = (amount: number, currency: Currency = "vnd") => {
  if (currency === "vnd") {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  } else if (currency === "usd") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  } else if (currency === "eur") {
    return new Intl.NumberFormat("en-EU", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  }
  return amount.toString();
};

// Helper function to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN");
};

// Helper function to get status color
const getStatusColor = (status: TechnologyStatus) => {
  switch (status) {
    case "draft":
      return "default";
    case "pending":
      return "warning";
    case "approved":
    case "active":
      return "success";
    case "rejected":
    case "inactive":
      return "danger";
    default:
      return "default";
  }
};

// Helper function to get status label
const getStatusLabel = (status: TechnologyStatus) => {
  switch (status) {
    case "draft":
      return "Bản nháp";
    case "pending":
      return "Chờ duyệt";
    case "approved":
      return "Đã duyệt";
    case "rejected":
      return "Từ chối";
    case "active":
      return "Hoạt động";
    case "inactive":
      return "Không hoạt động";
    default:
      return status;
  }
};

// Helper function to get pricing type label
const getPricingTypeLabel = (type: PricingType) => {
  switch (type) {
    case "grant_seed":
      return "Grant/Seed (TRL 1–3)";
    case "vc_joint_venture":
      return "VC/Joint Venture (TRL 4–6)";
    case "growth_strategic":
      return "Growth/Strategic (TRL 7–9)";
    default:
      return type;
  }
};

export default function MyTechnologiesPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [items, setItems] = useState<Technology[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalDocs, setTotalDocs] = useState<number | undefined>(undefined);
  const [totalPages, setTotalPages] = useState<number | undefined>(undefined);

  const addDisclosure = useDisclosure();
  const editDisclosure = useDisclosure();
  const viewDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();

  const [current, setCurrent] = useState<EditableTechnology | null>(null);

  const filteredItems = useMemo(() => items, [items]);

  const [actionLoading, setActionLoading] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const bulkDeleteDisclosure = useDisclosure();

  const selectedCount = useMemo(() => selectedKeys.size, [selectedKeys]);

  // Check authentication on component mount
  //   useEffect(() => {
  //     if (!user) {
  //       toast.error("Vui lòng đăng nhập để xem công nghệ của bạn", {
  //         duration: 3000,
  //       });
  //       router.push("/auth/login");
  //       return;
  //     }
  //   }, [user, router]);

  const fetchList = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const res = await getTechnologiesByUser(
        String((user as any).id || (user as any)._id),
        { limit, page }
      );
      const list = ((res as any).docs ||
        (res as any).data ||
        []) as Technology[];
      const tDocs = (res as any).totalDocs ?? list.length;
      const tPages =
        (res as any).totalPages ?? Math.max(1, Math.ceil(tDocs / limit));
      setItems(list);
      setTotalDocs(tDocs);
      setTotalPages(tPages);
    } catch (e) {
      console.error(e);
      toast.error("Không thể tải danh sách công nghệ", {
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategories({}, { limit: 100 });
      const list = ((res as any).docs || (res as any).data || []) as Category[];
      setCategories(list);
    } catch (e) {
      console.error("Failed to fetch categories:", e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchList();
      fetchCategories();
    }
  }, [page, limit, search, statusFilter, user]);

  const handleCreate = async () => {
    addDisclosure.onClose();
    await fetchList();
  };

  const handleUpdate = async () => {
    setCurrent(null);
    editDisclosure.onClose();
    await fetchList();
  };

  const handleDelete = async () => {
    if (!(current as any)?.id) return;
    if (!checkUserAuth(user, router)) return;

    const id = (current as any).id as string;
    setActionLoading(true);
    try {
      const itemsOnThisPage = items.length;
      await deleteTechnology(id);
      toast.success("Đã xóa công nghệ");
      setCurrent(null);
      deleteDisclosure.onClose();
      if (itemsOnThisPage === 1 && page > 1) {
        setPage((p) => Math.max(1, p - 1));
      } else {
        await fetchList();
      }
    } catch (e) {
      toast.error("Xóa công nghệ thất bại");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedKeys || selectedKeys.size === 0) return;
    if (!checkUserAuth(user, router)) return;

    setActionLoading(true);
    try {
      const ids = Array.from(selectedKeys);
      const itemsOnThisPage = items.length;
      await Promise.allSettled(ids.map((id) => deleteTechnology(String(id))));
      toast.success("Đã xóa các mục đã chọn");
      bulkDeleteDisclosure.onClose();
      setSelectedKeys(new Set());
      if (itemsOnThisPage === ids.length && page > 1) {
        setPage((p) => Math.max(1, p - 1));
      } else {
        await fetchList();
      }
    } catch (e) {
      toast.error("Xóa hàng loạt thất bại");
    } finally {
      setActionLoading(false);
    }
  };

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Zap className="h-8 w-8 text-blue-600 mr-3" />
                Công nghệ của tôi
              </h1>
              <p className="text-gray-600 mt-2">
                Quản lý các công nghệ bạn đã đăng tải
              </p>
            </div>
            {selectedCount > 0 ? (
              <Button
                color="danger"
                variant="bordered"
                startContent={<Trash2 className="h-5 w-5" />}
                onPress={() => {
                  bulkDeleteDisclosure.onOpen();
                }}
              >
                Xóa đã chọn ({selectedCount})
              </Button>
            ) : (
              <Button
                color="primary"
                variant="bordered"
                startContent={<Plus className="h-5 w-5" />}
                onPress={() => {
                  if (!checkUserAuth(user, router)) return;
                  setCurrent({});
                  addDisclosure.onOpen();
                }}
              >
                Thêm công nghệ mới
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="flex flex-col gap-3">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tổng công nghệ</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {totalDocs ?? items.length}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Select
                    placeholder="Lọc theo trạng thái"
                    selectedKeys={
                      statusFilter ? new Set([statusFilter]) : new Set()
                    }
                    onSelectionChange={(keys) => {
                      const key = Array.from(keys as Set<string>)[0];
                      setPage(1);
                      setStatusFilter(key || "");
                    }}
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
                    onChange={(e) => {
                      setPage(1);
                      setSearch(e.target.value);
                    }}
                    className="max-w-sm"
                  />
                </div>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="relative overflow-x-auto">
                <Table
                  aria-label="Danh sách công nghệ"
                  removeWrapper
                  selectionMode="multiple"
                  selectedKeys={selectedKeys as unknown as Set<any>}
                  onSelectionChange={(keys) => {
                    if (keys === "all") {
                      const all = new Set(
                        (filteredItems as any[]).map((it) =>
                          String(it.id || it._id)
                        )
                      );
                      setSelectedKeys(all);
                    } else {
                      setSelectedKeys(
                        new Set(Array.from(keys as Set<any>).map(String))
                      );
                    }
                  }}
                >
                  <TableHeader>
                    <TableColumn className="sticky backdrop-blur z-20">
                      Tiêu đề công nghệ
                    </TableColumn>
                    <TableColumn className="sticky backdrop-blur z-20">
                      Lĩnh vực
                    </TableColumn>
                    <TableColumn className="sticky backdrop-blur z-20">
                      Mức TRL
                    </TableColumn>
                    <TableColumn className="sticky backdrop-blur z-20">
                      Trạng thái
                    </TableColumn>
                    <TableColumn className="sticky backdrop-blur z-20">
                      Chế độ hiển thị
                    </TableColumn>
                    <TableColumn className="sticky backdrop-blur z-20">
                      Ngày tạo
                    </TableColumn>
                    <TableColumn
                      className="sticky backdrop-blur right-0"
                      align="end"
                    >
                      Hành động
                    </TableColumn>
                  </TableHeader>
                  <TableBody
                    emptyContent={
                      isLoading ? "Đang tải..." : "Chưa có công nghệ nào"
                    }
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
                        <TableCell className="text-gray-600">
                          {item.trl_level || "Chưa xác định"}
                        </TableCell>
                        <TableCell>
                          <Chip color={getStatusColor(item.status)} size="sm">
                            {getStatusLabel(item.status)}
                          </Chip>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {item.visibility_mode === "public" && "Công khai"}
                          {item.visibility_mode === "private" && "Riêng tư"}
                          {item.visibility_mode === "restricted" && "Hạn chế"}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {item.createdAt
                            ? formatDate(item.createdAt)
                            : "Chưa xác định"}
                        </TableCell>
                        <TableCell className="sticky backdrop-blur z-10 right-0 text-right justify-end">
                          {selectedCount > 0 ? null : (
                            <div className="flex items-center gap-2 justify-end">
                              <Tooltip content="Xem chi tiết">
                                <Button
                                  variant="flat"
                                  size="sm"
                                  startContent={<Eye className="h-4 w-4" />}
                                  onPress={() => {
                                    setCurrent(item);
                                    viewDisclosure.onOpen();
                                  }}
                                />
                              </Tooltip>
                              <Tooltip content="Chỉnh sửa">
                                <Button
                                  variant="flat"
                                  size="sm"
                                  startContent={<Edit className="h-4 w-4" />}
                                  onPress={() => {
                                    if (!checkUserAuth(user, router)) return;
                                    setCurrent(item);
                                    editDisclosure.onOpen();
                                  }}
                                />
                              </Tooltip>
                              <Tooltip content="Xóa">
                                <Button
                                  variant="flat"
                                  size="sm"
                                  startContent={<Trash2 className="h-4 w-4" />}
                                  onPress={() => {
                                    if (!checkUserAuth(user, router)) return;
                                    setCurrent(item);
                                    deleteDisclosure.onOpen();
                                  }}
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
            </CardBody>
          </Card>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              {(() => {
                const start = totalDocs
                  ? (page - 1) * limit + 1
                  : items.length
                    ? 1
                    : 0;
                const end = totalDocs
                  ? Math.min(page * limit, totalDocs)
                  : items.length;
                const total = totalDocs ?? items.length;
                return `${start}–${end} của ${total}`;
              })()}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Số dòng:</span>
                <Select
                  size="sm"
                  selectedKeys={new Set([String(limit)])}
                  onSelectionChange={(keys) => {
                    const key = Array.from(keys as Set<string>)[0];
                    const val = parseInt(key || "10", 10);
                    setPage(1);
                    setLimit(val);
                  }}
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
        </div>
      </div>

      <AddTechnologyModal
        disclosure={addDisclosure}
        current={current}
        setCurrent={setCurrent}
        onCreate={handleCreate}
        loading={actionLoading}
        categories={categories}
      />
      <EditTechnologyModal
        disclosure={editDisclosure}
        current={current}
        setCurrent={setCurrent}
        onUpdate={handleUpdate}
        loading={actionLoading}
        categories={categories}
      />
      <ViewTechnologyModal
        disclosure={viewDisclosure as any}
        current={current}
        categories={categories}
      />
      <DeleteTechnologyModal
        disclosure={deleteDisclosure}
        current={current}
        onDelete={handleDelete}
        loading={actionLoading}
      />
      {/* Bulk delete modal */}
      <Modal
        isOpen={bulkDeleteDisclosure.isOpen}
        onOpenChange={bulkDeleteDisclosure.onOpenChange}
        size="sm"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Xác nhận xóa hàng loạt</ModalHeader>
              <ModalBody>
                Bạn có chắc muốn xóa {selectedCount} công nghệ đã chọn? Hành
                động này không thể hoàn tác.
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Hủy
                </Button>
                <Button
                  color="danger"
                  onPress={handleBulkDelete}
                  variant="bordered"
                  startContent={<Trash2 className="h-4 w-4" />}
                  isLoading={!!actionLoading}
                >
                  Xóa tất cả
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Toaster position="top-right" />
    </div>
  );
}

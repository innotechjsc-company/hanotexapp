"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Plus, Edit, Trash2, Eye } from "lucide-react";
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
} from "@heroui/react";
import {
  getInvestmentFunds,
  createInvestmentFund,
  updateInvestmentFund,
  deleteInvestmentFund,
} from "@/api/investment-fund";
import type { InvestmentFund } from "@/types/investment_fund";
import { Toaster, toast } from "react-hot-toast";
import { useAuthStore } from "@/store/auth";

type EditableFund = Partial<InvestmentFund> & { id?: string };

type DisclosureLike = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose?: () => void;
};

function AddFundModal({
  disclosure,
  current,
  setCurrent,
  onCreate,
  loading,
}: {
  disclosure: DisclosureLike;
  current: EditableFund | null;
  setCurrent: React.Dispatch<React.SetStateAction<EditableFund | null>>;
  onCreate: () => Promise<void> | void;
  loading?: boolean;
}) {
  return (
    <Modal
      isOpen={disclosure.isOpen}
      onOpenChange={disclosure.onOpenChange}
      size="lg"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Thêm quỹ/nhà đầu tư</ModalHeader>
            <ModalBody>
              <Input
                label="Tên"
                value={current?.name || ""}
                onChange={(e) =>
                  setCurrent((p) => ({ ...(p || {}), name: e.target.value }))
                }
              />
              <Textarea
                label="Mô tả"
                value={current?.description || ""}
                onChange={(e) =>
                  setCurrent((p) => ({
                    ...(p || {}),
                    description: e.target.value,
                  }))
                }
                minRows={4}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Hủy
              </Button>
              <Button
                color="primary"
                variant="bordered"
                onPress={onCreate}
                isDisabled={!current?.name || !current?.description || loading}
                isLoading={!!loading}
              >
                Lưu
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function EditFundModal({
  disclosure,
  current,
  setCurrent,
  onUpdate,
  loading,
}: {
  disclosure: DisclosureLike;
  current: EditableFund | null;
  setCurrent: React.Dispatch<React.SetStateAction<EditableFund | null>>;
  onUpdate: () => Promise<void> | void;
  loading?: boolean;
}) {
  return (
    <Modal
      isOpen={disclosure.isOpen}
      onOpenChange={disclosure.onOpenChange}
      size="lg"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Chỉnh sửa quỹ/nhà đầu tư</ModalHeader>
            <ModalBody>
              <Input
                label="Tên"
                value={current?.name || ""}
                onChange={(e) =>
                  setCurrent((p) => ({ ...(p || {}), name: e.target.value }))
                }
              />
              <Textarea
                label="Mô tả"
                value={current?.description || ""}
                onChange={(e) =>
                  setCurrent((p) => ({
                    ...(p || {}),
                    description: e.target.value,
                  }))
                }
                minRows={4}
              />
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Hủy
              </Button>
              <Button
                color="primary"
                variant="bordered"
                onPress={onUpdate}
                isDisabled={!current?.name || !current?.description || loading}
                isLoading={!!loading}
              >
                Cập nhật
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function ViewFundModal({
  disclosure,
  current,
}: {
  disclosure: DisclosureLike;
  current: EditableFund | null;
}) {
  return (
    <Modal
      isOpen={disclosure.isOpen}
      onOpenChange={disclosure.onOpenChange}
      size="md"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader>Thông tin quỹ/nhà đầu tư</ModalHeader>
            <ModalBody>
              <div className="space-y-2">
                <div>
                  <div className="text-sm text-gray-500">Tên</div>
                  <div className="font-medium">{current?.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Mô tả</div>
                  <div className="text-gray-700 whitespace-pre-wrap">
                    {current?.description}
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onPress={() => disclosure.onClose && disclosure.onClose()}
              >
                Đóng
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function DeleteFundModal({
  disclosure,
  current,
  onDelete,
  loading,
}: {
  disclosure: DisclosureLike;
  current: EditableFund | null;
  onDelete: () => Promise<void> | void;
  loading?: boolean;
}) {
  return (
    <Modal
      isOpen={disclosure.isOpen}
      onOpenChange={disclosure.onOpenChange}
      size="sm"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Xác nhận xóa</ModalHeader>
            <ModalBody>
              Bạn có chắc chắn muốn xóa quỹ/nhà đầu tư "{current?.name}"? Hành
              động này không thể hoàn tác.
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                Hủy
              </Button>
              <Button
                color="danger"
                onPress={onDelete}
                variant="bordered"
                startContent={<Trash2 className="h-4 w-4" />}
                isLoading={!!loading}
              >
                Xóa
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default function MyInvestmentsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [items, setItems] = useState<InvestmentFund[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalDocs, setTotalDocs] = useState<number | undefined>(undefined);
  const [totalPages, setTotalPages] = useState<number | undefined>(undefined);

  const addDisclosure = useDisclosure();
  const editDisclosure = useDisclosure();
  const viewDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();

  const [current, setCurrent] = useState<EditableFund | null>(null);

  const filteredItems = useMemo(() => items, [items]);

  const [actionLoading, setActionLoading] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const bulkDeleteDisclosure = useDisclosure();

  const selectedCount = useMemo(() => selectedKeys.size, [selectedKeys]);

  const fetchList = async () => {
    setIsLoading(true);
    try {
      const res = await getInvestmentFunds(
        { search: search || undefined },
        { limit, page }
      );
      const list = ((res as any).docs ||
        (res as any).data ||
        []) as InvestmentFund[];
      const tDocs = (res as any).totalDocs ?? list.length;
      const tPages =
        (res as any).totalPages ?? Math.max(1, Math.ceil(tDocs / limit));
      setItems(list);
      setTotalDocs(tDocs);
      setTotalPages(tPages);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      // lazy import toast at top
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [page, limit, search]);

  const handleCreate = async () => {
    if (!current?.name || !current?.description) return;
    setActionLoading(true);
    try {
      if (!user) return;
      await createInvestmentFund({
        name: current.name,
        description: current.description,
        user: user,
      });
      toast.success("Tạo quỹ thành công");
      setCurrent(null);
      addDisclosure.onClose();
      await fetchList();
    } catch (e) {
      toast.error("Tạo quỹ thất bại");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!current?.name || !current?.description || !(current as any).id) return;
    const id = (current as any).id as string;
    setActionLoading(true);
    try {
      if (!user) return;
      await updateInvestmentFund(id, {
        name: current.name,
        description: current.description,
        user: user,
      });
      toast.success("Cập nhật quỹ thành công");
      setCurrent(null);
      editDisclosure.onClose();
      await fetchList();
    } catch (e) {
      toast.error("Cập nhật quỹ thất bại");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!(current as any)?.id) return;
    const id = (current as any).id as string;
    setActionLoading(true);
    try {
      const itemsOnThisPage = items.length;
      await deleteInvestmentFund(id);
      toast.success("Đã xóa quỹ");
      setCurrent(null);
      deleteDisclosure.onClose();
      if (itemsOnThisPage === 1 && page > 1) {
        setPage((p) => Math.max(1, p - 1));
      } else {
        await fetchList();
      }
    } catch (e) {
      toast.error("Xóa quỹ thất bại");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedKeys || selectedKeys.size === 0) return;
    setActionLoading(true);
    try {
      const ids = Array.from(selectedKeys);
      const itemsOnThisPage = items.length;
      await Promise.allSettled(
        ids.map((id) => deleteInvestmentFund(String(id)))
      );
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Briefcase className="h-8 w-8 text-purple-600 mr-3" />
                Quỹ đầu tư của tôi
              </h1>
              <p className="text-gray-600 mt-2">
                Quản lý các quỹ/nhà đầu tư của bạn
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
                  setCurrent({});
                  addDisclosure.onOpen();
                }}
              >
                Thêm quỹ/nhà đầu tư
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
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Briefcase className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tổng hồ sơ</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {totalDocs ?? items.length}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="Tìm theo tên, mô tả..."
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
                  aria-label="Danh sách quỹ/nhà đầu tư"
                  removeWrapper
                  selectionMode="multiple"
                  selectedKeys={selectedKeys as unknown as Set<any>}
                  onSelectionChange={(keys) => {
                    // HeroUI passes Set<React.Key> | "all"; we only support explicit Set
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
                      Tên quỹ/nhà đầu tư
                    </TableColumn>
                    <TableColumn className="sticky backdrop-blur z-20">
                      Mô tả
                    </TableColumn>
                    <TableColumn
                      className="sticky backdrop-blur right-0"
                      align="end"
                    >
                      Hành động
                    </TableColumn>
                  </TableHeader>
                  <TableBody
                    emptyContent={isLoading ? "Đang tải..." : "Chưa có dữ liệu"}
                    items={filteredItems as any}
                  >
                    {(item: any) => (
                      <TableRow key={item.id || item._id}>
                        <TableCell className="font-medium">
                          {item.name}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {item.description}
                        </TableCell>
                        <TableCell className="sticky backdrop-blur z-10 right-0 text-right justify-end">
                          {selectedCount > 0 ? null : (
                            <div className="flex items-center gap-2 justify-end">
                              <Button
                                variant="flat"
                                size="sm"
                                startContent={<Eye className="h-4 w-4" />}
                                onPress={() => {
                                  setCurrent(item);
                                  viewDisclosure.onOpen();
                                }}
                              />
                              <Button
                                variant="flat"
                                size="sm"
                                startContent={<Edit className="h-4 w-4" />}
                                onPress={() => {
                                  setCurrent(item);
                                  editDisclosure.onOpen();
                                }}
                              />
                              <Button
                                variant="flat"
                                size="sm"
                                startContent={<Trash2 className="h-4 w-4" />}
                                onPress={() => {
                                  setCurrent(item);
                                  deleteDisclosure.onOpen();
                                }}
                              />
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

      <AddFundModal
        disclosure={addDisclosure}
        current={current}
        setCurrent={setCurrent}
        onCreate={handleCreate}
        loading={actionLoading}
      />
      <EditFundModal
        disclosure={editDisclosure}
        current={current}
        setCurrent={setCurrent}
        onUpdate={handleUpdate}
        loading={actionLoading}
      />
      <ViewFundModal disclosure={viewDisclosure as any} current={current} />
      <DeleteFundModal
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
                Bạn có chắc muốn xóa {selectedCount} mục đã chọn? Hành động này
                không thể hoàn tác.
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

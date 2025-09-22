"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FolderOpen,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  DollarSign,
  Users,
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
  DatePicker,
} from "@heroui/react";
import {
  getProjects,
  getProjectsByUser,
  createProject,
  updateProject,
  deleteProject,
} from "@/api/projects";
import { getTechnologies } from "@/api/technologies";
import { getInvestmentFunds } from "@/api/investment-fund";
import type { Project } from "@/types/project";
import type { Technology } from "@/types/technologies";
import type { InvestmentFund } from "@/types/investment_fund";
import { Toaster, toast } from "react-hot-toast";
import { useAuthStore } from "@/store/auth";

type EditableProject = Partial<Project> & { id?: string };

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
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Helper function to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN");
};

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "warning";
    case "in_progress":
      return "primary";
    case "completed":
      return "success";
    case "cancelled":
      return "danger";
    default:
      return "default";
  }
};

// Helper function to get status label
const getStatusLabel = (status: string) => {
  switch (status) {
    case "pending":
      return "Chờ duyệt";
    case "in_progress":
      return "Đang thực hiện";
    case "completed":
      return "Hoàn thành";
    case "cancelled":
      return "Đã hủy";
    default:
      return status;
  }
};

function AddProjectModal({
  disclosure,
  current,
  setCurrent,
  onCreate,
  loading,
  technologies,
  investmentFunds,
}: {
  disclosure: DisclosureLike;
  current: EditableProject | null;
  setCurrent: React.Dispatch<React.SetStateAction<EditableProject | null>>;
  onCreate: () => Promise<void> | void;
  loading?: boolean;
  technologies: Technology[];
  investmentFunds: InvestmentFund[];
}) {
  return (
    <Modal
      isOpen={disclosure.isOpen}
      onOpenChange={disclosure.onOpenChange}
      size="lg"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Thêm dự án mới</ModalHeader>
            <ModalBody>
              <Input
                label="Tên dự án"
                placeholder="Nhập tên dự án"
                value={current?.name || ""}
                onChange={(e) =>
                  setCurrent((p) => ({ ...(p || {}), name: e.target.value }))
                }
                variant="bordered"
                isRequired
              />
              <Textarea
                label="Mô tả dự án"
                placeholder="Nhập mô tả chi tiết về dự án"
                value={current?.description || ""}
                onChange={(e) =>
                  setCurrent((p) => ({
                    ...(p || {}),
                    description: e.target.value,
                  }))
                }
                minRows={4}
                variant="bordered"
                isRequired
              />
              <Select
                label="Công nghệ"
                placeholder="Chọn công nghệ"
                selectedKeys={
                  current?.technology
                    ? new Set([String(current.technology)])
                    : new Set()
                }
                onSelectionChange={(keys) => {
                  const key = Array.from(keys as Set<string>)[0];
                  setCurrent((p) => ({ ...(p || {}), technology: key }));
                }}
                isRequired
                variant="bordered"
              >
                {technologies.map((tech) => (
                  <SelectItem
                    key={String((tech as any).id || (tech as any)._id)}
                  >
                    {tech.title}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="Quỹ đầu tư"
                placeholder="Chọn quỹ đầu tư"
                selectedKeys={
                  current?.investment_fund
                    ? new Set([String(current.investment_fund)])
                    : new Set()
                }
                onSelectionChange={(keys) => {
                  const key = Array.from(keys as Set<string>)[0];
                  setCurrent((p) => ({ ...(p || {}), investment_fund: key }));
                }}
                isRequired
                variant="bordered"
              >
                {investmentFunds.map((fund) => (
                  <SelectItem
                    key={String((fund as any).id || (fund as any)._id)}
                  >
                    {fund.name}
                  </SelectItem>
                ))}
              </Select>
              <Input
                label="Số tiền đầu tư kêu gọi (VND)"
                type="number"
                placeholder="Nhập số tiền"
                value={current?.goal_money ? String(current.goal_money) : ""}
                onChange={(e) =>
                  setCurrent((p) => ({
                    ...(p || {}),
                    goal_money: parseInt(e.target.value) || 0,
                  }))
                }
                variant="bordered"
              />
              <Input
                label="Ngày kết thúc"
                type="date"
                value={current?.end_date || ""}
                onChange={(e) =>
                  setCurrent((p) => ({
                    ...(p || {}),
                    end_date: e.target.value,
                  }))
                }
                variant="bordered"
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
                isDisabled={
                  !current?.name ||
                  !current?.description ||
                  !current?.technology ||
                  !current?.investment_fund ||
                  loading
                }
                isLoading={!!loading}
              >
                Tạo dự án
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function EditProjectModal({
  disclosure,
  current,
  setCurrent,
  onUpdate,
  loading,
  technologies,
  investmentFunds,
}: {
  disclosure: DisclosureLike;
  current: EditableProject | null;
  setCurrent: React.Dispatch<React.SetStateAction<EditableProject | null>>;
  onUpdate: () => Promise<void> | void;
  loading?: boolean;
  technologies: Technology[];
  investmentFunds: InvestmentFund[];
}) {
  return (
    <Modal
      isOpen={disclosure.isOpen}
      onOpenChange={disclosure.onOpenChange}
      size="lg"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Chỉnh sửa dự án</ModalHeader>
            <ModalBody>
              <Input
                label="Tên dự án"
                placeholder="Nhập tên dự án"
                value={current?.name || ""}
                onChange={(e) =>
                  setCurrent((p) => ({ ...(p || {}), name: e.target.value }))
                }
                isRequired
                variant="bordered"
              />
              <Textarea
                label="Mô tả dự án"
                placeholder="Nhập mô tả chi tiết về dự án"
                value={current?.description || ""}
                onChange={(e) =>
                  setCurrent((p) => ({
                    ...(p || {}),
                    description: e.target.value,
                  }))
                }
                minRows={4}
                isRequired
                variant="bordered"
              />
              <Select
                label="Công nghệ"
                placeholder="Chọn công nghệ"
                selectedKeys={
                  current?.technology
                    ? new Set([String(current.technology)])
                    : new Set()
                }
                onSelectionChange={(keys) => {
                  const key = Array.from(keys as Set<string>)[0];
                  setCurrent((p) => ({ ...(p || {}), technology: key }));
                }}
                isRequired
                variant="bordered"
              >
                {technologies.map((tech) => (
                  <SelectItem
                    key={String((tech as any).id || (tech as any)._id)}
                  >
                    {tech.title}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="Quỹ đầu tư"
                placeholder="Chọn quỹ đầu tư"
                selectedKeys={
                  current?.investment_fund
                    ? new Set([String(current.investment_fund)])
                    : new Set()
                }
                onSelectionChange={(keys) => {
                  const key = Array.from(keys as Set<string>)[0];
                  setCurrent((p) => ({ ...(p || {}), investment_fund: key }));
                }}
                isRequired
                variant="bordered"
              >
                {investmentFunds.map((fund) => (
                  <SelectItem
                    key={String((fund as any).id || (fund as any)._id)}
                  >
                    {fund.name}
                  </SelectItem>
                ))}
              </Select>
              <Select
                label="Trạng thái"
                placeholder="Chọn trạng thái"
                selectedKeys={
                  current?.status ? new Set([current.status]) : new Set()
                }
                onSelectionChange={(keys) => {
                  const key = Array.from(keys as Set<string>)[0];
                  setCurrent((p) => ({ ...(p || {}), status: key }));
                }}
                variant="bordered"
              >
                <SelectItem key="pending">Chờ duyệt</SelectItem>
                <SelectItem key="in_progress">Đang thực hiện</SelectItem>
                <SelectItem key="completed">Hoàn thành</SelectItem>
                <SelectItem key="cancelled">Đã hủy</SelectItem>
              </Select>
              <Input
                label="Số tiền đầu tư kêu gọi (VND)"
                type="number"
                placeholder="Nhập số tiền"
                value={current?.goal_money ? String(current.goal_money) : ""}
                onChange={(e) =>
                  setCurrent((p) => ({
                    ...(p || {}),
                    goal_money: parseInt(e.target.value) || 0,
                  }))
                }
                variant="bordered"
              />
              <Input
                label="Ngày kết thúc"
                type="date"
                value={current?.end_date || ""}
                onChange={(e) =>
                  setCurrent((p) => ({
                    ...(p || {}),
                    end_date: e.target.value,
                  }))
                }
                variant="bordered"
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
                isDisabled={
                  !current?.name ||
                  !current?.description ||
                  !current?.technology ||
                  !current?.investment_fund ||
                  loading
                }
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

function ViewProjectModal({
  disclosure,
  current,
  technologies,
  investmentFunds,
}: {
  disclosure: DisclosureLike;
  current: EditableProject | null;
  technologies: Technology[];
  investmentFunds: InvestmentFund[];
}) {
  const getTechnologyName = (techId: string | Technology) => {
    if (typeof techId === "string") {
      const tech = technologies.find(
        (t) => String((t as any).id || (t as any)._id) === techId
      );
      return tech?.title || "Không xác định";
    }
    return techId.title || "Không xác định";
  };

  const getFundName = (fundId: string | InvestmentFund) => {
    if (typeof fundId === "string") {
      const fund = investmentFunds.find(
        (f) => String((f as any).id || (f as any)._id) === fundId
      );
      return fund?.name || "Không xác định";
    }
    return fundId.name || "Không xác định";
  };

  return (
    <Modal
      isOpen={disclosure.isOpen}
      onOpenChange={disclosure.onOpenChange}
      size="lg"
      scrollBehavior="inside"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader>Thông tin dự án</ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500">Tên dự án</div>
                  <div className="font-medium text-lg">{current?.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Mô tả</div>
                  <div className="text-gray-700 whitespace-pre-wrap">
                    {current?.description}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Công nghệ</div>
                    <div className="font-medium">
                      {current?.technology
                        ? getTechnologyName(current.technology)
                        : "Chưa chọn"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Quỹ đầu tư</div>
                    <div className="font-medium">
                      {current?.investment_fund
                        ? getFundName(current.investment_fund)
                        : "Chưa chọn"}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500">Trạng thái</div>
                    <Chip
                      color={getStatusColor(current?.status || "")}
                      size="sm"
                    >
                      {getStatusLabel(current?.status || "")}
                    </Chip>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Số tiền kêu gọi</div>
                    <div className="font-medium">
                      {current?.goal_money
                        ? formatCurrency(current.goal_money)
                        : "Chưa xác định"}
                    </div>
                  </div>
                </div>
                {current?.end_date && (
                  <div>
                    <div className="text-sm text-gray-500">Ngày kết thúc</div>
                    <div className="font-medium">
                      {formatDate(current.end_date)}
                    </div>
                  </div>
                )}
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

function DeleteProjectModal({
  disclosure,
  current,
  onDelete,
  loading,
}: {
  disclosure: DisclosureLike;
  current: EditableProject | null;
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
              Bạn có chắc chắn muốn xóa dự án "{current?.name}"? Hành động này
              không thể hoàn tác.
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

export default function MyProjectsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [items, setItems] = useState<Project[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [investmentFunds, setInvestmentFunds] = useState<InvestmentFund[]>([]);
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

  const [current, setCurrent] = useState<EditableProject | null>(null);

  const filteredItems = useMemo(() => items, [items]);

  const [actionLoading, setActionLoading] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const bulkDeleteDisclosure = useDisclosure();

  const selectedCount = useMemo(() => selectedKeys.size, [selectedKeys]);

  // Check authentication on component mount
  useEffect(() => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để xem dự án của bạn", {
        duration: 3000,
      });
      router.push("/auth/login");
      return;
    }
  }, [user, router]);

  const fetchList = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const res = await getProjectsByUser(
        String((user as any).id || (user as any)._id),
        { limit, page }
      );
      const list = ((res as any).docs || (res as any).data || []) as Project[];
      const tDocs = (res as any).totalDocs ?? list.length;
      const tPages =
        (res as any).totalPages ?? Math.max(1, Math.ceil(tDocs / limit));
      setItems(list);
      setTotalDocs(tDocs);
      setTotalPages(tPages);
    } catch (e) {
      console.error(e);
      toast.error("Không thể tải danh sách dự án", {
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTechnologies = async () => {
    try {
      const res = await getTechnologies({}, { limit: 100 });
      const list = ((res as any).docs ||
        (res as any).data ||
        []) as Technology[];
      setTechnologies(list);
    } catch (e) {
      console.error("Failed to fetch technologies:", e);
    }
  };

  const fetchInvestmentFunds = async () => {
    try {
      const res = await getInvestmentFunds({}, { limit: 100 });
      const list = ((res as any).docs ||
        (res as any).data ||
        []) as InvestmentFund[];
      setInvestmentFunds(list);
    } catch (e) {
      console.error("Failed to fetch investment funds:", e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchList();
      fetchTechnologies();
      fetchInvestmentFunds();
    }
  }, [page, limit, search, statusFilter, user]);

  const handleCreate = async () => {
    if (
      !current?.name ||
      !current?.description ||
      !current?.technology ||
      !current?.investment_fund
    )
      return;
    if (!checkUserAuth(user, router)) return;

    setActionLoading(true);
    try {
      await createProject({
        name: current.name,
        description: current.description,
        technology: current.technology,
        investment_fund: current.investment_fund,
        status: current.status || "pending",
        goal_money: current.goal_money || 0,
        end_date: current.end_date,
        user: user!,
      });
      toast.success("Tạo dự án thành công");
      setCurrent(null);
      addDisclosure.onClose();
      await fetchList();
    } catch (e) {
      toast.error("Tạo dự án thất bại");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!current?.name || !current?.description || !(current as any).id) return;
    if (!checkUserAuth(user, router)) return;

    const id = (current as any).id as string;
    setActionLoading(true);
    try {
      await updateProject(id, {
        name: current.name,
        description: current.description,
        technology: current.technology,
        investment_fund: current.investment_fund,
        status: current.status,
        goal_money: current.goal_money,
        end_date: current.end_date,
        user: user!,
      });
      toast.success("Cập nhật dự án thành công");
      setCurrent(null);
      editDisclosure.onClose();
      await fetchList();
    } catch (e) {
      toast.error("Cập nhật dự án thất bại");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!(current as any)?.id) return;
    if (!checkUserAuth(user, router)) return;

    const id = (current as any).id as string;
    setActionLoading(true);
    try {
      const itemsOnThisPage = items.length;
      await deleteProject(id);
      toast.success("Đã xóa dự án");
      setCurrent(null);
      deleteDisclosure.onClose();
      if (itemsOnThisPage === 1 && page > 1) {
        setPage((p) => Math.max(1, p - 1));
      } else {
        await fetchList();
      }
    } catch (e) {
      toast.error("Xóa dự án thất bại");
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
      await Promise.allSettled(ids.map((id) => deleteProject(String(id))));
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
                <FolderOpen className="h-8 w-8 text-blue-600 mr-3" />
                Dự án của tôi
              </h1>
              <p className="text-gray-600 mt-2">
                Quản lý các dự án đầu tư của bạn
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
                Thêm dự án mới
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
                    <FolderOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tổng dự án</p>
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
                    <SelectItem key="pending">Chờ duyệt</SelectItem>
                    <SelectItem key="in_progress">Đang thực hiện</SelectItem>
                    <SelectItem key="completed">Hoàn thành</SelectItem>
                    <SelectItem key="cancelled">Đã hủy</SelectItem>
                  </Select>
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
                  aria-label="Danh sách dự án"
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
                      Tên dự án
                    </TableColumn>
                    <TableColumn className="sticky backdrop-blur z-20">
                      Công nghệ
                    </TableColumn>
                    <TableColumn className="sticky backdrop-blur z-20">
                      Quỹ đầu tư
                    </TableColumn>
                    <TableColumn className="sticky backdrop-blur z-20">
                      Số tiền kêu gọi
                    </TableColumn>
                    <TableColumn className="sticky backdrop-blur z-20">
                      Trạng thái
                    </TableColumn>
                    <TableColumn className="sticky backdrop-blur z-20">
                      Ngày kết thúc
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
                      isLoading ? "Đang tải..." : "Chưa có dự án nào"
                    }
                    items={filteredItems as any}
                  >
                    {(item: any) => (
                      <TableRow key={item.id || item._id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="font-semibold">{item.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {item.description}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {item.technology?.title || "Chưa chọn"}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {item.investment_fund?.name || "Chưa chọn"}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {item.goal_money
                            ? formatCurrency(item.goal_money)
                            : "Chưa xác định"}
                        </TableCell>
                        <TableCell>
                          <Chip color={getStatusColor(item.status)} size="sm">
                            {getStatusLabel(item.status)}
                          </Chip>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {item.end_date
                            ? formatDate(item.end_date)
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

      <AddProjectModal
        disclosure={addDisclosure}
        current={current}
        setCurrent={setCurrent}
        onCreate={handleCreate}
        loading={actionLoading}
        technologies={technologies}
        investmentFunds={investmentFunds}
      />
      <EditProjectModal
        disclosure={editDisclosure}
        current={current}
        setCurrent={setCurrent}
        onUpdate={handleUpdate}
        loading={actionLoading}
        technologies={technologies}
        investmentFunds={investmentFunds}
      />
      <ViewProjectModal
        disclosure={viewDisclosure as any}
        current={current}
        technologies={technologies}
        investmentFunds={investmentFunds}
      />
      <DeleteProjectModal
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
                Bạn có chắc muốn xóa {selectedCount} dự án đã chọn? Hành động
                này không thể hoàn tác.
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

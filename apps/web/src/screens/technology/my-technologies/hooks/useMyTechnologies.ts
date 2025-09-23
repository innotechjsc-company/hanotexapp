"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDisclosure } from "@heroui/react";
import { getTechnologiesByUser, deleteTechnology } from "@/api/technologies";
import { getCategories } from "@/api/categories";
import type { Technology } from "@/types/technologies";
import type { Category } from "@/types/categories";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/auth";
import { checkUserAuth } from "../utils";

export type EditableTechnology = Partial<Technology> & { id?: string };

export interface UseMyTechnologiesReturn {
  // Data state
  items: Technology[];
  categories: Category[];
  current: EditableTechnology | null;
  setCurrent: React.Dispatch<React.SetStateAction<EditableTechnology | null>>;

  // Loading states
  isLoading: boolean;
  actionLoading: boolean;

  // Filters and pagination
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  statusFilter: string;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  totalDocs: number | undefined;
  totalPages: number | undefined;

  // Selection state
  selectedKeys: Set<string>;
  setSelectedKeys: React.Dispatch<React.SetStateAction<Set<string>>>;
  selectedCount: number;

  // Computed data
  filteredItems: Technology[];

  // Modal disclosures
  addDisclosure: ReturnType<typeof useDisclosure>;
  editDisclosure: ReturnType<typeof useDisclosure>;
  viewDisclosure: ReturnType<typeof useDisclosure>;
  deleteDisclosure: ReturnType<typeof useDisclosure>;
  bulkDeleteDisclosure: ReturnType<typeof useDisclosure>;
  proposalsDisclosure: ReturnType<typeof useDisclosure>;

  // Actions
  fetchList: () => Promise<void>;
  handleCreate: () => Promise<void>;
  handleUpdate: () => Promise<void>;
  handleDelete: () => Promise<void>;
  handleBulkDelete: () => Promise<void>;

  // User data
  user: any;
}

export function useMyTechnologies(): UseMyTechnologiesReturn {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  // Data state
  const [items, setItems] = useState<Technology[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [current, setCurrent] = useState<EditableTechnology | null>(null);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters and pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalDocs, setTotalDocs] = useState<number | undefined>(undefined);
  const [totalPages, setTotalPages] = useState<number | undefined>(undefined);

  // Selection state
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  // Modal disclosures
  const addDisclosure = useDisclosure();
  const editDisclosure = useDisclosure();
  const viewDisclosure = useDisclosure();
  const deleteDisclosure = useDisclosure();
  const bulkDeleteDisclosure = useDisclosure();
  const proposalsDisclosure = useDisclosure();

  // Computed values
  const filteredItems = useMemo(() => items, [items]);
  const selectedCount = useMemo(() => selectedKeys.size, [selectedKeys]);

  // Fetch technologies list
  const fetchList = useCallback(async () => {
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
  }, [user, limit, page]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await getCategories({}, { limit: 100 });
      const list = ((res as any).docs || (res as any).data || []) as Category[];
      setCategories(list);
    } catch (e) {
      console.error("Failed to fetch categories:", e);
    }
  }, []);

  // Effect to fetch data when dependencies change
  useEffect(() => {
    if (user) {
      fetchList();
      fetchCategories();
    }
  }, [page, limit, search, statusFilter, user, fetchList, fetchCategories]);

  // Action handlers
  const handleCreate = useCallback(async () => {
    addDisclosure.onClose();
    await fetchList();
  }, [addDisclosure, fetchList]);

  const handleUpdate = useCallback(async () => {
    setCurrent(null);
    editDisclosure.onClose();
    await fetchList();
  }, [editDisclosure, fetchList]);

  const handleDelete = useCallback(async () => {
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
  }, [current, user, router, items.length, deleteDisclosure, page, fetchList]);

  const handleBulkDelete = useCallback(async () => {
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
  }, [
    selectedKeys,
    user,
    router,
    items.length,
    bulkDeleteDisclosure,
    page,
    fetchList,
  ]);

  return {
    // Data state
    items,
    categories,
    current,
    setCurrent,

    // Loading states
    isLoading,
    actionLoading,

    // Filters and pagination
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    limit,
    setLimit,
    totalDocs,
    totalPages,

    // Selection state
    selectedKeys,
    setSelectedKeys,
    selectedCount,

    // Computed data
    filteredItems,

    // Modal disclosures
    addDisclosure,
    editDisclosure,
    viewDisclosure,
    deleteDisclosure,
    bulkDeleteDisclosure,
    proposalsDisclosure,

    // Actions
    fetchList,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleBulkDelete,

    // User data
    user,
  };
}

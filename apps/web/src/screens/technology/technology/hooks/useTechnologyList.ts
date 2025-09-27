"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAllCategories } from "@/api/categories";
import { getPublicTechnologies } from "@/api/technologies";

export type ViewMode = "grid" | "list";

export interface UseTechnologyListReturn {
  // data
  technologies: any[];
  categories: Array<{ id: string; name: string }>;
  loading: boolean;

  // state
  searchQuery: string;
  sortBy: string;
  sortOrder: "ASC" | "DESC";
  viewMode: ViewMode;
  filters: { category: string; trl_level: string; status: string };

  // derived for HeroUI Select
  categorySelectedKeys: Set<string>;
  trlSelectedKeys: Set<string>;
  statusSelectedKeys: Set<string>;

  // actions
  setViewMode: (v: ViewMode) => void;
  setSearchQuery: (v: string) => void;
  setFilters: (f: { category: string; trl_level: string; status: string }) => void;
  handleCategorySelection: (keys: any) => void;
  handleTrlSelection: (keys: any) => void;
  handleStatusSelection: (keys: any) => void;
  handleSearchSubmit: (e?: React.FormEvent) => void;
  handleSort: (field: string) => void;
  clearFilters: () => void;

  // helpers
  showClear: boolean;
  trlChipColor: (level?: number) => "default" | "warning" | "success";
  statusChipColor: (status?: string) => "success" | "warning" | "default";
}

export function useTechnologyList(): UseTechnologyListReturn {
  const [technologies, setTechnologies] = useState<any[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filters, setFilters] = useState({ category: "", trl_level: "", status: "ACTIVE" });

  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize search query from URL
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearchQuery(q);
  }, [searchParams]);

  // Load categories
  useEffect(() => {
    const run = async () => {
      try {
        const res = await getAllCategories({ limit: 100 });
        const list = (res.docs || res.data || []) as any[];
        setCategories(
          list
            .filter((c) => c && (c.id || c._id))
            .map((c) => ({ id: String(c.id ?? c._id), name: c.name }))
        );
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]);
      }
    };
    run();
  }, []);

  // Fetch technologies via Payload API + client-side filtering fallback
  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        setLoading(true);
        // Map UI state to API filters/pagination
        const mapStatus = (s?: string) => {
          if (!s) return undefined;
          const up = s.toUpperCase();
          if (up === "ACTIVE") return "active";
          if (up === "PENDING") return "pending";
          return undefined; // Unknown mapping like SOLD -> ignore at API level
        };

        const sortField = sortBy === "created_at" ? "createdAt" : sortBy === "trl_level" ? "trl_level" : "createdAt";
        const sortParam = `${sortOrder === "DESC" ? "-" : ""}${sortField}`;

        const apiFilters: any = {
          category_id: filters.category || undefined,
          status: mapStatus(filters.status),
          search: searchQuery || undefined,
        };

        const response = await getPublicTechnologies(apiFilters, { sort: sortParam, limit: 20 });

        const list = ((response.docs as any[]) || (response.data as any[]) || []) as any[];
        if (Array.isArray(list)) {
          let data: any[] = list;

          // Search filter
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            data = data.filter((t) =>
              (t.title && t.title.toLowerCase().includes(q)) ||
              (t.public_summary && t.public_summary.toLowerCase().includes(q)) ||
              (t.category_name && t.category_name.toLowerCase().includes(q)) ||
              (t.owners && Array.isArray(t.owners) && t.owners.some((o: any) => o.owner_name && o.owner_name.toLowerCase().includes(q)))
            );
          }

          // Category filter: ensure by id or name if backend didn't filter
          if (filters.category) {
            const chosen = categories.find((c) => c.id === filters.category)?.name;
            data = data.filter((t) =>
              (t.category_name && chosen && t.category_name === chosen) ||
              (t.category && typeof t.category === "object" && (t.category.id === filters.category || t.category?._id === filters.category)) ||
              (t.category && typeof t.category === "string" && t.category === filters.category)
            );
          }

          // TRL filter: support range (e.g. "1-3") or single ("1")
          if (filters.trl_level) {
            if (filters.trl_level.includes("-")) {
              const [min, max] = filters.trl_level.split("-").map(Number);
              data = data.filter((t) => (t.trl_level ?? 0) >= min && (t.trl_level ?? 0) <= max);
            } else {
              const lv = Number(filters.trl_level);
              if (!Number.isNaN(lv)) {
                data = data.filter((t) => Number(t.trl_level ?? 0) === lv);
              }
            }
          }

          // Status filter (client-side normalization)
          if (filters.status) {
            const desired = filters.status.toUpperCase();
            data = data.filter((t) => String(t.status || "").toUpperCase() === desired);
          }

          setTechnologies(data);
        } else {
          console.error("Technologies response is not an array:", response);
          setTechnologies([]);
        }
      } catch (err) {
        console.error("Error fetching technologies:", err);
        setTechnologies([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchTechnologies, searchQuery ? 300 : 0);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, sortBy, sortOrder, filters, categories]);

  // Handlers
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    else params.delete("q");
    router.push(`/technologies?${params.toString()}`);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    else {
      setSortBy(field);
      setSortOrder("DESC");
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilters({ category: "", trl_level: "", status: "ACTIVE" });
    router.push("/technologies");
  };

  const handleCategorySelection = (keys: any) => {
    const value = (Array.from(keys)[0] as string) || "";
    setFilters((f) => ({ ...f, category: value }));
  };

  const handleTrlSelection = (keys: any) => {
    const value = (Array.from(keys)[0] as string) || "";
    setFilters((f) => ({ ...f, trl_level: value }));
  };

  const handleStatusSelection = (keys: any) => {
    const value = (Array.from(keys)[0] as string) || "";
    setFilters((f) => ({ ...f, status: value }));
  };

  const trlChipColor = (level?: number) => {
    const lv = level ?? 0;
    if (lv <= 3) return "default" as const;
    if (lv <= 6) return "warning" as const;
    return "success" as const;
  };

  const statusChipColor = (status?: string) => {
    const s = String(status || "").toUpperCase();
    switch (s) {
      case "ACTIVE":
        return "success" as const;
      case "PENDING":
        return "warning" as const;
      default:
        return "default" as const;
    }
  };

  // Derived selectedKeys for Select components
  const categorySelectedKeys = useMemo(() => (filters.category ? new Set([filters.category]) : new Set<string>()), [filters.category]);
  const trlSelectedKeys = useMemo(() => (filters.trl_level ? new Set([filters.trl_level]) : new Set<string>()), [filters.trl_level]);
  const statusSelectedKeys = useMemo(() => (filters.status ? new Set([filters.status]) : new Set<string>()), [filters.status]);

  const showClear = Boolean(
    searchQuery || filters.category || filters.trl_level || filters.status !== "ACTIVE"
  );

  return {
    technologies,
    categories,
    loading,
    searchQuery,
    sortBy,
    sortOrder,
    viewMode,
    filters,
    categorySelectedKeys,
    trlSelectedKeys,
    statusSelectedKeys,
    setViewMode,
    setSearchQuery,
    setFilters,
    handleCategorySelection,
    handleTrlSelection,
    handleStatusSelection,
    handleSearchSubmit,
    handleSort,
    clearFilters,
    showClear,
    trlChipColor,
    statusChipColor,
  };
}

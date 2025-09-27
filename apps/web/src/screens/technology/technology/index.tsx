"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Spinner } from "@heroui/react";
import { Cpu, Lightbulb, Zap, TrendingUp } from "lucide-react";
import TechnologyCard from "./components/TechnologyCard";
import EmptyState from "./components/EmptyState";
import { getPublicTechnologies } from "@/api/technologies";
import { getAllCategories } from "@/api/categories";
import Filters from "./components/Filters";
import SectionBanner from "@/components/ui/SectionBanner";
import AnimatedIcon from "@/components/ui/AnimatedIcon";

export default function TechnologyListScreen() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [categorySelectedKeys, setCategorySelectedKeys] = useState<Set<string>>(
    new Set()
  );
  const [trlSelectedKeys, setTrlSelectedKeys] = useState<Set<string>>(
    new Set()
  );

  // Simple helpers for chips
  const trlChipColor = (level?: number): "default" | "warning" | "success" => {
    const lv = level ?? 0;
    if (lv <= 3) return "default";
    if (lv <= 6) return "warning";
    return "success";
  };

  const statusChipColor = (
    status?: string
  ): "success" | "warning" | "default" => {
    const s = String(status || "").toUpperCase();
    if (s === "ACTIVE") return "success";
    if (s === "PENDING") return "warning";
    return "default";
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const categoryId = Array.from(categorySelectedKeys)[0];
      const trlKey = Array.from(trlSelectedKeys)[0];
      const trlLevel = trlKey ? Number(trlKey) : undefined;

      const res = await getPublicTechnologies(
        {
          search: query || undefined,
          category_id: categoryId || undefined,
          trl_level: Number.isFinite(trlLevel as number)
            ? (trlLevel as number)
            : undefined,
        },
        { page, limit, sort: "-createdAt" }
      );

      const list = Array.isArray(res?.data)
        ? (res.data as any[])
        : Array.isArray(res?.docs)
          ? (res.docs as any[])
          : [];

      setItems(list);

      // Derive pagination
      const tp =
        (res as any)?.totalPages ?? (res as any)?.pagination?.totalPages;
      const td = (res as any)?.totalDocs ?? (res as any)?.pagination?.total;
      const lim = (res as any)?.limit ?? limit;

      setTotalPages(
        typeof tp === "number" && tp > 0
          ? tp
          : Math.max(1, Math.ceil((td || list.length) / lim))
      );
      setTotalDocs(typeof td === "number" ? td : list.length);
    } catch (e) {
      console.error("Failed to load technologies", e);
      setItems([]);
      setTotalPages(1);
      setTotalDocs(0);
    } finally {
      setLoading(false);
    }
  };

  // Load categories once
  useEffect(() => {
    const run = async () => {
      try {
        const res = await getAllCategories({ limit: 100 });
        const list = (res.docs || res.data || []) as any[];
        const mapped = list
          .filter((c) => c && (c.id || c._id))
          .map((c) => ({ id: String(c.id ?? c._id), name: c.name }));
        setCategories(mapped);
      } catch (e) {
        console.error("Failed to load categories", e);
        setCategories([]);
      }
    };
    run();
  }, []);

  // Handle URL parameters
  useEffect(() => {
    const categoryId = searchParams.get("category_id");
    if (categoryId) {
      setCategorySelectedKeys(new Set([categoryId]));
    }
  }, [searchParams]);

  // Refetch when page or filters change
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, categorySelectedKeys, trlSelectedKeys]);

  const onSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (page === 1) {
      fetchData();
    } else {
      setPage(1);
    }
  };

  const canPrev = useMemo(() => page > 1, [page]);
  const canNext = useMemo(() => page < totalPages, [page, totalPages]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Technology Banner */}
      <SectionBanner
        title="Kho Công nghệ"
        subtitle="Khám phá và tìm kiếm các công nghệ tiên tiến từ doanh nghiệp, viện nghiên cứu và trường đại học trên toàn quốc"
        icon={<AnimatedIcon animation="rotate" delay={500}><Cpu className="h-12 w-12 text-white" /></AnimatedIcon>}
        variant="hero"
        className="mb-8"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center space-x-3">
          <AnimatedIcon animation="pulse">
            <Lightbulb className="h-8 w-8 text-blue-600" />
          </AnimatedIcon>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Danh sách công nghệ
            </h1>
            <p className="text-default-600">
              Tìm kiếm và duyệt các công nghệ công bố công khai
            </p>
          </div>
        </div>

        {/* Search + Filters */}
        <Filters
          searchQuery={query}
          onSearchChange={setQuery}
          onSubmit={onSubmit}
          onClear={() => {
            setQuery("");
            setCategorySelectedKeys(new Set());
            setTrlSelectedKeys(new Set());
            setPage(1);
          }}
          showClear={Boolean(
            query || categorySelectedKeys.size || trlSelectedKeys.size
          )}
          categories={categories}
          categorySelectedKeys={categorySelectedKeys}
          onCategoryChange={(keys) => {
            setCategorySelectedKeys(new Set(keys));
            setPage(1);
          }}
          trlSelectedKeys={trlSelectedKeys}
          onTrlChange={(keys) => {
            setTrlSelectedKeys(new Set(keys));
            setPage(1);
          }}
        />

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner size="lg" color="primary" />
          </div>
        ) : items.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((tech) => (
                <TechnologyCard
                  key={tech.id}
                  item={tech}
                  viewMode="grid"
                  trlChipColor={trlChipColor}
                  statusChipColor={statusChipColor}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-8">
              <p className="text-sm text-default-600">
                Tổng:{" "}
                <span className="font-semibold text-foreground">
                  {totalDocs}
                </span>{" "}
                kết quả
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="bordered"
                  isDisabled={!canPrev}
                  onPress={() => canPrev && setPage((p) => Math.max(1, p - 1))}
                >
                  Trang trước
                </Button>
                <span className="text-sm text-default-600">
                  Trang{" "}
                  <span className="font-semibold text-foreground">{page}</span>{" "}
                  / {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="bordered"
                  isDisabled={!canNext}
                  onPress={() => canNext && setPage((p) => p + 1)}
                >
                  Trang sau
                </Button>
              </div>
            </div>
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

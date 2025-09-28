"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";
import {
  Search,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Calendar,
  DollarSign,
  Users,
  ArrowRight,
  Plus,
  Send,
} from "lucide-react";
import { Card, Input, Button, Select, Spin, Tag } from "antd";
import { getDemands } from "@/api/demands";
import { getAllCategories } from "@/api/categories";
import { Demand } from "@/types/demand";
import { Category } from "@/types/categories";
import { formatPriceRange } from "@/constants/demands";
import DemandCard from "./components/DemandCard";

export default function DemandsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [demands, setDemands] = useState<Demand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState({
    category: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalPages: 1,
    totalDocs: 0,
  });

  // Bỏ budget options vì không yêu cầu trên màn hình này
  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const response = await getAllCategories({ limit: 100 }); // Get all categories

      if (response.docs && Array.isArray(response.docs)) {
        setCategories(response.docs.flat());
      } else if (response.data && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.log("No categories found, setting empty array");
        setCategories([]);
      }
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      // Set fallback categories for testing if API fails
      setCategories([
        {
          id: "fallback-1",
          name: "Công nghệ thông tin",
          code_intl: "1.0",
          code_vn: "100",
        },
        { id: "fallback-2", name: "Y tế", code_intl: "2.0", code_vn: "200" },
        {
          id: "fallback-3",
          name: "Nông nghiệp",
          code_intl: "3.0",
          code_vn: "300",
        },
        {
          id: "fallback-4",
          name: "Môi trường",
          code_intl: "4.0",
          code_vn: "400",
        },
      ]);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // Fetch demands from API
  const fetchDemands = useCallback(async () => {
    try {
      setError("");

      // Build filters object for API using PayloadCMS where syntax
      const apiFilters: any = {};
      if (activeSearchQuery) {
        apiFilters["where[title][contains]"] = activeSearchQuery;
      }
      if (filters.category) {
        apiFilters["where[category][equals]"] = filters.category;
      }

      // Build pagination + sort
      const paginationParams = {
        page: pagination.page,
        limit: pagination.limit,
        sort: `${sortOrder === "DESC" ? "-" : ""}${sortBy}`,
      };

      const response = await getDemands(apiFilters, paginationParams);
      if (response.docs && response.docs.length > 0) {
        const flattenedDemands = response.docs.flat();
        setDemands(flattenedDemands);
      } else if (response.data) {
        setDemands(
          Array.isArray(response.data) ? response.data : [response.data]
        );
      } else {
        setDemands([]);
      }

      setPagination((prev) => ({
        ...prev,
        totalPages: response.totalPages || 1,
        totalDocs: response.totalDocs || 0,
      }));
    } catch (err: any) {
      console.error("Error fetching demands:", err);
      setError(err.message || "Có lỗi xảy ra khi tải danh sách nhu cầu");
      setDemands([]);
    } finally {
      setLoading(false);
      setIsFiltering(false);
    }
  }, [
    activeSearchQuery,
    filters.category,
    pagination.page,
    pagination.limit,
    sortBy,
    sortOrder,
  ]);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchDemands();
  }, [fetchDemands]);

  // Extracted search logic to be reusable
  const performSearch = useCallback(() => {
    if (activeSearchQuery) {
      // Clear search
      setActiveSearchQuery("");
      setSearchQuery("");
    } else {
      // Perform search
      setActiveSearchQuery(searchQuery.trim());
    }
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [searchQuery, activeSearchQuery]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      performSearch();
    },
    [performSearch]
  );

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, []);

  const handleSort = useCallback(
    (field: string) => {
      if (sortBy === field) {
        setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
      } else {
        setSortBy(field);
        setSortOrder("DESC");
      }
    },
    [sortBy, sortOrder]
  );

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Đang tìm kiếm";
      case "FULFILLED":
        return "Đã tìm thấy";
      case "EXPIRED":
        return "Hết hạn";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Spin size="large" />
            <p className="text-default-600 mt-4">
              Đang tải danh sách nhu cầu...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center py-2">
            <div className="p-2">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Có lỗi xảy ra
              </h3>
              <p className="text-default-600 mb-4">{error}</p>
              <Button
                type="primary"
                onClick={() => {
                  setError("");
                  fetchDemands();
                }}
              >
                Thử lại
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Nhu cầu công nghệ
            </h1>
            <p className="text-default-600">
              Khám phá các nhu cầu công nghệ từ doanh nghiệp và tổ chức
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-sm mb-4">
          <div className="p-2">
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm nhu cầu công nghệ..."
                  prefix={<Search className="h-4 w-4 text-gray-400" />}
                  onPressEnter={(e) => {
                    e.preventDefault();
                    performSearch();
                  }}
                  className="flex-1"
                />
                <Button
                  type="primary"
                  onClick={performSearch}
                  danger={!!activeSearchQuery}
                >
                  {activeSearchQuery ? "Xóa tìm kiếm" : "Tìm kiếm"}
                </Button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-600">Danh mục</label>
                  <Select
                    allowClear
                    placeholder="Tất cả danh mục"
                    value={filters.category || undefined}
                    loading={categoriesLoading}
                    onChange={(val) =>
                      handleFilterChange({ ...filters, category: val || "" })
                    }
                    options={[
                      ...categories.map((c) => ({
                        label: c.name,
                        value: c.id || c.name,
                      })),
                    ]}
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label as string)
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-4 mt-2">
          <div className="flex items-center space-x-4">
            <p className="text-default-600">
              Tìm thấy{" "}
              <span className="font-semibold">{pagination.totalDocs}</span>
              {activeSearchQuery && (
                <span className="ml-1 text-default-500">
                  cho "{activeSearchQuery}"
                </span>
              )}{" "}
              nhu cầu
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <Button
                type={sortBy === "createdAt" ? "primary" : "default"}
                size="small"
                onClick={() => handleSort("createdAt")}
                icon={
                  sortBy === "createdAt" ? (
                    sortOrder === "ASC" ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    )
                  ) : undefined
                }
              >
                Ngày tạo
              </Button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                type={viewMode === "grid" ? "primary" : "default"}
                size="small"
                onClick={() => setViewMode("grid")}
                icon={<Grid className="h-4 w-4" />}
              />
              <Button
                type={viewMode === "list" ? "primary" : "default"}
                size="small"
                onClick={() => setViewMode("list")}
                icon={<List className="h-4 w-4" />}
              />
            </div>
          </div>
        </div>

        {/* Demands Grid/List */}
        <div className="relative">
          {isFiltering && (
            <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
              <Spin size="large" />
            </div>
          )}
          {demands.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch"
                  : "space-y-3"
              }
            >
              {demands.map((demand, index) => (
                <DemandCard
                  key={demand.id || index}
                  demand={demand}
                  viewMode={viewMode}
                  isAuthenticated={isAuthenticated}
                  onViewDetails={() => {
                    const target = `/demands/${demand.id || index}`;
                    if (isAuthenticated) {
                      router.push(target);
                    } else {
                      router.push(
                        `/auth/login?redirect=${encodeURIComponent(target)}`
                      );
                    }
                  }}
                  onPropose={() => router.push(`/demands/${demand.id}/propose`)}
                />
              ))}
            </div>
          ) : (
            <Card className="py-2">
              <div className="flex flex-col items-center justify-center text-center p-2">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Không tìm thấy nhu cầu nào
                </h3>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          type="primary"
          shape="circle"
          size="large"
          className="w-14 h-14 shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
          onClick={() => {
            if (isAuthenticated) {
              router.push("/demands/register");
            } else {
              router.push("/auth/login?redirect=/demands/register");
            }
          }}
          title={
            isAuthenticated
              ? "Đăng nhu cầu KH&CN mới"
              : "Đăng nhập để đăng nhu cầu"
          }
          icon={<Plus className="h-6 w-6" />}
        />
      </div>
    </div>
  );
}

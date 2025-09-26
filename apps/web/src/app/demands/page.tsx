"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";
import {
  Search,
  Filter,
  Grid,
  List,
  SortAsc,
  SortDesc,
  MapPin,
  Calendar,
  Eye,
  DollarSign,
  Clock,
  Users,
  ArrowRight,
  Plus,
  Send,
} from "lucide-react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Select,
  SelectItem,
  Chip,
  Spinner,
  ButtonGroup,
  Avatar,
} from "@heroui/react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getDemands } from "@/api/demands";
import { getAllCategories } from "@/api/categories";
import { Demand } from "@/types/demand";
import { Category } from "@/types/categories";

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
  const [activeSearchQuery, setActiveSearchQuery] = useState(""); // New state for active search query
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState({
    category: "",
    budget_range: "",
    status: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalPages: 1,
    totalDocs: 0,
  });
  const [budgetOptions, setBudgetOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // Fetch budget options on component mount
  useEffect(() => {
    const fetchBudgetOptions = async () => {
      try {
        // Fetch a large number of demands to get all possible budget ranges
        const response = await getDemands({}, { limit: 1000, page: 1 });
        if (response.docs) {
          const demands = response.docs.flat();
          const uniqueBudgets = new Map<string, string>();

          demands.forEach((demand) => {
            if (demand.from_price != null && demand.to_price != null) {
              const value = `${demand.from_price}-${demand.to_price}`;
              const label = `${demand.from_price.toLocaleString()} - ${demand.to_price.toLocaleString()} VNĐ`;
              if (!uniqueBudgets.has(value)) {
                uniqueBudgets.set(value, label);
              }
            }
          });

          const options = Array.from(uniqueBudgets.entries()).map(
            ([value, label]) => ({ value, label })
          );
          setBudgetOptions(options);
        }
      } catch (error) {
        console.error("Error fetching budget options:", error);
      }
    };

    fetchBudgetOptions();
  }, []);
  // Fetch categories from API
  const fetchCategories = async () => {
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
  };

  // Fetch demands from API
  const fetchDemands = async () => {
    try {
      setError("");

      // Build filters object
      const apiFilters: any = {};
      if (activeSearchQuery) {
        // Use a specific filter for title search
        apiFilters["where[title][like]"] = activeSearchQuery;
      }
      if (filters.category) {
        // Use the category ID for filtering
        apiFilters["where[category][equals]"] = filters.category;
      }
      if (filters.status) {
        apiFilters.status = filters.status;
      }
      if (filters.budget_range) {
        const [from_price, to_price] = filters.budget_range
          .split("-")
          .map(Number);
        if (!isNaN(from_price) && !isNaN(to_price)) {
          // Filter for exact from_price and to_price match
          apiFilters["where[from_price][equals]"] = from_price;
          apiFilters["where[to_price][equals]"] = to_price;
        }
      }

      // Build pagination object
      const paginationParams = {
        page: pagination.page,
        limit: pagination.limit,
      };

      const response = await getDemands(apiFilters, paginationParams);
      if (response.docs && response.docs.length > 0) {
        // response.docs is Demand[][], so we need to flatten it
        const flattenedDemands = response.docs.flat();
        setDemands(flattenedDemands);
      } else if (response.data) {
        // Fallback if data is returned instead of docs
        setDemands(
          Array.isArray(response.data) ? response.data : [response.data]
        );
      } else {
        setDemands([]);
      }

      // Update pagination info
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
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchDemands();
  }, [
    pagination.page,
    pagination.limit,
    sortBy,
    sortOrder,
    filters,
    activeSearchQuery,
  ]);

  // Extracted search logic to be reusable
  const performSearch = () => {
    setIsFiltering(true);
    const newActiveQuery = activeSearchQuery ? "" : searchQuery.trim();
    setActiveSearchQuery(newActiveQuery);
    if (activeSearchQuery) {
      setSearchQuery("");
    }
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: any) => {
    setIsFiltering(true);
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(field);
      setSortOrder("DESC");
    }
  };

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
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Spinner size="lg" color="primary" />
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
      <div className="min-h-screen bg-background py-8 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <Card className="text-center py-12 ">
            <CardBody>
              <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-danger-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Có lỗi xảy ra
              </h3>
              <p className="text-default-600 mb-4">{error}</p>
              <Button
                color="primary"
                onPress={() => {
                  setError("");
                  fetchDemands();
                }}
              >
                Thử lại
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Nhu cầu công nghệ
            </h1>
            <p className="text-default-600">
              Khám phá các nhu cầu công nghệ từ doanh nghiệp và tổ chức
            </p>
          </div>
          <Button
            color="primary"
            size="lg"
            startContent={<Plus className="h-5 w-5" />}
            className="font-medium"
            onPress={() => {
              if (isAuthenticated) {
                router.push("/demands/register");
              } else {
                router.push("/auth/login?redirect=/demands/register");
              }
            }}
            style={{
              backgroundColor: "#006FEE",
              color: "#ffffff",
              minHeight: "44px",
              fontWeight: "500",
            }}
            title={
              isAuthenticated
                ? "Đăng nhu cầu công nghệ mới"
                : "Đăng nhập để đăng nhu cầu"
            }
          >
            Đăng nhu cầu
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-sm mb-8">
          <CardBody className="p-6">
            <div className="flex flex-col gap-4">
              <form onSubmit={handleSearch} className="flex gap-4">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm nhu cầu công nghệ..."
                  startContent={<Search className="h-5 w-5 text-default-400" />}
                  variant="bordered"
                  className="flex-1"
                  classNames={{
                    input: "text-sm",
                    inputWrapper: "h-12",
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // Prevent form submission
                      performSearch();
                    }
                  }}
                />
                <Button
                  type="submit"
                  color={activeSearchQuery ? "danger" : "primary"}
                  size="lg"
                  className="px-8"
                  onPress={() => performSearch()}
                  style={{
                    backgroundColor: activeSearchQuery ? "#EF4444" : "#006FEE",
                    color: "#ffffff",
                    minHeight: "48px",
                    fontWeight: "500",
                    border: "none",
                  }}
                >
                  {activeSearchQuery ? "Xóa tìm kiếm" : "Tìm kiếm"}
                </Button>
              </form>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Danh mục"
                  placeholder="Tất cả danh mục"
                  selectedKeys={filters.category ? [filters.category] : []}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;
                    handleFilterChange({
                      ...filters,
                      category: selectedKey || "",
                    });
                  }}
                  variant="bordered"
                  classNames={{
                    label: "text-sm font-medium text-foreground",
                  }}
                  isLoading={categoriesLoading}
                >
                  {[
                    <SelectItem key="">Tất cả danh mục</SelectItem>,
                    ...categories.map((category) => (
                      <SelectItem key={category.id || category.name}>
                        {category.name}
                      </SelectItem>
                    )),
                  ]}
                </Select>

                <Select
                  label="Ngân sách"
                  placeholder="Tất cả ngân sách"
                  selectedKeys={
                    filters.budget_range ? [filters.budget_range] : []
                  }
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;
                    handleFilterChange({
                      ...filters,
                      budget_range: selectedKey || "",
                    });
                  }}
                  variant="bordered"
                  classNames={{
                    label: "text-sm font-medium text-foreground",
                  }}
                >
                  {[
                    <SelectItem key="">Tất cả ngân sách</SelectItem>,
                    ...budgetOptions.map((option) => (
                      <SelectItem key={option.value}>{option.label}</SelectItem>
                    )),
                  ]}
                </Select>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
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
                variant={sortBy === "created_at" ? "flat" : "light"}
                color={sortBy === "created_at" ? "primary" : "default"}
                size="sm"
                onPress={() => handleSort("created_at")}
                endContent={
                  sortBy === "created_at" &&
                  (sortOrder === "ASC" ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  ))
                }
                style={{
                  backgroundColor:
                    sortBy === "created_at" ? "#006FEE20" : "transparent",
                  color: sortBy === "created_at" ? "#006FEE" : "#71717A",
                  border: "1px solid #E4E4E7",
                  minHeight: "32px",
                }}
              >
                Ngày tạo
              </Button>
            </div>

            {/* View Mode Toggle */}
            <ButtonGroup variant="bordered" size="sm">
              <Button
                isIconOnly
                variant={viewMode === "grid" ? "solid" : "bordered"}
                color={viewMode === "grid" ? "primary" : "default"}
                onPress={() => setViewMode("grid")}
                style={{
                  backgroundColor:
                    viewMode === "grid" ? "#006FEE" : "transparent",
                  color: viewMode === "grid" ? "#ffffff" : "#71717A",
                  border: "1px solid #E4E4E7",
                  minHeight: "32px",
                  minWidth: "32px",
                }}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                isIconOnly
                variant={viewMode === "list" ? "solid" : "bordered"}
                color={viewMode === "list" ? "primary" : "default"}
                onPress={() => setViewMode("list")}
                style={{
                  backgroundColor:
                    viewMode === "list" ? "#006FEE" : "transparent",
                  color: viewMode === "list" ? "#ffffff" : "#71717A",
                  border: "1px solid #E4E4E7",
                  minHeight: "32px",
                  minWidth: "32px",
                }}
              >
                <List className="h-4 w-4" />
              </Button>
            </ButtonGroup>
          </div>
        </div>

        {/* Demands Grid/List */}
        <div className="relative">
          {isFiltering && (
            <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
              <Spinner size="lg" color="primary" />
            </div>
          )}
          {demands.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {demands.map((demand, index) => (
                <Card
                  key={demand.id || index}
                  className={`shadow-sm hover:shadow-md transition-shadow ${
                    viewMode === "grid" ? "h-full flex flex-col" : ""
                  }`}
                  isPressable={false}
                >
                  <CardBody className="p-6 flex flex-col h-full">
                    {viewMode === "grid" ? (
                      // Grid View
                      <>
                        <div className="flex items-start justify-between mb-4">
                          <Chip
                            size="sm"
                            color="primary"
                            variant="flat"
                            className="text-xs"
                          >
                            {typeof demand.category === "object" &&
                            demand.category?.name
                              ? demand.category.name
                              : typeof demand.category === "string"
                                ? demand.category
                                : "Chưa phân loại"}
                          </Chip>
                          <Chip
                            size="sm"
                            color="success"
                            variant="flat"
                            className="text-xs"
                          >
                            TRL {demand.trl_level}
                          </Chip>
                        </div>

                        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                          {demand.title}
                        </h3>

                        <p className="text-default-600 text-sm mb-4 line-clamp-3 flex-grow">
                          {demand.description}
                        </p>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-default-500">
                            <DollarSign className="h-4 w-4 mr-2" />
                            <span>
                              {demand.from_price && demand.to_price
                                ? `${demand.from_price.toLocaleString()} - ${demand.to_price.toLocaleString()} VNĐ`
                                : "Thỏa thuận"}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-default-500">
                            <Users className="h-4 w-4 mr-2" />
                            <span>
                              {typeof demand.user === "object" &&
                              demand.user?.full_name
                                ? demand.user.full_name
                                : "Người dùng"}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-default-500">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Mới đăng</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-default-500 mb-4">
                          <div className="flex items-center">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {demand.cooperation || "Hợp tác"}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-xs text-default-400">
                              {demand.documents?.length || 0} tài liệu
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2 mt-auto">
                          <Button
                            color="primary"
                            className="w-full"
                            onPress={() => {
                              const target = `/demands/${demand.id || index}`;
                              if (isAuthenticated) {
                                router.push(target);
                              } else {
                                router.push(
                                  `/auth/login?redirect=${encodeURIComponent(target)}`
                                );
                              }
                            }}
                            endContent={<ArrowRight className="h-4 w-4" />}
                            style={{
                              backgroundColor: "#006FEE",
                              color: "#ffffff",
                              minHeight: "40px",
                              fontWeight: "500",
                              border: "none",
                            }}
                          >
                            Xem chi tiết
                          </Button>
                        </div>
                      </>
                    ) : (
                      // List View
                      <div className="flex items-start space-x-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold text-foreground">
                              {demand.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <Chip
                                size="sm"
                                color="primary"
                                variant="flat"
                                className="text-xs"
                              >
                                {typeof demand.category === "object" &&
                                demand.category?.name
                                  ? demand.category.name
                                  : typeof demand.category === "string"
                                    ? demand.category
                                    : "Chưa phân loại"}
                              </Chip>
                              <Chip
                                size="sm"
                                color="success"
                                variant="flat"
                                className="text-xs"
                              >
                                TRL {demand.trl_level}
                              </Chip>
                            </div>
                          </div>

                          <p className="text-default-600 text-sm mb-3 line-clamp-2">
                            {demand.description}
                          </p>
                        </div>

                        <div className="flex flex-col space-y-2">
                          <Button
                            color="primary"
                            size="sm"
                            onPress={() => router.push(`/demands/${demand.id}`)}
                            endContent={<ArrowRight className="h-4 w-4" />}
                            style={{
                              backgroundColor: "#006FEE",
                              color: "#ffffff",
                              minHeight: "32px",
                              fontWeight: "500",
                              border: "none",
                            }}
                          >
                            Xem chi tiết
                          </Button>
                          {isAuthenticated && (
                            <Button
                              color="success"
                              variant="bordered"
                              size="sm"
                              onPress={() =>
                                router.push(`/demands/${demand.id}/propose`)
                              }
                              endContent={<Send className="h-4 w-4" />}
                              style={{
                                backgroundColor: "transparent",
                                color: "#17C964",
                                border: "1px solid #17C964",
                                minHeight: "32px",
                                fontWeight: "500",
                              }}
                            >
                              Đề xuất
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="py-12">
              <CardBody className="flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-default-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-default-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Không tìm thấy nhu cầu nào
                </h3>
              </CardBody>
            </Card>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          color="primary"
          size="lg"
          isIconOnly
          className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          onPress={() => {
            if (isAuthenticated) {
              router.push("/demands/register");
            } else {
              router.push("/auth/login?redirect=/demands/register");
            }
          }}
          style={{
            backgroundColor: "#006FEE",
            color: "#ffffff",
            border: "none",
          }}
          title={
            isAuthenticated
              ? "Đăng nhu cầu công nghệ mới"
              : "Đăng nhập để đăng nhu cầu"
          }
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}

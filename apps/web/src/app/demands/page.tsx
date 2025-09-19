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
import { Demand } from "@/types/demand";

export default function DemandsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
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

  // Fetch demands from API
  const fetchDemands = async () => {
    try {
      setLoading(true);
      setError("");

      // Build filters object
      const apiFilters: any = {};
      if (searchQuery) {
        apiFilters.search = searchQuery;
      }
      if (filters.category) {
        apiFilters.category = filters.category;
      }
      if (filters.status) {
        apiFilters.status = filters.status;
      }

      // Build pagination object
      const paginationParams = {
        page: pagination.page,
        limit: pagination.limit,
      };

      console.log(
        "Fetching demands with filters:",
        apiFilters,
        "pagination:",
        paginationParams
      );

      const response = await getDemands(apiFilters, paginationParams);
      console.log("Demands API response:", response);

      if (response.docs && response.docs.length > 0) {
        // response.docs is Demand[][], so we need to flatten it
        const flattenedDemands = response.docs.flat();
        console.log("Flattened demands:", flattenedDemands);
        setDemands(flattenedDemands);
      } else if (response.data) {
        // Fallback if data is returned instead of docs
        console.log("Response data:", response.data);
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
    }
  };

  useEffect(() => {
    fetchDemands();
  }, [pagination.page, pagination.limit]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset to first page and fetch with search query
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchDemands();
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
    // Fetch will be triggered by useEffect when filters change
  };

  // Add useEffect to refetch when filters change
  useEffect(() => {
    if (pagination.page === 1) {
      fetchDemands();
    }
  }, [filters, searchQuery]);

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
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="text-center py-12">
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
            style={{
              backgroundColor: "#006FEE",
              color: "#ffffff",
              minHeight: "44px",
              fontWeight: "500",
            }}
          >
            Đăng nhu cầu
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-sm mb-8">
          <CardBody className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Search Bar */}
              <div className="flex gap-4">
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
                />
                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  className="px-8"
                  style={{
                    backgroundColor: "#006FEE",
                    color: "#ffffff",
                    minHeight: "48px",
                    fontWeight: "500",
                    border: "none",
                  }}
                >
                  Tìm kiếm
                </Button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                >
                  <SelectItem key="Y tế">Y tế</SelectItem>
                  <SelectItem key="Môi trường">Môi trường</SelectItem>
                  <SelectItem key="Nông nghiệp">Nông nghiệp</SelectItem>
                  <SelectItem key="Công nghệ thông tin">
                    Công nghệ thông tin
                  </SelectItem>
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
                  <SelectItem key="0-100M">Dưới 100M VNĐ</SelectItem>
                  <SelectItem key="100M-500M">100M - 500M VNĐ</SelectItem>
                  <SelectItem key="500M-1B">500M - 1B VNĐ</SelectItem>
                  <SelectItem key="1B+">Trên 1B VNĐ</SelectItem>
                </Select>

                <Select
                  label="Trạng thái"
                  placeholder="Tất cả trạng thái"
                  selectedKeys={filters.status ? [filters.status] : []}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;
                    handleFilterChange({
                      ...filters,
                      status: selectedKey || "",
                    });
                  }}
                  variant="bordered"
                  classNames={{
                    label: "text-sm font-medium text-foreground",
                  }}
                >
                  <SelectItem key="ACTIVE">Đang tìm kiếm</SelectItem>
                  <SelectItem key="FULFILLED">Đã tìm thấy</SelectItem>
                  <SelectItem key="EXPIRED">Hết hạn</SelectItem>
                </Select>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <p className="text-default-600">
              Tìm thấy <span className="font-semibold">{demands.length}</span>{" "}
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

              <Button
                variant={sortBy === "deadline" ? "flat" : "light"}
                color={sortBy === "deadline" ? "primary" : "default"}
                size="sm"
                onPress={() => handleSort("deadline")}
                endContent={
                  sortBy === "deadline" &&
                  (sortOrder === "ASC" ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  ))
                }
                style={{
                  backgroundColor:
                    sortBy === "deadline" ? "#006FEE20" : "transparent",
                  color: sortBy === "deadline" ? "#006FEE" : "#71717A",
                  border: "1px solid #E4E4E7",
                  minHeight: "32px",
                }}
              >
                Hạn chót
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
                          onPress={() =>
                            router.push(`/demands/${demand.id || index}`)
                          }
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
                        {isAuthenticated && (
                          <Button
                            color="success"
                            variant="bordered"
                            className="w-full"
                            onPress={() =>
                              router.push(
                                `/demands/${demand.id || index}/propose`
                              )
                            }
                            endContent={<Send className="h-4 w-4" />}
                            style={{
                              backgroundColor: "transparent",
                              color: "#17C964",
                              border: "1px solid #17C964",
                              minHeight: "40px",
                              fontWeight: "500",
                            }}
                          >
                            Đề xuất giải pháp
                          </Button>
                        )}
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
          <Card className="text-center py-12">
            <CardBody>
              <div className="w-16 h-16 bg-default-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-default-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Không tìm thấy nhu cầu nào
              </h3>
              <p className="text-default-600">
                Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
              </p>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}

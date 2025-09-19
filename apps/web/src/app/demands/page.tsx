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
import apiClient from "@/lib/api";

interface Demand {
  id: number;
  title: string;
  description: string;
  location: string;
  budget: string;
  deadline: string;
  category: string;
  views: number;
  status: "ACTIVE" | "FULFILLED" | "EXPIRED";
  created_at: string;
  company_name: string;
}

export default function DemandsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState({
    category: "",
    budget_range: "",
    status: "ACTIVE",
  });

  // Mock data for demands
  const mockDemands: Demand[] = [
    {
      id: 1,
      title: "Tìm kiếm công nghệ AI cho chẩn đoán y tế",
      description:
        "Doanh nghiệp y tế cần công nghệ AI để phân tích hình ảnh X-quang và MRI, hỗ trợ chẩn đoán bệnh lý một cách chính xác và nhanh chóng.",
      location: "Hà Nội",
      budget: "500M - 1B VNĐ",
      deadline: "30 ngày",
      category: "Y tế",
      views: 156,
      status: "ACTIVE",
      created_at: "2025-01-15",
      company_name: "Bệnh viện Đa khoa Hà Nội",
    },
    {
      id: 2,
      title: "Công nghệ xử lý nước thải công nghiệp",
      description:
        "Nhà máy sản xuất cần giải pháp xử lý nước thải hiệu quả, tiết kiệm năng lượng và thân thiện với môi trường.",
      location: "Bắc Ninh",
      budget: "200M - 500M VNĐ",
      deadline: "45 ngày",
      category: "Môi trường",
      views: 89,
      status: "ACTIVE",
      created_at: "2025-01-14",
      company_name: "Công ty TNHH Sản xuất ABC",
    },
    {
      id: 3,
      title: "Hệ thống IoT cho nông nghiệp thông minh",
      description:
        "Nông trại cần hệ thống giám sát và điều khiển tự động cho canh tác, bao gồm cảm biến độ ẩm, nhiệt độ và hệ thống tưới tiêu.",
      location: "Hưng Yên",
      budget: "100M - 300M VNĐ",
      deadline: "60 ngày",
      category: "Nông nghiệp",
      views: 234,
      status: "ACTIVE",
      created_at: "2025-01-13",
      company_name: "Nông trại Thông minh XYZ",
    },
    {
      id: 4,
      title: "Công nghệ blockchain cho chuỗi cung ứng",
      description:
        "Doanh nghiệp logistics cần ứng dụng blockchain để theo dõi và minh bạch hóa chuỗi cung ứng sản phẩm.",
      location: "TP. Hồ Chí Minh",
      budget: "300M - 800M VNĐ",
      deadline: "90 ngày",
      category: "Công nghệ thông tin",
      views: 178,
      status: "ACTIVE",
      created_at: "2025-01-12",
      company_name: "Công ty Logistics DEF",
    },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchDemands = async () => {
      setLoading(true);
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDemands(mockDemands);
      setLoading(false);
    };

    fetchDemands();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter demands based on search query
    const filtered = mockDemands.filter(
      (demand) =>
        demand.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        demand.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        demand.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setDemands(filtered);
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
          </div>
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
                    setFilters({ ...filters, category: selectedKey || "" });
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
                    setFilters({ ...filters, budget_range: selectedKey || "" });
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
                  selectedKeys={[filters.status]}
                  onSelectionChange={(keys) => {
                    const selectedKey = Array.from(keys)[0] as string;
                    setFilters({ ...filters, status: selectedKey });
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
            {demands.map((demand) => (
              <Card
                key={demand.id}
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
                          {demand.category}
                        </Chip>
                        <Chip
                          size="sm"
                          color={
                            demand.status === "ACTIVE"
                              ? "success"
                              : demand.status === "FULFILLED"
                                ? "primary"
                                : "danger"
                          }
                          variant="flat"
                          className="text-xs"
                        >
                          {getStatusText(demand.status)}
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
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{demand.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-default-500">
                          <DollarSign className="h-4 w-4 mr-2" />
                          <span>{demand.budget}</span>
                        </div>
                        <div className="flex items-center text-sm text-default-500">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>Còn {demand.deadline}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-default-500 mb-4">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{demand.company_name}</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          <span>{demand.views} lượt xem</span>
                        </div>
                      </div>

                      <div className="space-y-2 mt-auto">
                        <Button
                          color="primary"
                          className="w-full"
                          onPress={() => router.push(`/demands/${demand.id}`)}
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
                              router.push(`/demands/${demand.id}/propose`)
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
                              {demand.category}
                            </Chip>
                            <Chip
                              size="sm"
                              color={
                                demand.status === "ACTIVE"
                                  ? "success"
                                  : demand.status === "FULFILLED"
                                    ? "primary"
                                    : "danger"
                              }
                              variant="flat"
                              className="text-xs"
                            >
                              {getStatusText(demand.status)}
                            </Chip>
                          </div>
                        </div>

                        <p className="text-default-600 text-sm mb-3 line-clamp-2">
                          {demand.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4 text-sm text-default-500 mb-3">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>{demand.location}</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2" />
                            <span>{demand.budget}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>Còn {demand.deadline}</span>
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-2" />
                            <span>{demand.views} lượt xem</span>
                          </div>
                        </div>
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

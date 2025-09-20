"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Gavel,
  ArrowRight,
  Plus,
  ExternalLink,
} from "lucide-react";
import {
  Card,
  CardBody,
  Button,
  Input,
  Chip,
  Select,
  SelectItem,
  Spinner,
  Avatar,
} from "@heroui/react";

interface Auction {
  id: number;
  title: string;
  description: string;
  technology_name: string;
  starting_price: number;
  current_bid: number;
  reserve_price: number;
  start_date: string;
  end_date: string;
  status: "upcoming" | "active" | "completed" | "cancelled";
  participants: number;
  bids_count: number;
  category: string;
  trl_level: number;
  seller: string;
  image_url?: string;
}

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [sortBy, setSortBy] = useState("end_date");

  // Mock data for auctions
  const mockAuctions: Auction[] = [
    {
      id: 1,
      title: "Đấu giá công nghệ AI nhận diện hình ảnh y tế",
      description:
        "Công nghệ AI tiên tiến có khả năng nhận diện và phân tích hình ảnh y tế với độ chính xác cao, hỗ trợ chẩn đoán bệnh lý.",
      technology_name: "AI Medical Image Recognition",
      starting_price: 500000000,
      current_bid: 750000000,
      reserve_price: 800000000,
      start_date: "2025-01-15",
      end_date: "2025-01-25",
      status: "active",
      participants: 12,
      bids_count: 8,
      category: "Y tế",
      trl_level: 7,
      seller: "Viện Công nghệ Y tế Hà Nội",
    },
    {
      id: 2,
      title: "Đấu giá hệ thống IoT nông nghiệp thông minh",
      description:
        "Hệ thống IoT hoàn chỉnh cho nông nghiệp thông minh bao gồm cảm biến, điều khiển tự động và phân tích dữ liệu.",
      technology_name: "Smart Agriculture IoT System",
      starting_price: 200000000,
      current_bid: 0,
      reserve_price: 300000000,
      start_date: "2025-02-01",
      end_date: "2025-02-10",
      status: "upcoming",
      participants: 0,
      bids_count: 0,
      category: "Nông nghiệp",
      trl_level: 6,
      seller: "Công ty Công nghệ Nông nghiệp ABC",
    },
    {
      id: 3,
      title: "Đấu giá công nghệ xử lý nước thải công nghiệp",
      description:
        "Công nghệ xử lý nước thải công nghiệp hiệu quả, tiết kiệm năng lượng và thân thiện với môi trường.",
      technology_name: "Industrial Wastewater Treatment",
      starting_price: 300000000,
      current_bid: 450000000,
      reserve_price: 500000000,
      start_date: "2025-01-10",
      end_date: "2025-01-20",
      status: "completed",
      participants: 8,
      bids_count: 15,
      category: "Môi trường",
      trl_level: 8,
      seller: "Viện Môi trường và Phát triển bền vững",
    },
    {
      id: 4,
      title: "Đấu giá blockchain cho chuỗi cung ứng",
      description:
        "Giải pháp blockchain toàn diện cho quản lý chuỗi cung ứng, đảm bảo tính minh bạch và truy xuất nguồn gốc.",
      technology_name: "Supply Chain Blockchain Solution",
      starting_price: 400000000,
      current_bid: 0,
      reserve_price: 600000000,
      start_date: "2025-02-15",
      end_date: "2025-02-25",
      status: "upcoming",
      participants: 0,
      bids_count: 0,
      category: "Công nghệ thông tin",
      trl_level: 6,
      seller: "Công ty Blockchain Solutions",
    },
  ];

  const auctionStatuses = [
    { value: "active", label: "Đang diễn ra" },
    { value: "upcoming", label: "Sắp diễn ra" },
    { value: "completed", label: "Đã kết thúc" },
    { value: "cancelled", label: "Đã hủy" },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchAuctions = async () => {
      setLoading(true);
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAuctions(mockAuctions);
      setLoading(false);
    };

    fetchAuctions();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter auctions based on search query
    const filtered = mockAuctions.filter(
      (auction) =>
        auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        auction.technology_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        auction.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setAuctions(filtered);
  };

  const filteredAuctions = auctions.filter(
    (auction) => auction.status === selectedStatus
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "upcoming":
        return "primary";
      case "completed":
        return "default";
      case "cancelled":
        return "danger";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Đang diễn ra";
      case "upcoming":
        return "Sắp diễn ra";
      case "completed":
        return "Đã kết thúc";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getTRLColor = (level: number) => {
    if (level <= 3) return "danger";
    if (level <= 6) return "warning";
    return "success";
  };

  const getTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Đã kết thúc";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `Còn ${days} ngày`;
    if (hours > 0) return `Còn ${hours} giờ`;
    return "Sắp kết thúc";
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
              Đấu giá công nghệ
            </h1>
            <p className="text-default-600">
              Tham gia đấu giá các công nghệ tiên tiến và tìm kiếm cơ hội đầu tư
            </p>
          </div>
          <Button
            color="primary"
            startContent={<Plus className="h-5 w-5" />}
            size="lg"
          >
            Tạo đấu giá
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardBody className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Search Bar */}
              <div className="flex gap-4 ">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm đấu giá công nghệ..."
                  startContent={<Search className="h-5 w-5 text-default-400" />}
                  className="flex-1"
                  size="lg"
                  variant="bordered"
                  classNames={{
                    input: "focus:outline-none",
                    inputWrapper:
                      "focus:outline-none focus-within:outline-none hover:border-primary focus-within:border-primary",
                  }}
                />
                <Button type="submit" color="primary" size="lg">
                  Tìm kiếm
                </Button>
              </div>

              {/* Status Filter */}
              <div className="flex flex-wrap gap-2">
                {auctionStatuses.map((status) => (
                  <Button
                    key={status.value}
                    onPress={() => setSelectedStatus(status.value)}
                    color={
                      selectedStatus === status.value ? "primary" : "default"
                    }
                    variant={selectedStatus === status.value ? "solid" : "flat"}
                    size="sm"
                  >
                    {status.label}
                  </Button>
                ))}
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <p className="text-default-600">
              Tìm thấy{" "}
              <span className="font-semibold">{filteredAuctions.length}</span>{" "}
              đấu giá
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Select
              value={sortBy}
              onSelectionChange={(value) => setSortBy(value as string)}
              placeholder="Sắp xếp theo"
              className="w-48"
              size="sm"
            >
              <SelectItem key="end_date">Theo thời gian kết thúc</SelectItem>
              <SelectItem key="current_bid">Theo giá hiện tại</SelectItem>
              <SelectItem key="participants">Theo số người tham gia</SelectItem>
            </Select>
          </div>
        </div>

        {/* Auctions List */}
        {filteredAuctions.length > 0 ? (
          <div className="space-y-6">
            {filteredAuctions.map((auction) => (
              <Card
                key={auction.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardBody className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Chip color="primary" variant="flat" size="sm">
                        {auction.category}
                      </Chip>
                      <Chip
                        color={getStatusColor(auction.status)}
                        variant="flat"
                        size="sm"
                      >
                        {getStatusText(auction.status)}
                      </Chip>
                      <Chip
                        color={getTRLColor(auction.trl_level)}
                        variant="flat"
                        size="sm"
                      >
                        TRL {auction.trl_level}
                      </Chip>
                    </div>
                    {auction.status === "active" && (
                      <div className="text-right">
                        <p className="text-sm text-default-500">
                          Thời gian còn lại
                        </p>
                        <p className="text-lg font-semibold text-danger-600">
                          {getTimeRemaining(auction.end_date)}
                        </p>
                      </div>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-foreground mb-2 hover:text-primary transition-colors cursor-pointer">
                    {auction.title}
                  </h2>

                  <p className="text-default-600 mb-4 line-clamp-2">
                    {auction.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Price Information */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-default-700">
                        Thông tin giá
                      </h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-default-500">
                            Giá khởi điểm:
                          </span>
                          <span className="font-medium text-foreground">
                            {formatPrice(auction.starting_price)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-default-500">
                            Giá hiện tại:
                          </span>
                          <span className="font-semibold text-success-600">
                            {auction.current_bid > 0
                              ? formatPrice(auction.current_bid)
                              : "Chưa có bid"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-default-500">Giá dự trữ:</span>
                          <span className="font-medium text-foreground">
                            {formatPrice(auction.reserve_price)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Auction Details */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-default-700">
                        Chi tiết đấu giá
                      </h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-default-500">
                            Người tham gia:
                          </span>
                          <span className="font-medium text-foreground">
                            {auction.participants}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-default-500">Số lượt bid:</span>
                          <span className="font-medium text-foreground">
                            {auction.bids_count}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-default-500">Người bán:</span>
                          <span className="font-medium text-foreground">
                            {auction.seller}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Time Information */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-default-700">
                        Thời gian
                      </h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-default-500">Bắt đầu:</span>
                          <span className="font-medium text-foreground">
                            {formatDate(auction.start_date)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-default-500">Kết thúc:</span>
                          <span className="font-medium text-foreground">
                            {formatDate(auction.end_date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-default-500">
                      <span>Công nghệ: </span>
                      <span className="font-medium text-foreground">
                        {auction.technology_name}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {auction.status === "active" && (
                        <Button
                          color="danger"
                          size="sm"
                          startContent={<Gavel className="h-4 w-4" />}
                        >
                          Tham gia đấu giá
                        </Button>
                      )}
                      {auction.status === "upcoming" && (
                        <Button
                          color="primary"
                          size="sm"
                          startContent={<Calendar className="h-4 w-4" />}
                        >
                          Đăng ký tham gia
                        </Button>
                      )}
                      <Button
                        variant="light"
                        color="primary"
                        size="sm"
                        endContent={<ExternalLink className="h-3 w-3" />}
                      >
                        Chi tiết đấu giá
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Avatar
              icon={<Gavel className="h-8 w-8" />}
              className="w-16 h-16 mx-auto mb-4 bg-default-100 text-default-400"
            />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Không tìm thấy đấu giá nào
            </h3>
            <p className="text-default-600">
              Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </p>
          </div>
        )}

        {/* Load More Button */}
        {filteredAuctions.length > 0 && (
          <div className="text-center mt-8">
            <Button
              variant="bordered"
              endContent={<ArrowRight className="h-4 w-4" />}
              size="lg"
            >
              Xem thêm đấu giá
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  Users,
  Eye,
  Filter,
  Search,
  Gavel,
  Zap,
  Star,
} from "lucide-react";
import AnimatedIcon from "@/components/ui/AnimatedIcon";
import AuctionImagePlaceholder from "@/components/auction/AuctionImagePlaceholder";
import { useAuth, useAuthStore } from "@/store/auth";
import { Spinner } from "@heroui/react";
import toast from "react-hot-toast";
import { getAuctions } from "@/api/auctions";
import { getBidsByAuction } from "@/api/bids";
import { payloadApiClient } from "@/api/client";
import { getFullMediaUrl } from "@/utils/mediaUrl";

interface AuctionDisplay {
  id: string;
  title: string;
  currentBid: number;
  bidCount: number;
  timeLeft: string;
  viewers: number;
  isActive: boolean;
  image?: string;
  category: string;
  startTime: Date;
  endTime: Date;
  status: "upcoming" | "active" | "ended" | "cancelled";
  startingPrice?: number;
}

// Tính thời gian còn lại
const calculateTimeLeft = (endTime: string | Date | undefined): string => {
  if (!endTime) return "Không xác định";

  const now = new Date().getTime();
  const end = new Date(endTime).getTime();
  const timeLeft = end - now;

  if (timeLeft <= 0) return "Đã kết thúc";

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days} ngày ${hours} giờ`;
  } else if (hours > 0) {
    return `${hours} giờ ${minutes} phút`;
  } else {
    return `${minutes} phút`;
  }
};

// Tính trạng thái đấu giá dựa trên thời gian
const calculateAuctionStatus = (
  startTime: string | Date | undefined,
  endTime: string | Date | undefined
): "upcoming" | "active" | "ended" | "cancelled" => {
  if (!startTime || !endTime) return "cancelled";

  const now = new Date().getTime();
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();

  if (now < start) {
    return "upcoming";
  } else if (now >= start && now < end) {
    return "active";
  } else {
    return "ended";
  }
};

// Lấy nhãn trạng thái tiếng Việt
const getStatusLabel = (
  status: "upcoming" | "active" | "ended" | "cancelled"
): string => {
  switch (status) {
    case "upcoming":
      return "Sắp diễn ra";
    case "active":
      return "Đang diễn ra";
    case "ended":
      return "Đã kết thúc";
    case "cancelled":
      return "Đã hủy";
    default:
      return "Không xác định";
  }
};

// Lấy màu sắc cho trạng thái
const getStatusColor = (
  status: "upcoming" | "active" | "ended" | "cancelled"
): string => {
  switch (status) {
    case "upcoming":
      return "bg-blue-100 text-blue-800";
    case "active":
      return "bg-green-100 text-green-800";
    case "ended":
      return "bg-gray-100 text-gray-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Lấy hình ảnh ngẫu nhiên cho đấu giá - 7 ảnh bất kỳ với nội dung đa dạng
const getRandomAuctionImage = (auctionId: string): string => {
  const images = [
    // Ảnh 1: Cảnh thiên nhiên - Mountain landscape
    "https://picsum.photos/400/300?random=1",
    // Ảnh 2: Thành phố hiện đại - City skyline
    "https://picsum.photos/400/300?random=2",
    // Ảnh 3: Đồ ăn ngon - Food
    "https://picsum.photos/400/300?random=3",
    // Ảnh 4: Nghệ thuật trừu tượng - Abstract art
    "https://picsum.photos/400/300?random=4",
    // Ảnh 5: Thể thao - Sports
    "https://picsum.photos/400/300?random=5",
    // Ảnh 6: Du lịch - Travel
    "https://picsum.photos/400/300?random=6",
    // Ảnh 7: Âm nhạc - Music
    "https://picsum.photos/400/300?random=7",
  ];

  // Sử dụng auction ID để tạo seed ngẫu nhiên nhất quán
  const hash = auctionId.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);

  const index = Math.abs(hash) % images.length;
  return images[index];
};

export default function AuctionsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [auctions, setAuctions] = useState<AuctionDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { user, isAuthenticated, isLoading, token } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);

  // Authentication check effect
  useEffect(() => {
    // Wait for auth state to be determined
    if (!isLoading) {
      setAuthChecked(true);

      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        toast.error("Vui lòng đăng nhập để xem danh sách đấu giá");
        router.push("/auth/login");
        return;
      }

      // Setup API client authentication
      const token = localStorage.getItem("auth_token");
      if (token && isAuthenticated) {
        payloadApiClient.setToken(token);
      }
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    // Only proceed if user is authenticated
    if (!authChecked || !isAuthenticated) {
      return;
    }

    // Read URL parameters
    const status = searchParams.get("status");
    if (status) {
      if (status === "upcoming") {
        setStatusFilter("upcoming");
      } else if (status === "active") {
        setStatusFilter("active");
      } else if (status === "ended") {
        setStatusFilter("ended");
      }
    }
    fetchAuctions();
  }, [searchParams, authChecked, isAuthenticated]);

  // Real-time updates - refresh auction list every 30 seconds and update status every minute
  useEffect(() => {
    // Only set up interval if user is authenticated
    if (!authChecked || !isAuthenticated) {
      return;
    }

    const interval = setInterval(() => {
      fetchAuctions();
    }, 30000);

    // Update status every minute without refetching data
    const statusInterval = setInterval(() => {
      setAuctions((prevAuctions) =>
        prevAuctions.map((auction) => {
          const newStatus = calculateAuctionStatus(
            auction.startTime,
            auction.endTime
          );

          return {
            ...auction,
            status: newStatus,
            isActive: newStatus === "active",
            timeLeft: calculateTimeLeft(auction.endTime),
          };
        })
      );
    }, 60000);

    return () => {
      clearInterval(interval);
      clearInterval(statusInterval);
    };
  }, [authChecked, isAuthenticated]);

  // Listen for bid placement events
  useEffect(() => {
    // Only set up listeners if user is authenticated
    if (!authChecked || !isAuthenticated) {
      return;
    }

    const handleBidPlaced = () => {
      // Refetch auctions when a bid is placed
      console.log("Bid placed event received, refreshing auctions...");
      fetchAuctions();
    };

    // Listen for custom events from bid placement
    window.addEventListener("bidPlaced", handleBidPlaced);
    window.addEventListener("auctionUpdated", handleBidPlaced);

    return () => {
      window.removeEventListener("bidPlaced", handleBidPlaced);
      window.removeEventListener("auctionUpdated", handleBidPlaced);
    };
  }, [authChecked, isAuthenticated]);

  const fetchAuctions = async () => {
    try {
      setLoading(true);

      // Set token for API client if available
      if (token) {
        payloadApiClient.setToken(token);
      }

      // Fetch auctions using CMS API client
      const response = await getAuctions({}, { limit: 50, sort: "-createdAt" });
      const auctionsList = response.docs || [];

      // Transform data and fetch bid counts
      const auctionsWithBids = await Promise.allSettled(
        auctionsList.map(async (auction: any) => {
          try {
            // Fetch bid count for each auction using CMS API client
            const bidResponse = await getBidsByAuction(auction.id, {
              limit: 1,
            });
            let bidCount = bidResponse.totalDocs || 0;
            let currentBid =
              auction.currentBid ||
              auction.current_price ||
              auction.startingPrice ||
              auction.start_price ||
              0;

            // If there are bids, get the highest bid amount
            if (
              bidCount > 0 &&
              bidResponse.docs &&
              bidResponse.docs.length > 0
            ) {
              const highestBid = Math.max(
                ...bidResponse.docs.map(
                  (bid: any) => bid.amount || bid.bid_amount || 0
                )
              );
              currentBid = Math.max(currentBid, highestBid);
            }

            const startTime = new Date(
              auction.startTime || auction.start_time || Date.now()
            );
            const endTime = new Date(
              auction.endTime || auction.end_time || Date.now()
            );
            const calculatedStatus = calculateAuctionStatus(startTime, endTime);

            // Resolve image: prefer auction.image if present, fallback to random
            const rawImage = auction.image as any;
            const resolvedImage =
              (rawImage && typeof rawImage === "string" && rawImage) ||
              (rawImage && typeof rawImage === "object" && rawImage.url
                ? getFullMediaUrl(rawImage.url)
                : null) ||
              getRandomAuctionImage(auction.id);

            return {
              id: auction.id,
              title: auction.title || "Không có tiêu đề",
              currentBid,
              bidCount,
              timeLeft: calculateTimeLeft(endTime),
              viewers: auction.viewers || 0,
              isActive: calculatedStatus === "active",
              image: resolvedImage,
              category: auction.category || "Không phân loại",
              startTime: startTime,
              endTime: endTime,
              status: calculatedStatus,
              startingPrice: auction.startingPrice || auction.start_price || 0,
            };
          } catch (error) {
            console.warn(
              `Failed to fetch bids for auction ${auction.id}:`,
              error
            );
            const startTime = new Date(
              auction.startTime || auction.start_time || Date.now()
            );
            const endTime = new Date(
              auction.endTime || auction.end_time || Date.now()
            );
            const calculatedStatus = calculateAuctionStatus(startTime, endTime);

            const rawImage = auction.image as any;
            const resolvedImage =
              (rawImage && typeof rawImage === "string" && rawImage) ||
              (rawImage && typeof rawImage === "object" && rawImage.url
                ? getFullMediaUrl(rawImage.url)
                : null) ||
              getRandomAuctionImage(auction.id);

            return {
              id: auction.id,
              title: auction.title || "Không có tiêu đề",
              currentBid:
                auction.currentBid ||
                auction.current_price ||
                auction.startingPrice ||
                auction.start_price ||
                0,
              bidCount: 0,
              timeLeft: calculateTimeLeft(endTime),
              viewers: auction.viewers || 0,
              isActive: calculatedStatus === "active",
              image: resolvedImage,
              category: auction.category || "Không phân loại",
              startTime: startTime,
              endTime: endTime,
              status: calculatedStatus,
              startingPrice: auction.startingPrice || auction.start_price || 0,
            };
          }
        })
      );

      // Filter successful results
      const successfulAuctions = auctionsWithBids
        .filter((result) => result.status === "fulfilled")
        .map(
          (result) => (result as PromiseFulfilledResult<AuctionDisplay>).value
        );

      setAuctions(successfulAuctions);
    } catch (error) {
      console.error("Error fetching auctions:", error);
      toast.error("Không thể tải danh sách đấu giá");
    } finally {
      setLoading(false);
    }
  };

  const filteredAuctions = auctions.filter((auction) => {
    // Safe check for title before calling toLowerCase
    const matchesSearch = auction.title
      ? auction.title.toLowerCase().includes(searchTerm.toLowerCase())
      : true; // If no title, include in search (or you could exclude with false)

    // Safe check for category
    const matchesCategory =
      categoryFilter === "all" ||
      (auction.category && auction.category === categoryFilter);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && auction.status === "active") ||
      (statusFilter === "upcoming" && auction.status === "upcoming") ||
      (statusFilter === "ended" && auction.status === "ended");

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [
    "all",
    "Công nghệ thông tin",
    "Công nghệ sinh học",
    "Công nghệ năng lượng",
    "Công nghệ vật liệu",
  ];

  // Show loading screen while checking authentication
  if (!authChecked || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="mt-4 text-gray-600">Đang kiểm tra xác thực...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render anything (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách đấu giá...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <AnimatedIcon animation="rotate" delay={500}>
                <Star className="h-8 w-8 text-blue-600" />
              </AnimatedIcon>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Danh sách đấu giá
                </h2>
                <p className="text-gray-600 mt-1">
                  Tìm và tham gia đấu giá công nghệ phù hợp với bạn
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative group">
                <AnimatedIcon
                  animation="pulse"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors"
                >
                  <Search className="h-4 w-4" />
                </AnimatedIcon>
                <input
                  type="text"
                  placeholder="Tìm kiếm đấu giá..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-blue-300"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả danh mục</option>
                {categories.slice(1).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Đang diễn ra</option>
                <option value="upcoming">Sắp diễn ra</option>
                <option value="ended">Đã kết thúc</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredAuctions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              {searchTerm || categoryFilter !== "all" || statusFilter !== "all"
                ? "Không tìm thấy đấu giá phù hợp"
                : "Chưa có đấu giá nào"}
            </div>
            <button
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
                setStatusFilter("all");
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuctions.map((auction, index) => (
              <Link
                key={auction.id}
                href={`/auction/${auction.id}`}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  <img
                    src={auction.image}
                    alt={auction.title}
                    className="w-full h-48 object-cover transition-opacity duration-300"
                    loading="lazy"
                    onLoad={(e) => {
                      // Fade in when loaded
                      e.currentTarget.style.opacity = "1";
                    }}
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      e.currentTarget.style.display = "none";
                      const placeholder = e.currentTarget
                        .nextElementSibling as HTMLElement;
                      if (placeholder) {
                        placeholder.style.display = "block";
                      }
                    }}
                    style={{ opacity: 0 }}
                  />

                  {/* Placeholder - hidden by default, shown only on image error */}
                  <div
                    className="w-full h-48 hidden"
                    style={{ display: "none" }}
                  >
                    <AuctionImagePlaceholder
                      category={auction.category}
                      title={auction.title}
                      className="w-full h-48"
                    />
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3 gap-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 flex-1 min-w-0">
                      {auction.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap flex-shrink-0 ${getStatusColor(auction.status)}`}
                    >
                      {getStatusLabel(auction.status)}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Giá hiện tại
                      </span>
                      <span className="font-semibold text-green-600">
                        {auction.currentBid.toLocaleString()} VNĐ
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-1 group">
                        <AnimatedIcon animation="bounce" delay={index * 200}>
                          <Users className="h-4 w-4" />
                        </AnimatedIcon>
                        <span>{auction.bidCount} lượt đấu giá</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <AnimatedIcon
                          animation="pulse"
                          delay={index * 200 + 100}
                        >
                          <Eye className="h-4 w-4" />
                        </AnimatedIcon>
                        <span>{auction.viewers} người xem</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <AnimatedIcon
                        animation="rotate"
                        delay={index * 200 + 200}
                      >
                        <Clock className="h-4 w-4" />
                      </AnimatedIcon>
                      <span>{auction.timeLeft}</span>
                    </div>
                    <span className="text-sm text-blue-600 font-medium group-hover:text-blue-800 transition-colors">
                      Xem chi tiết →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

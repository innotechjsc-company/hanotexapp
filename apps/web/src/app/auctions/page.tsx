"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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

interface Auction {
  id: string;
  title: string;
  currentBid: number;
  bidCount: number;
  timeLeft: string;
  viewers: number;
  isActive: boolean;
  image?: string;
  category: string;
  endTime: Date;
}

export default function AuctionsPage() {
  const searchParams = useSearchParams();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
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
  }, [searchParams]);

  // Real-time updates - refresh auction list every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAuctions();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Listen for localStorage changes (when user places bids)
  useEffect(() => {
    const handleStorageChange = () => {
      // Refetch auctions when localStorage changes (bid placed)
      fetchAuctions();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events from bid placement
    window.addEventListener('bidPlaced', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bidPlaced', handleStorageChange);
    };
  }, []);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/auctions");
      if (!response.ok) {
        throw new Error("Không thể tải danh sách đấu giá");
      }
      const data = await response.json();
      
      // Update auctions with localStorage bid data
      const updatedAuctions = data.map((auction: Auction) => {
        const storedBids = localStorage.getItem(`auction_bids_${auction.id}`);
        if (storedBids) {
          try {
            const parsedBids = JSON.parse(storedBids);
            if (parsedBids.length > 0) {
              const latestBid = parsedBids[parsedBids.length - 1];
              return {
                ...auction,
                currentBid: latestBid.amount || auction.currentBid,
                bidCount: parsedBids.length,
              };
            }
          } catch (e) {
            console.warn(`Failed to parse stored bids for auction ${auction.id}:`, e);
          }
        }
        return auction;
      });
      
      setAuctions(updatedAuctions);
    } catch (error) {
      console.error("Error fetching auctions:", error);
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
      (statusFilter === "active" && auction.isActive) ||
      (statusFilter === "upcoming" && auction.isActive) || // For now, treat upcoming same as active
      (statusFilter === "ended" && !auction.isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [
    "all",
    "Công nghệ thông tin",
    "Công nghệ sinh học",
    "Công nghệ năng lượng",
    "Công nghệ vật liệu",
  ];

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
                  {auction.image ? (
                    <img
                      src={auction.image}
                      alt={auction.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      <div className="text-blue-600 text-4xl">🔬</div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {auction.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        auction.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {auction.isActive ? "Đang diễn ra" : "Đã kết thúc"}
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

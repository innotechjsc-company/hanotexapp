"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  Plus,
  ExternalLink,
  Navigation,
  X, // Added X icon for clearing search
} from "lucide-react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Chip,
  Select,
  SelectItem,
  Spinner,
  Divider,
} from "@heroui/react";
import { Event } from "@/types/event";
import {
  getEvents,
  getUpcomingEvents,
  getOngoingEvents,
  getPastEvents,
  searchEvents,
} from "@/api/events";
import { PAYLOAD_API_BASE_URL } from "@/api/config";
import { useRouter } from "next/navigation";
import { getFullMediaUrl } from "@/utils/mediaUrl";

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState(""); // New state for active search query
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    "pending" | "in_progress" | "completed" | "cancelled" | "all"
  >("all");
  const [sortBy, setSortBy] = useState("start_date");
  const [totalDocs, setTotalDocs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Helper function to resolve event image
  const getEventImageUrl = (event: Event): string => {
    if (!event.image) {
      return "/images/events/default.jpg"; // Default event image
    }

    if (typeof event.image === "string") {
      return event.image.startsWith("http")
        ? event.image
        : getFullMediaUrl(event.image);
    }

    if (event.image.url) {
      return getFullMediaUrl(event.image.url);
    }

    return "/images/events/default.jpg";
  };

  const eventStatuses = [
    { value: "all", label: "Tất cả" },
    { value: "pending", label: "Chờ duyệt" },
    { value: "in_progress", label: "Đang diễn ra" },
    { value: "completed", label: "Đã kết thúc" },
    { value: "cancelled", label: "Đã hủy" },
  ];

  // Fetch events from API
  const fetchEvents = async (
    isLoadMore = false,
    customSearchQuery?: string
  ) => {
    try {
      if (!isLoadMore) {
        setLoading(true);
        setError(null);
      }

      let response;

      const currentSearchQuery =
        customSearchQuery !== undefined ? customSearchQuery : activeSearchQuery;

      const filters: any = {}; // Explicitly type filters
      if (currentSearchQuery.trim()) {
        filters.search = currentSearchQuery.trim();
      }

      if (selectedStatus !== "all") {
        filters.status = selectedStatus;
      }

      const paginationParams = {
        page: isLoadMore ? currentPage + 1 : 1,
        limit: 10,
        sort: sortBy === "start_date" ? "start_date" : "-createdAt",
      };

      // Fetch all events without status filter
      response = await getEvents(filters, paginationParams);

      const newEvents = Array.isArray(response.docs) ? response.docs : [];

      if (isLoadMore) {
        setEvents((prev) => [...prev, ...newEvents] as any);
        setCurrentPage((prev) => prev + 1);
      } else {
        setEvents(newEvents as any);
        setCurrentPage(1);
      }

      setTotalDocs(response.totalDocs || 0);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Không thể tải danh sách sự kiện. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedStatus, sortBy, activeSearchQuery]); // Added activeSearchQuery to dependencies

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeSearchQuery) {
      // If there's an active search, clear it
      setSearchQuery("");
      setActiveSearchQuery("");
      setCurrentPage(1);
      fetchEvents(false, ""); // Fetch all events again
      return;
    }

    // If no active search, perform a new search
    const newSearchQuery = searchQuery.trim();
    if (newSearchQuery) {
      setActiveSearchQuery(newSearchQuery);
      setCurrentPage(1);
      fetchEvents(false, newSearchQuery);
    } else {
      // If search query is empty, just refetch without search
      fetchEvents(false, "");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper function to generate Google Maps URL from address
  const getGoogleMapsUrl = (address: string | null | undefined): string => {
    if (!address || address.trim() === "") {
      return "";
    }

    // Encode the address for URL
    const encodedAddress = encodeURIComponent(address.trim());
    return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  };

  // Helper function to check if address has Google Maps URL
  const hasValidAddress = (address: string | null | undefined): boolean => {
    return !!(address && address.trim() !== "");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Spinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Sự kiện & Hội thảo
            </h1>
            <p className="text-gray-600">
              Tham gia các sự kiện, hội thảo và triển lãm công nghệ quan trọng
            </p>
          </div>
          {/* <Button
            color="primary"
            startContent={<Plus className="h-5 w-5" />}
            className="font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-md visible opacity-100 z-10 relative"
            size="md"
            onPress={() => router.push("/events/register")}
          >
            Đăng sự kiện
          </Button> */}
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardBody className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Search Bar */}
              <div className="flex gap-4 items-center flex-wrap">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sự kiện..."
                  startContent={<Search className="h-5 w-5 text-gray-400" />}
                  variant="bordered"
                  className="flex-1"
                />
                <Button
                  type="submit"
                  color={activeSearchQuery ? "danger" : "primary"} // Change button color when activeSearchQuery is present
                  className={`px-6 shadow-md min-w-[120px] visible opacity-100 z-10 relative flex-shrink-0 ${
                    activeSearchQuery
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                  size="md"
                >
                  {activeSearchQuery ? (
                    <X className="h-5 w-5 mr-2" />
                  ) : (
                    <Search className="h-5 w-5 mr-2" />
                  )}
                  {activeSearchQuery ? "Xóa tìm kiếm" : "Tìm kiếm"}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {activeSearchQuery ? (
              <p className="text-gray-600">
                Tìm thấy <span className="font-semibold">{totalDocs}</span> sự
                kiện
                <span className="ml-1 text-gray-500">
                  cho "{activeSearchQuery}"
                </span>
              </p>
            ) : (
              <p className="text-gray-600">
                Tổng cộng <span className="font-semibold">{totalDocs}</span> sự
                kiện
              </p>
            )}
          </div>
        </div>
        {/* Events List */}
        {events.length > 0 ? (
          <div className="space-y-6 w-full">
            {events.map((event: Event) => (
              <article
                key={event.id}
                onClick={() => router.push(`/events/${event.id}`)}
                className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Featured Image */}
                  <div className="md:w-1/3 relative overflow-hidden">
                    <img
                      src={getEventImageUrl(event)}
                      alt={event.title}
                      className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = "/images/events/default.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/90 text-gray-800">
                        Sự kiện
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          event.status === "in_progress"
                            ? "bg-green-100 text-green-800"
                            : event.status === "completed"
                              ? "bg-gray-100 text-gray-800"
                              : event.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {event.status === "in_progress"
                          ? "Đang diễn ra"
                          : event.status === "completed"
                            ? "Đã kết thúc"
                            : event.status === "cancelled"
                              ? "Đã hủy"
                              : "Chờ duyệt"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{formatDate(event.start_date)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{formatDate(event.end_date)}</span>
                        </div>
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </h2>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {event.content.length > 200
                        ? event.content.substring(0, 200) + "..."
                        : event.content}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {event.location && hasValidAddress(event.location) ? (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="line-clamp-1 max-w-32">
                              {event.location}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(
                                  getGoogleMapsUrl(event?.location || ""),
                                  "_blank"
                                );
                              }}
                              className="ml-2 p-1 hover:bg-gray-100 rounded"
                              title="Xem vị trí trên Google Maps"
                            >
                              <Navigation className="h-3 w-3 text-blue-600" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center text-gray-400">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>Chưa cập nhật địa điểm</span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <span>
                            Ngày tạo:{" "}
                            {event.createdAt
                              ? formatDate(event.createdAt)
                              : "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {event.url && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(event?.url || "", "_blank");
                            }}
                            className="inline-flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Xem chi tiết
                          </button>
                        )}
                        <button className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm">
                          Chi tiết sự kiện
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không tìm thấy sự kiện nào
            </h3>
            <p className="text-gray-600">
              {activeSearchQuery
                ? `Không tìm thấy sự kiện nào với từ khóa "${activeSearchQuery}". Hãy thử từ khóa khác.`
                : "Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc"}
            </p>
          </div>
        )}

        {/* Load More Button */}
        {events.length > 0 && events.length < totalDocs && (
          <div className="text-center mt-8">
            <Button
              variant="bordered"
              endContent={<ArrowRight className="h-4 w-4" />}
              className="px-6 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm font-medium visible opacity-100 z-10 relative"
              size="md"
              onPress={() => fetchEvents(true)}
              isLoading={loading}
            >
              Xem thêm sự kiện
            </Button>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Có lỗi xảy ra
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button
              color="primary"
              onPress={() => fetchEvents()}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Thử lại
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

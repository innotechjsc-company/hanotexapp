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
    "upcoming" | "in_progress" | "completed" | "all"
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
    { value: "upcoming", label: "Chưa bắt đầu" },
    { value: "in_progress", label: "Đang diễn ra" },
    { value: "completed", label: "Đã kết thúc" },
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

      let newEvents: Event[] = Array.isArray(response.docs)
        ? (response.docs as unknown as Event[])
        : [];

      // Filter events by status based on dates if not "all"
      if (selectedStatus !== "all") {
        newEvents = newEvents.filter((event: Event) => {
          const eventStatus = getEventStatus(event.start_date, event.end_date);
          return eventStatus.status === selectedStatus;
        });
      }

      if (isLoadMore) {
        setEvents((prev) => [...prev, ...newEvents] as any);
        setCurrentPage((prev) => prev + 1);
      } else {
        setEvents(newEvents as any);
        setCurrentPage(1);
      }

      // For filtered results, we need to calculate total based on all events
      // This is a simplified approach - in production you might want to fetch all events to get accurate count
      setTotalDocs(
        selectedStatus === "all" ? response.totalDocs || 0 : newEvents.length
      );
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

  // Helper function to determine event status based on dates
  const getEventStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return {
        status: "upcoming",
        label: "Chưa bắt đầu",
        className: "bg-blue-100 text-blue-800",
      };
    } else if (now >= start && now <= end) {
      return {
        status: "in_progress",
        label: "Đang diễn ra",
        className: "bg-green-100 text-green-800",
      };
    } else {
      return {
        status: "completed",
        label: "Đã kết thúc",
        className: "bg-gray-100 text-gray-800",
      };
    }
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
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center mb-4">
            <Search className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">
              Tìm kiếm & Lọc
            </h2>
          </div>
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sự kiện, hội thảo, triển lãm..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              {activeSearchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveSearchQuery("");
                    setCurrentPage(1);
                    fetchEvents(false, "");
                  }}
                  className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700`}
                >
                  <X className="h-4 w-4 mr-2" />
                  Xóa tìm kiếm
                </button>
              ) : (
                <button
                  type="submit"
                  className={`px-6 py-3 rounded-xl transition-all duration-300 flex items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800`}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Tìm kiếm
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <Filter className="h-4 w-4 mr-2" />
                <span>Trạng thái:</span>
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                {eventStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-blue-50 text-blue-600 rounded-full px-4 py-2">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">
                <span className="font-bold">{totalDocs}</span> sự kiện
                {activeSearchQuery && (
                  <span className="ml-1 text-gray-500">
                    cho "{activeSearchQuery}"
                  </span>
                )}
              </span>
            </div>
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
                      {(() => {
                        const eventStatus = getEventStatus(
                          event.start_date,
                          event.end_date
                        );
                        return (
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${eventStatus.className}`}
                          >
                            {eventStatus.label}
                          </span>
                        );
                      })()}
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3 flex-1">
                        <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {event.title}
                        </h2>
                      </div>
                    </div>

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
          <div className="text-center mt-12">
            <button
              onClick={() => fetchEvents(true)}
              disabled={loading}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Đang tải...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-5 w-5" />
                  Xem thêm sự kiện
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="text-red-600 mb-4">
                <ExternalLink className="h-12 w-12 mx-auto mb-2" />
                <h3 className="text-lg font-semibold">Có lỗi xảy ra</h3>
                <p className="text-sm mt-2">{error}</p>
              </div>
              <button
                onClick={() => fetchEvents()}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

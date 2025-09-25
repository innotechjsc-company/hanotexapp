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

export default function EventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    "pending" | "in_progress" | "completed" | "cancelled" | "all"
  >("all");
  const [sortBy, setSortBy] = useState("start_date");
  const [totalDocs, setTotalDocs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Comments state
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Phạm Minh D",
      avatar: "P",
      avatarColor: "purple",
      time: "09:44 24 thg 9",
      content:
        "Sự kiện này có hấp dẫn quá! Mình đã đăng ký rồi, mong chờ được tham gia.",
    },
    {
      id: 2,
      author: "Hoàng Thị E",
      avatar: "H",
      avatarColor: "blue",
      time: "08:44 24 thg 9",
      content:
        "Có workshop thực hành không ạ? Mình muốn tìm hiểu thêm về phần này.",
    },
  ]);
  const [newComment, setNewComment] = useState("");

  const eventTypes = [
    "Tất cả",
    "Hội thảo",
    "Workshop",
    "Triển lãm",
    "Hội nghị",
  ];
  const eventStatuses = [
    { value: "all", label: "Tất cả" },
    { value: "pending", label: "Chờ duyệt" },
    { value: "in_progress", label: "Đang diễn ra" },
    { value: "completed", label: "Đã kết thúc" },
    { value: "cancelled", label: "Đã hủy" },
  ];

  // Fetch events from API
  const fetchEvents = async (isLoadMore = false) => {
    try {
      if (!isLoadMore) {
        setLoading(true);
        setError(null);
      }

      let response;

      // Fetch based on selected status
      if (selectedStatus === "all") {
        // Fetch all events without status filter
        response = await getEvents(
          {}, // No filters
          {
            page: isLoadMore ? currentPage + 1 : 1,
            limit: 10,
            sort: sortBy === "start_date" ? "start_date" : "-createdAt",
          }
        );
      } else if (selectedStatus === "in_progress") {
        response = await getOngoingEvents({
          page: isLoadMore ? currentPage + 1 : 1,
          limit: 10,
          sort: sortBy === "start_date" ? "start_date" : "-createdAt",
        });
      } else if (selectedStatus === "completed") {
        response = await getPastEvents({
          page: isLoadMore ? currentPage + 1 : 1,
          limit: 10,
          sort: sortBy === "start_date" ? "-end_date" : "-createdAt",
        });
      } else {
        response = await getEvents(
          { status: selectedStatus as any },
          {
            page: isLoadMore ? currentPage + 1 : 1,
            limit: 10,
            sort: sortBy === "start_date" ? "start_date" : "-createdAt",
          }
        );
      }

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
  }, [selectedStatus, sortBy]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchEvents();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await searchEvents(
        searchQuery,
        { status: selectedStatus },
        {
          page: 1,
          limit: 10,
          sort: sortBy === "start_date" ? "start_date" : "-createdAt",
        }
      );

      const searchResults = Array.isArray(response.docs) ? response.docs : [];
      setEvents(searchResults as any);
      setTotalDocs(response.totalDocs || 0);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error searching events:", err);
      setError("Không thể tìm kiếm sự kiện. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get image URL
  const getImageUrl = (image: any): string => {
    // Multiple fallback images for variety
    const fallbackImages = [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop", // Conference
      "https://images.unsplash.com/photo-1559223607-b4d0555ae227?w=800&h=400&fit=crop", // Business meeting
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop", // Tech event
      "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&h=400&fit=crop", // Workshop
    ];

    // Use a random fallback image based on image id or title
    const fallbackIndex = image?.id
      ? parseInt(image.id.slice(-1), 16) % fallbackImages.length
      : Math.floor(Math.random() * fallbackImages.length);
    const fallbackImage = fallbackImages[fallbackIndex];

    if (!image) return fallbackImage;

    // Check if it's a string URL
    if (typeof image === "string") {
      if (image.startsWith("http")) return image;
      return `${PAYLOAD_API_BASE_URL.replace("/api", "")}${image}`;
    }

    // Check if it's an image object from PayloadCMS
    if (image && typeof image === "object") {
      // Only use the image if it's actually an image file
      if (image.mimeType && image.mimeType.startsWith("image/")) {
        if (image.url) {
          if (image.url.startsWith("http")) return image.url;
          return `${PAYLOAD_API_BASE_URL.replace("/api", "")}${image.url}`;
        }
      }
      // If it's not an image file (like PDF), use fallback
      return fallbackImage;
    }

    return fallbackImage;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "in_progress":
        return "primary";
      case "completed":
        return "success";
      case "cancelled":
        return "danger";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Chờ duyệt";
      case "in_progress":
        return "Đang diễn ra";
      case "completed":
        return "Đã kết thúc";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  // Comment handlers
  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: "Bạn",
        avatar: "B",
        avatarColor: "green",
        time: new Date().toLocaleString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
        }),
        content: newComment.trim(),
      };
      setComments([comment, ...comments]);
      setNewComment("");
    }
  };

  const getAvatarColorClass = (color: string) => {
    switch (color) {
      case "purple":
        return "bg-purple-100 text-purple-600";
      case "blue":
        return "bg-blue-100 text-blue-600";
      case "green":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
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
                  color="primary"
                  className="px-6 bg-blue-600 text-white hover:bg-blue-700 shadow-md min-w-[120px] visible opacity-100 z-10 relative flex-shrink-0"
                  size="md"
                >
                  Tìm kiếm
                </Button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Trạng thái"
                  variant="bordered"
                  selectedKeys={[selectedStatus]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as
                      | "pending"
                      | "in_progress"
                      | "completed"
                      | "cancelled"
                      | "all";
                    setSelectedStatus(selected);
                  }}
                >
                  {eventStatuses.map((status) => (
                    <SelectItem key={status.value}>{status.label}</SelectItem>
                  ))}
                </Select>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <p className="text-gray-600">
              Tìm thấy <span className="font-semibold">{totalDocs}</span> sự
              kiện
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Select
              size="sm"
              variant="bordered"
              selectedKeys={[sortBy]}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setSortBy(selected);
              }}
              className="w-48"
            >
              <SelectItem key="date">Theo ngày</SelectItem>
              <SelectItem key="title">Theo tên</SelectItem>
              <SelectItem key="attendees">Theo số lượng tham gia</SelectItem>
            </Select>
          </div>
        </div>

        {/* Events List */}
        {events.length > 0 ? (
          <div className="space-y-6 w-full">
            {events.map((event: Event) => (
              <Card
                key={event.id}
                className="hover:shadow-md transition-shadow w-full cursor-pointer"
                isPressable
                onPress={() => router.push(`/events/${event.id}`)}
              >
                <CardBody className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                    {event.title}
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {event.content.length > 200
                      ? event.content.substring(0, 200) + "..."
                      : event.content}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(event.start_date)}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{formatDate(event.end_date)}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-center text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    )}
                  </div>

                  <Divider className="my-4" />

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span>Ngày tạo: </span>
                      <span className="font-medium">
                        {event.createdAt ? formatDate(event.createdAt) : "N/A"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap min-h-[40px]">
                      {event.url && (
                        <div onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="light"
                            color="primary"
                            size="sm"
                            endContent={<ExternalLink className="h-3 w-3" />}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium visible opacity-100 z-10 relative flex-shrink-0"
                            onPress={() => window.open(event.url, "_blank")}
                          >
                            Xem chi tiết
                          </Button>
                        </div>
                      )}
                      <div onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="light"
                          color="primary"
                          size="sm"
                          endContent={<ExternalLink className="h-3 w-3" />}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium visible opacity-100 z-10 relative flex-shrink-0"
                          onPress={() => router.push(`/events/${event.id}`)}
                        >
                          Chi tiết sự kiện
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
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
              Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
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

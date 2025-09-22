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

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: string;
  type: string;
  status: "upcoming" | "ongoing" | "completed";
  registration_required: boolean;
  registration_deadline?: string;
  image_url?: string;
  organizer: string;
  contact_email: string;
  contact_phone: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("upcoming");
  const [sortBy, setSortBy] = useState("date");

  // Mock data for events
  const mockEvents: Event[] = [
    {
      id: 1,
      title: "Techmart Hà Nội 2025",
      description:
        "Triển lãm công nghệ và sản phẩm khoa học công nghệ lớn nhất Hà Nội với sự tham gia của hơn 200 doanh nghiệp và viện nghiên cứu.",
      date: "2025-02-25",
      time: "08:00 - 17:00",
      location: "Trung tâm Hội nghị Quốc gia",
      attendees: "500+",
      type: "Triển lãm",
      status: "upcoming",
      registration_required: true,
      registration_deadline: "2025-02-20",
      organizer: "Sở KH&CN Hà Nội",
      contact_email: "contact@hanotex.vn",
      contact_phone: "024 3825 1234",
      image_url: "/images/events/techmart-2025.jpg",
    },
    {
      id: 2,
      title: "Đấu giá công nghệ AI & Machine Learning",
      description:
        "Sự kiện đấu giá các công nghệ AI và Machine Learning từ các viện nghiên cứu và doanh nghiệp công nghệ hàng đầu.",
      date: "2025-03-15",
      time: "14:00 - 16:00",
      location: "Sở KH&CN Hà Nội",
      attendees: "200+",
      type: "Đấu giá",
      status: "upcoming",
      registration_required: true,
      registration_deadline: "2025-03-10",
      organizer: "HANOTEX",
      contact_email: "contact@hanotex.vn",
      contact_phone: "024 3825 1234",
      image_url: "/images/events/ai-auction.jpg",
    },
    {
      id: 3,
      title: "Hội thảo chuyển giao công nghệ",
      description:
        "Hội thảo chuyên đề về quy trình chuyển giao công nghệ hiệu quả, chia sẻ kinh nghiệm và best practices.",
      date: "2025-03-20",
      time: "09:00 - 12:00",
      location: "Trường Đại học Bách Khoa Hà Nội",
      attendees: "150+",
      type: "Hội thảo",
      status: "upcoming",
      registration_required: true,
      registration_deadline: "2025-03-15",
      organizer: "Đại học Bách Khoa Hà Nội",
      contact_email: "contact@hanotex.vn",
      contact_phone: "024 3869 1234",
      image_url: "/images/events/tech-transfer-workshop.jpg",
    },
    {
      id: 4,
      title: 'Workshop "Định giá công nghệ và sở hữu trí tuệ"',
      description:
        "Workshop hướng dẫn các phương pháp định giá công nghệ và bảo vệ quyền sở hữu trí tuệ cho doanh nghiệp.",
      date: "2025-03-25",
      time: "13:30 - 17:00",
      location: "Viện Hàn lâm Khoa học Việt Nam",
      attendees: "100+",
      type: "Workshop",
      status: "upcoming",
      registration_required: true,
      registration_deadline: "2025-03-20",
      organizer: "Viện Hàn lâm KH&CN VN",
      contact_email: "contact@hanotex.vn",
      contact_phone: "024 3791 1234",
    },
    {
      id: 5,
      title: 'Hội nghị "Xu hướng công nghệ 2025"',
      description:
        "Hội nghị tổng kết các xu hướng công nghệ nổi bật trong năm 2025 và định hướng phát triển cho các doanh nghiệp.",
      date: "2025-01-20",
      time: "08:30 - 16:30",
      location: "Khách sạn Daewoo Hà Nội",
      attendees: "300+",
      type: "Hội nghị",
      status: "completed",
      registration_required: false,
      organizer: "Hiệp hội Doanh nghiệp CNTT",
      contact_email: "contact@hanotex.vn",
      contact_phone: "024 3775 1234",
    },
  ];

  const eventTypes = [
    "Tất cả",
    "Triển lãm",
    "Đấu giá",
    "Hội thảo",
    "Workshop",
    "Hội nghị",
  ];
  const eventStatuses = [
    { value: "upcoming", label: "Sắp diễn ra" },
    { value: "ongoing", label: "Đang diễn ra" },
    { value: "completed", label: "Đã kết thúc" },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchEvents = async () => {
      setLoading(true);
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEvents(mockEvents);
      setLoading(false);
    };

    fetchEvents();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter events based on search query
    const filtered = mockEvents.filter(
      (event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setEvents(filtered);
  };

  const filteredEvents = events.filter((event) => {
    const typeMatch =
      selectedType === "" ||
      selectedType === "Tất cả" ||
      event.type === selectedType;
    const statusMatch = event.status === selectedStatus;
    return typeMatch && statusMatch;
  });

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
      case "upcoming":
        return "success";
      case "ongoing":
        return "primary";
      case "completed":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Sắp diễn ra";
      case "ongoing":
        return "Đang diễn ra";
      case "completed":
        return "Đã kết thúc";
      default:
        return status;
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
          <Button
            color="primary"
            startContent={<Plus className="h-5 w-5" />}
            className="font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-md visible opacity-100 z-10 relative"
            size="md"
          >
            Đăng sự kiện
          </Button>
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
                  label="Loại sự kiện"
                  variant="bordered"
                  selectedKeys={selectedType ? [selectedType] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    setSelectedType(selected === "Tất cả" ? "" : selected);
                  }}
                >
                  {eventTypes.map((type) => (
                    <SelectItem key={type === "Tất cả" ? "" : type}>
                      {type}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Trạng thái"
                  variant="bordered"
                  selectedKeys={[selectedStatus]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
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
              Tìm thấy{" "}
              <span className="font-semibold">{filteredEvents.length}</span> sự
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
        {filteredEvents.length > 0 ? (
          <div className="space-y-6 w-full">
            {filteredEvents.map((event) => (
              <Card
                key={event.id}
                className="hover:shadow-md transition-shadow w-full"
                isPressable
              >
                <CardBody className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Chip color="primary" size="sm" variant="flat">
                        {event.type}
                      </Chip>
                      <Chip
                        color={getStatusColor(event.status) as any}
                        size="sm"
                        variant="flat"
                      >
                        {getStatusText(event.status)}
                      </Chip>
                      {event.registration_required && (
                        <Chip color="warning" size="sm" variant="flat">
                          Cần đăng ký
                        </Chip>
                      )}
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                    {event.title}
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {event.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{event.attendees} người tham gia</span>
                    </div>
                  </div>

                  <Divider className="my-4" />

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span>Tổ chức bởi: </span>
                      <span className="font-medium">{event.organizer}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap min-h-[40px]">
                      {event.status === "upcoming" &&
                        event.registration_required && (
                          <Button
                            color="primary"
                            size="sm"
                            className="bg-blue-600 text-white hover:bg-blue-700 shadow-sm font-medium visible opacity-100 z-10 relative flex-shrink-0"
                          >
                            Đăng ký tham gia
                          </Button>
                        )}
                      <Button
                        variant="light"
                        color="primary"
                        size="sm"
                        endContent={<ExternalLink className="h-3 w-3" />}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium visible opacity-100 z-10 relative flex-shrink-0"
                      >
                        Chi tiết sự kiện
                      </Button>
                    </div>
                  </div>

                  {event.registration_deadline &&
                    event.status === "upcoming" && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <strong>Hạn đăng ký:</strong>{" "}
                          {formatDate(event.registration_deadline)}
                        </p>
                      </div>
                    )}
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
        {filteredEvents.length > 0 && (
          <div className="text-center mt-8">
            <Button
              variant="bordered"
              endContent={<ArrowRight className="h-4 w-4" />}
              className="px-6 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 shadow-sm font-medium visible opacity-100 z-10 relative"
              size="md"
            >
              Xem thêm sự kiện
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

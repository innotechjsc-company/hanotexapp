"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  ArrowLeft,
  Share2,
  ExternalLink,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Info,
  MessageCircle,
  Send,
} from "lucide-react";
import Link from "next/link";
import Map from "@/components/ui/Map";
import CountdownTimer from "@/components/ui/CountdownTimer";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  location_details?: {
    address: string;
    coordinates: [number, number];
    googleMapsUrl?: string;
  };
  attendees: string;
  type: string;
  status: "upcoming" | "ongoing" | "completed";
  registration_required: boolean;
  registration_deadline?: string;
  image_url?: string;
  gallery_images?: string[];
  organizer: string;
  contact_email: string;
  contact_phone: string;
  detailed_content?: string;
  agenda?: Array<{
    time: string;
    title: string;
    speaker?: string;
  }>;
}

interface Comment {
  id: number;
  user: {
    name: string;
    avatar?: string;
    initial: string;
  };
  content: string;
  timestamp: string;
}

export default function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  // Mock data - in real app, fetch from API
  const mockEvent: Event = {
    id: parseInt(params.id),
    title: "Techmart Hà Nội 2025",
    description:
      "Triển lãm công nghệ và sản phẩm khoa học công nghệ lớn nhất Hà Nội với sự tham gia của hơn 200 doanh nghiệp và viện nghiên cứu.",
    date: "2025-02-25",
    time: "08:00 - 17:00",
    location: "Trung tâm Hội nghị Quốc gia",
    location_details: {
      address: "Mỹ Đình, Nam Từ Liêm, Hà Nội",
      coordinates: [21.0285, 105.8542],
      googleMapsUrl: "https://maps.google.com/?q=21.0285,105.8542",
    },
    attendees: "500+",
    type: "Triển lãm",
    status: "upcoming",
    registration_required: true,
    registration_deadline: "2025-02-20",
    organizer: "Sở KH&CN Hà Nội",
    contact_email: "contact@hanotex.vn",
    contact_phone: "024 3825 1234",
    image_url: "/images/events/techmart-2025.jpg",
    gallery_images: [
      "/images/events/techmart-2025.jpg",
      "/images/events/ai-auction.jpg",
      "/images/events/tech-transfer-workshop.jpg",
      "/images/events/techmart-2025.jpg",
    ],
    detailed_content: `
      <p>Techmart Hà Nội 2025 là triển lãm công nghệ và sản phẩm khoa học công nghệ lớn nhất Hà Nội, quy tụ hơn 200 doanh nghiệp và viện nghiên cứu hàng đầu. Sự kiện này mang đến cơ hội tuyệt vời để kết nối, học hỏi và khám phá những xu hướng công nghệ mới nhất.</p>
      
      <h2>Mục tiêu sự kiện</h2>
      <p>Techmart Hà Nội 2025 được tổ chức với các mục tiêu chính:</p>
      <ul>
        <li>Giới thiệu các sản phẩm và dịch vụ công nghệ mới nhất</li>
        <li>Tạo cơ hội kết nối giữa doanh nghiệp và nhà nghiên cứu</li>
        <li>Thúc đẩy chuyển giao công nghệ và thương mại hóa</li>
        <li>Nâng cao nhận thức về vai trò của khoa học công nghệ</li>
      </ul>
      
      <h2>Nội dung chính</h2>
      <p>Sự kiện bao gồm nhiều hoạt động đa dạng:</p>
      <ul>
        <li>Triển lãm sản phẩm và công nghệ</li>
        <li>Hội thảo chuyên đề về xu hướng công nghệ</li>
        <li>Kết nối doanh nghiệp (B2B)</li>
        <li>Demo và thuyết trình công nghệ</li>
        <li>Hội chợ việc làm trong lĩnh vực công nghệ</li>
      </ul>
      
      <h2>Đối tượng tham gia</h2>
      <p>Techmart Hà Nội 2025 dành cho:</p>
      <ul>
        <li>Doanh nghiệp công nghệ và khởi nghiệp</li>
        <li>Viện nghiên cứu và trường đại học</li>
        <li>Nhà đầu tư và quỹ đầu tư</li>
        <li>Sinh viên và chuyên gia công nghệ</li>
        <li>Đại diện các cơ quan chính phủ</li>
      </ul>
    `,
    agenda: [
      {
        time: "08:00 - 08:30",
        title: "Đăng ký và khai mạc",
        speaker: "Đại diện Sở KH&CN Hà Nội",
      },
      {
        time: "08:30 - 09:30",
        title: "Phát biểu khai mạc và giới thiệu tổng quan",
        speaker: "Ông Nguyễn Văn A - Giám đốc Sở KH&CN",
      },
      {
        time: "09:30 - 11:00",
        title: "Triển lãm sản phẩm công nghệ",
        speaker: "Các doanh nghiệp tham gia",
      },
      {
        time: "11:00 - 12:00",
        title: "Hội thảo: Xu hướng AI và Machine Learning 2025",
        speaker: "GS.TS. Trần Văn B - Viện Công nghệ Thông tin",
      },
      {
        time: "13:30 - 15:00",
        title: "Demo công nghệ và thuyết trình sản phẩm",
        speaker: "Các startup công nghệ",
      },
      {
        time: "15:00 - 16:30",
        title: "Kết nối doanh nghiệp (B2B Networking)",
        speaker: "Tất cả tham gia",
      },
      {
        time: "16:30 - 17:00",
        title: "Tổng kết và bế mạc",
        speaker: "Đại diện Ban tổ chức",
      },
    ],
  };

  // Mock comments data
  const mockComments: Comment[] = [
    {
      id: 1,
      user: {
        name: "Phạm Minh D",
        initial: "P",
      },
      content:
        "Sự kiện này có hấp dẫn quá! Mình đã đăng ký rồi, mong chờ được tham gia.",
      timestamp: "09:44 24 thg 9",
    },
    {
      id: 2,
      user: {
        name: "Hoàng Thị E",
        initial: "H",
      },
      content:
        "Có workshop thực hành không ạ? Mình muốn tìm hiểu thêm về phần này.",
      timestamp: "08:44 24 thg 9",
    },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchEvent = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEvent(mockEvent);
      setComments(mockComments);
      setLoading(false);
    };

    fetchEvent();
  }, [params.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleRegister = () => {
    setIsRegistered(true);
    // In real app, handle registration logic
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: comments.length + 1,
        user: {
          name: "Bạn",
          initial: "B",
        },
        content: newComment.trim(),
        timestamp: new Date().toLocaleString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          day: "numeric",
          month: "short",
        }),
      };
      setComments([comment, ...comments]);
      setNewComment("");
    }
  };

  const nextImage = () => {
    if (event?.gallery_images) {
      setCurrentImageIndex((prev) =>
        prev === event.gallery_images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (event?.gallery_images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? event.gallery_images!.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin sự kiện...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Không tìm thấy sự kiện
          </h1>
          <Link href="/events" className="text-blue-600 hover:text-blue-800">
            Quay lại danh sách sự kiện
          </Link>
        </div>
      </div>
    );
  }

  const allImages = event.gallery_images
    ? [event.image_url, ...event.gallery_images].filter(Boolean)
    : [event.image_url].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with gradient background */}
      <div className="relative bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900 text-white">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/events"
              className="flex items-center text-white hover:text-purple-200 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Quay lại danh sách sự kiện
            </Link>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-sm font-medium text-white">
                {getStatusText(event.status)}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {event.title}
            </h1>
            <p className="text-xl text-purple-100 leading-relaxed max-w-4xl">
              {event.description}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Countdown Timer */}
            {event.status === "upcoming" && (
              <CountdownTimer
                targetDate={`${event.date}T${event.time.split(" - ")[0]}:00`}
                className="mb-6"
              />
            )}

            {/* Thông tin sự kiện card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Info className="h-5 w-5 mr-2 text-purple-600" />
                Thông tin sự kiện
              </h2>
              <div className="space-y-4">
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-purple-700 mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Thời gian bắt đầu
                  </h3>
                  <p className="text-purple-900 font-medium text-lg">
                    {formatDate(event.date)} • {event.time}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">
                    Mô tả sự kiện
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Tham gia cùng chúng tôi trong hội thảo về những xu hướng mới
                    nhất trong lĩnh vực Trí tuệ Nhân tạo. Sự kiện sẽ bao gồm các
                    phiên thuyết trình từ các chuyên gia hàng đầu, workshop thực
                    hành và cơ hội networking với cộng đồng tech Việt Nam.
                  </p>
                </div>
              </div>
            </div>

            {/* Địa điểm với bản đồ */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-purple-600" />
                Địa điểm
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Trung tâm Hội nghị Quốc gia
                  </h3>
                  <p className="text-gray-900 mb-2">
                    {event.location_details?.address}
                  </p>
                  {event.location_details?.googleMapsUrl && (
                    <a
                      href={event.location_details.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-purple-600 hover:text-purple-800 text-sm font-medium"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Xem trên Google Maps
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <MessageCircle className="h-5 w-5 text-gray-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Bình luận ({comments.length})
                </h2>
              </div>

              {/* Comment Input */}
              <div className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Chia sẻ suy nghĩ của bạn về sự kiện..."
                  className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                />
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleCommentSubmit}
                    disabled={!newComment.trim()}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Đăng bình luận
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-medium text-sm">
                          {comment.user.initial}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {comment.user.name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {comments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ!</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            {event.registration_required && event.status === "upcoming" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Đăng ký tham gia
                </h3>

                {event.registration_deadline && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                      <p className="text-sm text-yellow-800">
                        Hạn đăng ký: {formatDate(event.registration_deadline)}
                      </p>
                    </div>
                  </div>
                )}

                {isRegistered ? (
                  <div className="text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <p className="text-green-600 font-medium">
                      Đã đăng ký thành công!
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Chúng tôi sẽ gửi thông tin chi tiết đến email của bạn
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleRegister}
                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200"
                  >
                    Đăng ký ngay
                  </button>
                )}
              </div>
            )}

            {/* Organizer Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-purple-600" />
                Thông tin tổ chức
              </h3>
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Đơn vị tổ chức
                  </h4>
                  <p className="text-gray-900">{event.organizer}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Email liên hệ
                  </h4>
                  <a
                    href={`mailto:${event.contact_email}`}
                    className="text-purple-600 hover:text-purple-800"
                  >
                    {event.contact_email}
                  </a>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">
                    Số điện thoại
                  </h4>
                  <a
                    href={`tel:${event.contact_phone}`}
                    className="text-purple-600 hover:text-purple-800"
                  >
                    {event.contact_phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

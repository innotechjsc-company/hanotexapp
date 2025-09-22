'use client';

import { useState, useEffect } from 'react';
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
  Info
} from 'lucide-react';
import Link from 'next/link';

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

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);

  // Mock data - in real app, fetch from API
  const mockEvent: Event = {
    id: parseInt(params.id),
    title: "Techmart Hà Nội 2025",
    description: "Triển lãm công nghệ và sản phẩm khoa học công nghệ lớn nhất Hà Nội với sự tham gia của hơn 200 doanh nghiệp và viện nghiên cứu.",
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
    gallery_images: [
      "/images/events/techmart-2025.jpg",
      "/images/events/ai-auction.jpg",
      "/images/events/tech-transfer-workshop.jpg",
      "/images/events/techmart-2025.jpg"
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
        speaker: "Đại diện Sở KH&CN Hà Nội"
      },
      {
        time: "08:30 - 09:30",
        title: "Phát biểu khai mạc và giới thiệu tổng quan",
        speaker: "Ông Nguyễn Văn A - Giám đốc Sở KH&CN"
      },
      {
        time: "09:30 - 11:00",
        title: "Triển lãm sản phẩm công nghệ",
        speaker: "Các doanh nghiệp tham gia"
      },
      {
        time: "11:00 - 12:00",
        title: "Hội thảo: Xu hướng AI và Machine Learning 2025",
        speaker: "GS.TS. Trần Văn B - Viện Công nghệ Thông tin"
      },
      {
        time: "13:30 - 15:00",
        title: "Demo công nghệ và thuyết trình sản phẩm",
        speaker: "Các startup công nghệ"
      },
      {
        time: "15:00 - 16:30",
        title: "Kết nối doanh nghiệp (B2B Networking)",
        speaker: "Tất cả tham gia"
      },
      {
        time: "16:30 - 17:00",
        title: "Tổng kết và bế mạc",
        speaker: "Đại diện Ban tổ chức"
      }
    ]
  };

  useEffect(() => {
    // Simulate API call
    const fetchEvent = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEvent(mockEvent);
      setLoading(false);
    };

    fetchEvent();
  }, [params.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Sắp diễn ra';
      case 'ongoing':
        return 'Đang diễn ra';
      case 'completed':
        return 'Đã kết thúc';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleRegister = () => {
    setIsRegistered(true);
    // In real app, handle registration logic
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy sự kiện</h1>
          <Link href="/events" className="text-blue-600 hover:text-blue-800">
            Quay lại danh sách sự kiện
          </Link>
        </div>
      </div>
    );
  }

  const allImages = event.gallery_images ? [event.image_url, ...event.gallery_images].filter(Boolean) : [event.image_url].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <Link 
              href="/events" 
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Quay lại danh sách sự kiện
            </Link>
            <button className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200">
              <Share2 className="h-5 w-5 mr-2" />
              Chia sẻ
            </button>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                {getStatusText(event.status)}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {event.type}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
            <p className="text-xl text-gray-600 leading-relaxed">{event.description}</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Image */}
            {allImages.length > 0 && (
              <div className="relative">
                <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden">
                  <img
                    src={allImages[currentImageIndex]}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all duration-200"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {allImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-200 ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Detailed Content */}
            {event.detailed_content && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div 
                  className="prose prose-gray max-w-none"
                  dangerouslySetInnerHTML={{ __html: event.detailed_content }}
                />
              </div>
            )}

            {/* Agenda */}
            {event.agenda && event.agenda.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Chương trình sự kiện</h3>
                <div className="space-y-4">
                  {event.agenda.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-20 text-sm font-medium text-blue-600">
                        {item.time}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                        {item.speaker && (
                          <p className="text-sm text-gray-600">Diễn giả: {item.speaker}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Thông tin sự kiện</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{formatDate(event.date)}</p>
                    <p className="text-sm text-gray-600">Ngày diễn ra</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{event.time}</p>
                    <p className="text-sm text-gray-600">Thời gian</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{event.location}</p>
                    <p className="text-sm text-gray-600">Địa điểm</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{event.attendees}</p>
                    <p className="text-sm text-gray-600">Số lượng tham gia</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{event.organizer}</p>
                    <p className="text-sm text-gray-600">Tổ chức</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration */}
            {event.registration_required && event.status === 'upcoming' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Đăng ký tham gia</h3>
                
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
                    <p className="text-green-600 font-medium">Đã đăng ký thành công!</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Chúng tôi sẽ gửi thông tin chi tiết đến email của bạn
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleRegister}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    Đăng ký tham gia
                  </button>
                )}
              </div>
            )}

            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Liên hệ</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{event.organizer}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                  <a 
                    href={`mailto:${event.contact_email}`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {event.contact_email}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                  <a 
                    href={`tel:${event.contact_phone}`}
                    className="text-sm text-blue-600 hover:text-blue-800"
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

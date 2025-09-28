"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  Clock,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { getNews } from "@/api/news";
import {
  getUpcomingEvents,
  registerForEvent,
  checkUserRegistration,
} from "@/api/events";
import { useAuth } from "@/store/auth";

type EventItem = {
  id: string | number;
  title: string;
  description?: string;
  date?: string;
  time?: string;
  location?: string;
  attendees?: string;
  type?: string;
  status?: string;
};

export default function NewsEventsSection() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [news, setNews] = useState<
    Array<{
      id: string | number;
      title: string;
      excerpt: string;
      date: string;
      category: string;
      readTime: string;
    }>
  >([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventRegistrations, setEventRegistrations] = useState<
    Record<string, boolean>
  >({});
  const [registering, setRegistering] = useState<Record<string, boolean>>({});
  const [showRegisterModal, setShowRegisterModal] = useState<{
    eventId: string | null;
    show: boolean;
  }>({ eventId: null, show: false });

  const estimateReadTime = (content: string): string => {
    if (!content) return "1 phút";
    const words = content
      .replace(/<[^>]+>/g, " ")
      .split(/\s+/)
      .filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} phút`;
  };

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        // Fetch only 5 latest news items
        const res = await getNews(
          {},
          { limit: 5, page: 1, sort: "-createdAt" }
        );
        const list = (
          Array.isArray((res as any).data)
            ? (res as any).data
            : Array.isArray((res as any).docs)
              ? (res as any).docs
              : []
        ) as any[];

        const mapped = list.map((n: any) => ({
          id: n.id || n._id,
          title: n.title,
          excerpt: n.content
            ? n.content.length > 160
              ? n.content.substring(0, 160) + "..."
              : n.content
            : "",
          date: n.createdAt
            ? new Date(n.createdAt).toLocaleDateString("vi-VN")
            : "",
          category: "Tin tức",
          readTime: estimateReadTime(n.content || ""),
        }));
        setNews(mapped);
      } catch (e) {
        console.error("Error fetching news:", e);
        setNews([]);
      }
    };

    fetchLatestNews();

    const fetchLatestEvents = async () => {
      try {
        // Fetch 5 upcoming events
        const res = await getUpcomingEvents({ limit: 5, sort: "start_date" });
        const list = (
          Array.isArray((res as any).data)
            ? (res as any).data
            : Array.isArray((res as any).docs)
              ? (res as any).docs
              : []
        ) as any[];

        const mapped: EventItem[] = list.map((event: any) => {
          const start = event.start_date
            ? new Date(event.start_date)
            : undefined;
          const end = event.end_date ? new Date(event.end_date) : undefined;
          return {
            id: event.id || event._id || Math.random(),
            title: event.title || "Sự kiện",
            description: event.content
              ? event.content.length > 100
                ? event.content.substring(0, 100) + "..."
                : event.content
              : undefined,
            date: start ? start.toLocaleDateString("vi-VN") : undefined,
            time:
              start && end
                ? `${start.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`
                : start
                  ? start.toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : undefined,
            location: event.location || "TBA",
            attendees: event.max_attendees
              ? `${event.max_attendees} người`
              : undefined,
            type: "Sự kiện",
            status: "Sắp diễn ra",
          };
        });
        setEvents(mapped);
      } catch (e) {
        console.error("Error fetching events:", e);
        setEvents([]);
      }
    };
    fetchLatestEvents();
  }, []);

  // Check registration status for all events
  useEffect(() => {
    if (isAuthenticated && user?.id && events.length > 0) {
      const checkAllRegistrations = async () => {
        const registrations: Record<string, boolean> = {};
        for (const event of events) {
          try {
            const isRegistered = await checkUserRegistration(
              event.id.toString(),
              user.id
            );
            registrations[event.id.toString()] = isRegistered;
          } catch (error) {
            console.error(
              `Error checking registration for event ${event.id}:`,
              error
            );
            registrations[event.id.toString()] = false;
          }
        }
        setEventRegistrations(registrations);
      };
      checkAllRegistrations();
    }
  }, [isAuthenticated, user?.id, events]);

  // Handle registration
  const handleRegister = (eventId: string) => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    setShowRegisterModal({ eventId, show: true });
  };

  // Confirm registration
  const confirmRegister = async () => {
    if (!user?.id || !showRegisterModal.eventId) return;

    try {
      setRegistering((prev) => ({
        ...prev,
        [showRegisterModal.eventId!]: true,
      }));
      await registerForEvent(showRegisterModal.eventId, user.id);

      setEventRegistrations((prev) => ({
        ...prev,
        [showRegisterModal.eventId!]: true,
      }));

      setShowRegisterModal({ eventId: null, show: false });
    } catch (err) {
      console.error("Error registering for event:", err);
      alert("Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.");
    } finally {
      setRegistering((prev) => ({
        ...prev,
        [showRegisterModal.eventId!]: false,
      }));
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tin tức & Sự kiện
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Cập nhật những thông tin mới nhất về khoa học công nghệ và các sự
            kiện quan trọng
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* News Section */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">
                Tin tức mới nhất
              </h3>
              <Link
                href="/news"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                Xem tất cả
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-6">
              {news.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.id}`}
                  className="block bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {article.category}
                      </span>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>

                    <h4 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                      {article.title}
                    </h4>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{article.date}</span>
                      </div>
                      <span className="inline-flex items-center text-blue-600 font-medium text-sm">
                        Đọc thêm
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Events Section */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-gray-900">
                Sự kiện sắp diễn ra
              </h3>
              <Link
                href="/events"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                Xem tất cả
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            <div className="space-y-6">
              {events.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="block bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        {event.type && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                            {event.type}
                          </span>
                        )}
                        {event.status && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            {event.status}
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {event.title}
                      </h4>
                      {event.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
                    {event.date && (
                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{event.date}</span>
                      </div>
                    )}
                    {event.time && (
                      <div className="flex items-center text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{event.time}</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    )}
                    {event.attendees && (
                      <div className="flex items-center text-gray-500">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{event.attendees} người tham gia</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <Link
                      href={`/events/${event.id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Chi tiết sự kiện
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                    {eventRegistrations[event.id.toString()] ? (
                      <div className="flex items-center text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span>Đã đăng ký</span>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRegister(event.id.toString());
                        }}
                        disabled={registering[event.id.toString()]}
                        className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {registering[event.id.toString()]
                          ? "Đang đăng ký..."
                          : "Đăng ký tham gia"}
                      </button>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Đăng ký nhận thông báo
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Nhận thông báo về tin tức mới nhất và sự kiện sắp diễn ra trong
              lĩnh vực khoa học công nghệ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Register Confirmation Modal */}
      {showRegisterModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Xác nhận đăng ký
              </h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn tham gia sự kiện này không?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setShowRegisterModal({ eventId: null, show: false })
                  }
                  disabled={registering[showRegisterModal.eventId || ""]}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
                >
                  Thoát
                </button>
                <button
                  onClick={confirmRegister}
                  disabled={registering[showRegisterModal.eventId || ""]}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {registering[showRegisterModal.eventId || ""] ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    "Xác nhận"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

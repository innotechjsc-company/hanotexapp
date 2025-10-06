"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, ArrowRight, Clock, User } from "lucide-react";
import { getNews } from "@/api/news";
import { getUpcomingEvents } from "@/api/events";

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
  const [news, setNews] = useState<
    Array<{
      id: string | number;
      title: string;
      excerpt: string;
      date: string;
      category: string;
      readTime: string;
      imageUrl?: string;
      subCategory?: string;
      author?: string;
      authorAvatar?: string;
    }>
  >([]);
  const [events, setEvents] = useState<EventItem[]>([]);

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

        const mapped = list.map((n: any, index: number) => ({
          id: n.id || n._id,
          title: n.title,
          excerpt: n.content
            ? n.content.length > 160
              ? n.content.substring(0, 160) + "..."
              : n.content
            : "Sự kiện quy tụ hàng trăm chuyên gia AI hàng đầu thế giới, trình bày những nghiên cứu và ứng dụng mới nhất trong lĩnh vực trí tuệ nhân tạo.",
          date: n.createdAt
            ? new Date(n.createdAt).toLocaleDateString("vi-VN")
            : `1${5 - index} Tháng 10, 2024`,
          category: "Tin tức",
          readTime: estimateReadTime(n.content || ""),
          imageUrl: n.image?.url,
          subCategory: "Hội nghị Khoa học",
          author: "Ban tổ chức HANOTEX",
          authorAvatar: "/images/hanotex-logo-avatar.png",
        }));
        console.log("list", list);
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* News Section (Left Column) */}
          <div className="lg:col-span-8">
            <div className="space-y-8">
              {news.slice(0, 2).map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="relative">
                    <img
                      src={`https://api.hanotex.vn/${article.imageUrl}`}
                      alt={article.title}
                      className="w-full h-64 object-cover"
                    />
                    <span className="absolute top-4 left-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-500 text-white">
                      {article.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {article.date} •{" "}
                        {article.subCategory || "Hội nghị Khoa học"}
                      </span>
                    </div>
                    <Link href={`/news/${article.id}`}>
                      <h4 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                        {article.title}
                      </h4>
                    </Link>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <span className="font-medium text-gray-700">
                          {article.author}
                        </span>
                      </div>
                      <Link
                        href={`/news/${article.id}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Đọc thêm
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-8">
            {/* Upcoming Events */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Sự kiện sắp tới
              </h3>
              <div className="space-y-5">
                {events.slice(0, 3).map((event) => {
                  const eventDate = event.date
                    ? new Date(event.date.split("/").reverse().join("-"))
                    : new Date();
                  const day = eventDate.getDate();
                  const month = `THG ${eventDate.getMonth() + 1}`;

                  return (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className="flex items-center gap-4 group"
                    >
                      <div className="text-center flex-shrink-0">
                        <div className="bg-blue-600 text-white rounded-t-lg px-3 py-1 text-xs font-bold">
                          {month}
                        </div>
                        <div className="bg-white border border-gray-200 text-blue-600 rounded-b-lg px-3 py-2 text-2xl font-bold">
                          {day}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {event.title}
                        </h4>
                        <p className="text-sm text-gray-500 line-clamp-2">
                          {event.description}
                        </p>
                        {event.time && (
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Clock className="h-3 w-3 mr-1.5" />
                            <span>{event.time}</span>
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
              <Link
                href="/events"
                className="mt-6 w-full inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
              >
                Xem tất cả sự kiện
              </Link>
            </div>

            {/* Newsletter Subscription */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-8 text-white text-center">
              <h3 className="text-xl font-bold mb-3">Đăng ký nhận tin</h3>
              <p className="text-sm text-blue-100 mb-6">
                Nhận thông tin mới nhất về các sản phẩm công nghệ, sự kiện và cơ
                hội đầu tư
              </p>
              <form className="space-y-4">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="w-full px-4 py-3 border-0 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-medium transition-colors bg-white text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white"
                >
                  Đăng ký ngay
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

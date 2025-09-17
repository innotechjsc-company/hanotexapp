'use client';

import Link from 'next/link';
import { Calendar, MapPin, Users, ArrowRight, Clock, ExternalLink } from 'lucide-react';

export default function NewsEventsSection() {
  // Mock data for news and events
  const news = [
    {
      id: 1,
      title: 'HANOTEX chính thức ra mắt sàn giao dịch công nghệ',
      excerpt: 'Sàn giao dịch công nghệ HANOTEX đã chính thức đi vào hoạt động, kết nối các bên trong hệ sinh thái khoa học công nghệ Hà Nội...',
      date: '15/01/2025',
      category: 'Tin tức',
      image: '/images/news-1.jpg',
      readTime: '3 phút'
    },
    {
      id: 2,
      title: 'Hội thảo "Xu hướng công nghệ 2025" tại Hà Nội',
      excerpt: 'Hội thảo quy tụ các chuyên gia hàng đầu trong lĩnh vực AI, IoT và công nghệ sinh học để thảo luận về xu hướng phát triển...',
      date: '12/01/2025',
      category: 'Sự kiện',
      image: '/images/news-2.jpg',
      readTime: '5 phút'
    },
    {
      id: 3,
      title: 'Chính sách hỗ trợ doanh nghiệp khởi nghiệp công nghệ',
      excerpt: 'Thành phố Hà Nội ban hành chính sách mới hỗ trợ doanh nghiệp khởi nghiệp trong lĩnh vực khoa học công nghệ...',
      date: '10/01/2025',
      category: 'Chính sách',
      image: '/images/news-3.jpg',
      readTime: '4 phút'
    }
  ];

  const events = [
    {
      id: 1,
      title: 'Techmart Hà Nội 2025',
      description: 'Triển lãm công nghệ và sản phẩm khoa học công nghệ lớn nhất Hà Nội',
      date: '25/02/2025',
      time: '08:00 - 17:00',
      location: 'Trung tâm Hội nghị Quốc gia',
      attendees: '500+',
      type: 'Triển lãm',
      status: 'Sắp diễn ra'
    },
    {
      id: 2,
      title: 'Đấu giá công nghệ AI & Machine Learning',
      description: 'Sự kiện đấu giá các công nghệ AI và Machine Learning từ các viện nghiên cứu',
      date: '15/03/2025',
      time: '14:00 - 16:00',
      location: 'Sở KH&CN Hà Nội',
      attendees: '200+',
      type: 'Đấu giá',
      status: 'Sắp diễn ra'
    },
    {
      id: 3,
      title: 'Hội thảo chuyển giao công nghệ',
      description: 'Hội thảo chuyên đề về quy trình chuyển giao công nghệ hiệu quả',
      date: '20/03/2025',
      time: '09:00 - 12:00',
      location: 'Trường Đại học Bách Khoa Hà Nội',
      attendees: '150+',
      type: 'Hội thảo',
      status: 'Sắp diễn ra'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tin tức & Sự kiện
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Cập nhật những thông tin mới nhất về khoa học công nghệ và các sự kiện quan trọng
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
                <article
                  key={article.id}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
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
                      <Link
                        href={`/news/${article.id}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        Đọc thêm
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </article>
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
                <div
                  key={event.id}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                          {event.type}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {event.status}
                        </span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {event.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {event.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{event.date}</span>
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

                  <div className="flex items-center justify-between">
                    <Link
                      href={`/events/${event.id}`}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Chi tiết sự kiện
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Link>
                    <button className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500">
                      Đăng ký tham gia
                    </button>
                  </div>
                </div>
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
              Nhận thông báo về tin tức mới nhất và sự kiện sắp diễn ra trong lĩnh vực khoa học công nghệ
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
    </section>
  );
}

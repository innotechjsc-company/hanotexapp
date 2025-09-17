'use client';

import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Nguyễn Văn An',
    position: 'Giám đốc Công nghệ',
    company: 'TechCorp Vietnam',
    content: 'HANOTEX đã giúp chúng tôi tìm được đối tác phù hợp để chuyển giao công nghệ AI. Quy trình đơn giản và hiệu quả.',
    rating: 5,
    avatar: '/avatars/nguyen-van-an.jpg',
  },
  {
    name: 'Trần Thị Bình',
    position: 'Nghiên cứu viên',
    company: 'Viện Khoa học Công nghệ',
    content: 'Sàn giao dịch này thực sự hữu ích cho việc kết nối giữa nghiên cứu và ứng dụng thực tế. Tôi đã tìm được nhiều cơ hội hợp tác.',
    rating: 5,
    avatar: '/avatars/tran-thi-binh.jpg',
  },
  {
    name: 'Lê Minh Cường',
    position: 'CEO',
    company: 'StartupTech',
    content: 'HANOTEX không chỉ là nơi giao dịch mà còn là cộng đồng học hỏi và chia sẻ kinh nghiệm. Rất recommend!',
    rating: 5,
    avatar: '/avatars/le-minh-cuong.jpg',
  },
  {
    name: 'Phạm Thị Dung',
    position: 'Quản lý Dự án',
    company: 'Innovation Hub',
    content: 'Chúng tôi đã thành công chuyển giao 3 công nghệ thông qua HANOTEX. Dịch vụ hỗ trợ rất chuyên nghiệp.',
    rating: 5,
    avatar: '/avatars/pham-thi-dung.jpg',
  },
  {
    name: 'Hoàng Văn Em',
    position: 'Kỹ sư Công nghệ',
    company: 'GreenTech Solutions',
    content: 'Giao diện thân thiện, dễ sử dụng. Tôi có thể dễ dàng tìm kiếm và so sánh các công nghệ phù hợp với nhu cầu.',
    rating: 5,
    avatar: '/avatars/hoang-van-em.jpg',
  },
  {
    name: 'Vũ Thị Phương',
    position: 'Giám đốc R&D',
    company: 'BioTech Vietnam',
    content: 'HANOTEX đã mở ra nhiều cơ hội hợp tác quốc tế cho chúng tôi. Thực sự là cầu nối quan trọng trong hệ sinh thái công nghệ.',
    rating: 5,
    avatar: '/avatars/vu-thi-phuong.jpg',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Những chia sẻ chân thực từ các đối tác đã tin tưởng và sử dụng dịch vụ của HANOTEX
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Quote Icon */}
              <div className="flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-full mb-4">
                <Quote className="h-6 w-6" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-gray-600 font-semibold text-lg">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.position}
                  </div>
                  <div className="text-sm text-primary-600 font-medium">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                98%
              </div>
              <div className="text-gray-600">
                Khách hàng hài lòng
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-secondary-600 mb-2">
                4.9/5
              </div>
              <div className="text-gray-600">
                Đánh giá trung bình
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent-600 mb-2">
                500+
              </div>
              <div className="text-gray-600">
                Đánh giá tích cực
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                24/7
              </div>
              <div className="text-gray-600">
                Hỗ trợ khách hàng
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Bạn cũng muốn chia sẻ trải nghiệm?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Tham gia cộng đồng HANOTEX và chia sẻ câu chuyện thành công của bạn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500"
            >
              Tham gia ngay
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500"
            >
              Liên hệ chúng tôi
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
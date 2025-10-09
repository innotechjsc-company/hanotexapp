"use client";

import { Star } from "lucide-react";

const testimonials = [
  {
    name: "GS. Nguyễn Văn Minh",
    position: "Viện trưởng Viện CNTT",
    content:
      "“HANOTEX đã giúp chúng tôi kết nối với nhiều doanh nghiệp có nhu cầu ứng dụng nghiên cứu. Nền tảng rất chuyên nghiệp và hiệu quả.”",
    rating: 5,
  },
  {
    name: "Trần Thị Hoa",
    position: "CEO TechViet Solutions",
    content:
      "“Qua HANOTEX, chúng tôi đã tìm được công nghệ AI phù hợp cho sản phẩm của mình. Quá trình giao dịch minh bạch và an toàn.”",
    rating: 5,
  },
  {
    name: "Lê Minh Tuấn",
    position: "Giám đốc đầu tư VN Capital",
    content:
      "“Nền tảng cung cấp thông tin chi tiết về các dự án đầu tư. Chúng tôi đã đầu tư thành công vào 3 startup công nghệ qua HANOTEX.”",
    rating: 5,
  },
];

const getInitials = (name: string) => {
  const nameParts = name.split(" ");
  const lastName = nameParts[nameParts.length - 1];
  return lastName.charAt(0).toUpperCase();
};

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ý kiến từ cộng đồng
          </h2>
          <p className="text-lg text-blue-200 max-w-3xl mx-auto">
            Những chia sẻ từ các nhà khoa học, doanh nghiệp và nhà đầu tư về
            trải nghiệm sử dụng HANOTEX
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-blue-800 rounded-xl p-8 flex flex-col h-full"
            >
              <div className="flex-grow">
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 rounded-full mr-4 bg-blue-700 flex items-center justify-center text-xl font-bold">
                    {getInitials(testimonial.name)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-blue-300">
                      {testimonial.position}
                    </p>
                  </div>
                </div>
                <p className="text-blue-200 italic leading-relaxed">
                  {testimonial.content}
                </p>
              </div>
              <div className="flex items-center mt-6 pt-6 border-t border-blue-700">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { Building2, Target, Users, Lightbulb } from 'lucide-react';

export default function IntroSection() {
  const features = [
    {
      icon: Building2,
      title: 'HANOTEX là gì?',
      description: 'Sàn giao dịch công nghệ trực tuyến của thành phố Hà Nội, kết nối các bên trong hệ sinh thái khoa học công nghệ.'
    },
    {
      icon: Target,
      title: 'Mục tiêu',
      description: 'Thúc đẩy chuyển giao công nghệ, thương mại hóa kết quả nghiên cứu và tạo cầu nối giữa cung - cầu công nghệ.'
    },
    {
      icon: Users,
      title: 'Đối tượng',
      description: 'Doanh nghiệp, viện nghiên cứu, trường đại học, cá nhân nghiên cứu và các tổ chức khoa học công nghệ.'
    },
    {
      icon: Lightbulb,
      title: 'Lợi ích',
      description: 'Tăng cường hiệu quả chuyển giao công nghệ, mở rộng thị trường và tạo cơ hội hợp tác đổi mới sáng tạo.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Về HANOTEX
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Nền tảng kết nối toàn diện cho hệ sinh thái khoa học công nghệ Hà Nội
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Tham gia ngay để kết nối và phát triển
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Hãy trở thành một phần của hệ sinh thái khoa học công nghệ Hà Nội. 
              Đăng ký tài khoản miễn phí và bắt đầu hành trình đổi mới sáng tạo của bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center justify-center rounded-lg px-8 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500">
                Đăng ký miễn phí
              </button>
              <button className="inline-flex items-center justify-center rounded-lg px-8 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 border border-blue-600 bg-white text-blue-600 hover:bg-blue-50 focus:ring-blue-500">
                Tìm hiểu thêm
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

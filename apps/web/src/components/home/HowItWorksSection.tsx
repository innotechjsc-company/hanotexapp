'use client';

import { UserPlus, Upload, Search, Users, Award, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Đăng ký tài khoản',
    description: 'Tạo tài khoản miễn phí với thông tin cá nhân hoặc doanh nghiệp',
    color: 'text-primary-600',
    bgColor: 'bg-primary-100',
  },
  {
    icon: Upload,
    title: 'Đăng tải công nghệ',
    description: 'Tải lên thông tin chi tiết về công nghệ, sản phẩm hoặc dịch vụ của bạn',
    color: 'text-secondary-600',
    bgColor: 'bg-secondary-100',
  },
  {
    icon: Search,
    title: 'Khám phá & Tìm kiếm',
    description: 'Tìm kiếm và khám phá các công nghệ phù hợp với nhu cầu của bạn',
    color: 'text-accent-600',
    bgColor: 'bg-accent-100',
  },
  {
    icon: Users,
    title: 'Kết nối & Thương lượng',
    description: 'Liên hệ trực tiếp với chủ sở hữu để thương lượng và đàm phán',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    icon: Award,
    title: 'Đấu giá & Giao dịch',
    description: 'Tham gia đấu giá hoặc thực hiện giao dịch trực tiếp',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    icon: TrendingUp,
    title: 'Thương mại hóa',
    description: 'Chuyển giao công nghệ và thương mại hóa thành công',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Cách thức hoạt động
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Quy trình đơn giản và minh bạch để tham gia sàn giao dịch công nghệ HANOTEX
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center text-sm font-bold text-gray-600 z-10">
                {index + 1}
              </div>

              {/* Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-full">
                <div className="px-6 py-4 text-center">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${step.bgColor} ${step.color} mb-4`}>
                    <step.icon className="h-8 w-8" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector Line (except for last item in each row) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-200 transform -translate-y-1/2 z-0" />
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Sẵn sàng bắt đầu?
            </h3>
            <p className="text-gray-600 mb-6">
              Tham gia ngay hôm nay để trở thành một phần của cộng đồng công nghệ Hà Nội
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500"
              >
                Đăng ký ngay
              </a>
              <a
                href="/technologies"
                className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500"
              >
                Khám phá công nghệ
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
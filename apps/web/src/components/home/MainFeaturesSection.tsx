'use client';

import { 
  FileText, 
  DollarSign, 
  Users, 
  Shield, 
  TrendingUp, 
  ArrowRight 
} from 'lucide-react';

export default function MainFeaturesSection() {
  const features = [
    {
      icon: FileText,
      title: 'Niêm yết công nghệ',
      description: 'Đăng tải và quản lý thông tin công nghệ một cách chuyên nghiệp với hệ thống phân loại TRL và đánh giá chất lượng.',
      color: 'bg-blue-100 text-blue-600',
      hoverColor: 'hover:bg-blue-600 hover:text-white'
    },
    {
      icon: DollarSign,
      title: 'Định giá & thẩm định',
      description: 'Hệ thống định giá công nghệ dựa trên TRL, tiềm năng thương mại và thẩm định độc lập từ chuyên gia.',
      color: 'bg-green-100 text-green-600',
      hoverColor: 'hover:bg-green-600 hover:text-white'
    },
    {
      icon: Users,
      title: 'Tư vấn & môi giới',
      description: 'Kết nối với đội ngũ chuyên gia tư vấn và môi giới công nghệ có kinh nghiệm trong lĩnh vực chuyên môn.',
      color: 'bg-purple-100 text-purple-600',
      hoverColor: 'hover:bg-purple-600 hover:text-white'
    },
    {
      icon: Shield,
      title: 'NDA & pháp lý',
      description: 'Hỗ trợ thỏa thuận bảo mật (NDA) và các vấn đề pháp lý liên quan đến chuyển giao công nghệ.',
      color: 'bg-orange-100 text-orange-600',
      hoverColor: 'hover:bg-orange-600 hover:text-white'
    },
    {
      icon: TrendingUp,
      title: 'Đầu tư & quỹ',
      description: 'Kết nối với các quỹ đầu tư, nhà đầu tư thiên thần và các nguồn vốn hỗ trợ phát triển công nghệ.',
      color: 'bg-red-100 text-red-600',
      hoverColor: 'hover:bg-red-600 hover:text-white'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tính năng chính
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Hệ thống toàn diện hỗ trợ toàn bộ quy trình chuyển giao và thương mại hóa công nghệ
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className="p-8">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 transition-colors duration-300 ${feature.color} ${feature.hoverColor}`}>
                  <feature.icon className="h-8 w-8" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Learn More Link */}
                <div className="flex items-center text-blue-600 group-hover:translate-x-1 transition-transform">
                  <span className="text-sm font-medium mr-2">Tìm hiểu thêm</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Bắt đầu hành trình đổi mới sáng tạo
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Tham gia ngay để trải nghiệm đầy đủ các tính năng và dịch vụ của HANOTEX
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/auth/register"
                className="inline-flex items-center justify-center rounded-lg px-8 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
              >
                Đăng ký tài khoản
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a 
                href="/technologies"
                className="inline-flex items-center justify-center rounded-lg px-8 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 border border-blue-600 bg-white text-blue-600 hover:bg-blue-50 focus:ring-blue-500"
              >
                Xem demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

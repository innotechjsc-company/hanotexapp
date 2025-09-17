'use client';

import Link from 'next/link';
import { 
  ArrowRight, 
  Users, 
  DollarSign, 
  Shield, 
  TrendingUp, 
  FileText,
  Target,
  Zap
} from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      title: 'Tư vấn chuyển giao công nghệ',
      description: 'Hỗ trợ tư vấn, đánh giá và thực hiện chuyển giao công nghệ từ nghiên cứu đến ứng dụng thực tế.',
      icon: Users,
      href: '/services/consulting',
      features: ['Đánh giá tiềm năng thương mại', 'Tư vấn chiến lược chuyển giao', 'Hỗ trợ đàm phán hợp đồng']
    },
    {
      title: 'Định giá công nghệ',
      description: 'Dịch vụ định giá chuyên nghiệp cho các công nghệ, sáng chế và tài sản trí tuệ.',
      icon: DollarSign,
      href: '/services/valuation',
      features: ['Định giá sáng chế', 'Đánh giá tài sản trí tuệ', 'Báo cáo định giá chuyên nghiệp']
    },
    {
      title: 'Hỗ trợ pháp lý',
      description: 'Tư vấn pháp lý về sở hữu trí tuệ, chuyển giao công nghệ và bảo vệ quyền lợi.',
      icon: Shield,
      href: '/services/legal',
      features: ['Đăng ký sở hữu trí tuệ', 'Tư vấn hợp đồng', 'Bảo vệ quyền sở hữu']
    },
    {
      title: 'Kết nối đầu tư',
      description: 'Kết nối các nhà đầu tư với các dự án công nghệ tiềm năng.',
      icon: TrendingUp,
      href: '/services/investment',
      features: ['Kết nối nhà đầu tư', 'Hỗ trợ pitch deck', 'Tư vấn gọi vốn']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Dịch vụ hỗ trợ
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Cung cấp các dịch vụ chuyên nghiệp để hỗ trợ toàn diện quá trình chuyển giao và thương mại hóa công nghệ
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dịch vụ của chúng tôi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              HANOTEX cung cấp các dịch vụ chuyên nghiệp để hỗ trợ toàn diện 
              quá trình chuyển giao và thương mại hóa công nghệ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <service.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {service.description}
                    </p>
                    
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                          <Target className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link 
                      href={service.href}
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      Tìm hiểu thêm
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Cần hỗ trợ dịch vụ?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Liên hệ với chúng tôi để được tư vấn miễn phí về các dịch vụ phù hợp với nhu cầu của bạn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
            >
              <FileText className="h-5 w-5 mr-2" />
              Liên hệ tư vấn
            </Link>
            <Link 
              href="/services/booking"
              className="border border-gray-600 hover:border-gray-500 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
            >
              <Zap className="h-5 w-5 mr-2" />
              Đặt lịch tư vấn
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

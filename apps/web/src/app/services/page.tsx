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
  Zap,
  Brain,
  Lightbulb,
  Award,
  Handshake,
  Rocket,
  CheckCircle
} from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      title: 'Tư vấn công nghệ',
      description: 'Hỗ trợ tư vấn, đánh giá và thực hiện chuyển giao công nghệ từ nghiên cứu đến ứng dụng thực tế.',
      icon: Brain,
      href: '/services/consulting',
      features: ['Đánh giá tiềm năng thương mại', 'Tư vấn chiến lược chuyển giao', 'Hỗ trợ đàm phán hợp đồng'],
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Thẩm định & định giá',
      description: 'Dịch vụ định giá chuyên nghiệp cho các công nghệ, sáng chế và tài sản trí tuệ.',
      icon: DollarSign,
      href: '/services/valuation',
      features: ['Định giá sáng chế', 'Đánh giá tài sản trí tuệ', 'Báo cáo định giá chuyên nghiệp'],
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: 'Tư vấn pháp lý',
      description: 'Tư vấn pháp lý về sở hữu trí tuệ, chuyển giao công nghệ và bảo vệ quyền lợi.',
      icon: Shield,
      href: '/services/legal',
      features: ['Đăng ký sở hữu trí tuệ', 'Tư vấn hợp đồng', 'Bảo vệ quyền sở hữu'],
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Sở hữu trí tuệ',
      description: 'Dịch vụ toàn diện về sở hữu trí tuệ, từ tư vấn, đăng ký đến bảo vệ quyền sở hữu.',
      icon: Lightbulb,
      href: '/services/intellectual-property',
      features: ['Đăng ký bằng sáng chế', 'Bảo hộ nhãn hiệu', 'Chiến lược SHTT'],
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      title: 'Kết nối đầu tư',
      description: 'Kết nối các nhà đầu tư với các dự án công nghệ tiềm năng.',
      icon: TrendingUp,
      href: '/services/investment',
      features: ['Kết nối nhà đầu tư', 'Hỗ trợ pitch deck', 'Tư vấn gọi vốn'],
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600'
    },
    {
      title: 'Đào tạo & Hỗ trợ',
      description: 'Các khóa đào tạo chuyên sâu về công nghệ, sở hữu trí tuệ và chuyển giao công nghệ.',
      icon: Award,
      href: '/services/training',
      features: ['Đào tạo công nghệ', 'Khóa học SHTT', 'Hỗ trợ phát triển'],
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Rocket className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Dịch vụ chuyên nghiệp</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Dịch vụ hỗ trợ
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Cung cấp các dịch vụ chuyên nghiệp để hỗ trợ toàn diện quá trình chuyển giao và thương mại hóa công nghệ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
              >
                <Handshake className="h-5 w-5 mr-2" />
                Liên hệ ngay
              </Link>
              <Link 
                href="#services"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center"
              >
                <ArrowRight className="h-5 w-5 mr-2" />
                Khám phá dịch vụ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-blue-50 text-blue-600 rounded-full px-4 py-2 mb-4">
              <Award className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Dịch vụ chuyên nghiệp</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dịch vụ của chúng tôi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              HANOTEX cung cấp các dịch vụ chuyên nghiệp để hỗ trợ toàn diện 
              quá trình chuyển giao và thương mại hóa công nghệ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                {/* Header with gradient */}
                <div className={`h-32 bg-gradient-to-r ${service.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute top-4 right-4">
                    <div className={`w-12 h-12 ${service.bgColor} rounded-xl flex items-center justify-center`}>
                      <service.icon className={`h-6 w-6 ${service.iconColor}`} />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-bold text-white">
                      {service.title}
                    </h3>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link 
                    href={service.href}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors group-hover:translate-x-1"
                  >
                    Tìm hiểu thêm
                    <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-gray-600">Khách hàng tin tưởng</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">1000+</div>
              <div className="text-gray-600">Dự án thành công</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">50+</div>
              <div className="text-gray-600">Chuyên gia tư vấn</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">95%</div>
              <div className="text-gray-600">Tỷ lệ hài lòng</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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

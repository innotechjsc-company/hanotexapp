'use client';

import { 
  DollarSign, 
  CheckCircle, 
  TrendingUp,
  Phone,
  Mail,
  BarChart3,
  Target,
  Award,
  Shield,
  Clock,
  Star,
  UserPlus,
  Rocket,
  Lightbulb,
  Users,
  Zap as ZapIcon
} from 'lucide-react';
import Link from 'next/link';

export default function ValuationPage() {
  const services = [
    {
      title: 'Định giá sáng chế',
      description: 'Đánh giá giá trị kinh tế của các sáng chế và giải pháp hữu ích.',
      features: [
        'Phân tích tính độc đáo của sáng chế',
        'Đánh giá tiềm năng thương mại',
        'So sánh với các sáng chế tương tự',
        'Báo cáo định giá chuyên nghiệp'
      ]
    },
    {
      title: 'Đánh giá tài sản trí tuệ',
      description: 'Định giá toàn diện các tài sản trí tuệ của doanh nghiệp.',
      features: [
        'Đánh giá danh mục sáng chế',
        'Định giá nhãn hiệu và tên thương mại',
        'Đánh giá bí quyết công nghệ',
        'Báo cáo tổng hợp tài sản trí tuệ'
      ]
    },
    {
      title: 'Báo cáo định giá chuyên nghiệp',
      description: 'Cung cấp báo cáo định giá đáp ứng các tiêu chuẩn quốc tế.',
      features: [
        'Tuân thủ chuẩn mực quốc tế',
        'Phân tích rủi ro chi tiết',
        'Dự báo dòng tiền',
        'Hỗ trợ thẩm định độc lập'
      ]
    }
  ];

  const methods = [
    {
      title: 'Phương pháp chi phí',
      description: 'Định giá dựa trên chi phí phát triển và thay thế'
    },
    {
      title: 'Phương pháp thị trường',
      description: 'So sánh với các giao dịch tương tự trên thị trường'
    },
    {
      title: 'Phương pháp thu nhập',
      description: 'Định giá dựa trên dòng tiền tương lai từ tài sản'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <DollarSign className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Định giá chuyên nghiệp</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Định giá công nghệ
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
              Dịch vụ định giá chuyên nghiệp cho các công nghệ, sáng chế và tài sản trí tuệ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Liên hệ tư vấn
              </Link>
              <Link
                href="#services"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors inline-flex items-center"
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                Khám phá dịch vụ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-green-50 text-green-600 rounded-full px-4 py-2 mb-4">
              <DollarSign className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Dịch vụ định giá</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dịch vụ định giá
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi cung cấp các dịch vụ định giá chuyên nghiệp theo tiêu chuẩn quốc tế
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                {/* Header with gradient */}
                <div className="h-32 bg-gradient-to-r from-green-500 to-green-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute top-4 right-4">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-bold text-white">
                      {service.title}
                    </h3>
                  </div>
                </div>
                
                <div className="p-8">
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link 
                    href="/contact"
                    className="inline-flex items-center text-green-600 hover:text-green-700 font-medium transition-colors group-hover:translate-x-1"
                  >
                    Tìm hiểu thêm
                    <TrendingUp className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methods Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-blue-50 text-blue-600 rounded-full px-4 py-2 mb-4">
              <BarChart3 className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Phương pháp khoa học</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Phương pháp định giá
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sử dụng các phương pháp định giá tiên tiến và được công nhận quốc tế
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {methods.map((method, index) => (
              <div key={index} className="group text-center">
                <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                  {method.title}
                </h3>
                <p className="text-gray-600">
                  {method.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-green-50 to-emerald-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-gray-600">Dự án định giá</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">98%</div>
              <div className="text-gray-600">Độ chính xác</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">30+</div>
              <div className="text-gray-600">Chuyên gia</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">4.8/5</div>
              <div className="text-gray-600">Đánh giá khách hàng</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-purple-50 text-purple-600 rounded-full px-4 py-2 mb-4">
              <Award className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Ưu điểm dịch vụ</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn chúng tôi?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Đội ngũ chuyên gia giàu kinh nghiệm và phương pháp định giá chuyên nghiệp
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Độ chính xác cao
              </h3>
              <p className="text-gray-600">
                Sử dụng các mô hình định giá tiên tiến và dữ liệu thị trường cập nhật
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Tiêu chuẩn quốc tế
              </h3>
              <p className="text-gray-600">
                Tuân thủ các chuẩn mực định giá quốc tế và được công nhận rộng rãi
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Tư vấn chiến lược
              </h3>
              <p className="text-gray-600">
                Không chỉ định giá mà còn đưa ra các khuyến nghị chiến lược
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 via-green-900 to-emerald-900 text-white py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
            <ZapIcon className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Bắt đầu ngay hôm nay</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Cần định giá công nghệ?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Liên hệ với chúng tôi để được tư vấn và thực hiện định giá chuyên nghiệp
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:02438251234"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 inline-flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <Phone className="h-5 w-5 mr-2" />
              024 3825 1234
            </a>
            <a 
              href="mailto:valuation@hanotex.gov.vn"
              className="border border-gray-600 hover:border-gray-500 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 inline-flex items-center justify-center hover:bg-white/10"
            >
              <Mail className="h-5 w-5 mr-2" />
              valuation@hanotex.gov.vn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

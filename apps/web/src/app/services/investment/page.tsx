'use client';

import { 
  TrendingUp, 
  CheckCircle, 
  Users,
  Phone,
  Mail,
  Target,
  Award,
  Briefcase
} from 'lucide-react';

export default function InvestmentPage() {
  const services = [
    {
      title: 'Kết nối nhà đầu tư',
      description: 'Kết nối các dự án công nghệ tiềm năng với các nhà đầu tư phù hợp.',
      features: [
        'Phân tích và đánh giá dự án',
        'Tìm kiếm nhà đầu tư phù hợp',
        'Tổ chức các buổi pitch',
        'Hỗ trợ đàm phán và ký kết'
      ]
    },
    {
      title: 'Hỗ trợ pitch deck',
      description: 'Hỗ trợ xây dựng pitch deck chuyên nghiệp để trình bày dự án.',
      features: [
        'Thiết kế pitch deck chuyên nghiệp',
        'Tư vấn nội dung trình bày',
        'Luyện tập thuyết trình',
        'Hỗ trợ Q&A và phản biện'
      ]
    },
    {
      title: 'Tư vấn gọi vốn',
      description: 'Tư vấn chiến lược gọi vốn và cấu trúc vốn cho startup.',
      features: [
        'Đánh giá nhu cầu vốn',
        'Lựa chọn phương thức gọi vốn',
        'Cấu trúc vốn tối ưu',
        'Tư vấn pháp lý gọi vốn'
      ]
    }
  ];

  const investors = [
    {
      name: 'Nhà đầu tư thiên thần',
      description: 'Các cá nhân giàu có đầu tư vào giai đoạn sớm'
    },
    {
      name: 'Quỹ đầu tư mạo hiểm',
      description: 'Các quỹ chuyên đầu tư vào startup công nghệ'
    },
    {
      name: 'Nhà đầu tư chiến lược',
      description: 'Các doanh nghiệp lớn tìm kiếm công nghệ mới'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Kết nối đầu tư
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Kết nối các dự án công nghệ tiềm năng với các nhà đầu tư phù hợp
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dịch vụ kết nối đầu tư
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi cung cấp các dịch vụ toàn diện để kết nối dự án với nhà đầu tư
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-6">
                  <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {service.description}
                  </p>
                </div>

                <ul className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investors Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mạng lưới nhà đầu tư
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kết nối với mạng lưới nhà đầu tư đa dạng và uy tín
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {investors.map((investor, index) => (
              <div key={index} className="text-center">
                <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {investor.name}
                </h3>
                <p className="text-gray-600">
                  {investor.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn chúng tôi?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Mạng lưới rộng lớn
              </h3>
              <p className="text-gray-600">
                Kết nối với hàng trăm nhà đầu tư trong và ngoài nước
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Kết nối chính xác
              </h3>
              <p className="text-gray-600">
                Phân tích và kết nối dự án với nhà đầu tư phù hợp nhất
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Tỷ lệ thành công cao
              </h3>
              <p className="text-gray-600">
                Nhiều dự án đã gọi vốn thành công thông qua chúng tôi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Cần gọi vốn cho dự án?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Liên hệ với chúng tôi để được hỗ trợ kết nối với các nhà đầu tư phù hợp
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:02438251234"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
            >
              <Phone className="h-5 w-5 mr-2" />
              024 3825 1234
            </a>
            <a 
              href="mailto:investment@hanotex.gov.vn"
              className="border border-gray-600 hover:border-gray-500 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
            >
              <Mail className="h-5 w-5 mr-2" />
              investment@hanotex.gov.vn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

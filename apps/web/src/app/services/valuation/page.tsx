'use client';

import { 
  DollarSign, 
  CheckCircle, 
  TrendingUp,
  Phone,
  Mail,
  BarChart3,
  Target,
  Award
} from 'lucide-react';

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
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Định giá công nghệ
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
              Dịch vụ định giá chuyên nghiệp cho các công nghệ, sáng chế và tài sản trí tuệ
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dịch vụ định giá
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi cung cấp các dịch vụ định giá chuyên nghiệp theo tiêu chuẩn quốc tế
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-6">
                  <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <DollarSign className="h-8 w-8 text-green-600" />
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

      {/* Methods Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Phương pháp định giá
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sử dụng các phương pháp định giá tiên tiến và được công nhận quốc tế
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {methods.map((method, index) => (
              <div key={index} className="text-center">
                <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
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

      {/* Features Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ưu điểm dịch vụ
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Độ chính xác cao
              </h3>
              <p className="text-gray-600">
                Sử dụng các mô hình định giá tiên tiến và dữ liệu thị trường cập nhật
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Tiêu chuẩn quốc tế
              </h3>
              <p className="text-gray-600">
                Tuân thủ các chuẩn mực định giá quốc tế và được công nhận rộng rãi
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
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
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Cần định giá công nghệ?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Liên hệ với chúng tôi để được tư vấn và thực hiện định giá chuyên nghiệp
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:02438251234"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
            >
              <Phone className="h-5 w-5 mr-2" />
              024 3825 1234
            </a>
            <a 
              href="mailto:valuation@hanotex.gov.vn"
              className="border border-gray-600 hover:border-gray-500 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
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

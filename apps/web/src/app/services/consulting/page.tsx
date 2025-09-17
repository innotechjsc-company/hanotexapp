'use client';

import { 
  Users, 
  Target, 
  CheckCircle, 
  ArrowRight,
  FileText,
  Phone,
  Mail
} from 'lucide-react';

export default function ConsultingPage() {
  const services = [
    {
      title: 'Đánh giá tiềm năng thương mại',
      description: 'Phân tích và đánh giá khả năng thương mại hóa của công nghệ, sản phẩm nghiên cứu.',
      features: [
        'Phân tích thị trường mục tiêu',
        'Đánh giá tính cạnh tranh',
        'Dự báo doanh thu tiềm năng',
        'Báo cáo chi tiết và khuyến nghị'
      ]
    },
    {
      title: 'Tư vấn chiến lược chuyển giao',
      description: 'Xây dựng chiến lược chuyển giao công nghệ phù hợp với từng loại hình và mục tiêu.',
      features: [
        'Lựa chọn phương thức chuyển giao',
        'Xây dựng kế hoạch triển khai',
        'Định giá và cấu trúc hợp đồng',
        'Quản lý rủi ro và bảo vệ quyền lợi'
      ]
    },
    {
      title: 'Hỗ trợ đàm phán hợp đồng',
      description: 'Hỗ trợ đàm phán và ký kết các hợp đồng chuyển giao công nghệ.',
      features: [
        'Soạn thảo hợp đồng chuyên nghiệp',
        'Đàm phán điều khoản hợp lý',
        'Rà soát và hoàn thiện hợp đồng',
        'Hỗ trợ thực hiện và giám sát'
      ]
    }
  ];

  const process = [
    {
      step: 1,
      title: 'Tiếp nhận yêu cầu',
      description: 'Thu thập thông tin và tài liệu về công nghệ cần tư vấn'
    },
    {
      step: 2,
      title: 'Phân tích và đánh giá',
      description: 'Nghiên cứu, phân tích và đánh giá toàn diện'
    },
    {
      step: 3,
      title: 'Tư vấn và khuyến nghị',
      description: 'Đưa ra các khuyến nghị và giải pháp cụ thể'
    },
    {
      step: 4,
      title: 'Hỗ trợ triển khai',
      description: 'Hỗ trợ thực hiện các khuyến nghị đã đưa ra'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Tư vấn chuyển giao công nghệ
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Dịch vụ tư vấn chuyên nghiệp giúp bạn chuyển giao công nghệ một cách hiệu quả và an toàn
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dịch vụ tư vấn
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi cung cấp các dịch vụ tư vấn toàn diện cho quá trình chuyển giao công nghệ
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-6">
                  <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8 text-blue-600" />
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

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Quy trình tư vấn
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quy trình tư vấn chuyên nghiệp đảm bảo hiệu quả và chất lượng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Bắt đầu tư vấn ngay hôm nay
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Liên hệ với chúng tôi để được tư vấn miễn phí và xây dựng chiến lược chuyển giao công nghệ hiệu quả
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="tel:02438251234"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
            >
              <Phone className="h-5 w-5 mr-2" />
              024 3825 1234
            </a>
            <a 
              href="mailto:consulting@hanotex.gov.vn"
              className="border border-gray-600 hover:border-gray-500 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
            >
              <Mail className="h-5 w-5 mr-2" />
              consulting@hanotex.gov.vn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

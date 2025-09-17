'use client';

import { 
  Shield, 
  CheckCircle, 
  FileText,
  Phone,
  Mail,
  Clock,
  Users,
  Award
} from 'lucide-react';

export default function LegalPage() {
  const services = [
    {
      title: 'Đăng ký sở hữu trí tuệ',
      description: 'Hỗ trợ đăng ký bản quyền, sáng chế, nhãn hiệu và các tài sản trí tuệ khác.',
      features: [
        'Đăng ký sáng chế và giải pháp hữu ích',
        'Đăng ký nhãn hiệu và tên thương mại',
        'Đăng ký bản quyền tác giả',
        'Đăng ký kiểu dáng công nghiệp'
      ],
      icon: Shield
    },
    {
      title: 'Tư vấn hợp đồng',
      description: 'Soạn thảo và tư vấn các loại hợp đồng chuyển giao công nghệ.',
      features: [
        'Hợp đồng chuyển giao công nghệ',
        'Hợp đồng li-xăng sáng chế',
        'Hợp đồng hợp tác nghiên cứu',
        'Hợp đồng bảo mật thông tin'
      ],
      icon: FileText
    },
    {
      title: 'Bảo vệ quyền sở hữu',
      description: 'Hỗ trợ bảo vệ và thực thi quyền sở hữu trí tuệ.',
      features: [
        'Giám sát vi phạm quyền sở hữu',
        'Xử lý tranh chấp về IP',
        'Tư vấn chiến lược bảo vệ',
        'Hỗ trợ pháp lý tại tòa án'
      ],
      icon: Award
    }
  ];

  const process = [
    {
      step: 1,
      title: 'Tư vấn ban đầu',
      description: 'Phân tích tình huống và đưa ra lời khuyên pháp lý'
    },
    {
      step: 2,
      title: 'Soạn thảo tài liệu',
      description: 'Chuẩn bị các tài liệu pháp lý cần thiết'
    },
    {
      step: 3,
      title: 'Nộp đơn và theo dõi',
      description: 'Nộp đơn và theo dõi tiến trình xử lý'
    },
    {
      step: 4,
      title: 'Hoàn thiện thủ tục',
      description: 'Hoàn tất các thủ tục và bàn giao kết quả'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Hỗ trợ pháp lý
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Dịch vụ pháp lý chuyên nghiệp cho sở hữu trí tuệ và chuyển giao công nghệ
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dịch vụ pháp lý
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi cung cấp các dịch vụ pháp lý toàn diện cho sở hữu trí tuệ và chuyển giao công nghệ
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-6">
                  <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <service.icon className="h-8 w-8 text-blue-600" />
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
              Quy trình hỗ trợ pháp lý
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quy trình chuyên nghiệp đảm bảo hiệu quả và tuân thủ pháp luật
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
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Đội ngũ chuyên gia
              </h3>
              <p className="text-gray-600">
                Đội ngũ luật sư và chuyên gia giàu kinh nghiệm trong lĩnh vực sở hữu trí tuệ
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Thời gian nhanh chóng
              </h3>
              <p className="text-gray-600">
                Xử lý nhanh chóng với thời gian cam kết rõ ràng cho từng loại dịch vụ
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Chất lượng đảm bảo
              </h3>
              <p className="text-gray-600">
                Cam kết chất lượng dịch vụ với tỷ lệ thành công cao trong các thủ tục pháp lý
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Cần hỗ trợ pháp lý?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Liên hệ với chúng tôi để được tư vấn pháp lý chuyên nghiệp và bảo vệ quyền sở hữu trí tuệ
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
              href="mailto:legal@hanotex.gov.vn"
              className="border border-gray-600 hover:border-gray-500 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
            >
              <Mail className="h-5 w-5 mr-2" />
              legal@hanotex.gov.vn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

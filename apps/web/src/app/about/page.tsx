'use client';

import { 
  Building2, 
  Target, 
  Users, 
  Award,
  MapPin,
  Phone,
  Mail,
  Globe
} from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      title: 'Đổi mới sáng tạo',
      description: 'Thúc đẩy và hỗ trợ các ý tưởng sáng tạo, công nghệ tiên tiến'
    },
    {
      title: 'Minh bạch công khai',
      description: 'Hoạt động minh bạch, công khai trong mọi giao dịch và dịch vụ'
    },
    {
      title: 'Chất lượng cao',
      description: 'Cam kết cung cấp dịch vụ chất lượng cao, chuyên nghiệp'
    },
    {
      title: 'Phát triển bền vững',
      description: 'Hướng đến phát triển bền vững cho cộng đồng và môi trường'
    }
  ];

  const milestones = [
    {
      year: '2024',
      title: 'Thành lập HANOTEX',
      description: 'Chính thức ra mắt sàn giao dịch công nghệ Hà Nội'
    },
    {
      year: '2024',
      title: 'Triển khai hệ thống',
      description: 'Hoàn thiện hệ thống công nghệ và đưa vào vận hành'
    },
    {
      year: '2025',
      title: 'Mở rộng dịch vụ',
      description: 'Mở rộng các dịch vụ hỗ trợ và kết nối'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Về HANOTEX
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Sàn giao dịch công nghệ trực tuyến của thành phố Hà Nội
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Sứ mệnh của chúng tôi
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                HANOTEX được thành lập với sứ mệnh kết nối cung - cầu công nghệ, 
                thúc đẩy đổi mới sáng tạo và thương mại hóa kết quả nghiên cứu 
                khoa học công nghệ tại Hà Nội và cả nước.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Chúng tôi cam kết tạo ra một môi trường minh bạch, công khai 
                và hiệu quả để các nhà nghiên cứu, doanh nghiệp và nhà đầu tư 
                có thể gặp gỡ, hợp tác và phát triển.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center">
                <div className="bg-blue-100 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                  <Building2 className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Tầm nhìn
                </h3>
                <p className="text-gray-600">
                  Trở thành sàn giao dịch công nghệ hàng đầu Việt Nam, 
                  góp phần đưa Việt Nam trở thành quốc gia đổi mới sáng tạo 
                  trong khu vực và thế giới.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Giá trị cốt lõi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những giá trị định hướng hoạt động và phát triển của HANOTEX
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Award className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Lịch sử phát triển
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Những dấu mốc quan trọng trong quá trình phát triển của HANOTEX
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-lg min-w-[80px] text-center">
                  {milestone.year}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {milestone.title}
                  </h3>
                  <p className="text-gray-600">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Liên hệ với chúng tôi
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Sẵn sàng hỗ trợ và tư vấn cho các nhu cầu của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Địa chỉ
              </h3>
              <p className="text-gray-600 text-sm">
                Sở KH&CN Hà Nội<br />
                15 Lê Thánh Tông<br />
                Hoàn Kiếm, Hà Nội
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Điện thoại
              </h3>
              <p className="text-gray-600">
                024 3825 1234
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Email
              </h3>
              <p className="text-gray-600">
                info@hanotex.gov.vn
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Website
              </h3>
              <p className="text-gray-600">
                www.hanotex.gov.vn
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

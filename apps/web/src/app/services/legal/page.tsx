"use client";

import {
  Shield,
  CheckCircle,
  FileText,
  Phone,
  Mail,
  Clock,
  Users,
  Award,
  Star,
  UserPlus,
  Rocket,
  Lightbulb,
  TrendingUp,
  Target,
  Brain,
} from "lucide-react";
import Link from "next/link";

export default function LegalPage() {
  const services = [
    {
      title: "Đăng ký sở hữu trí tuệ",
      description:
        "Hỗ trợ đăng ký bản quyền, sáng chế, nhãn hiệu và các tài sản trí tuệ khác.",
      features: [
        "Đăng ký sáng chế và giải pháp hữu ích",
        "Đăng ký nhãn hiệu và tên thương mại",
        "Đăng ký bản quyền tác giả",
        "Đăng ký kiểu dáng công nghiệp",
      ],
      icon: Shield,
    },
    {
      title: "Tư vấn hợp đồng",
      description:
        "Soạn thảo và tư vấn các loại hợp đồng chuyển giao công nghệ.",
      features: [
        "Hợp đồng chuyển giao công nghệ",
        "Hợp đồng li-xăng sáng chế",
        "Hợp đồng hợp tác nghiên cứu",
        "Hợp đồng bảo mật thông tin",
      ],
      icon: FileText,
    },
    {
      title: "Bảo vệ quyền sở hữu",
      description: "Hỗ trợ bảo vệ và thực thi quyền sở hữu trí tuệ.",
      features: [
        "Giám sát vi phạm quyền sở hữu",
        "Xử lý tranh chấp về IP",
        "Tư vấn chiến lược bảo vệ",
        "Hỗ trợ pháp lý tại tòa án",
      ],
      icon: Award,
    },
  ];

  const process = [
    {
      step: 1,
      title: "Tư vấn ban đầu",
      description: "Phân tích tình huống và đưa ra lời khuyên pháp lý",
    },
    {
      step: 2,
      title: "Soạn thảo tài liệu",
      description: "Chuẩn bị các tài liệu pháp lý cần thiết",
    },
    {
      step: 3,
      title: "Nộp đơn và theo dõi",
      description: "Nộp đơn và theo dõi tiến trình xử lý",
    },
    {
      step: 4,
      title: "Hoàn thiện thủ tục",
      description: "Hoàn tất các thủ tục và bàn giao kết quả",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Shield className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">
                Hỗ trợ pháp lý chuyên nghiệp
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Hỗ trợ pháp lý
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Dịch vụ pháp lý chuyên nghiệp cho sở hữu trí tuệ và chuyển giao
              công nghệ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Liên hệ tư vấn
              </Link>
              <Link
                href="#services"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center"
              >
                <Shield className="h-5 w-5 mr-2" />
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
            <div className="inline-flex items-center bg-blue-50 text-blue-600 rounded-full px-4 py-2 mb-4">
              <Shield className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Dịch vụ pháp lý</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dịch vụ pháp lý
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chúng tôi cung cấp các dịch vụ pháp lý toàn diện cho sở hữu trí
              tuệ và chuyển giao công nghệ
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                {/* Header with gradient */}
                <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute top-4 right-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                      <service.icon className="h-6 w-6 text-blue-600" />
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
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors group-hover:translate-x-1"
                  >
                    Tìm hiểu thêm
                    <Shield className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-green-50 text-green-600 rounded-full px-4 py-2 mb-4">
              <Clock className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">
                Quy trình chuyên nghiệp
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Quy trình hỗ trợ pháp lý
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quy trình chuyên nghiệp đảm bảo hiệu quả và tuân thủ pháp luật
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <div key={index} className="group text-center">
                <div className="relative mb-6">
                  <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    {item.step}
                  </div>
                  {index < process.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200 transform translate-x-8">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400"></div>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
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
              <div className="text-3xl font-bold text-gray-900 mb-2">300+</div>
              <div className="text-gray-600">Dự án pháp lý</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">99%</div>
              <div className="text-gray-600">Tỷ lệ thành công</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">25+</div>
              <div className="text-gray-600">Luật sư chuyên gia</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">4.9/5</div>
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
              <span className="text-sm font-medium">
                Tại sao chọn chúng tôi
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn chúng tôi?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Đội ngũ luật sư chuyên nghiệp và phương pháp hỗ trợ pháp lý hiệu
              quả
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Đội ngũ chuyên gia
              </h3>
              <p className="text-gray-600">
                Đội ngũ luật sư và chuyên gia giàu kinh nghiệm trong lĩnh vực sở
                hữu trí tuệ
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Thời gian nhanh chóng
              </h3>
              <p className="text-gray-600">
                Xử lý nhanh chóng với thời gian cam kết rõ ràng cho từng loại
                dịch vụ
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Chất lượng đảm bảo
              </h3>
              <p className="text-gray-600">
                Cam kết chất lượng dịch vụ với tỷ lệ thành công cao trong các
                thủ tục pháp lý
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
            <Lightbulb className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Bắt đầu ngay hôm nay</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Cần hỗ trợ pháp lý?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Liên hệ với chúng tôi để được tư vấn pháp lý chuyên nghiệp và bảo vệ
            quyền sở hữu trí tuệ
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:0986287758"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 inline-flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <Phone className="h-5 w-5 mr-2" />
              0986287758
            </a>
            <a
              href="mailto:contact@hanotex.vn"
              className="border border-gray-600 hover:border-gray-500 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 inline-flex items-center justify-center hover:bg-white/10"
            >
              <Mail className="h-5 w-5 mr-2" />
              contact@hanotex.vn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

'use client';

import { BookOpen, Users, Zap, Target, FileText, Calendar, Shield, CheckCircle } from 'lucide-react';

export default function UserGuidePage() {
  const steps = [
    {
      step: 1,
      title: 'Đăng ký tài khoản',
      description: 'Tạo tài khoản miễn phí trên HANOTEX',
      icon: Users,
      details: [
        'Truy cập trang đăng ký',
        'Điền thông tin cá nhân',
        'Chọn loại tài khoản phù hợp',
        'Xác thực email',
        'Hoàn tất đăng ký'
      ]
    },
    {
      step: 2,
      title: 'Cập nhật hồ sơ',
      description: 'Hoàn thiện thông tin cá nhân và tổ chức',
      icon: FileText,
      details: [
        'Cập nhật thông tin liên hệ',
        'Thêm thông tin công ty/tổ chức',
        'Tải lên logo và hình ảnh',
        'Mô tả lĩnh vực hoạt động',
        'Xác thực danh tính'
      ]
    },
    {
      step: 3,
      title: 'Đăng tải công nghệ',
      description: 'Giới thiệu công nghệ của bạn với cộng đồng',
      icon: Zap,
      details: [
        'Vào mục "Đăng công nghệ"',
        'Điền thông tin chi tiết',
        'Tải lên tài liệu kỹ thuật',
        'Thêm hình ảnh minh họa',
        'Chờ xét duyệt và công bố'
      ]
    },
    {
      step: 4,
      title: 'Tìm kiếm và kết nối',
      description: 'Khám phá cơ hội hợp tác và đầu tư',
      icon: Target,
      details: [
        'Sử dụng công cụ tìm kiếm',
        'Lọc theo lĩnh vực và tiêu chí',
        'Liên hệ trực tiếp với chủ sở hữu',
        'Tham gia các sự kiện networking',
        'Sử dụng dịch vụ tư vấn'
      ]
    }
  ];

  const features = [
    {
      title: 'Tìm kiếm thông minh',
      description: 'Sử dụng các bộ lọc nâng cao để tìm công nghệ phù hợp',
      tips: [
        'Sử dụng từ khóa chính xác',
        'Kết hợp nhiều tiêu chí lọc',
        'Lưu tìm kiếm để theo dõi',
        'Đặt thông báo cho kết quả mới'
      ]
    },
    {
      title: 'Quản lý hồ sơ hiệu quả',
      description: 'Tối ưu hóa hồ sơ để thu hút đối tác',
      tips: [
        'Cập nhật thông tin thường xuyên',
        'Sử dụng hình ảnh chất lượng cao',
        'Viết mô tả chi tiết và hấp dẫn',
        'Thêm video giới thiệu nếu có thể'
      ]
    },
    {
      title: 'Giao tiếp chuyên nghiệp',
      description: 'Xây dựng mối quan hệ tốt với đối tác',
      tips: [
        'Phản hồi tin nhắn nhanh chóng',
        'Cung cấp thông tin đầy đủ',
        'Sử dụng ngôn ngữ chuyên nghiệp',
        'Thể hiện sự tin cậy và minh bạch'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Hướng dẫn sử dụng
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Hướng dẫn chi tiết để sử dụng hiệu quả các tính năng của HANOTEX
            </p>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              Bắt đầu với HANOTEX
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Làm theo các bước sau để tận dụng tối đa các tính năng của sàn giao dịch công nghệ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-center mb-6">
                  <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <step.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-3">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {step.description}
                  </p>
                </div>

                <ul className="space-y-2">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Guide Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tính năng và mẹo sử dụng
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Khám phá các tính năng nâng cao và mẹo để sử dụng HANOTEX hiệu quả nhất
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {feature.description}
                </p>
                
                <h4 className="font-semibold text-gray-900 mb-3">
                  Mẹo sử dụng:
                </h4>
                <ul className="space-y-2">
                  {feature.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Liên kết nhanh
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Truy cập nhanh các trang quan trọng và dịch vụ hỗ trợ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a href="/technologies/register" className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow text-center">
              <Zap className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Đăng công nghệ</h3>
              <p className="text-sm text-gray-600">Giới thiệu công nghệ của bạn</p>
            </a>

            <a href="/demands/register" className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow text-center">
              <Target className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Đăng nhu cầu</h3>
              <p className="text-sm text-gray-600">Tìm kiếm công nghệ phù hợp</p>
            </a>

            <a href="/services" className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow text-center">
              <Shield className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Dịch vụ hỗ trợ</h3>
              <p className="text-sm text-gray-600">Tư vấn chuyên nghiệp</p>
            </a>

            <a href="/contact" className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow text-center">
              <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Liên hệ</h3>
              <p className="text-sm text-gray-600">Hỗ trợ trực tiếp</p>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

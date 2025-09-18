'use client';

export default function TrainingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Đào tạo & Hỗ trợ
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nâng cao năng lực và kỹ năng thông qua các chương trình đào tạo chuyên nghiệp về công nghệ và sở hữu trí tuệ
          </p>
        </div>

        {/* Training Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Technology Training */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Đào tạo Công nghệ</h3>
            <p className="text-gray-600 mb-4">
              Các khóa học về công nghệ mới, xu hướng phát triển và ứng dụng thực tế
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• AI & Machine Learning</li>
              <li>• Blockchain & Cryptocurrency</li>
              <li>• IoT & Smart Systems</li>
              <li>• Cloud Computing</li>
              <li>• Cybersecurity</li>
            </ul>
          </div>

          {/* IP Training */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Đào tạo Sở hữu trí tuệ</h3>
            <p className="text-gray-600 mb-4">
              Chương trình đào tạo chuyên sâu về quản lý và bảo vệ tài sản trí tuệ
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Quản lý tài sản trí tuệ</li>
              <li>• Đăng ký bằng sáng chế</li>
              <li>• Bảo vệ nhãn hiệu</li>
              <li>• Chiến lược SHTT</li>
              <li>• Thương mại hóa SHTT</li>
            </ul>
          </div>

          {/* Business Training */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Đào tạo Kinh doanh</h3>
            <p className="text-gray-600 mb-4">
              Phát triển kỹ năng kinh doanh và khởi nghiệp công nghệ
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Khởi nghiệp công nghệ</li>
              <li>• Quản lý dự án</li>
              <li>• Marketing số</li>
              <li>• Tài chính doanh nghiệp</li>
              <li>• Quản lý nhân sự</li>
            </ul>
          </div>

          {/* Research Training */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Đào tạo Nghiên cứu</h3>
            <p className="text-gray-600 mb-4">
              Nâng cao kỹ năng nghiên cứu và phát triển sản phẩm
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Phương pháp nghiên cứu</li>
              <li>• Thiết kế thí nghiệm</li>
              <li>• Phân tích dữ liệu</li>
              <li>• Viết báo cáo khoa học</li>
              <li>• Trình bày kết quả</li>
            </ul>
          </div>

          {/* Legal Training */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Đào tạo Pháp lý</h3>
            <p className="text-gray-600 mb-4">
              Hiểu biết về pháp luật liên quan đến công nghệ và sở hữu trí tuệ
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Luật sở hữu trí tuệ</li>
              <li>• Luật công nghệ thông tin</li>
              <li>• Hợp đồng chuyển giao</li>
              <li>• Bảo vệ dữ liệu</li>
              <li>• Tuân thủ quy định</li>
            </ul>
          </div>

          {/* Support Services */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Dịch vụ Hỗ trợ</h3>
            <p className="text-gray-600 mb-4">
              Hỗ trợ toàn diện cho việc học tập và phát triển kỹ năng
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Tư vấn học tập</li>
              <li>• Hỗ trợ kỹ thuật</li>
              <li>• Tài liệu học tập</li>
              <li>• Cộng đồng học viên</li>
              <li>• Chứng chỉ hoàn thành</li>
            </ul>
          </div>
        </div>

        {/* Training Formats */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Hình thức đào tạo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Đào tạo trực tuyến</h3>
              <p className="text-gray-600">
                Học tập linh hoạt qua nền tảng online với video bài giảng chất lượng cao
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Đào tạo trực tiếp</h3>
              <p className="text-gray-600">
                Tham gia các khóa học tại trung tâm với sự hướng dẫn trực tiếp từ chuyên gia
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Đào tạo doanh nghiệp</h3>
              <p className="text-gray-600">
                Chương trình đào tạo tùy chỉnh cho doanh nghiệp và tổ chức
              </p>
            </div>
          </div>
        </div>

        {/* Upcoming Courses */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Khóa học sắp diễn ra
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Công nghệ
                </span>
                <span className="text-gray-500 text-sm">15-20/10/2025</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI & Machine Learning cơ bản
              </h3>
              <p className="text-gray-600 mb-4">
                Khóa học giới thiệu về trí tuệ nhân tạo và học máy cho người mới bắt đầu
              </p>
              <div className="flex items-center justify-between">
                <span className="text-green-600 font-semibold">Miễn phí</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Đăng ký
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Sở hữu trí tuệ
                </span>
                <span className="text-gray-500 text-sm">22-25/10/2025</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Quản lý tài sản trí tuệ
              </h3>
              <p className="text-gray-600 mb-4">
                Học cách quản lý và bảo vệ tài sản trí tuệ trong doanh nghiệp
              </p>
              <div className="flex items-center justify-between">
                <span className="text-green-600 font-semibold">2.500.000 VNĐ</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Sẵn sàng nâng cao kỹ năng?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Tham gia các khóa đào tạo chuyên nghiệp và phát triển sự nghiệp của bạn
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Đăng ký ngay
            </a>
            <a
              href="tel:+84123456789"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Tư vấn miễn phí
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

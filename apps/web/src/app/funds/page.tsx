import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quỹ & Đầu tư - HANOTEX',
  description: 'Kết nối các dự án công nghệ với nguồn vốn đầu tư, quỹ đầu tư và nhà đầu tư tiềm năng.',
};

export default function FundsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Quỹ & Đầu tư
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Kết nối các dự án công nghệ với nguồn vốn đầu tư, quỹ đầu tư và nhà đầu tư tiềm năng
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">150+</div>
            <div className="text-gray-600">Dự án đang hoạt động</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
            <div className="text-gray-600">Dự án đang gọi vốn</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">25+</div>
            <div className="text-gray-600">Quỹ đầu tư</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">500M+</div>
            <div className="text-gray-600">Tổng giá trị đầu tư (VNĐ)</div>
          </div>
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Active Projects */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Dự án đang hoạt động</h3>
            <p className="text-gray-600 mb-4">
              Khám phá các dự án công nghệ đang được triển khai và phát triển
            </p>
            <ul className="text-sm text-gray-500 space-y-1 mb-6">
              <li>• Dự án AI & Machine Learning</li>
              <li>• Ứng dụng IoT & Smart City</li>
              <li>• Giải pháp Blockchain</li>
              <li>• Công nghệ xanh & bền vững</li>
            </ul>
            <a
              href="/funds/active-projects"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              Xem tất cả
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Fundraising Projects */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Dự án đang gọi vốn</h3>
            <p className="text-gray-600 mb-4">
              Các dự án đang tìm kiếm nguồn vốn đầu tư để phát triển và mở rộng
            </p>
            <ul className="text-sm text-gray-500 space-y-1 mb-6">
              <li>• Startup công nghệ</li>
              <li>• Dự án R&D</li>
              <li>• Thương mại hóa công nghệ</li>
              <li>• Mở rộng thị trường</li>
            </ul>
            <a
              href="/funds/fundraising"
              className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold"
            >
              Xem tất cả
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Investment Funds */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Danh sách Quỹ đầu tư</h3>
            <p className="text-gray-600 mb-4">
              Khám phá các quỹ đầu tư chuyên về công nghệ và đổi mới sáng tạo
            </p>
            <ul className="text-sm text-gray-500 space-y-1 mb-6">
              <li>• Quỹ đầu tư mạo hiểm</li>
              <li>• Quỹ đầu tư tư nhân</li>
              <li>• Quỹ nhà nước</li>
              <li>• Quỹ quốc tế</li>
            </ul>
            <a
              href="/funds/investment-funds"
              className="inline-flex items-center text-purple-600 hover:text-purple-700 font-semibold"
            >
              Xem tất cả
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Featured Projects */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Dự án nổi bật
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  AI/ML
                </span>
                <span className="text-gray-500 text-sm">Đang hoạt động</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Hệ thống AI chẩn đoán y tế
              </h3>
              <p className="text-gray-600 mb-4">
                Ứng dụng AI để hỗ trợ chẩn đoán bệnh từ hình ảnh y tế
              </p>
              <div className="flex items-center justify-between">
                <span className="text-green-600 font-semibold">TRL 7-8</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Xem chi tiết
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  Gọi vốn
                </span>
                <span className="text-gray-500 text-sm">Cần 2B VNĐ</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nền tảng IoT nông nghiệp thông minh
              </h3>
              <p className="text-gray-600 mb-4">
                Giải pháp IoT để tối ưu hóa sản xuất nông nghiệp
              </p>
              <div className="flex items-center justify-between">
                <span className="text-orange-600 font-semibold">TRL 5-6</span>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Đầu tư
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  Blockchain
                </span>
                <span className="text-gray-500 text-sm">Đang hoạt động</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Hệ thống chuỗi cung ứng minh bạch
              </h3>
              <p className="text-gray-600 mb-4">
                Sử dụng blockchain để theo dõi chuỗi cung ứng
              </p>
              <div className="flex items-center justify-between">
                <span className="text-green-600 font-semibold">TRL 6-7</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Investment Process */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Quy trình đầu tư
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Khám phá dự án</h3>
              <p className="text-gray-600 text-sm">
                Tìm hiểu và đánh giá các dự án công nghệ tiềm năng
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Đánh giá kỹ thuật</h3>
              <p className="text-gray-600 text-sm">
                Phân tích kỹ thuật và tiềm năng thương mại hóa
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Thương lượng</h3>
              <p className="text-gray-600 text-sm">
                Đàm phán điều khoản đầu tư và hợp đồng
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Thực hiện đầu tư</h3>
              <p className="text-gray-600 text-sm">
                Ký kết hợp đồng và thực hiện đầu tư
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Sẵn sàng đầu tư hoặc tìm vốn?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Kết nối với cộng đồng đầu tư công nghệ và khám phá cơ hội mới
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Liên hệ ngay
            </a>
            <a
              href="/auth/register"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Đăng ký tham gia
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

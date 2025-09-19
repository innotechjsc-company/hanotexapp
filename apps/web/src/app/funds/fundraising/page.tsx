import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dự án đang gọi vốn - HANOTEX',
  description: 'Khám phá các dự án công nghệ đang tìm kiếm nguồn vốn đầu tư để phát triển và mở rộng.',
};

export default function FundraisingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Dự án đang gọi vốn
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá các dự án công nghệ đang tìm kiếm nguồn vốn đầu tư để phát triển và mở rộng
          </p>
        </div>

        {/* Investment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
            <div className="text-gray-600">Dự án đang gọi vốn</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">200B+</div>
            <div className="text-gray-600">Tổng vốn cần huy động (VNĐ)</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">30+</div>
            <div className="text-gray-600">Nhà đầu tư quan tâm</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">15</div>
            <div className="text-gray-600">Dự án đã gọi vốn thành công</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Tất cả lĩnh vực</option>
              <option>AI & Machine Learning</option>
              <option>IoT & Smart Systems</option>
              <option>Blockchain</option>
              <option>FinTech</option>
              <option>EdTech</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Tất cả mức vốn</option>
              <option>Dưới 1 tỷ VNĐ</option>
              <option>1-5 tỷ VNĐ</option>
              <option>5-10 tỷ VNĐ</option>
              <option>Trên 10 tỷ VNĐ</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Tất cả giai đoạn</option>
              <option>Seed</option>
              <option>Series A</option>
              <option>Series B</option>
              <option>Series C+</option>
            </select>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Lọc
            </button>
          </div>
        </div>

        {/* Fundraising Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Project 1 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  IoT
                </span>
                <span className="text-orange-600 font-semibold">Series A</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nền tảng IoT nông nghiệp thông minh
              </h3>
              <p className="text-gray-600 mb-4">
                Giải pháp IoT để tối ưu hóa sản xuất nông nghiệp với cảm biến và AI
              </p>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Mục tiêu: 5 tỷ VNĐ</span>
                  <span>Đã huy động: 2.5 tỷ VNĐ</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '50%'}}></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">AgriTech Startup</span>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Đầu tư
                </button>
              </div>
            </div>
          </div>

          {/* Project 2 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  AI/ML
                </span>
                <span className="text-orange-600 font-semibold">Seed</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI Chatbot cho doanh nghiệp
              </h3>
              <p className="text-gray-600 mb-4">
                Giải pháp chatbot thông minh sử dụng AI để hỗ trợ khách hàng 24/7
              </p>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Mục tiêu: 2 tỷ VNĐ</span>
                  <span>Đã huy động: 800M VNĐ</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '40%'}}></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">ChatBot Solutions</span>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Đầu tư
                </button>
              </div>
            </div>
          </div>

          {/* Project 3 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  Blockchain
                </span>
                <span className="text-orange-600 font-semibold">Series B</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nền tảng DeFi cho thị trường Việt Nam
              </h3>
              <p className="text-gray-600 mb-4">
                Ứng dụng tài chính phi tập trung phù hợp với thị trường Việt Nam
              </p>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Mục tiêu: 10 tỷ VNĐ</span>
                  <span>Đã huy động: 7 tỷ VNĐ</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{width: '70%'}}></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">DeFi Vietnam</span>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Đầu tư
                </button>
              </div>
            </div>
          </div>

          {/* Project 4 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  EdTech
                </span>
                <span className="text-orange-600 font-semibold">Series A</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nền tảng học lập trình online
              </h3>
              <p className="text-gray-600 mb-4">
                Học lập trình tương tác với AI mentor và cộng đồng lập trình viên
              </p>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Mục tiêu: 3 tỷ VNĐ</span>
                  <span>Đã huy động: 1.2 tỷ VNĐ</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full" style={{width: '40%'}}></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">CodeLearn</span>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Đầu tư
                </button>
              </div>
            </div>
          </div>

          {/* Project 5 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-r from-teal-500 to-blue-600 flex items-center justify-center">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                  FinTech
                </span>
                <span className="text-orange-600 font-semibold">Seed</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Ứng dụng quản lý tài chính cá nhân
              </h3>
              <p className="text-gray-600 mb-4">
                App quản lý chi tiêu và đầu tư với AI tư vấn tài chính cá nhân
              </p>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Mục tiêu: 1.5 tỷ VNĐ</span>
                  <span>Đã huy động: 600M VNĐ</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-teal-600 h-2 rounded-full" style={{width: '40%'}}></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">FinanceApp</span>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Đầu tư
                </button>
              </div>
            </div>
          </div>

          {/* Project 6 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                  Năng lượng
                </span>
                <span className="text-orange-600 font-semibold">Series A</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Hệ thống lưu trữ năng lượng thông minh
              </h3>
              <p className="text-gray-600 mb-4">
                Giải pháp lưu trữ năng lượng tái tạo với AI tối ưu hóa hiệu suất
              </p>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Mục tiêu: 8 tỷ VNĐ</span>
                  <span>Đã huy động: 4.8 tỷ VNĐ</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">EnergyStorage</span>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Đầu tư
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-8 text-center text-white mt-12">
          <h2 className="text-3xl font-bold mb-4">
            Có dự án cần gọi vốn?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Đăng ký dự án của bạn để kết nối với các nhà đầu tư tiềm năng
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Đăng ký dự án
            </a>
            <a
              href="/auth/register"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Tạo tài khoản
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

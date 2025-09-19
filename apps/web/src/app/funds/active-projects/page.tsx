import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dự án đang hoạt động - HANOTEX',
  description: 'Khám phá các dự án công nghệ đang được triển khai và phát triển trên nền tảng HANOTEX.',
};

export default function ActiveProjectsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Dự án đang hoạt động
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá các dự án công nghệ đang được triển khai và phát triển
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Tất cả lĩnh vực</option>
              <option>AI & Machine Learning</option>
              <option>IoT & Smart Systems</option>
              <option>Blockchain</option>
              <option>Công nghệ xanh</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Tất cả TRL</option>
              <option>TRL 1-3 (Nghiên cứu cơ bản)</option>
              <option>TRL 4-6 (Phát triển)</option>
              <option>TRL 7-9 (Thương mại hóa)</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Tất cả địa điểm</option>
              <option>Hà Nội</option>
              <option>TP. Hồ Chí Minh</option>
              <option>Đà Nẵng</option>
              <option>Khác</option>
            </select>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Lọc
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Project 1 */}
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
                <span className="text-green-600 font-semibold">TRL 7-8</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Hệ thống AI chẩn đoán y tế
              </h3>
              <p className="text-gray-600 mb-4">
                Ứng dụng trí tuệ nhân tạo để hỗ trợ chẩn đoán bệnh từ hình ảnh y tế với độ chính xác cao
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Viện Công nghệ Y tế</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>

          {/* Project 2 */}
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
                <span className="text-green-600 font-semibold">TRL 6-7</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Hệ thống giám sát môi trường thông minh
              </h3>
              <p className="text-gray-600 mb-4">
                Mạng lưới cảm biến IoT để giám sát chất lượng không khí và môi trường đô thị
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Công ty GreenTech</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Xem chi tiết
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
                <span className="text-green-600 font-semibold">TRL 6-7</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nền tảng chuỗi cung ứng minh bạch
              </h3>
              <p className="text-gray-600 mb-4">
                Sử dụng blockchain để theo dõi và đảm bảo tính minh bạch trong chuỗi cung ứng
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Startup ChainTech</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>

          {/* Project 4 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  Năng lượng
                </span>
                <span className="text-green-600 font-semibold">TRL 7-8</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Hệ thống năng lượng mặt trời thông minh
              </h3>
              <p className="text-gray-600 mb-4">
                Tối ưu hóa việc sử dụng năng lượng mặt trời với AI và IoT
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Công ty SolarTech</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Xem chi tiết
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
                <span className="text-green-600 font-semibold">TRL 8-9</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nền tảng thanh toán số
              </h3>
              <p className="text-gray-600 mb-4">
                Giải pháp thanh toán di động tích hợp AI và blockchain
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Công ty PayTech</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>

          {/* Project 6 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                  EdTech
                </span>
                <span className="text-green-600 font-semibold">TRL 6-7</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nền tảng học tập thích ứng
              </h3>
              <p className="text-gray-600 mb-4">
                Hệ thống học tập cá nhân hóa sử dụng AI để tối ưu trải nghiệm học
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Công ty EduTech</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-2 text-gray-500 hover:text-gray-700">Trước</button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg">1</button>
            <button className="px-3 py-2 text-gray-500 hover:text-gray-700">2</button>
            <button className="px-3 py-2 text-gray-500 hover:text-gray-700">3</button>
            <button className="px-3 py-2 text-gray-500 hover:text-gray-700">Sau</button>
          </nav>
        </div>
      </div>
    </div>
  );
}

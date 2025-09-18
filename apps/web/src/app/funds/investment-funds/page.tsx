import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Danh sách Quỹ đầu tư - HANOTEX',
  description: 'Khám phá các quỹ đầu tư chuyên về công nghệ và đổi mới sáng tạo trên nền tảng HANOTEX.',
};

export default function InvestmentFundsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Danh sách Quỹ đầu tư
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá các quỹ đầu tư chuyên về công nghệ và đổi mới sáng tạo
          </p>
        </div>

        {/* Fund Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">25+</div>
            <div className="text-gray-600">Quỹ đầu tư</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">500B+</div>
            <div className="text-gray-600">Tổng quy mô quỹ (VNĐ)</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">200+</div>
            <div className="text-gray-600">Dự án đã đầu tư</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">15+</div>
            <div className="text-gray-600">Quỹ đang tìm kiếm dự án</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Tất cả loại quỹ</option>
              <option>Quỹ đầu tư mạo hiểm</option>
              <option>Quỹ đầu tư tư nhân</option>
              <option>Quỹ nhà nước</option>
              <option>Quỹ quốc tế</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Tất cả quy mô</option>
              <option>Dưới 50 tỷ VNĐ</option>
              <option>50-200 tỷ VNĐ</option>
              <option>200-500 tỷ VNĐ</option>
              <option>Trên 500 tỷ VNĐ</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Tất cả lĩnh vực</option>
              <option>AI & Machine Learning</option>
              <option>IoT & Smart Systems</option>
              <option>Blockchain</option>
              <option>FinTech</option>
              <option>EdTech</option>
            </select>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Lọc
            </button>
          </div>
        </div>

        {/* Investment Funds */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Fund 1 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  VC Fund
                </span>
                <span className="text-green-600 font-semibold">Đang hoạt động</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                TechVenture Capital
              </h3>
              <p className="text-gray-600 mb-4">
                Quỹ đầu tư mạo hiểm chuyên về công nghệ và đổi mới sáng tạo
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Quy mô quỹ:</span>
                  <span className="font-semibold">200 tỷ VNĐ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Dự án đã đầu tư:</span>
                  <span className="font-semibold">25 dự án</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Giai đoạn đầu tư:</span>
                  <span className="font-semibold">Seed - Series A</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Hà Nội, Việt Nam</span>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Liên hệ
                </button>
              </div>
            </div>
          </div>

          {/* Fund 2 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Government Fund
                </span>
                <span className="text-green-600 font-semibold">Đang hoạt động</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Quỹ Đổi mới sáng tạo Quốc gia
              </h3>
              <p className="text-gray-600 mb-4">
                Quỹ nhà nước hỗ trợ các dự án đổi mới sáng tạo và công nghệ cao
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Quy mô quỹ:</span>
                  <span className="font-semibold">1,000 tỷ VNĐ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Dự án đã đầu tư:</span>
                  <span className="font-semibold">150 dự án</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Giai đoạn đầu tư:</span>
                  <span className="font-semibold">R&D - Thương mại hóa</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Hà Nội, Việt Nam</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Liên hệ
                </button>
              </div>
            </div>
          </div>

          {/* Fund 3 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-r from-green-500 to-teal-600 flex items-center justify-center">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  International Fund
                </span>
                <span className="text-green-600 font-semibold">Đang hoạt động</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Southeast Asia Tech Fund
              </h3>
              <p className="text-gray-600 mb-4">
                Quỹ đầu tư quốc tế chuyên về công nghệ tại khu vực Đông Nam Á
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Quy mô quỹ:</span>
                  <span className="font-semibold">500M USD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Dự án đã đầu tư:</span>
                  <span className="font-semibold">80 dự án</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Giai đoạn đầu tư:</span>
                  <span className="font-semibold">Series A - C</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Singapore</span>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Liên hệ
                </button>
              </div>
            </div>
          </div>

          {/* Fund 4 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                  Corporate VC
                </span>
                <span className="text-green-600 font-semibold">Đang hoạt động</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Corporate Innovation Fund
              </h3>
              <p className="text-gray-600 mb-4">
                Quỹ đầu tư của tập đoàn chuyên về đổi mới sáng tạo và công nghệ
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Quy mô quỹ:</span>
                  <span className="font-semibold">300 tỷ VNĐ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Dự án đã đầu tư:</span>
                  <span className="font-semibold">45 dự án</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Giai đoạn đầu tư:</span>
                  <span className="font-semibold">Seed - Series B</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">TP. Hồ Chí Minh</span>
                <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                  Liên hệ
                </button>
              </div>
            </div>
          </div>

          {/* Fund 5 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-r from-teal-500 to-blue-600 flex items-center justify-center">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                  Angel Fund
                </span>
                <span className="text-green-600 font-semibold">Đang hoạt động</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Angel Investors Network
              </h3>
              <p className="text-gray-600 mb-4">
                Mạng lưới nhà đầu tư thiên thần chuyên về startup công nghệ
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Quy mô quỹ:</span>
                  <span className="font-semibold">50 tỷ VNĐ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Dự án đã đầu tư:</span>
                  <span className="font-semibold">30 dự án</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Giai đoạn đầu tư:</span>
                  <span className="font-semibold">Pre-seed - Seed</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Đà Nẵng, Việt Nam</span>
                <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">
                  Liên hệ
                </button>
              </div>
            </div>
          </div>

          {/* Fund 6 */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                  Impact Fund
                </span>
                <span className="text-green-600 font-semibold">Đang hoạt động</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Social Impact Tech Fund
              </h3>
              <p className="text-gray-600 mb-4">
                Quỹ đầu tư tác động xã hội chuyên về công nghệ phục vụ cộng đồng
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Quy mô quỹ:</span>
                  <span className="font-semibold">100 tỷ VNĐ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Dự án đã đầu tư:</span>
                  <span className="font-semibold">20 dự án</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Giai đoạn đầu tư:</span>
                  <span className="font-semibold">Seed - Series A</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Hà Nội, Việt Nam</span>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Liên hệ
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-center text-white mt-12">
          <h2 className="text-3xl font-bold mb-4">
            Là quỹ đầu tư?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Tham gia nền tảng để kết nối với các dự án công nghệ tiềm năng
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Đăng ký quỹ
            </a>
            <a
              href="/auth/register"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
            >
              Tạo tài khoản
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

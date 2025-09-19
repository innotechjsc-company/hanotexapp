'use client';

export default function IntellectualPropertyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Dịch vụ Sở hữu trí tuệ
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hỗ trợ toàn diện về sở hữu trí tuệ, từ tư vấn, đăng ký đến bảo vệ quyền sở hữu trí tuệ của bạn
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Patent Services */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Bằng sáng chế</h3>
            <p className="text-gray-600 mb-4">
              Tư vấn và hỗ trợ đăng ký bằng sáng chế, bảo hộ các phát minh và giải pháp kỹ thuật
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Tư vấn khả năng đăng ký</li>
              <li>• Soạn thảo hồ sơ đăng ký</li>
              <li>• Theo dõi quy trình xét duyệt</li>
              <li>• Bảo vệ quyền sở hữu</li>
            </ul>
          </div>

          {/* Trademark Services */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Nhãn hiệu</h3>
            <p className="text-gray-600 mb-4">
              Đăng ký và bảo hộ nhãn hiệu, thương hiệu cho sản phẩm và dịch vụ của bạn
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Tra cứu nhãn hiệu</li>
              <li>• Đăng ký nhãn hiệu</li>
              <li>• Gia hạn nhãn hiệu</li>
              <li>• Chuyển nhượng quyền</li>
            </ul>
          </div>

          {/* Copyright Services */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Bản quyền</h3>
            <p className="text-gray-600 mb-4">
              Bảo hộ quyền tác giả cho các tác phẩm văn học, nghệ thuật, phần mềm
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Đăng ký bản quyền</li>
              <li>• Bảo vệ tác phẩm</li>
              <li>• Chuyển nhượng quyền</li>
              <li>• Xử lý vi phạm</li>
            </ul>
          </div>

          {/* Trade Secret Services */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Bí mật kinh doanh</h3>
            <p className="text-gray-600 mb-4">
              Bảo vệ thông tin bí mật, công thức, quy trình kinh doanh có giá trị
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Xây dựng chính sách bảo mật</li>
              <li>• Thỏa thuận bảo mật</li>
              <li>• Bảo vệ thông tin</li>
              <li>• Xử lý vi phạm</li>
            </ul>
          </div>

          {/* Industrial Design Services */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Kiểu dáng công nghiệp</h3>
            <p className="text-gray-600 mb-4">
              Bảo hộ thiết kế, kiểu dáng sản phẩm có tính thẩm mỹ và độc đáo
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Đăng ký kiểu dáng</li>
              <li>• Bảo vệ thiết kế</li>
              <li>• Gia hạn bảo hộ</li>
              <li>• Chuyển nhượng quyền</li>
            </ul>
          </div>

          {/* IP Strategy Services */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Chiến lược SHTT</h3>
            <p className="text-gray-600 mb-4">
              Xây dựng chiến lược sở hữu trí tuệ toàn diện cho doanh nghiệp
            </p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Đánh giá tài sản trí tuệ</li>
              <li>• Lập kế hoạch bảo hộ</li>
              <li>• Quản lý danh mục SHTT</li>
              <li>• Tối ưu hóa giá trị</li>
            </ul>
          </div>
        </div>

        {/* Process Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Quy trình tư vấn Sở hữu trí tuệ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tư vấn ban đầu</h3>
              <p className="text-gray-600 text-sm">
                Phân tích nhu cầu và đánh giá khả năng bảo hộ
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Soạn thảo hồ sơ</h3>
              <p className="text-gray-600 text-sm">
                Chuẩn bị đầy đủ tài liệu và hồ sơ đăng ký
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nộp đơn đăng ký</h3>
              <p className="text-gray-600 text-sm">
                Thực hiện thủ tục đăng ký tại cơ quan có thẩm quyền
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Theo dõi & Bảo vệ</h3>
              <p className="text-gray-600 text-sm">
                Theo dõi quy trình và bảo vệ quyền sở hữu
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Cần tư vấn về Sở hữu trí tuệ?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Liên hệ với chúng tôi để được tư vấn miễn phí và hỗ trợ tốt nhất
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Liên hệ ngay
            </a>
            <a
              href="tel:+84123456789"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Gọi hotline
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

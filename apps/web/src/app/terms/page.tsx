'use client';

import { FileText, Calendar, Users } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Điều khoản sử dụng
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Quy định và điều khoản sử dụng dịch vụ HANOTEX
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <FileText className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Thông tin chung</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Cập nhật lần cuối: <strong>15/09/2024</strong>
              </p>
              <p className="text-gray-600">
                Chào mừng bạn đến với HANOTEX - Sàn giao dịch công nghệ trực tuyến của thành phố Hà Nội. 
                Bằng việc sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu trong tài liệu này.
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Định nghĩa</h3>
                <ul className="space-y-2 text-gray-600">
                  <li><strong>HANOTEX:</strong> Sàn giao dịch công nghệ trực tuyến của thành phố Hà Nội</li>
                  <li><strong>Người dùng:</strong> Cá nhân, tổ chức sử dụng dịch vụ của HANOTEX</li>
                  <li><strong>Công nghệ:</strong> Các sản phẩm, giải pháp khoa học công nghệ được đăng tải trên sàn</li>
                  <li><strong>Dịch vụ:</strong> Các dịch vụ hỗ trợ chuyển giao công nghệ do HANOTEX cung cấp</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Điều kiện sử dụng</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Người dùng phải đủ 18 tuổi hoặc được đại diện hợp pháp đồng ý</li>
                  <li>• Cung cấp thông tin chính xác và cập nhật khi đăng ký tài khoản</li>
                  <li>• Chịu trách nhiệm về tính bảo mật của tài khoản và mật khẩu</li>
                  <li>• Tuân thủ các quy định pháp luật hiện hành</li>
                  <li>• Không sử dụng dịch vụ cho các mục đích bất hợp pháp</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Quyền và nghĩa vụ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Quyền của người dùng:</h4>
                    <ul className="space-y-1 text-gray-600 text-sm">
                      <li>• Đăng ký và sử dụng dịch vụ miễn phí</li>
                      <li>• Đăng tải và quản lý thông tin công nghệ</li>
                      <li>• Tìm kiếm và kết nối với đối tác</li>
                      <li>• Nhận hỗ trợ từ đội ngũ chuyên gia</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Nghĩa vụ của người dùng:</h4>
                    <ul className="space-y-1 text-gray-600 text-sm">
                      <li>• Cung cấp thông tin chính xác</li>
                      <li>• Bảo vệ quyền sở hữu trí tuệ</li>
                      <li>• Tuân thủ quy định pháp luật</li>
                      <li>• Thanh toán phí dịch vụ (nếu có)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">4. Quyền sở hữu trí tuệ</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Người dùng giữ quyền sở hữu đối với công nghệ của mình</li>
                  <li>• HANOTEX không có quyền sở hữu đối với nội dung người dùng đăng tải</li>
                  <li>• Người dùng chịu trách nhiệm về việc có quyền đăng tải nội dung</li>
                  <li>• HANOTEX có quyền gỡ bỏ nội dung vi phạm quyền sở hữu trí tuệ</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">5. Bảo mật thông tin</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• HANOTEX cam kết bảo mật thông tin cá nhân của người dùng</li>
                  <li>• Thông tin chỉ được sử dụng cho mục đích cung cấp dịch vụ</li>
                  <li>• Không chia sẻ thông tin với bên thứ ba không có sự đồng ý</li>
                  <li>• Áp dụng các biện pháp bảo mật tiên tiến</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">6. Giới hạn trách nhiệm</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• HANOTEX không chịu trách nhiệm cho các giao dịch giữa người dùng</li>
                  <li>• Không đảm bảo tính chính xác của thông tin do người dùng cung cấp</li>
                  <li>• Không chịu trách nhiệm cho thiệt hại gián tiếp hoặc hậu quả</li>
                  <li>• Giới hạn trách nhiệm trong phạm vi pháp luật cho phép</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">7. Thay đổi điều khoản</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• HANOTEX có quyền thay đổi điều khoản này bất cứ lúc nào</li>
                  <li>• Thông báo thay đổi sẽ được gửi qua email hoặc thông báo trên website</li>
                  <li>• Việc tiếp tục sử dụng dịch vụ sau khi thay đổi được coi là đồng ý</li>
                  <li>• Người dùng có thể từ chối thay đổi bằng cách ngừng sử dụng dịch vụ</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">8. Liên hệ</h3>
                <p className="text-gray-600">
                  Nếu bạn có bất kỳ câu hỏi nào về điều khoản sử dụng này, 
                  vui lòng liên hệ với chúng tôi:
                </p>
                <ul className="space-y-1 text-gray-600 mt-2">
                  <li>• Email: legal@hanotex.gov.vn</li>
                  <li>• Điện thoại: 024 3825 1234</li>
                  <li>• Địa chỉ: Sở KH&CN Hà Nội, 15 Lê Thánh Tông, Hoàn Kiếm, Hà Nội</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

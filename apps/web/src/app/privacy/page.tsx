'use client';

import { Shield, Lock, Eye, Database } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Chính sách bảo mật
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
              Cam kết bảo vệ thông tin cá nhân và quyền riêng tư của người dùng
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
                <Shield className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Cam kết bảo mật</h2>
              </div>
              <p className="text-gray-600 mb-4">
                Cập nhật lần cuối: <strong>15/09/2024</strong>
              </p>
              <p className="text-gray-600">
                HANOTEX cam kết bảo vệ thông tin cá nhân và quyền riêng tư của người dùng. 
                Chính sách này giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin của bạn.
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Eye className="h-5 w-5 text-green-600 mr-2" />
                  1. Thông tin chúng tôi thu thập
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Thông tin cá nhân:</h4>
                    <ul className="space-y-1 text-gray-600 text-sm ml-4">
                      <li>• Họ tên, email, số điện thoại</li>
                      <li>• Thông tin công ty/tổ chức (nếu có)</li>
                      <li>• Địa chỉ và thông tin liên hệ</li>
                      <li>• Thông tin xác thực danh tính</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Thông tin sử dụng:</h4>
                    <ul className="space-y-1 text-gray-600 text-sm ml-4">
                      <li>• Lịch sử truy cập và sử dụng dịch vụ</li>
                      <li>• Thông tin thiết bị và trình duyệt</li>
                      <li>• Dữ liệu về giao dịch và tương tác</li>
                      <li>• Thông tin về sở thích và hành vi sử dụng</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Database className="h-5 w-5 text-green-600 mr-2" />
                  2. Cách sử dụng thông tin
                </h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Cung cấp và cải thiện dịch vụ cho người dùng</li>
                  <li>• Xử lý giao dịch và thanh toán</li>
                  <li>• Gửi thông báo và cập nhật quan trọng</li>
                  <li>• Hỗ trợ khách hàng và giải quyết vấn đề</li>
                  <li>• Phân tích và nghiên cứu để cải thiện dịch vụ</li>
                  <li>• Tuân thủ các yêu cầu pháp lý</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Lock className="h-5 w-5 text-green-600 mr-2" />
                  3. Bảo vệ thông tin
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Biện pháp bảo mật:</h4>
                    <ul className="space-y-1 text-gray-600 text-sm">
                      <li>• Mã hóa dữ liệu trong quá trình truyền tải</li>
                      <li>• Lưu trữ an toàn với hệ thống bảo mật tiên tiến</li>
                      <li>• Kiểm soát truy cập nghiêm ngặt</li>
                      <li>• Giám sát và phát hiện xâm nhập</li>
                      <li>• Sao lưu dữ liệu định kỳ</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Đào tạo nhân viên:</h4>
                    <ul className="space-y-1 text-gray-600 text-sm">
                      <li>• Đào tạo về bảo mật thông tin</li>
                      <li>• Ký cam kết bảo mật</li>
                      <li>• Kiểm tra và giám sát định kỳ</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">4. Chia sẻ thông tin</h3>
                <p className="text-gray-600 mb-4">
                  Chúng tôi không bán, cho thuê hoặc chia sẻ thông tin cá nhân của bạn với bên thứ ba, 
                  trừ các trường hợp sau:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>• Có sự đồng ý rõ ràng của bạn</li>
                  <li>• Để cung cấp dịch vụ cho bạn</li>
                  <li>• Tuân thủ yêu cầu pháp lý</li>
                  <li>• Bảo vệ quyền lợi và an toàn của người dùng</li>
                  <li>• Trong trường hợp sáp nhập hoặc chuyển nhượng</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">5. Quyền của người dùng</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Quyền truy cập:</h4>
                    <ul className="space-y-1 text-gray-600 text-sm">
                      <li>• Xem thông tin cá nhân được lưu trữ</li>
                      <li>• Yêu cầu sao chép dữ liệu</li>
                      <li>• Kiểm tra cách sử dụng thông tin</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Quyền kiểm soát:</h4>
                    <ul className="space-y-1 text-gray-600 text-sm">
                      <li>• Cập nhật thông tin cá nhân</li>
                      <li>• Xóa tài khoản và dữ liệu</li>
                      <li>• Rút lại sự đồng ý</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">6. Cookie và công nghệ theo dõi</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Sử dụng cookie để cải thiện trải nghiệm người dùng</li>
                  <li>• Phân tích lưu lượng truy cập và hành vi sử dụng</li>
                  <li>• Cá nhân hóa nội dung và quảng cáo</li>
                  <li>• Người dùng có thể tắt cookie trong trình duyệt</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">7. Bảo vệ trẻ em</h3>
                <p className="text-gray-600">
                  Dịch vụ của chúng tôi không dành cho trẻ em dưới 13 tuổi. 
                  Chúng tôi không cố ý thu thập thông tin cá nhân từ trẻ em dưới 13 tuổi. 
                  Nếu phát hiện việc thu thập thông tin từ trẻ em, chúng tôi sẽ xóa thông tin đó ngay lập tức.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">8. Thay đổi chính sách</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Chúng tôi có thể cập nhật chính sách này theo thời gian</li>
                  <li>• Thông báo thay đổi sẽ được gửi qua email hoặc thông báo trên website</li>
                  <li>• Khuyến khích người dùng xem lại chính sách định kỳ</li>
                  <li>• Việc tiếp tục sử dụng dịch vụ sau khi thay đổi được coi là đồng ý</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">9. Liên hệ về bảo mật</h3>
                <p className="text-gray-600 mb-4">
                  Nếu bạn có câu hỏi hoặc quan ngại về chính sách bảo mật này, 
                  hoặc muốn thực hiện quyền của mình, vui lòng liên hệ:
                </p>
                <ul className="space-y-1 text-gray-600">
                  <li>• Email: privacy@hanotex.gov.vn</li>
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

'use client';

import { RefreshCw, Clock, Shield, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export default function RefundPolicyPage() {
  const refundConditions = [
    {
      title: 'Điều kiện được hoàn tiền',
      icon: CheckCircle,
      color: 'green',
      items: [
        'Dịch vụ không được cung cấp như cam kết',
        'Lỗi kỹ thuật từ phía HANOTEX',
        'Dịch vụ bị hủy do lỗi của chúng tôi',
        'Thanh toán trùng lặp do lỗi hệ thống',
        'Dịch vụ không đạt chất lượng như mô tả'
      ]
    },
    {
      title: 'Điều kiện không được hoàn tiền',
      icon: XCircle,
      color: 'red',
      items: [
        'Người dùng thay đổi ý định sau khi sử dụng dịch vụ',
        'Dịch vụ đã được cung cấp đầy đủ như cam kết',
        'Lỗi do người dùng cung cấp thông tin sai',
        'Vi phạm quy định sử dụng dịch vụ',
        'Hủy dịch vụ sau thời hạn cho phép'
      ]
    }
  ];

  const refundProcess = [
    {
      step: 1,
      title: 'Gửi yêu cầu',
      description: 'Gửi yêu cầu hoàn tiền qua email hoặc form liên hệ',
      timeframe: 'Ngay lập tức'
    },
    {
      step: 2,
      title: 'Xem xét yêu cầu',
      description: 'Chúng tôi sẽ xem xét và đánh giá yêu cầu của bạn',
      timeframe: '1-3 ngày làm việc'
    },
    {
      step: 3,
      title: 'Thông báo kết quả',
      description: 'Thông báo kết quả và hướng dẫn thực hiện (nếu được chấp thuận)',
      timeframe: '1-2 ngày làm việc'
    },
    {
      step: 4,
      title: 'Xử lý hoàn tiền',
      description: 'Thực hiện hoàn tiền theo phương thức thanh toán ban đầu',
      timeframe: '3-7 ngày làm việc'
    }
  ];

  const refundMethods = [
    {
      method: 'Chuyển khoản ngân hàng',
      timeframe: '3-5 ngày làm việc',
      description: 'Hoàn tiền trực tiếp vào tài khoản ngân hàng của bạn'
    },
    {
      method: 'Ví điện tử',
      timeframe: '1-3 ngày làm việc',
      description: 'Hoàn tiền vào ví điện tử đã sử dụng'
    },
    {
      method: 'Thẻ tín dụng/ghi nợ',
      timeframe: '5-10 ngày làm việc',
      description: 'Hoàn tiền vào thẻ thanh toán ban đầu'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Chính sách hoàn tiền
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
              Cam kết bảo vệ quyền lợi của khách hàng với chính sách hoàn tiền minh bạch
            </p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
            <div className="text-center">
              <RefreshCw className="h-16 w-16 text-green-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Tổng quan chính sách
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                HANOTEX cam kết cung cấp dịch vụ chất lượng cao và bảo vệ quyền lợi của khách hàng. 
                Chúng tôi có chính sách hoàn tiền công bằng và minh bạch trong các trường hợp cụ thể.
              </p>
            </div>
          </div>

          {/* Refund Conditions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {refundConditions.map((condition, index) => (
              <div key={index} className={`rounded-xl shadow-lg p-6 ${
                condition.color === 'green' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg mr-4 ${
                    condition.color === 'green' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    <condition.icon className={`h-6 w-6 ${
                      condition.color === 'green' ? 'text-green-600' : 'text-red-600'
                    }`} />
                  </div>
                  <h3 className={`text-xl font-semibold ${
                    condition.color === 'green' ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {condition.title}
                  </h3>
                </div>

                <ul className="space-y-2">
                  {condition.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <CheckCircle className={`h-4 w-4 mr-2 mt-1 flex-shrink-0 ${
                        condition.color === 'green' ? 'text-green-500' : 'text-red-500'
                      }`} />
                      <span className={`text-sm ${
                        condition.color === 'green' ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Refund Process */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <Clock className="h-8 w-8 text-green-600 mr-3" />
              Quy trình hoàn tiền
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Quy trình đơn giản và minh bạch để xử lý yêu cầu hoàn tiền
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {refundProcess.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 mb-3">
                  {step.description}
                </p>
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {step.timeframe}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Refund Methods */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Phương thức hoàn tiền
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Các phương thức hoàn tiền và thời gian xử lý tương ứng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {refundMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-center">
                  <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {method.method}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {method.description}
                  </p>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {method.timeframe}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mr-4 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold text-yellow-900 mb-4">
                  Lưu ý quan trọng
                </h3>
                <ul className="space-y-2 text-yellow-800">
                  <li>• Yêu cầu hoàn tiền phải được gửi trong vòng 30 ngày kể từ ngày thanh toán</li>
                  <li>• Phí giao dịch và phí dịch vụ có thể không được hoàn lại</li>
                  <li>• Thời gian xử lý có thể kéo dài hơn trong các dịp lễ tết</li>
                  <li>• Chúng tôi có quyền từ chối hoàn tiền nếu phát hiện gian lận</li>
                  <li>• Mọi quyết định hoàn tiền là quyết định cuối cùng của HANOTEX</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Cần hỗ trợ hoàn tiền?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Nếu bạn có yêu cầu hoàn tiền hoặc thắc mắc về chính sách, vui lòng liên hệ với chúng tôi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:refund@hanotex.gov.vn"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              refund@hanotex.gov.vn
            </a>
            <a 
              href="/contact"
              className="border border-gray-600 hover:border-gray-500 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
            >
              <Shield className="h-5 w-5 mr-2" />
              Liên hệ hỗ trợ
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

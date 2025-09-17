'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Phone, Mail } from 'lucide-react';

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  const faqCategories = [
    {
      title: 'Đăng ký và tài khoản',
      questions: [
        {
          question: 'Làm thế nào để đăng ký tài khoản trên HANOTEX?',
          answer: 'Bạn có thể đăng ký tài khoản bằng cách: 1) Truy cập trang đăng ký, 2) Điền thông tin cá nhân, 3) Chọn loại tài khoản (cá nhân/doanh nghiệp/tổ chức), 4) Xác thực email, 5) Hoàn tất đăng ký.'
        },
        {
          question: 'Có mất phí khi đăng ký tài khoản không?',
          answer: 'Đăng ký tài khoản trên HANOTEX hoàn toàn miễn phí. Bạn có thể sử dụng các tính năng cơ bản mà không cần trả phí.'
        },
        {
          question: 'Tôi có thể thay đổi thông tin tài khoản sau khi đăng ký không?',
          answer: 'Có, bạn có thể cập nhật thông tin tài khoản bất cứ lúc nào bằng cách vào phần "Hồ sơ cá nhân" và chỉnh sửa thông tin cần thiết.'
        }
      ]
    },
    {
      title: 'Đăng tải công nghệ',
      questions: [
        {
          question: 'Làm thế nào để đăng tải công nghệ lên sàn?',
          answer: 'Để đăng tải công nghệ: 1) Đăng nhập tài khoản, 2) Vào "Công nghệ" > "Đăng công nghệ", 3) Điền đầy đủ thông tin về công nghệ, 4) Tải lên tài liệu liên quan, 5) Chờ xét duyệt và công bố.'
        },
        {
          question: 'Cần những tài liệu gì khi đăng tải công nghệ?',
          answer: 'Bạn cần chuẩn bị: mô tả chi tiết công nghệ, tài liệu kỹ thuật, bằng sáng chế (nếu có), hình ảnh minh họa, thông tin về ứng dụng và giá trị thương mại.'
        },
        {
          question: 'Thời gian xét duyệt công nghệ là bao lâu?',
          answer: 'Thời gian xét duyệt thông thường từ 3-7 ngày làm việc. Đối với công nghệ phức tạp có thể mất thời gian lâu hơn để đánh giá kỹ lưỡng.'
        }
      ]
    },
    {
      title: 'Đăng nhu cầu công nghệ',
      questions: [
        {
          question: 'Làm thế nào để đăng nhu cầu tìm kiếm công nghệ?',
          answer: 'Để đăng nhu cầu: 1) Vào "Nhu cầu" > "Đăng nhu cầu", 2) Mô tả chi tiết nhu cầu công nghệ, 3) Định nghĩa yêu cầu kỹ thuật, 4) Đặt ngân sách (nếu có), 5) Chọn thời hạn tìm kiếm.'
        },
        {
          question: 'Tôi có thể chỉnh sửa nhu cầu sau khi đăng không?',
          answer: 'Có, bạn có thể chỉnh sửa nhu cầu đã đăng trong vòng 24 giờ đầu tiên. Sau đó cần liên hệ bộ phận hỗ trợ để thực hiện thay đổi.'
        }
      ]
    },
    {
      title: 'Giao dịch và thanh toán',
      questions: [
        {
          question: 'HANOTEX có thu phí giao dịch không?',
          answer: 'HANOTEX áp dụng phí dịch vụ cho các giao dịch thành công. Phí này được tính dựa trên giá trị giao dịch và được thông báo rõ ràng trước khi thực hiện.'
        },
        {
          question: 'Các phương thức thanh toán được hỗ trợ là gì?',
          answer: 'Chúng tôi hỗ trợ thanh toán qua: chuyển khoản ngân hàng, ví điện tử, thẻ tín dụng/ghi nợ, và các phương thức khác theo thỏa thuận.'
        }
      ]
    },
    {
      title: 'Dịch vụ hỗ trợ',
      questions: [
        {
          question: 'HANOTEX cung cấp những dịch vụ hỗ trợ gì?',
          answer: 'Chúng tôi cung cấp: tư vấn chuyển giao công nghệ, định giá công nghệ, hỗ trợ pháp lý về sở hữu trí tuệ, kết nối đầu tư, và các dịch vụ chuyên sâu khác.'
        },
        {
          question: 'Làm thế nào để liên hệ tư vấn?',
          answer: 'Bạn có thể liên hệ qua: hotline 024 3825 1234, email info@hanotex.gov.vn, hoặc đặt lịch tư vấn trực tiếp tại văn phòng.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Câu hỏi thường gặp
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Tìm hiểu câu trả lời cho các câu hỏi phổ biến về HANOTEX
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <HelpCircle className="h-6 w-6 text-purple-600 mr-3" />
                {category.title}
              </h2>
              
              <div className="space-y-4">
                {category.questions.map((item, itemIndex) => {
                  const globalIndex = categoryIndex * 100 + itemIndex;
                  const isOpen = openItems.includes(globalIndex);
                  
                  return (
                    <div key={itemIndex} className="bg-white rounded-lg shadow-md">
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900 pr-4">
                          {item.question}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-purple-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-purple-600 flex-shrink-0" />
                        )}
                      </button>
                      
                      {isOpen && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-600 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Không tìm thấy câu trả lời?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Đội ngũ hỗ trợ của chúng tôi sẵn sàng giúp đỡ bạn
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Phone className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Gọi điện thoại
                </h3>
                <p className="text-gray-600 mb-4">
                  Hotline: 024 3825 1234
                </p>
                <p className="text-sm text-gray-500">
                  Thứ 2 - Thứ 6: 8:00 - 17:00
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Gửi email
                </h3>
                <p className="text-gray-600 mb-4">
                  support@hanotex.gov.vn
                </p>
                <p className="text-sm text-gray-500">
                  Phản hồi trong 24 giờ
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <MessageCircle className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Chat trực tuyến
                </h3>
                <p className="text-gray-600 mb-4">
                  Hỗ trợ trực tiếp
                </p>
                <p className="text-sm text-gray-500">
                  Thứ 2 - Thứ 6: 8:00 - 17:00
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

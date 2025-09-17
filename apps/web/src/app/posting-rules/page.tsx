'use client';

import { Shield, AlertTriangle, CheckCircle, XCircle, FileText, Users } from 'lucide-react';

export default function PostingRulesPage() {
  const rules = [
    {
      title: 'Quy tắc đăng tải công nghệ',
      icon: Shield,
      items: [
        {
          rule: 'Thông tin chính xác và đầy đủ',
          description: 'Cung cấp thông tin chính xác về công nghệ, không được gian lận hoặc che giấu thông tin quan trọng.',
          type: 'required'
        },
        {
          rule: 'Quyền sở hữu hợp pháp',
          description: 'Chỉ đăng tải công nghệ mà bạn có quyền sở hữu hoặc được ủy quyền hợp pháp.',
          type: 'required'
        },
        {
          rule: 'Mô tả chi tiết và rõ ràng',
          description: 'Cung cấp mô tả chi tiết về công nghệ, ứng dụng, lợi ích và giá trị thương mại.',
          type: 'required'
        },
        {
          rule: 'Tài liệu kỹ thuật đầy đủ',
          description: 'Đính kèm các tài liệu kỹ thuật, bằng sáng chế, chứng nhận chất lượng (nếu có).',
          type: 'recommended'
        }
      ]
    },
    {
      title: 'Quy tắc đăng nhu cầu',
      icon: Users,
      items: [
        {
          rule: 'Mô tả nhu cầu cụ thể',
          description: 'Mô tả rõ ràng nhu cầu công nghệ, yêu cầu kỹ thuật và mục tiêu ứng dụng.',
          type: 'required'
        },
        {
          rule: 'Thông tin ngân sách',
          description: 'Cung cấp thông tin về ngân sách dự kiến (nếu có) để thu hút đối tác phù hợp.',
          type: 'recommended'
        },
        {
          rule: 'Thời hạn hợp lý',
          description: 'Đặt thời hạn tìm kiếm hợp lý và thực tế với nhu cầu của dự án.',
          type: 'required'
        }
      ]
    }
  ];

  const prohibitedContent = [
    'Công nghệ vi phạm pháp luật hoặc đạo đức',
    'Thông tin sai sự thật hoặc gây hiểu lầm',
    'Nội dung có tính chất lừa đảo hoặc lừa gạt',
    'Công nghệ liên quan đến vũ khí hoặc chất độc hại',
    'Thông tin cá nhân của người khác không được phép',
    'Nội dung có tính chất phân biệt đối xử',
    'Spam hoặc quảng cáo không liên quan',
    'Công nghệ đã hết hạn bảo hộ hoặc không còn giá trị'
  ];

  const penalties = [
    {
      level: 'Cảnh báo',
      description: 'Đối với vi phạm nhỏ lần đầu',
      actions: ['Gửi thông báo cảnh báo', 'Yêu cầu chỉnh sửa nội dung']
    },
    {
      level: 'Tạm khóa tài khoản',
      description: 'Đối với vi phạm nghiêm trọng hoặc tái phạm',
      actions: ['Khóa tài khoản 7-30 ngày', 'Yêu cầu xác thực danh tính']
    },
    {
      level: 'Khóa vĩnh viễn',
      description: 'Đối với vi phạm rất nghiêm trọng',
      actions: ['Khóa tài khoản vĩnh viễn', 'Không cho phép đăng ký lại']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 via-red-700 to-red-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Quy định đăng tin
            </h1>
            <p className="text-xl md:text-2xl text-red-100 mb-8 max-w-3xl mx-auto">
              Các quy tắc và quy định khi đăng tải thông tin trên HANOTEX
            </p>
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <FileText className="h-8 w-8 text-red-600 mr-3" />
              Quy tắc đăng tải
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tuân thủ các quy tắc sau để đảm bảo chất lượng và tính minh bạch của sàn giao dịch
            </p>
          </div>

          <div className="space-y-12">
            {rules.map((ruleGroup, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-red-100 p-3 rounded-lg mr-4">
                    <ruleGroup.icon className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {ruleGroup.title}
                  </h3>
                </div>

                <div className="space-y-4">
                  {ruleGroup.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {item.type === 'required' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {item.rule}
                          </h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.type === 'required' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.type === 'required' ? 'Bắt buộc' : 'Khuyến nghị'}
                          </span>
                        </div>
                        <p className="text-gray-600">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prohibited Content Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <XCircle className="h-8 w-8 text-red-600 mr-3" />
              Nội dung cấm đăng tải
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Các loại nội dung không được phép đăng tải trên HANOTEX
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prohibitedContent.map((content, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">{content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Penalties Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hình thức xử lý vi phạm
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Các biện pháp xử lý đối với các trường hợp vi phạm quy định
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {penalties.map((penalty, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-center mb-4">
                  <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                    index === 0 ? 'bg-yellow-100' : index === 1 ? 'bg-orange-100' : 'bg-red-100'
                  }`}>
                    <AlertTriangle className={`h-6 w-6 ${
                      index === 0 ? 'text-yellow-600' : index === 1 ? 'text-orange-600' : 'text-red-600'
                    }`} />
                  </div>
                  <h3 className={`text-lg font-semibold ${
                    index === 0 ? 'text-yellow-800' : index === 1 ? 'text-orange-800' : 'text-red-800'
                  }`}>
                    {penalty.level}
                  </h3>
                </div>
                
                <p className="text-gray-600 text-center mb-4">
                  {penalty.description}
                </p>

                <ul className="space-y-2">
                  {penalty.actions.map((action, actionIndex) => (
                    <li key={actionIndex} className="flex items-start text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Cần hỗ trợ về quy định?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Nếu bạn có thắc mắc về quy định đăng tin, vui lòng liên hệ với chúng tôi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:legal@hanotex.gov.vn"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
            >
              <FileText className="h-5 w-5 mr-2" />
              legal@hanotex.gov.vn
            </a>
            <a 
              href="/contact"
              className="border border-gray-600 hover:border-gray-500 text-gray-700 px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center justify-center"
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

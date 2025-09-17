'use client';

import { Building2, TrendingUp, Users, Globe, Award, ArrowRight } from 'lucide-react';

export default function PartnersSection() {
  // Mock data for partners
  const partners = [
    {
      name: 'Sở KH&CN Hà Nội',
      type: 'Cơ quan nhà nước',
      logo: '/images/partners/hanoi-science-tech.png',
      description: 'Cơ quan chủ quản của sàn giao dịch HANOTEX'
    },
    {
      name: 'Trường Đại học Bách Khoa Hà Nội',
      type: 'Trường đại học',
      logo: '/images/partners/hust.png',
      description: 'Đối tác nghiên cứu và phát triển công nghệ'
    },
    {
      name: 'Viện Hàn lâm Khoa học Việt Nam',
      type: 'Viện nghiên cứu',
      logo: '/images/partners/vast.png',
      description: 'Đối tác nghiên cứu khoa học cơ bản'
    },
    {
      name: 'FPT Corporation',
      type: 'Doanh nghiệp',
      logo: '/images/partners/fpt.png',
      description: 'Đối tác công nghệ thông tin'
    },
    {
      name: 'Viettel Group',
      type: 'Doanh nghiệp',
      logo: '/images/partners/viettel.png',
      description: 'Đối tác viễn thông và công nghệ'
    },
    {
      name: 'VinGroup',
      type: 'Tập đoàn',
      logo: '/images/partners/vingroup.png',
      description: 'Đối tác đa ngành'
    }
  ];

  // Mock data for investment funds
  const funds = [
    {
      name: 'Quỹ Đầu tư Khởi nghiệp Sáng tạo Hà Nội',
      type: 'Quỹ đầu tư',
      focus: 'Khởi nghiệp công nghệ',
      size: '500 tỷ VNĐ',
      description: 'Hỗ trợ các dự án khởi nghiệp trong lĩnh vực khoa học công nghệ'
    },
    {
      name: 'Vietnam Silicon Valley',
      type: 'Quỹ đầu tư',
      focus: 'Công nghệ cao',
      size: '200 triệu USD',
      description: 'Đầu tư vào các công ty công nghệ có tiềm năng phát triển'
    },
    {
      name: 'IDG Ventures Vietnam',
      type: 'Quỹ đầu tư',
      focus: 'Công nghệ thông tin',
      size: '100 triệu USD',
      description: 'Chuyên đầu tư vào các startup công nghệ thông tin'
    },
    {
      name: 'CyberAgent Capital',
      type: 'Quỹ đầu tư',
      focus: 'Internet & Mobile',
      size: '50 triệu USD',
      description: 'Đầu tư vào các công ty internet và mobile'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Đối tác & Quỹ đầu tư
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Hệ thống đối tác uy tín và các quỹ đầu tư chuyên nghiệp hỗ trợ phát triển hệ sinh thái khoa học công nghệ
          </p>
        </div>

        {/* Partners Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Đối tác chiến lược
            </h3>
            <p className="text-gray-600">
              Các tổ chức, doanh nghiệp và viện nghiên cứu hàng đầu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partners.map((partner, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 p-6 text-center"
              >
                {/* Logo Placeholder */}
                <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Building2 className="h-10 w-10 text-blue-600" />
                </div>

                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {partner.name}
                </h4>

                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3">
                  {partner.type}
                </span>

                <p className="text-gray-600 text-sm">
                  {partner.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Investment Funds Section */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Quỹ đầu tư liên kết
            </h3>
            <p className="text-gray-600">
              Các quỹ đầu tư chuyên nghiệp hỗ trợ phát triển dự án công nghệ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {funds.map((fund, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 p-6"
              >
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      {fund.name}
                    </h4>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {fund.type}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">Lĩnh vực:</span>
                    <p className="font-medium text-gray-900">{fund.focus}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Quy mô:</span>
                    <p className="font-medium text-gray-900">{fund.size}</p>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  {fund.description}
                </p>

                <div className="flex items-center justify-between">
                  <button className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm">
                    Tìm hiểu thêm
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </button>
                  <button className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500">
                    Liên hệ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Trở thành đối tác của HANOTEX
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Tham gia mạng lưới đối tác để cùng phát triển hệ sinh thái khoa học công nghệ Hà Nội
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center justify-center rounded-lg px-8 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500">
                <Users className="mr-2 h-5 w-5" />
                Trở thành đối tác
              </button>
              <button className="inline-flex items-center justify-center rounded-lg px-8 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 border border-blue-600 bg-white text-blue-600 hover:bg-blue-50 focus:ring-blue-500">
                <Globe className="mr-2 h-5 w-5" />
                Tìm hiểu thêm
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import Link from 'next/link';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Youtube,
  ArrowRight,
  Building2,
  Users,
  FileText,
  Shield
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Công nghệ', href: '/technologies' },
    { name: 'Nhu cầu', href: '/demands' },
    { name: 'Tin tức', href: '/news' },
    { name: 'Sự kiện', href: '/events' },
    { name: 'Về chúng tôi', href: '/about' }
  ];

  const services = [
    { name: 'Đăng công nghệ', href: '/technologies/register' },
    { name: 'Đăng nhu cầu', href: '/demands/register' },
    { name: 'Tư vấn chuyển giao', href: '/services/consulting' },
    { name: 'Định giá công nghệ', href: '/services/valuation' },
    { name: 'Hỗ trợ pháp lý', href: '/services/legal' },
    { name: 'Kết nối đầu tư', href: '/services/investment' }
  ];

  const policies = [
    { name: 'Điều khoản sử dụng', href: '/terms' },
    { name: 'Chính sách bảo mật', href: '/privacy' },
    { name: 'Quy định đăng tin', href: '/posting-rules' },
    { name: 'Chính sách hoàn tiền', href: '/refund-policy' },
    { name: 'Hướng dẫn sử dụng', href: '/user-guide' },
    { name: 'Câu hỏi thường gặp', href: '/faq' }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/hanotex' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/hanotex' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/hanotex' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/hanotex' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xl">
                HANOTEX
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Sàn giao dịch công nghệ trực tuyến của thành phố Hà Nội. 
              Kết nối cung - cầu công nghệ, thúc đẩy đổi mới sáng tạo.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <MapPin className="h-5 w-5 mr-3 text-blue-400" />
                <span className="text-sm">
                  Sở KH&CN Hà Nội<br />
                  15 Lê Thánh Tông, Hoàn Kiếm, Hà Nội
                </span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="h-5 w-5 mr-3 text-blue-400" />
                <span className="text-sm">024 3825 1234</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="h-5 w-5 mr-3 text-blue-400" />
                <span className="text-sm">info@hanotex.gov.vn</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Globe className="h-5 w-5 mr-3 text-blue-400" />
                <span className="text-sm">www.hanotex.gov.vn</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-blue-400" />
              Liên kết nhanh
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors flex items-center group"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-400" />
              Dịch vụ
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="text-gray-300 hover:text-white transition-colors flex items-center group"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-400" />
              Chính sách
            </h3>
            <ul className="space-y-3">
              {policies.map((policy) => (
                <li key={policy.name}>
                  <Link
                    href={policy.href}
                    className="text-gray-300 hover:text-white transition-colors flex items-center group"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {policy.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Đăng ký nhận tin tức
              </h3>
              <p className="text-gray-300">
                Nhận thông tin mới nhất về công nghệ, sự kiện và cơ hội hợp tác
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} HANOTEX. Tất cả quyền được bảo lưu.
            </div>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm mr-2">Theo dõi chúng tôi:</span>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Government Link */}
          <div className="mt-4 pt-4 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-sm">
              Được vận hành bởi{' '}
              <a
                href="https://www.hanoi.gov.vn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Sở Khoa học và Công nghệ Hà Nội
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

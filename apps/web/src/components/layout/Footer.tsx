"use client";

import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  MessageSquare,
} from "lucide-react";

const Logo = () => (
  <div className="w-10 h-10 flex items-center justify-center">
    <img
      src="/Group 1000004724.svg"
      alt="HANOTEX Logo"
      className="w-full h-full object-contain"
    />
  </div>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const services = [
    { name: "Sản phẩm KH&CN", href: "/products" },
    { name: "Nhu cầu KH&CN", href: "/needs" },
    { name: "Đấu giá công nghệ", href: "/auctions" },
    { name: "Kêu gọi đầu tư", href: "/investments" },
    { name: "Tư vấn chuyển giao", href: "/consulting" },
  ];

  const supportLinks = [
    { name: "Trung tâm trợ giúp", href: "/help-center" },
    { name: "Hướng dẫn sử dụng", href: "/guides" },
    { name: "Câu hỏi thường gặp", href: "/faq" },
    { name: "Liên hệ hỗ trợ", href: "/support" },
    { name: "Báo cáo sự cố", href: "/report-issue" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "YouTube", icon: Youtube, href: "#" },
  ];

  return (
    <footer className="bg-[#1C254E] text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: HANOTEX Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Logo />
              <div>
                <h2 className="font-bold text-xl">HANOTEX</h2>
                <p className="text-sm text-gray-400">
                  Sàn Khoa học Công nghệ Hà Nội
                </p>
              </div>
            </div>
            <p className="text-gray-300">
              Sàn giao dịch công nghệ trực tuyến do UBND Thành phố Hà Nội chỉ
              đạo phát triển, Sở Khoa học và Công nghệ Hà Nội trực tiếp quản lý,
              vận hành.
              <br />
              <br />
              HANOTEX là nền tảng kết nối cung – cầu công nghệ, thúc đẩy thương
              mại hóa kết quả nghiên cứu và đổi mới sáng tạo, góp phần xây dựng
              hệ sinh thái khoa học công nghệ bền vững của Thủ đô.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="md:col-start-2">
            <h3 className="font-bold text-lg mb-4">Sản phẩm & Dịch vụ</h3>
            <ul className="space-y-3">
              {services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 className="font-bold text-lg mb-4">Hỗ trợ</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4">Liên hệ</h3>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-1 flex-shrink-0" />
                <span>256 Đường Võ Chí Công, Tây Hồ, Hà Nội</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3" />
                <span>+84 986287758</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3" />
                <span>info@hanotex.vn</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p className="mb-4 md:mb-0">
            &copy; {currentYear} HANOTEX. Tất cả quyền được bảo lưu.
          </p>
          <div className="flex space-x-6">
            <Link href="/terms" className="hover:text-white">
              Điều khoản sử dụng
            </Link>
            <Link href="/privacy" className="hover:text-white">
              Chính sách bảo mật
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button className="fixed bottom-5 right-5 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors z-50">
        <MessageSquare className="h-7 w-7" />
      </button>
    </footer>
  );
}

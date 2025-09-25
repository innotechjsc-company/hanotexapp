"use client";

import {
  Building2,
  FileText,
  GraduationCap,
  Target,
  User,
  Zap,
  Briefcase,
} from "lucide-react";
import type { MenuItem, UserMenuItem } from "./types";

export const mainMenuItems: MenuItem[] = [
  {
    name: "Công nghệ",
    href: "/technologies",
    icon: Zap,
    submenu: [
      { name: "Tất cả công nghệ", href: "/technologies" },
      { name: "Công nghệ mới", href: "/technologies?filter=new" },
      { name: "Công nghệ nổi bật", href: "/technologies?filter=featured" },
      { name: "Đăng công nghệ", href: "/technologies/register" },
    ],
  },
  {
    name: "Nhu cầu",
    href: "/demands",
    icon: Target,
    submenu: [
      { name: "Tất cả nhu cầu", href: "/demands" },
      { name: "Nhu cầu mới", href: "/demands?filter=new" },
      { name: "Nhu cầu khẩn cấp", href: "/demands?filter=urgent" },
      { name: "Đăng nhu cầu", href: "/demands/register" },
    ],
  },
  {
    name: "Dịch vụ",
    href: "/services",
    icon: Building2,
    submenu: [
      { name: "Tư vấn công nghệ", href: "/services/consulting" },
      { name: "Thẩm định & định giá", href: "/services/valuation" },
      { name: "Tư vấn pháp lý", href: "/services/legal" },
      { name: "Sở hữu trí tuệ", href: "/services/intellectual-property" },
      { name: "Kết nối đầu tư", href: "/services/investment" },
      { name: "Đào tạo & Hỗ trợ", href: "/services/training" },
    ],
  },
  {
    name: "Quỹ & Đầu tư",
    href: "/funds",
    icon: Target,
    submenu: [
      { name: "Dự án đang hoạt động", href: "/funds/active-projects" },
      { name: "Dự án đang gọi vốn", href: "/funds/fundraising" },
      { name: "Danh sách Quỹ đầu tư", href: "/funds/investment-funds" },
    ],
  },
  {
    name: "Tin tức & Sự kiện",
    href: "/news",
    icon: FileText,
    submenu: [
      { name: "Tin tức mới nhất", href: "/news" },
      // { name: "Thông báo", href: "/news?category=announcements" },
      // { name: "Chính sách", href: "/news?category=policies" },
      // { name: "Hướng dẫn", href: "/news?category=guides" },
      { name: "Sự kiện sắp diễn ra", href: "/events" },
      // { name: "Hội thảo", href: "/events?type=seminar" },
      // { name: "Triển lãm", href: "/events?type=exhibition" },
    ],
  },
  {
    name: "Giới thiệu",
    href: "/about",
    icon: User,
    submenu: [
      { name: "Về HANOTEX", href: "/about" },
      { name: "Liên hệ", href: "/contact" },
      { name: "Hướng dẫn sử dụng", href: "/user-guide" },
      { name: "Câu hỏi thường gặp", href: "/faq" },
      { name: "Chính sách bảo mật", href: "/privacy" },
      { name: "Điều khoản sử dụng", href: "/terms" },
    ],
  },
];

export const userMenuItemsBase: UserMenuItem[] = [
  { name: "Hồ sơ cá nhân", href: "/profile" },
  { name: "Công nghệ của tôi", href: "/my-technologies" },
  { name: "Nhu cầu của tôi", href: "/my-demands" },
  { name: "Đề xuất của tôi", href: "/my-proposals" },
  { name: "Dự án của tôi", href: "/my-projects" },
  { name: "Quỹ & Đầu tư của tôi", href: "/my-investments" },
  { name: "Tin nhắn", href: "/messages" },
  { name: "Cài đặt", href: "/settings" },
];

export function getUserIconByType(type?: string) {
  switch (type) {
    case "COMPANY":
      return Briefcase;
    case "RESEARCH_INSTITUTION":
      return GraduationCap;
    case "INDIVIDUAL":
      return User;
    default:
      return User;
  }
}

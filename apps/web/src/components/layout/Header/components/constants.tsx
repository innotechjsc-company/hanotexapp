"use client";

import {
  Building2,
  FileText,
  GraduationCap,
  Target,
  User,
  Zap,
  Briefcase,
  Gavel,
  Database,
} from "lucide-react";
import type { MenuItem, UserMenuItem } from "./types";

export const mainMenuItems: MenuItem[] = [
  {
    name: "Công nghệ",
    href: "/technologies",
    icon: Zap,
  },
  {
    name: "Nhu cầu",
    href: "/demands",
    icon: Target,
  },
  {
    name: "Đấu giá",
    href: "/auctions",
    icon: Gavel,
    submenu: [
      { name: "Đang diễn ra", href: "/auctions?status=active" },
      { name: "Sắp diễn ra", href: "/auctions?status=upcoming" },
      { name: "Tạo đấu giá", href: "/auctions/create" },
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
    name: "Dữ liệu KH&CN",
    href: "/data",
    icon: Database,
    submenu: [
      { name: "Danh sách nhà khoa học/phát minh", href: "/data/scientists" },
      { name: "Danh sách viện/trường/tổ chức", href: "/data/institutions" },
    ],
  },
];

export const userMenuItemsBase: UserMenuItem[] = [
  { name: "Hồ sơ cá nhân", href: "/profile" },
  { name: "Công nghệ của tôi", href: "/my-technologies" },
  { name: "Nhu cầu của tôi", href: "/my-demands" },
  { name: "Đấu giá của tôi", href: "/my-auctions" },
  { name: "Đề xuất của tôi", href: "/my-proposals" },
  { name: "Dự án của tôi", href: "/my-projects" },
  { name: "Quỹ & Đầu tư của tôi", href: "/my-investments" },
  { name: "Phiếu dịch vụ của tôi", href: "/my-services-tickets" },
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

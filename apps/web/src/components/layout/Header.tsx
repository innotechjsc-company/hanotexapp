"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import SearchModal from "@/components/ui/SearchModal";
import {
  Menu,
  X,
  Search,
  User,
  Bell,
  ChevronDown,
  Building2,
  Zap,
  Target,
  FileText,
  Calendar,
  LogIn,
  UserPlus,
  Briefcase,
  GraduationCap,
  Database,
  Users,
  Lightbulb,
} from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();

  // Get display name based on user type
  const getDisplayName = () => {
    if (!user) return "Người dùng";

    return user.full_name;
  };

  // Get user avatar/icon based on user type
  const getUserIcon = () => {
    if (!user) return User;

    switch (user.user_type) {
      case "COMPANY":
        return Briefcase;
      case "RESEARCH_INSTITUTION":
        return GraduationCap;
      case "INDIVIDUAL":
        return User;
      default:
        return User;
    }
  };

  const UserIcon = getUserIcon();

  const mainMenuItems = [
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
        { name: "Thông báo", href: "/news?category=announcements" },
        { name: "Chính sách", href: "/news?category=policies" },
        { name: "Hướng dẫn", href: "/news?category=guides" },
        { name: "Sự kiện sắp diễn ra", href: "/events" },
        { name: "Hội thảo", href: "/events?type=seminar" },
        { name: "Triển lãm", href: "/events?type=exhibition" },
      ],
    },
    {
      name: "Dữ Liệu CKCN",
      href: "/data",
      icon: Database,
      submenu: [
        { name: "Danh sách Tổ chức/Viện/Trường", href: "/data/organizations" },
        { name: "Danh sách Nhà sáng chế/Phát minh", href: "/data/inventors" },
        { name: "Danh sách Công Nghệ & Nhu cầu", href: "/data/technologies" },
      ],
    },
  ];

  const userMenuItems = [
    { name: "Hồ sơ cá nhân", href: "/profile" },
    { name: "Công nghệ của tôi", href: "/my-technologies" },
    { name: "Nhu cầu của tôi", href: "/my-demands" },
    { name: "Dự án của tôi", href: "/my-projects" },
    { name: "Quỹ & Đầu tư của tôi", href: "/my-investments" },
    { name: "Tin nhắn", href: "/messages" },
    { name: "Cài đặt", href: "/settings" },
    { name: "Đăng xuất", href: "#", action: logout },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20 gap-4">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center group">
              <div className="w-28 h-16 min-w-[112px] flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                <img
                  src="/logo.png"
                  alt="HANOTEX Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2 flex-1 justify-center max-w-4xl ml-2">
            {mainMenuItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 whitespace-nowrap ${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 shadow-md"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm"
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                  {item.submenu && (
                    <ChevronDown className="h-4 w-4 ml-1 flex-shrink-0 group-hover:rotate-180 transition-transform duration-300" />
                  )}
                </Link>

                {/* Dropdown Menu */}
                {item.submenu && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="py-3">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-5 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-200 font-medium"
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
            {/* User Menu or Auth Buttons */}
            {isAuthenticated ? (
              <>
                {/* Search Button - Only show when authenticated */}
                <button
                  onClick={() => setIsSearchModalOpen(true)}
                  className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 hover:scale-110 group"
                >
                  <Search className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                </button>

                {/* Notifications - Only show when authenticated */}
                <button className="p-3 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-300 hover:scale-110 relative group">
                  <Bell className="h-5 w-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full animate-pulse shadow-md"></span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-300 hover:shadow-md group min-w-0"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 flex-shrink-0">
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <div className="hidden md:block text-left min-w-0 flex-1">
                      <div className="text-sm font-semibold text-gray-800 truncate">
                        {getDisplayName()}
                      </div>
                      <div className="text-xs text-gray-500 capitalize truncate">
                        {user?.user_type?.toLowerCase().replace("_", " ") ||
                          "User"}
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform duration-300 flex-shrink-0" />
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-100 z-50">
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg">
                            <UserIcon className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-800 truncate">
                              {getDisplayName()}
                            </div>
                            <div className="text-xs text-gray-500 capitalize">
                              {user?.user_type
                                ?.toLowerCase()
                                .replace("_", " ") || "User"}
                            </div>
                            <div className="text-xs text-gray-400 truncate">
                              {user?.email}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="py-2">
                        {userMenuItems.map((item) =>
                          item.action ? (
                            <button
                              key={item.name}
                              onClick={() => {
                                item.action();
                                setIsUserMenuOpen(false);
                              }}
                              className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 hover:text-red-700 transition-all duration-200 font-medium"
                            >
                              {item.name}
                            </button>
                          ) : (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-200 font-medium"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              {item.name}
                            </Link>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/login"
                  className="flex items-center px-4 py-3 text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md whitespace-nowrap"
                >
                  <LogIn className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span className="hidden sm:inline">Đăng nhập</span>
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap"
                >
                  <UserPlus className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span className="hidden sm:inline">Đăng ký</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 hover:scale-110"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-6 bg-gray-50/50">
            <nav className="space-y-2 px-2">
              {mainMenuItems.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      isActive(item.href)
                        ? "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 shadow-md"
                        : "text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-sm"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>

                  {/* Mobile Submenu */}
                  {item.submenu && (
                    <div className="ml-8 mt-2 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </header>
  );
}

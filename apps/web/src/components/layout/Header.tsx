'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import SearchModal from '@/components/ui/SearchModal';
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
  Users,
  Shield,
  LogIn,
  UserPlus
} from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();

  const mainMenuItems = [
    {
      name: 'Trang chủ',
      href: '/',
      icon: Building2
    },
    {
      name: 'Công nghệ',
      href: '/technologies',
      icon: Zap,
      submenu: [
        { name: 'Tất cả công nghệ', href: '/technologies' },
        { name: 'Công nghệ mới', href: '/technologies?filter=new' },
        { name: 'Công nghệ nổi bật', href: '/technologies?filter=featured' },
        { name: 'Đăng công nghệ', href: '/technologies/register' }
      ]
    },
    {
      name: 'Nhu cầu',
      href: '/demands',
      icon: Target,
      submenu: [
        { name: 'Tất cả nhu cầu', href: '/demands' },
        { name: 'Nhu cầu mới', href: '/demands?filter=new' },
        { name: 'Nhu cầu khẩn cấp', href: '/demands?filter=urgent' },
        { name: 'Đăng nhu cầu', href: '/demands/register' }
      ]
    },
    {
      name: 'Tin tức',
      href: '/news',
      icon: FileText,
      submenu: [
        { name: 'Tin tức mới nhất', href: '/news' },
        { name: 'Thông báo', href: '/news?category=announcements' },
        { name: 'Chính sách', href: '/news?category=policies' },
        { name: 'Hướng dẫn', href: '/news?category=guides' }
      ]
    },
    {
      name: 'Sự kiện',
      href: '/events',
      icon: Calendar,
      submenu: [
        { name: 'Sự kiện sắp diễn ra', href: '/events' },
        { name: 'Hội thảo', href: '/events?type=seminar' },
        { name: 'Triển lãm', href: '/events?type=exhibition' },
        { name: 'Đăng ký sự kiện', href: '/events/register' }
      ]
    }
  ];

  const userMenuItems = [
    { name: 'Hồ sơ cá nhân', href: '/profile' },
    { name: 'Công nghệ của tôi', href: '/my-technologies' },
    { name: 'Nhu cầu của tôi', href: '/my-demands' },
    { name: 'Tin nhắn', href: '/messages' },
    { name: 'Cài đặt', href: '/settings' },
    { name: 'Đăng xuất', href: '#', action: logout }
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white px-3 py-2 rounded-lg font-bold text-lg">
                HANOTEX
              </div>
              <span className="hidden sm:block text-sm text-gray-600">
                Sàn giao dịch công nghệ Hà Nội
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {mainMenuItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                  {item.submenu && (
                    <ChevronDown className="h-4 w-4 ml-1" />
                  )}
                </Link>

                {/* Dropdown Menu */}
                {item.submenu && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
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
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <button 
              onClick={() => setIsSearchModalOpen(true)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu or Auth Buttons */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    {user?.email || 'Người dùng'}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="py-2">
                      {userMenuItems.map((item) => (
                        item.action ? (
                          <button
                            key={item.name}
                            onClick={() => {
                              item.action();
                              setIsUserMenuOpen(false);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                          >
                            {item.name}
                          </button>
                        ) : (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/login"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Đăng nhập
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2">
              {mainMenuItems.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4 mr-3" />
                    {item.name}
                  </Link>
                  
                  {/* Mobile Submenu */}
                  {item.submenu && (
                    <div className="ml-6 mt-2 space-y-1">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
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

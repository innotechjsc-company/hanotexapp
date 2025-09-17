'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, TrendingUp, Users, Award, Zap, Plus, Target } from 'lucide-react';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results
      window.location.href = `/technologies?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const stats = [
    { icon: TrendingUp, label: 'Công nghệ', value: '500+', color: 'text-blue-600' },
    { icon: Users, label: 'Người dùng', value: '2,500+', color: 'text-blue-600' },
    { icon: Award, label: 'Giao dịch', value: '150+', color: 'text-blue-600' },
    { icon: Zap, label: 'TRL Level', value: '1-9', color: 'text-blue-600' },
  ];

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center">
          {/* Logo & Slogan */}
          <div className="mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-2xl">
                HANOTEX
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Kết nối công nghệ – Thúc đẩy đổi mới
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Sàn giao dịch công nghệ trực tuyến của thành phố Hà Nội
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-12">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm công nghệ, nhu cầu, chuyên gia..."
                  className="w-full pl-12 pr-32 py-4 text-lg border border-gray-300 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 inline-flex items-center justify-center rounded-lg px-6 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                >
                  Tìm kiếm
                </button>
              </div>
            </form>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/technologies/register"
              className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 group shadow-lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Đăng sản phẩm công nghệ
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/demands/register"
              className="inline-flex items-center justify-center rounded-lg px-8 py-4 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 border-blue-600 bg-white text-blue-600 hover:bg-blue-50 focus:ring-blue-500 group shadow-lg"
            >
              <Target className="mr-2 h-5 w-5" />
              Đăng nhu cầu công nghệ
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg mb-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-100 rounded-full opacity-20 animate-pulse" />
      <div className="absolute top-40 right-20 w-16 h-16 bg-blue-100 rounded-full opacity-20 animate-pulse animation-delay-200" />
      <div className="absolute bottom-20 left-20 w-12 h-12 bg-blue-100 rounded-full opacity-20 animate-pulse animation-delay-400" />
      <div className="absolute bottom-40 right-10 w-24 h-24 bg-blue-100 rounded-full opacity-20 animate-pulse animation-delay-600" />
    </section>
  );
}
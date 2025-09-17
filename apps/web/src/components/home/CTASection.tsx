'use client';

import Link from 'next/link';
import { ArrowRight, Rocket, Users, TrendingUp } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full opacity-10 animate-pulse" />
      <div className="absolute top-20 right-20 w-16 h-16 bg-white rounded-full opacity-10 animate-pulse animation-delay-200" />
      <div className="absolute bottom-20 left-20 w-12 h-12 bg-white rounded-full opacity-10 animate-pulse animation-delay-400" />
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-white rounded-full opacity-10 animate-pulse animation-delay-600" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Main CTA */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Sẵn sàng tham gia cộng đồng công nghệ?
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto mb-8">
              Hãy bắt đầu hành trình chuyển giao và thương mại hóa công nghệ của bạn ngay hôm nay
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 bg-white text-primary-600 hover:bg-gray-100 focus:ring-white group"
              >
                <Rocket className="mr-2 h-5 w-5" />
                Đăng ký miễn phí
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/technologies"
                className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 border-2 border-white text-white hover:bg-white hover:text-primary-600 focus:ring-white group"
              >
                Khám phá ngay
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Bắt đầu nhanh chóng
              </h3>
              <p className="text-primary-100">
                Đăng ký và đăng tải công nghệ trong vài phút
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Cộng đồng lớn
              </h3>
              <p className="text-primary-100">
                Kết nối với hàng nghìn chuyên gia công nghệ
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Tăng trưởng bền vững
              </h3>
              <p className="text-primary-100">
                Phát triển và thương mại hóa công nghệ hiệu quả
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-16 pt-8 border-t border-white border-opacity-20">
            <p className="text-primary-100 mb-4">
              Cần hỗ trợ? Liên hệ với chúng tôi
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-white">
              <a
                href="mailto:support@hanotex.com"
                className="hover:text-primary-100 transition-colors"
              >
                📧 support@hanotex.com
              </a>
              <span className="hidden sm:block">•</span>
              <a
                href="tel:+84123456789"
                className="hover:text-primary-100 transition-colors"
              >
                📞 +84 123 456 789
              </a>
              <span className="hidden sm:block">•</span>
              <span>
                🕒 24/7 Hỗ trợ
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* 404 Illustration */}
          <div className="mx-auto h-48 w-48 text-gray-400 mb-8">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              className="w-full h-full"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709"
              />
            </svg>
          </div>

          {/* Error Message */}
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Trang không tìm thấy
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Home className="h-5 w-5 mr-2" />
              Về trang chủ
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Quay lại
            </button>
          </div>

          {/* Search Suggestion */}
          <div className="mt-12">
            <p className="text-sm text-gray-500 mb-4">
              Hoặc tìm kiếm nội dung bạn cần:
            </p>
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm công nghệ, nhu cầu..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-12">
            <p className="text-sm text-gray-500 mb-4">Các trang phổ biến:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/technologies"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Công nghệ
              </Link>
              <Link
                href="/demands"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Nhu cầu
              </Link>
              <Link
                href="/auctions"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Đấu giá
              </Link>
              <Link
                href="/news"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Tin tức
              </Link>
              <Link
                href="/events"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Sự kiện
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

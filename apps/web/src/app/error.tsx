'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mx-auto h-24 w-24 text-red-500 mb-8">
            <AlertTriangle className="w-full h-full" />
          </div>

          {/* Error Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Đã xảy ra lỗi
          </h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Xin lỗi, đã có lỗi xảy ra trong quá trình xử lý. Vui lòng thử lại sau.
          </p>

          {/* Error Details (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
              <h3 className="text-sm font-medium text-red-800 mb-2">Chi tiết lỗi:</h3>
              <p className="text-sm text-red-700 font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-red-600 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Thử lại
            </button>
            
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Home className="h-5 w-5 mr-2" />
              Về trang chủ
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-12">
            <p className="text-sm text-gray-500">
              Nếu lỗi vẫn tiếp tục xảy ra, vui lòng{' '}
              <a
                href="mailto:support@hanotex.vn"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                liên hệ hỗ trợ
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

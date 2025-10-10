"use client";

import { Shield } from "lucide-react";
import { useRouter } from "next/navigation";

interface ConfidentialDetailCardProps {
  confidential_detail?: string;
  isAuthenticated: boolean;
}

export default function ConfidentialDetailCard({
  confidential_detail,
  isAuthenticated,
}: ConfidentialDetailCardProps) {
  const router = useRouter();
  if (!confidential_detail) return null;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Chi tiết kỹ thuật
        </h2>
        {!isAuthenticated && (
          <div className="flex items-center text-amber-600 text-sm">
            <Shield className="h-4 w-4 mr-1" />
            Cần đăng nhập để xem
          </div>
        )}
      </div>
      {isAuthenticated ? (
        <div
          className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{
            __html: (confidential_detail || "").replace(/\n/g, "<br>"),
          }}
        />
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600 text-center">
            Vui lòng đăng nhập để xem thông tin chi tiết về công nghệ này.
          </p>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => router.push("/auth/login")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Đăng nhập
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

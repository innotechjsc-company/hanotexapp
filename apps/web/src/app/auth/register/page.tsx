"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthActions } from "@/store/auth";
import { RegisterData, UserType } from "@/api/auth";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    user_type: "INDIVIDUAL" as UserType,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuthActions();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      setLoading(false);
      return;
    }

    // Validation mật khẩu tối thiểu
    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      setLoading(false);
      return;
    }

    try {
      // Tạo RegisterData đơn giản
      const registerData: RegisterData = {
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name || undefined,
        user_type: formData.user_type,
        role: "USER", // Mặc định là USER
      };

      await register(registerData);
      router.push(
        "/auth/login?message=Đăng ký thành công! Vui lòng đăng nhập."
      );
    } catch (err: any) {
      setError(err.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Đăng ký tài khoản
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* Basic Registration Info */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Nhập địa chỉ email"
                />
              </div>

              <div>
                <label
                  htmlFor="full_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Họ và tên
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  autoComplete="name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Nhập họ và tên đầy đủ"
                />
              </div>

              <div>
                <label
                  htmlFor="user_type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Loại tài khoản *
                </label>
                <select
                  id="user_type"
                  name="user_type"
                  required
                  value={formData.user_type}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="INDIVIDUAL">Cá nhân</option>
                  <option value="COMPANY">Doanh nghiệp</option>
                  <option value="RESEARCH_INSTITUTION">
                    Viện nghiên cứu/Trường đại học
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mật khẩu *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                  minLength={6}
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Xác nhận mật khẩu *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Nhập lại mật khẩu"
                  minLength={6}
                />
              </div>
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Lưu ý</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Sau khi đăng ký, bạn có thể cập nhật thông tin chi tiết
                      trong phần hồ sơ cá nhân. Thông tin đầy đủ sẽ giúp tăng độ
                      tin cậy và cơ hội giao dịch trên nền tảng.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Đang đăng ký..." : "Đăng ký tài khoản"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

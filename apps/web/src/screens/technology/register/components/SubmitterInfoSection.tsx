import React from "react";
import { User } from "@/types";

interface SubmitterInfoSectionProps {
  submitter: User;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export const SubmitterInfoSection: React.FC<SubmitterInfoSectionProps> = ({
  submitter,
  onChange,
}) => {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          1. Thông tin người đăng *
        </h2>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="submitter.user_type"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Loại người đăng
            </label>
            <select
              id="submitter.user_type"
              name="submitter.user_type"
              value={submitter.user_type}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="INDIVIDUAL">Cá nhân</option>
              <option value="COMPANY">Doanh nghiệp</option>
              <option value="RESEARCH_INSTITUTION">Viện/Trường</option>
            </select>
          </div>

          {/* Common fields */}
          <div>
            <label
              htmlFor="submitter.email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email *
            </label>
            <input
              type="email"
              id="submitter.email"
              name="submitter.email"
              required
              value={submitter.email}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập email"
            />
          </div>

          <div>
            <label
              htmlFor="submitter.phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Số điện thoại
            </label>
            <input
              type="tel"
              id="submitter.phone"
              name="submitter.phone"
              value={submitter.phone}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập số điện thoại"
            />
          </div>

          {/* Individual fields */}
          {submitter.user_type === "INDIVIDUAL" && (
            <>
              <div>
                <label
                  htmlFor="submitter.full_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Họ tên *
                </label>
                <input
                  type="text"
                  id="submitter.full_name"
                  name="submitter.full_name"
                  required
                  value={submitter.full_name}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập họ tên"
                />
              </div>
              <div>
                <label
                  htmlFor="submitter.profession"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nghề nghiệp / Chức danh
                </label>
                <input
                  type="text"
                  id="submitter.profession"
                  name="submitter.profession"
                  value={submitter.profession}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhà nghiên cứu / Founder"
                />
              </div>
            </>
          )}

          {/* Company fields */}
          {submitter.user_type === "COMPANY" && (
            <>
              <div>
                <label
                  htmlFor="submitter.full_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tên doanh nghiệp *
                </label>
                <input
                  type="text"
                  id="submitter.full_name"
                  name="submitter.full_name"
                  required
                  value={submitter.full_name}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Công ty ABC"
                />
              </div>
            </>
          )}

          {/* Research Institution fields */}
          {submitter.user_type === "RESEARCH_INSTITUTION" && (
            <>
              <div>
                <label
                  htmlFor="submitter.full_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tên viện/trường *
                </label>
                <input
                  type="text"
                  id="submitter.full_name"
                  name="submitter.full_name"
                  required
                  value={submitter.full_name}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Trường/Viện XYZ"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

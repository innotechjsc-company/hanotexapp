import React from "react";
import { Submitter } from "../types";

interface SubmitterInfoSectionProps {
  submitter: Submitter;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
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
              htmlFor="submitter.submitterType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Loại người đăng
            </label>
            <select
              id="submitter.submitterType"
              name="submitter.submitterType"
              value={submitter.submitterType}
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
          {submitter.submitterType === "INDIVIDUAL" && (
            <>
              <div>
                <label
                  htmlFor="submitter.fullName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Họ tên *
                </label>
                <input
                  type="text"
                  id="submitter.fullName"
                  name="submitter.fullName"
                  required
                  value={submitter.fullName}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập họ tên"
                />
              </div>
              <div>
                <label
                  htmlFor="submitter.position"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nghề nghiệp / Chức danh
                </label>
                <input
                  type="text"
                  id="submitter.position"
                  name="submitter.position"
                  value={submitter.position}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhà nghiên cứu / Founder"
                />
              </div>
              <div>
                <label
                  htmlFor="submitter.organization"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tổ chức / Công ty
                </label>
                <input
                  type="text"
                  id="submitter.organization"
                  name="submitter.organization"
                  value={submitter.organization}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập tên tổ chức"
                />
              </div>
            </>
          )}

          {/* Company fields */}
          {submitter.submitterType === "COMPANY" && (
            <>
              <div>
                <label
                  htmlFor="submitter.fullName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tên doanh nghiệp *
                </label>
                <input
                  type="text"
                  id="submitter.fullName"
                  name="submitter.fullName"
                  required
                  value={submitter.fullName}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Công ty ABC"
                />
              </div>
              <div>
                <label
                  htmlFor="submitter.taxCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mã số thuế
                </label>
                <input
                  type="text"
                  id="submitter.taxCode"
                  name="submitter.taxCode"
                  value={submitter.taxCode || ""}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="010xxxxxxx"
                />
              </div>
              <div>
                <label
                  htmlFor="submitter.businessLicense"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Giấy ĐKKD
                </label>
                <input
                  type="text"
                  id="submitter.businessLicense"
                  name="submitter.businessLicense"
                  value={submitter.businessLicense || ""}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Số/Ngày cấp"
                />
              </div>
              <div>
                <label
                  htmlFor="submitter.legalRepresentative"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Người đại diện pháp luật
                </label>
                <input
                  type="text"
                  id="submitter.legalRepresentative"
                  name="submitter.legalRepresentative"
                  value={submitter.legalRepresentative || ""}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nguyễn Văn B"
                />
              </div>
            </>
          )}

          {/* Research Institution fields */}
          {submitter.submitterType === "RESEARCH_INSTITUTION" && (
            <>
              <div>
                <label
                  htmlFor="submitter.fullName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tên viện/trường *
                </label>
                <input
                  type="text"
                  id="submitter.fullName"
                  name="submitter.fullName"
                  required
                  value={submitter.fullName}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Trường/Viện XYZ"
                />
              </div>
              <div>
                <label
                  htmlFor="submitter.unitCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mã số đơn vị
                </label>
                <input
                  type="text"
                  id="submitter.unitCode"
                  name="submitter.unitCode"
                  value={submitter.unitCode || ""}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="..."
                />
              </div>
              <div>
                <label
                  htmlFor="submitter.managingAgency"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Cơ quan chủ quản
                </label>
                <input
                  type="text"
                  id="submitter.managingAgency"
                  name="submitter.managingAgency"
                  value={submitter.managingAgency || ""}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Bộ/UBND ..."
                />
              </div>
              <div>
                <label
                  htmlFor="submitter.researchTaskCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mã số nhiệm vụ KH&CN
                </label>
                <input
                  type="text"
                  id="submitter.researchTaskCode"
                  name="submitter.researchTaskCode"
                  value={submitter.researchTaskCode || ""}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="VD: KC.01.xx.yyyy"
                />
              </div>
              <div>
                <label
                  htmlFor="submitter.researchTeam"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nhóm nghiên cứu/Chủ nhiệm
                </label>
                <input
                  type="text"
                  id="submitter.researchTeam"
                  name="submitter.researchTeam"
                  value={submitter.researchTeam || ""}
                  onChange={onChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="TS. ..."
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
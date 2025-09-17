'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthActions } from '@/store/auth';

type UserType = 'INDIVIDUAL' | 'COMPANY' | 'RESEARCH_INSTITUTION';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'INDIVIDUAL' as UserType,
    // Individual profile
    fullName: '',
    idNumber: '',
    phone: '',
    profession: '',
    // Company profile
    companyName: '',
    taxCode: '',
    businessLicense: '',
    legalRepresentative: '',
    contactEmail: '',
    // Research profile
    institutionName: '',
    institutionCode: '',
    governingBody: '',
    researchTaskCode: '',
    acceptanceReport: '',
    researchGroup: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuthActions();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      setLoading(false);
      return;
    }

    try {
      const profile = getProfileData();
      await register(formData.email, formData.password, formData.userType, profile);
      router.push('/auth/login?message=Đăng ký thành công');
    } catch (err: any) {
      setError(err.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  const getProfileData = () => {
    switch (formData.userType) {
      case 'INDIVIDUAL':
        return {
          full_name: formData.fullName,
          id_number: formData.idNumber,
          phone: formData.phone,
          profession: formData.profession
        };
      case 'COMPANY':
        return {
          company_name: formData.companyName,
          tax_code: formData.taxCode,
          business_license: formData.businessLicense,
          legal_representative: formData.legalRepresentative,
          contact_email: formData.contactEmail
        };
      case 'RESEARCH_INSTITUTION':
        return {
          institution_name: formData.institutionName,
          institution_code: formData.institutionCode,
          governing_body: formData.governingBody,
          research_task_code: formData.researchTaskCode,
          acceptance_report: formData.acceptanceReport,
          research_group: formData.researchGroup
        };
      default:
        return {};
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const renderProfileFields = () => {
    switch (formData.userType) {
      case 'INDIVIDUAL':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Họ và tên *
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Nhập họ và tên"
              />
            </div>
            <div>
              <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">
                Số CMND/CCCD
              </label>
              <input
                id="idNumber"
                name="idNumber"
                type="text"
                value={formData.idNumber}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Nhập số CMND/CCCD"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Số điện thoại
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div>
              <label htmlFor="profession" className="block text-sm font-medium text-gray-700">
                Nghề nghiệp
              </label>
              <input
                id="profession"
                name="profession"
                type="text"
                value={formData.profession}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Nhập nghề nghiệp"
              />
            </div>
          </div>
        );
      
      case 'COMPANY':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                Tên công ty *
              </label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                required
                value={formData.companyName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Nhập tên công ty"
              />
            </div>
            <div>
              <label htmlFor="taxCode" className="block text-sm font-medium text-gray-700">
                Mã số thuế
              </label>
              <input
                id="taxCode"
                name="taxCode"
                type="text"
                value={formData.taxCode}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Nhập mã số thuế"
              />
            </div>
            <div>
              <label htmlFor="legalRepresentative" className="block text-sm font-medium text-gray-700">
                Người đại diện pháp luật
              </label>
              <input
                id="legalRepresentative"
                name="legalRepresentative"
                type="text"
                value={formData.legalRepresentative}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Nhập tên người đại diện"
              />
            </div>
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                Email liên hệ
              </label>
              <input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Nhập email liên hệ"
              />
            </div>
          </div>
        );
      
      case 'RESEARCH_INSTITUTION':
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700">
                Tên viện/trường *
              </label>
              <input
                id="institutionName"
                name="institutionName"
                type="text"
                required
                value={formData.institutionName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Nhập tên viện/trường"
              />
            </div>
            <div>
              <label htmlFor="institutionCode" className="block text-sm font-medium text-gray-700">
                Mã viện/trường
              </label>
              <input
                id="institutionCode"
                name="institutionCode"
                type="text"
                value={formData.institutionCode}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Nhập mã viện/trường"
              />
            </div>
            <div>
              <label htmlFor="governingBody" className="block text-sm font-medium text-gray-700">
                Cơ quan chủ quản
              </label>
              <input
                id="governingBody"
                name="governingBody"
                type="text"
                value={formData.governingBody}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Nhập cơ quan chủ quản"
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
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
              Đã có tài khoản?{' '}
              <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-500">
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

            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Thông tin cơ bản</h3>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Nhập email"
                />
              </div>

              <div>
                <label htmlFor="userType" className="block text-sm font-medium text-gray-700">
                  Loại tài khoản *
                </label>
                <select
                  id="userType"
                  name="userType"
                  required
                  value={formData.userType}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="INDIVIDUAL">Cá nhân</option>
                  <option value="COMPANY">Doanh nghiệp</option>
                  <option value="RESEARCH_INSTITUTION">Viện/Trường</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Mật khẩu *
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Nhập mật khẩu"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Xác nhận mật khẩu *
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Nhập lại mật khẩu"
                  />
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Thông tin chi tiết</h3>
              {renderProfileFields()}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang đăng ký...' : 'Đăng ký'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

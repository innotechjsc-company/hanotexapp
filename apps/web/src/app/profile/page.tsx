'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit,
  Save,
  X,
  Shield,
  Award,
  FileText
} from 'lucide-react';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    profession: '',
    companyName: '',
    taxCode: '',
    legalRepresentative: '',
    contactEmail: '',
    institutionName: '',
    institutionCode: '',
    governingBody: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Load user profile data
    if (user) {
      setProfileData({
        fullName: user.profile?.full_name || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        profession: user.profile?.profession || '',
        companyName: user.profile?.company_name || '',
        taxCode: user.profile?.tax_code || '',
        legalRepresentative: user.profile?.legal_representative || '',
        contactEmail: user.profile?.contact_email || '',
        institutionName: user.profile?.institution_name || '',
        institutionCode: user.profile?.institution_code || '',
        governingBody: user.profile?.governing_body || ''
      });
    }
  }, [user, isAuthenticated, router]);

  const handleSave = async () => {
    try {
      // TODO: Implement profile update API call
      console.log('Saving profile:', profileData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleCancel = () => {
    // Reset to original data
    if (user) {
      setProfileData({
        fullName: user.profile?.full_name || '',
        email: user.email || '',
        phone: user.profile?.phone || '',
        profession: user.profile?.profession || '',
        companyName: user.profile?.company_name || '',
        taxCode: user.profile?.tax_code || '',
        legalRepresentative: user.profile?.legal_representative || '',
        contactEmail: user.profile?.contact_email || '',
        institutionName: user.profile?.institution_name || '',
        institutionCode: user.profile?.institution_code || '',
        governingBody: user.profile?.governing_body || ''
      });
    }
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case 'INDIVIDUAL': return 'Cá nhân';
      case 'COMPANY': return 'Doanh nghiệp';
      case 'RESEARCH_INSTITUTION': return 'Viện/Trường';
      default: return type;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'USER': return 'Người dùng';
      case 'ADMIN': return 'Quản trị viên';
      case 'MODERATOR': return 'Điều hành viên';
      case 'SUPPORT': return 'Hỗ trợ';
      default: return role;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h1>
              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Hủy
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Lưu
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Chỉnh sửa
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-12 w-12" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {profileData.fullName || user.email}
                </h2>
                <p className="text-gray-600">{user.email}</p>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <Shield className="h-4 w-4 mr-2" />
                    {getUserTypeLabel(user.user_type)}
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <Award className="h-4 w-4 mr-2" />
                    {getRoleLabel(user.role)}
                  </div>
                  <div className="flex items-center justify-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Tham gia: {new Date(user.created_at).toLocaleDateString('vi-VN')}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white shadow rounded-lg p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Công nghệ đã đăng</span>
                  <span className="text-sm font-medium text-gray-900">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Nhu cầu đã đăng</span>
                  <span className="text-sm font-medium text-gray-900">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Đấu giá tham gia</span>
                  <span className="text-sm font-medium text-gray-900">0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Thông tin chi tiết</h3>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900 flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Thông tin cơ bản
                    </h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Họ và tên
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="fullName"
                          value={profileData.fullName}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{profileData.fullName || 'Chưa cập nhật'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <p className="text-sm text-gray-900 flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {profileData.email}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-sm text-gray-900 flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          {profileData.phone || 'Chưa cập nhật'}
                        </p>
                      )}
                    </div>

                    {user.user_type === 'INDIVIDUAL' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nghề nghiệp
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="profession"
                            value={profileData.profession}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{profileData.profession || 'Chưa cập nhật'}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Organization Information */}
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900 flex items-center">
                      <Building2 className="h-5 w-5 mr-2" />
                      Thông tin tổ chức
                    </h4>

                    {user.user_type === 'COMPANY' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên công ty
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="companyName"
                              value={profileData.companyName}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          ) : (
                            <p className="text-sm text-gray-900">{profileData.companyName || 'Chưa cập nhật'}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mã số thuế
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="taxCode"
                              value={profileData.taxCode}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          ) : (
                            <p className="text-sm text-gray-900">{profileData.taxCode || 'Chưa cập nhật'}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Người đại diện pháp luật
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="legalRepresentative"
                              value={profileData.legalRepresentative}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          ) : (
                            <p className="text-sm text-gray-900">{profileData.legalRepresentative || 'Chưa cập nhật'}</p>
                          )}
                        </div>
                      </>
                    )}

                    {user.user_type === 'RESEARCH_INSTITUTION' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên viện/trường
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="institutionName"
                              value={profileData.institutionName}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          ) : (
                            <p className="text-sm text-gray-900">{profileData.institutionName || 'Chưa cập nhật'}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Mã viện/trường
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="institutionCode"
                              value={profileData.institutionCode}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          ) : (
                            <p className="text-sm text-gray-900">{profileData.institutionCode || 'Chưa cập nhật'}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cơ quan chủ quản
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              name="governingBody"
                              value={profileData.governingBody}
                              onChange={handleChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          ) : (
                            <p className="text-sm text-gray-900">{profileData.governingBody || 'Chưa cập nhật'}</p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

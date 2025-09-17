import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button, Input } from '@/components/ui';
import { useAuthStore } from '@/store/auth';
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

interface ProfileFormProps {
  onSave?: (data: any) => Promise<void>;
  onCancel?: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSave, onCancel }) => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
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
  }, [user]);

  const handleSave = async () => {
    setLoading(true);
    try {
      if (onSave) {
        await onSave(profileData);
      } else {
        // Default save behavior
        updateUser({ profile: profileData });
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
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
    onCancel?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!user) return null;

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
    <div className="space-y-6">
      {/* Profile Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center">
              <User className="h-10 w-10" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">
                {profileData.fullName || user.email}
              </h2>
              <p className="text-gray-600">{user.email}</p>
              
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="h-4 w-4 mr-1" />
                  {getUserTypeLabel(user.user_type)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Award className="h-4 w-4 mr-1" />
                  {getRoleLabel(user.role)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  Tham gia: {new Date(user.created_at).toLocaleDateString('vi-VN')}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    icon={<X className="h-4 w-4" />}
                  >
                    Hủy
                  </Button>
                  <Button
                    loading={loading}
                    onClick={handleSave}
                    icon={<Save className="h-4 w-4" />}
                  >
                    Lưu
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  icon={<Edit className="h-4 w-4" />}
                >
                  Chỉnh sửa
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader 
            title="Thông tin cơ bản"
            icon={<User className="h-5 w-5" />}
          />
          <CardContent className="space-y-4">
            <Input
              label="Họ và tên"
              name="fullName"
              value={profileData.fullName}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Nhập họ và tên"
            />

            <Input
              label="Email"
              name="email"
              value={profileData.email}
              disabled
              icon={<Mail className="h-4 w-4" />}
            />

            <Input
              label="Số điện thoại"
              name="phone"
              value={profileData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Nhập số điện thoại"
              icon={<Phone className="h-4 w-4" />}
            />

            {user.user_type === 'INDIVIDUAL' && (
              <Input
                label="Nghề nghiệp"
                name="profession"
                value={profileData.profession}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Nhập nghề nghiệp"
              />
            )}
          </CardContent>
        </Card>

        {/* Organization Information */}
        <Card>
          <CardHeader 
            title="Thông tin tổ chức"
            icon={<Building2 className="h-5 w-5" />}
          />
          <CardContent className="space-y-4">
            {user.user_type === 'COMPANY' && (
              <>
                <Input
                  label="Tên công ty"
                  name="companyName"
                  value={profileData.companyName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Nhập tên công ty"
                />

                <Input
                  label="Mã số thuế"
                  name="taxCode"
                  value={profileData.taxCode}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Nhập mã số thuế"
                />

                <Input
                  label="Người đại diện pháp luật"
                  name="legalRepresentative"
                  value={profileData.legalRepresentative}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Nhập tên người đại diện"
                />
              </>
            )}

            {user.user_type === 'RESEARCH_INSTITUTION' && (
              <>
                <Input
                  label="Tên viện/trường"
                  name="institutionName"
                  value={profileData.institutionName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Nhập tên viện/trường"
                />

                <Input
                  label="Mã viện/trường"
                  name="institutionCode"
                  value={profileData.institutionCode}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Nhập mã viện/trường"
                />

                <Input
                  label="Cơ quan chủ quản"
                  name="governingBody"
                  value={profileData.governingBody}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Nhập cơ quan chủ quản"
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileForm;



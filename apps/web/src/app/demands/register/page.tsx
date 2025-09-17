'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { 
  ArrowLeft,
  Save,
  Eye,
  Plus,
  Trash2,
  AlertCircle
} from 'lucide-react';

export default function RegisterDemandPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    budget: '',
    currency: 'VND',
    deadline: '',
    location: '',
    contactInfo: {
      contactPerson: '',
      email: '',
      phone: '',
      company: ''
    },
    requirements: {
      trlLevel: '',
      technologyType: '',
      specificRequirements: '',
      preferredPartners: '',
      timeline: ''
    }
  });

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/auth/login');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // TODO: Implement demand registration API call
      console.log('Submitting demand:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess('Nhu cầu đã được đăng ký thành công!');
      setFormData({
        title: '',
        description: '',
        categoryId: '',
        budget: '',
        currency: 'VND',
        deadline: '',
        location: '',
        contactInfo: {
          contactPerson: '',
          email: '',
          phone: '',
          company: ''
        },
        requirements: {
          trlLevel: '',
          technologyType: '',
          specificRequirements: '',
          preferredPartners: '',
          timeline: ''
        }
      });
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi đăng ký nhu cầu');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Đăng nhu cầu công nghệ</h1>
                  <p className="text-gray-600">Đăng nhu cầu tìm kiếm công nghệ lên sàn giao dịch HANOTEX</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Xem trước
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
              {success}
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Thông tin cơ bản</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề nhu cầu *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập tiêu đề nhu cầu"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả chi tiết *
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mô tả chi tiết về nhu cầu công nghệ của bạn"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                    Danh mục *
                  </label>
                  <select
                    id="categoryId"
                    name="categoryId"
                    required
                    value={formData.categoryId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Chọn danh mục</option>
                    <option value="550e8400-e29b-41d4-a716-446655440001">Công nghệ thông tin</option>
                    <option value="550e8400-e29b-41d4-a716-446655440002">Công nghệ sinh học</option>
                    <option value="550e8400-e29b-41d4-a716-446655440003">Vật liệu mới</option>
                    <option value="550e8400-e29b-41d4-a716-446655440004">Năng lượng</option>
                    <option value="550e8400-e29b-41d4-a716-446655440005">Môi trường</option>
                    <option value="550e8400-e29b-41d4-a716-446655440006">Y tế</option>
                    <option value="550e8400-e29b-41d4-a716-446655440007">Nông nghiệp</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Địa điểm
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập địa điểm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                    Ngân sách
                  </label>
                  <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập ngân sách"
                  />
                </div>

                <div>
                  <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                    Đơn vị tiền tệ
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="VND">VNĐ</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                    Thời hạn
                  </label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Thông tin liên hệ</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contactInfo.contactPerson" className="block text-sm font-medium text-gray-700 mb-1">
                    Người liên hệ *
                  </label>
                  <input
                    type="text"
                    id="contactInfo.contactPerson"
                    name="contactInfo.contactPerson"
                    required
                    value={formData.contactInfo.contactPerson}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập tên người liên hệ"
                  />
                </div>

                <div>
                  <label htmlFor="contactInfo.company" className="block text-sm font-medium text-gray-700 mb-1">
                    Công ty/Tổ chức
                  </label>
                  <input
                    type="text"
                    id="contactInfo.company"
                    name="contactInfo.company"
                    value={formData.contactInfo.company}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập tên công ty/tổ chức"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contactInfo.email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="contactInfo.email"
                    name="contactInfo.email"
                    required
                    value={formData.contactInfo.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập email liên hệ"
                  />
                </div>

                <div>
                  <label htmlFor="contactInfo.phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    id="contactInfo.phone"
                    name="contactInfo.phone"
                    value={formData.contactInfo.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Yêu cầu kỹ thuật</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="requirements.trlLevel" className="block text-sm font-medium text-gray-700 mb-1">
                    Mức độ phát triển (TRL)
                  </label>
                  <select
                    id="requirements.trlLevel"
                    name="requirements.trlLevel"
                    value={formData.requirements.trlLevel}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Chọn mức độ TRL</option>
                    <option value="1">TRL 1 - Nguyên lý cơ bản</option>
                    <option value="2">TRL 2 - Khái niệm công nghệ</option>
                    <option value="3">TRL 3 - Bằng chứng khái niệm</option>
                    <option value="4">TRL 4 - Xác thực trong phòng thí nghiệm</option>
                    <option value="5">TRL 5 - Xác thực trong môi trường liên quan</option>
                    <option value="6">TRL 6 - Trình diễn trong môi trường liên quan</option>
                    <option value="7">TRL 7 - Trình diễn trong môi trường vận hành</option>
                    <option value="8">TRL 8 - Hệ thống hoàn chỉnh và đủ điều kiện</option>
                    <option value="9">TRL 9 - Hệ thống thực tế được chứng minh</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="requirements.technologyType" className="block text-sm font-medium text-gray-700 mb-1">
                    Loại công nghệ
                  </label>
                  <input
                    type="text"
                    id="requirements.technologyType"
                    name="requirements.technologyType"
                    value={formData.requirements.technologyType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập loại công nghệ cần tìm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="requirements.specificRequirements" className="block text-sm font-medium text-gray-700 mb-1">
                  Yêu cầu cụ thể
                </label>
                <textarea
                  id="requirements.specificRequirements"
                  name="requirements.specificRequirements"
                  rows={4}
                  value={formData.requirements.specificRequirements}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Mô tả các yêu cầu cụ thể về công nghệ"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="requirements.preferredPartners" className="block text-sm font-medium text-gray-700 mb-1">
                    Đối tác ưu tiên
                  </label>
                  <input
                    type="text"
                    id="requirements.preferredPartners"
                    name="requirements.preferredPartners"
                    value={formData.requirements.preferredPartners}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Loại đối tác ưu tiên"
                  />
                </div>

                <div>
                  <label htmlFor="requirements.timeline" className="block text-sm font-medium text-gray-700 mb-1">
                    Thời gian thực hiện
                  </label>
                  <input
                    type="text"
                    id="requirements.timeline"
                    name="requirements.timeline"
                    value={formData.requirements.timeline}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ví dụ: 3-6 tháng"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Đăng nhu cầu
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

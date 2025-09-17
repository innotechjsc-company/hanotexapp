'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { 
  ArrowLeft,
  Share2,
  Heart,
  MessageCircle,
  Calendar,
  MapPin,
  User,
  Building2,
  DollarSign,
  Eye,
  Star,
  Download,
  Phone,
  Mail,
  ExternalLink,
  Shield,
  Award,
  Clock
} from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Technology {
  id: string;
  title: string;
  public_summary: string;
  confidential_detail?: string;
  trl_level: number;
  status: string;
  visibility_mode: string;
  created_at: string;
  updated_at: string;
  category: {
    id: string;
    name: string;
  };
  owner: {
    id: string;
    email: string;
    user_type: string;
    profile: any;
  };
  pricing?: {
    pricing_type: string;
    asking_price?: number;
    currency: string;
  };
  ip_details?: Array<{
    ip_type: string;
    ip_number: string;
    status: string;
    territory: string;
  }>;
  owners?: Array<{
    owner_type: string;
    owner_name: string;
    ownership_percentage: number;
  }>;
}

export default function TechnologyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [technology, setTechnology] = useState<Technology | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  useEffect(() => {
    const fetchTechnology = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/v1/technologies/${params.id}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          setTechnology(data.data);
        } else {
          setError('Không tìm thấy công nghệ');
        }
      } catch (err) {
        console.error('Error fetching technology:', err);
        setError('Có lỗi xảy ra khi tải thông tin công nghệ');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchTechnology();
    }
  }, [params.id]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement contact form submission
    console.log('Contact form submitted:', contactForm);
    setShowContactForm(false);
    setContactForm({
      name: '',
      email: '',
      phone: '',
      company: '',
      message: ''
    });
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const getTrlLabel = (level: number) => {
    const trlLabels = {
      1: 'Nguyên lý cơ bản',
      2: 'Khái niệm công nghệ',
      3: 'Bằng chứng khái niệm',
      4: 'Xác thực trong phòng thí nghiệm',
      5: 'Xác thực trong môi trường liên quan',
      6: 'Trình diễn trong môi trường liên quan',
      7: 'Trình diễn trong môi trường vận hành',
      8: 'Hệ thống hoàn chỉnh và đủ điều kiện',
      9: 'Hệ thống thực tế được chứng minh'
    };
    return trlLabels[level as keyof typeof trlLabels] || `TRL ${level}`;
  };

  const getStatusLabel = (status: string) => {
    const statusLabels = {
      'DRAFT': 'Bản nháp',
      'PENDING': 'Chờ phê duyệt',
      'APPROVED': 'Đã phê duyệt',
      'REJECTED': 'Đã từ chối',
      'ACTIVE': 'Đang hoạt động',
      'INACTIVE': 'Không hoạt động'
    };
    return statusLabels[status as keyof typeof statusLabels] || status;
  };

  const getStatusColor = (status: string) => {
    const statusColors = {
      'DRAFT': 'bg-gray-100 text-gray-800',
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'ACTIVE': 'bg-blue-100 text-blue-800',
      'INACTIVE': 'bg-gray-100 text-gray-800'
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !technology) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">{error}</div>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{technology.title}</h1>
                <div className="flex items-center space-x-4 mt-1">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(technology.status)}`}>
                    {getStatusLabel(technology.status)}
                  </span>
                  <span className="text-sm text-gray-600">
                    {technology.category.name}
                  </span>
                  <span className="text-sm text-gray-600">
                    TRL {technology.trl_level} - {getTrlLabel(technology.trl_level)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <Heart className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tóm tắt công nghệ</h2>
              <p className="text-gray-700 leading-relaxed">{technology.public_summary}</p>
            </div>

            {/* Detailed Information */}
            {technology.confidential_detail && (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Chi tiết kỹ thuật</h2>
                  {!isAuthenticated && (
                    <div className="flex items-center text-amber-600 text-sm">
                      <Shield className="h-4 w-4 mr-1" />
                      Cần đăng nhập để xem
                    </div>
                  )}
                </div>
                {isAuthenticated ? (
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">{technology.confidential_detail}</p>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-600 text-center">
                      Vui lòng đăng nhập để xem thông tin chi tiết về công nghệ này.
                    </p>
                    <div className="flex justify-center mt-4">
                      <button
                        onClick={() => router.push('/auth/login')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Đăng nhập
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* IP Details */}
            {technology.ip_details && technology.ip_details.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Thông tin sở hữu trí tuệ</h2>
                <div className="space-y-4">
                  {technology.ip_details.map((ip, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-sm font-medium text-gray-600">Loại IP:</span>
                          <p className="text-gray-900">{ip.ip_type}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">Số hiệu:</span>
                          <p className="text-gray-900">{ip.ip_number}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">Trạng thái:</span>
                          <p className="text-gray-900">{ip.status}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">Lãnh thổ:</span>
                          <p className="text-gray-900">{ip.territory}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technology Owners */}
            {technology.owners && technology.owners.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Chủ sở hữu công nghệ</h2>
                <div className="space-y-3">
                  {technology.owners.map((owner, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{owner.owner_name}</p>
                        <p className="text-sm text-gray-600">{owner.owner_type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{owner.ownership_percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin liên hệ</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {technology.owner.profile?.full_name || technology.owner.profile?.company_name || 'Chưa cập nhật'}
                    </p>
                    <p className="text-sm text-gray-600">{technology.owner.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-gray-400 mr-3" />
                  <p className="text-sm text-gray-600">
                    {technology.owner.user_type === 'INDIVIDUAL' ? 'Cá nhân' : 
                     technology.owner.user_type === 'COMPANY' ? 'Doanh nghiệp' : 'Viện/Trường'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setShowContactForm(true)}
                className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Liên hệ
              </button>
            </div>

            {/* Pricing Information */}
            {technology.pricing && (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin giá</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Loại định giá:</span>
                    <span className="text-sm text-gray-900">{technology.pricing.pricing_type}</span>
                  </div>
                  {technology.pricing.asking_price && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Giá yêu cầu:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {technology.pricing.asking_price.toLocaleString()} {technology.pricing.currency}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Technology Details */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Chi tiết công nghệ</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Mức độ TRL:</span>
                  <span className="text-sm text-gray-900">TRL {technology.trl_level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Danh mục:</span>
                  <span className="text-sm text-gray-900">{technology.category.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Trạng thái:</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(technology.status)}`}>
                    {getStatusLabel(technology.status)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Ngày tạo:</span>
                  <span className="text-sm text-gray-900">
                    {new Date(technology.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Liên hệ về công nghệ</h3>
            </div>
            <form onSubmit={handleContactSubmit} className="p-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={contactForm.name}
                  onChange={handleContactChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={contactForm.email}
                  onChange={handleContactChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={contactForm.phone}
                  onChange={handleContactChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Công ty/Tổ chức
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={contactForm.company}
                  onChange={handleContactChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Tin nhắn *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={contactForm.message}
                  onChange={handleContactChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập tin nhắn của bạn..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Gửi tin nhắn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

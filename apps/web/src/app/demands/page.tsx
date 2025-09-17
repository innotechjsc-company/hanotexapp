'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/store/auth';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  SortAsc, 
  SortDesc,
  MapPin,
  Calendar,
  Eye,
  DollarSign,
  Clock,
  Users,
  ArrowRight,
  Plus,
  Send
} from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import apiClient from '@/lib/api';

interface Demand {
  id: number;
  title: string;
  description: string;
  location: string;
  budget: string;
  deadline: string;
  category: string;
  views: number;
  status: 'ACTIVE' | 'FULFILLED' | 'EXPIRED';
  created_at: string;
  company_name: string;
}

export default function DemandsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [demands, setDemands] = useState<Demand[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState({
    category: '',
    budget_range: '',
    status: 'ACTIVE'
  });

  // Mock data for demands
  const mockDemands: Demand[] = [
    {
      id: 1,
      title: 'Tìm kiếm công nghệ AI cho chẩn đoán y tế',
      description: 'Doanh nghiệp y tế cần công nghệ AI để phân tích hình ảnh X-quang và MRI, hỗ trợ chẩn đoán bệnh lý một cách chính xác và nhanh chóng.',
      location: 'Hà Nội',
      budget: '500M - 1B VNĐ',
      deadline: '30 ngày',
      category: 'Y tế',
      views: 156,
      status: 'ACTIVE',
      created_at: '2025-01-15',
      company_name: 'Bệnh viện Đa khoa Hà Nội'
    },
    {
      id: 2,
      title: 'Công nghệ xử lý nước thải công nghiệp',
      description: 'Nhà máy sản xuất cần giải pháp xử lý nước thải hiệu quả, tiết kiệm năng lượng và thân thiện với môi trường.',
      location: 'Bắc Ninh',
      budget: '200M - 500M VNĐ',
      deadline: '45 ngày',
      category: 'Môi trường',
      views: 89,
      status: 'ACTIVE',
      created_at: '2025-01-14',
      company_name: 'Công ty TNHH Sản xuất ABC'
    },
    {
      id: 3,
      title: 'Hệ thống IoT cho nông nghiệp thông minh',
      description: 'Nông trại cần hệ thống giám sát và điều khiển tự động cho canh tác, bao gồm cảm biến độ ẩm, nhiệt độ và hệ thống tưới tiêu.',
      location: 'Hưng Yên',
      budget: '100M - 300M VNĐ',
      deadline: '60 ngày',
      category: 'Nông nghiệp',
      views: 234,
      status: 'ACTIVE',
      created_at: '2025-01-13',
      company_name: 'Nông trại Thông minh XYZ'
    },
    {
      id: 4,
      title: 'Công nghệ blockchain cho chuỗi cung ứng',
      description: 'Doanh nghiệp logistics cần ứng dụng blockchain để theo dõi và minh bạch hóa chuỗi cung ứng sản phẩm.',
      location: 'TP. Hồ Chí Minh',
      budget: '300M - 800M VNĐ',
      deadline: '90 ngày',
      category: 'Công nghệ thông tin',
      views: 178,
      status: 'ACTIVE',
      created_at: '2025-01-12',
      company_name: 'Công ty Logistics DEF'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchDemands = async () => {
      setLoading(true);
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDemands(mockDemands);
      setLoading(false);
    };

    fetchDemands();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter demands based on search query
    const filtered = mockDemands.filter(demand =>
      demand.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      demand.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      demand.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setDemands(filtered);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortOrder('DESC');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'FULFILLED': return 'bg-blue-100 text-blue-800';
      case 'EXPIRED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Đang tìm kiếm';
      case 'FULFILLED': return 'Đã tìm thấy';
      case 'EXPIRED': return 'Hết hạn';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Nhu cầu công nghệ
            </h1>
            <p className="text-gray-600">
              Khám phá các nhu cầu công nghệ từ doanh nghiệp và tổ chức
            </p>
          </div>
          <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-5 w-5 mr-2" />
            Đăng nhu cầu
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm nhu cầu công nghệ..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tìm kiếm
              </button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả danh mục</option>
                  <option value="Y tế">Y tế</option>
                  <option value="Môi trường">Môi trường</option>
                  <option value="Nông nghiệp">Nông nghiệp</option>
                  <option value="Công nghệ thông tin">Công nghệ thông tin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngân sách
                </label>
                <select
                  value={filters.budget_range}
                  onChange={(e) => setFilters({...filters, budget_range: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả ngân sách</option>
                  <option value="0-100M">Dưới 100M VNĐ</option>
                  <option value="100M-500M">100M - 500M VNĐ</option>
                  <option value="500M-1B">500M - 1B VNĐ</option>
                  <option value="1B+">Trên 1B VNĐ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ACTIVE">Đang tìm kiếm</option>
                  <option value="FULFILLED">Đã tìm thấy</option>
                  <option value="EXPIRED">Hết hạn</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <p className="text-gray-600">
              Tìm thấy <span className="font-semibold">{demands.length}</span> nhu cầu
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleSort('created_at')}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'created_at' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Ngày tạo
                {sortBy === 'created_at' && (
                  sortOrder === 'ASC' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                )}
              </button>
              
              <button
                onClick={() => handleSort('deadline')}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'deadline' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Hạn chót
                {sortBy === 'deadline' && (
                  sortOrder === 'ASC' ? <SortAsc className="ml-1 h-4 w-4" /> : <SortDesc className="ml-1 h-4 w-4" />
                )}
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Demands Grid/List */}
        {demands.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            {demands.map((demand) => (
              <div
                key={demand.id}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow ${
                  viewMode === 'list' ? 'p-6' : 'p-6'
                }`}
              >
                {viewMode === 'grid' ? (
                  // Grid View
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {demand.category}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(demand.status)}`}>
                        {getStatusText(demand.status)}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {demand.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {demand.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{demand.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span>{demand.budget}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Còn {demand.deadline}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{demand.company_name}</span>
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        <span>{demand.views} lượt xem</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <button 
                        onClick={() => router.push(`/demands/${demand.id}`)}
                        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Xem chi tiết
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </button>
                      {isAuthenticated && (
                        <button 
                          onClick={() => router.push(`/demands/${demand.id}/propose`)}
                          className="w-full flex items-center justify-center px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                        >
                          Đề xuất giải pháp
                          <Send className="ml-2 h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  // List View
                  <div className="flex items-start space-x-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {demand.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {demand.category}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(demand.status)}`}>
                            {getStatusText(demand.status)}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {demand.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{demand.location}</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2" />
                          <span>{demand.budget}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>Còn {demand.deadline}</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-2" />
                          <span>{demand.views} lượt xem</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <button 
                        onClick={() => router.push(`/demands/${demand.id}`)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Xem chi tiết
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </button>
                      {isAuthenticated && (
                        <button 
                          onClick={() => router.push(`/demands/${demand.id}/propose`)}
                          className="flex items-center px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                        >
                          Đề xuất
                          <Send className="ml-2 h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không tìm thấy nhu cầu nào
            </h3>
            <p className="text-gray-600">
              Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

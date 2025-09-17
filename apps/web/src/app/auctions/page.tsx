'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar,
  Clock,
  Gavel,
  Users,
  ArrowRight,
  Plus,
  ExternalLink,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import apiClient from '@/lib/api';

interface Auction {
  id: number;
  title: string;
  description: string;
  technology_name: string;
  starting_price: number;
  current_bid: number;
  reserve_price: number;
  start_date: string;
  end_date: string;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  participants: number;
  bids_count: number;
  category: string;
  trl_level: number;
  seller: string;
  image_url?: string;
}

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('active');
  const [sortBy, setSortBy] = useState('end_date');

  // Mock data for auctions
  const mockAuctions: Auction[] = [
    {
      id: 1,
      title: 'Đấu giá công nghệ AI nhận diện hình ảnh y tế',
      description: 'Công nghệ AI tiên tiến có khả năng nhận diện và phân tích hình ảnh y tế với độ chính xác cao, hỗ trợ chẩn đoán bệnh lý.',
      technology_name: 'AI Medical Image Recognition',
      starting_price: 500000000,
      current_bid: 750000000,
      reserve_price: 800000000,
      start_date: '2025-01-15',
      end_date: '2025-01-25',
      status: 'active',
      participants: 12,
      bids_count: 8,
      category: 'Y tế',
      trl_level: 7,
      seller: 'Viện Công nghệ Y tế Hà Nội'
    },
    {
      id: 2,
      title: 'Đấu giá hệ thống IoT nông nghiệp thông minh',
      description: 'Hệ thống IoT hoàn chỉnh cho nông nghiệp thông minh bao gồm cảm biến, điều khiển tự động và phân tích dữ liệu.',
      technology_name: 'Smart Agriculture IoT System',
      starting_price: 200000000,
      current_bid: 0,
      reserve_price: 300000000,
      start_date: '2025-02-01',
      end_date: '2025-02-10',
      status: 'upcoming',
      participants: 0,
      bids_count: 0,
      category: 'Nông nghiệp',
      trl_level: 6,
      seller: 'Công ty Công nghệ Nông nghiệp ABC'
    },
    {
      id: 3,
      title: 'Đấu giá công nghệ xử lý nước thải công nghiệp',
      description: 'Công nghệ xử lý nước thải công nghiệp hiệu quả, tiết kiệm năng lượng và thân thiện với môi trường.',
      technology_name: 'Industrial Wastewater Treatment',
      starting_price: 300000000,
      current_bid: 450000000,
      reserve_price: 500000000,
      start_date: '2025-01-10',
      end_date: '2025-01-20',
      status: 'completed',
      participants: 8,
      bids_count: 15,
      category: 'Môi trường',
      trl_level: 8,
      seller: 'Viện Môi trường và Phát triển bền vững'
    },
    {
      id: 4,
      title: 'Đấu giá blockchain cho chuỗi cung ứng',
      description: 'Giải pháp blockchain toàn diện cho quản lý chuỗi cung ứng, đảm bảo tính minh bạch và truy xuất nguồn gốc.',
      technology_name: 'Supply Chain Blockchain Solution',
      starting_price: 400000000,
      current_bid: 0,
      reserve_price: 600000000,
      start_date: '2025-02-15',
      end_date: '2025-02-25',
      status: 'upcoming',
      participants: 0,
      bids_count: 0,
      category: 'Công nghệ thông tin',
      trl_level: 6,
      seller: 'Công ty Blockchain Solutions'
    }
  ];

  const auctionStatuses = [
    { value: 'active', label: 'Đang diễn ra' },
    { value: 'upcoming', label: 'Sắp diễn ra' },
    { value: 'completed', label: 'Đã kết thúc' },
    { value: 'cancelled', label: 'Đã hủy' }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchAuctions = async () => {
      setLoading(true);
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAuctions(mockAuctions);
      setLoading(false);
    };

    fetchAuctions();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter auctions based on search query
    const filtered = mockAuctions.filter(auction =>
      auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auction.technology_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      auction.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setAuctions(filtered);
  };

  const filteredAuctions = auctions.filter(auction => auction.status === selectedStatus);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Đang diễn ra';
      case 'upcoming': return 'Sắp diễn ra';
      case 'completed': return 'Đã kết thúc';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getTRLColor = (level: number) => {
    if (level <= 3) return 'bg-red-100 text-red-800';
    if (level <= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getTimeRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Đã kết thúc';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `Còn ${days} ngày`;
    if (hours > 0) return `Còn ${hours} giờ`;
    return 'Sắp kết thúc';
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
              Đấu giá công nghệ
            </h1>
            <p className="text-gray-600">
              Tham gia đấu giá các công nghệ tiên tiến và tìm kiếm cơ hội đầu tư
            </p>
          </div>
          <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-5 w-5 mr-2" />
            Tạo đấu giá
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
                  placeholder="Tìm kiếm đấu giá công nghệ..."
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

            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
              {auctionStatuses.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setSelectedStatus(status.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedStatus === status.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </form>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <p className="text-gray-600">
              Tìm thấy <span className="font-semibold">{filteredAuctions.length}</span> đấu giá
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="end_date">Theo thời gian kết thúc</option>
              <option value="current_bid">Theo giá hiện tại</option>
              <option value="participants">Theo số người tham gia</option>
            </select>
          </div>
        </div>

        {/* Auctions List */}
        {filteredAuctions.length > 0 ? (
          <div className="space-y-6">
            {filteredAuctions.map((auction) => (
              <div
                key={auction.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {auction.category}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(auction.status)}`}>
                        {getStatusText(auction.status)}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTRLColor(auction.trl_level)}`}>
                        TRL {auction.trl_level}
                      </span>
                    </div>
                    {auction.status === 'active' && (
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Thời gian còn lại</p>
                        <p className="text-lg font-semibold text-red-600">
                          {getTimeRemaining(auction.end_date)}
                        </p>
                      </div>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                    {auction.title}
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {auction.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Price Information */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-700">Thông tin giá</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Giá khởi điểm:</span>
                          <span className="font-medium">{formatPrice(auction.starting_price)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Giá hiện tại:</span>
                          <span className="font-semibold text-green-600">
                            {auction.current_bid > 0 ? formatPrice(auction.current_bid) : 'Chưa có bid'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Giá dự trữ:</span>
                          <span className="font-medium">{formatPrice(auction.reserve_price)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Auction Details */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-700">Chi tiết đấu giá</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Người tham gia:</span>
                          <span className="font-medium">{auction.participants}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Số lượt bid:</span>
                          <span className="font-medium">{auction.bids_count}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Người bán:</span>
                          <span className="font-medium">{auction.seller}</span>
                        </div>
                      </div>
                    </div>

                    {/* Time Information */}
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-700">Thời gian</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Bắt đầu:</span>
                          <span className="font-medium">{formatDate(auction.start_date)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Kết thúc:</span>
                          <span className="font-medium">{formatDate(auction.end_date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      <span>Công nghệ: </span>
                      <span className="font-medium">{auction.technology_name}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {auction.status === 'active' && (
                        <button className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                          <Gavel className="h-4 w-4 mr-2" />
                          Tham gia đấu giá
                        </button>
                      )}
                      {auction.status === 'upcoming' && (
                        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          <Calendar className="h-4 w-4 mr-2" />
                          Đăng ký tham gia
                        </button>
                      )}
                      <button className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm">
                        Chi tiết đấu giá
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gavel className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không tìm thấy đấu giá nào
            </h3>
            <p className="text-gray-600">
              Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
            </p>
          </div>
        )}

        {/* Load More Button */}
        {filteredAuctions.length > 0 && (
          <div className="text-center mt-8">
            <button className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Xem thêm đấu giá
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

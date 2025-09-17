'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Search, Filter, SlidersHorizontal } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTrlLevel, setSelectedTrlLevel] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ACTIVE');
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      // Load categories when modal opens
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/v1/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) {
      params.set('search', searchQuery.trim());
    }
    if (selectedCategory) {
      params.set('category', selectedCategory);
    }
    if (selectedTrlLevel) {
      params.set('trl_level', selectedTrlLevel);
    }
    if (selectedStatus) {
      params.set('status', selectedStatus);
    }

    const queryString = params.toString();
    router.push(`/technologies${queryString ? `?${queryString}` : ''}`);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Tìm kiếm công nghệ</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Search Form */}
        <div className="p-6 space-y-6">
          {/* Search Input */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Từ khóa tìm kiếm
            </label>
            <div className="relative">
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tên công nghệ, mô tả..."
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((category: any) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* TRL Level Filter */}
            <div>
              <label htmlFor="trlLevel" className="block text-sm font-medium text-gray-700 mb-2">
                Mức độ phát triển (TRL)
              </label>
              <select
                id="trlLevel"
                value={selectedTrlLevel}
                onChange={(e) => setSelectedTrlLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả mức độ</option>
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

            {/* Status Filter */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ACTIVE">Đang hoạt động</option>
                <option value="APPROVED">Đã phê duyệt</option>
                <option value="PENDING">Chờ phê duyệt</option>
                <option value="DRAFT">Bản nháp</option>
              </select>
            </div>
          </div>

          {/* Quick Search Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm nhanh
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSearchQuery('AI');
                  setSelectedStatus('ACTIVE');
                }}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
              >
                Công nghệ AI
              </button>
              <button
                onClick={() => {
                  setSearchQuery('blockchain');
                  setSelectedStatus('ACTIVE');
                }}
                className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
              >
                Blockchain
              </button>
              <button
                onClick={() => {
                  setSearchQuery('IoT');
                  setSelectedStatus('ACTIVE');
                }}
                className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
              >
                Internet of Things
              </button>
              <button
                onClick={() => {
                  setSearchQuery('năng lượng');
                  setSelectedStatus('ACTIVE');
                }}
                className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition-colors"
              >
                Năng lượng sạch
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSearch}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Search className="h-4 w-4 mr-2" />
            Tìm kiếm
          </button>
        </div>
      </div>
    </div>
  );
}

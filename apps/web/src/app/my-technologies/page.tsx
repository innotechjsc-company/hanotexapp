'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, Plus, Edit, Trash2, Eye, MoreVertical } from 'lucide-react';

export default function MyTechnologiesPage() {
  const router = useRouter();
  const [technologies] = useState([
    {
      id: 1,
      title: 'Hệ thống quản lý năng lượng thông minh',
      status: 'ACTIVE',
      views: 156,
      inquiries: 8,
      created_at: '2024-01-15',
      category: 'Công nghệ thông tin & Truyền thông'
    },
    {
      id: 2,
      title: 'Công nghệ xử lý nước thải tiên tiến',
      status: 'PENDING',
      views: 0,
      inquiries: 0,
      created_at: '2024-01-20',
      category: 'Công nghệ môi trường'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Đã duyệt';
      case 'PENDING':
        return 'Chờ duyệt';
      case 'REJECTED':
        return 'Từ chối';
      default:
        return 'Không xác định';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Zap className="h-8 w-8 text-blue-600 mr-3" />
                Công nghệ của tôi
              </h1>
              <p className="text-gray-600 mt-2">
                Quản lý và theo dõi các công nghệ bạn đã đăng tải
              </p>
            </div>
            <button 
              onClick={() => router.push('/technologies/register')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Đăng công nghệ mới
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng công nghệ</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lượt xem</p>
                <p className="text-2xl font-bold text-gray-900">156</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <MoreVertical className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Yêu cầu liên hệ</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Edit className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </div>
        </div>

        {/* Technologies List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Danh sách công nghệ</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {technologies.map((tech) => (
              <div key={tech.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {tech.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(tech.status)}`}>
                        {getStatusText(tech.status)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {tech.category}
                    </p>

                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span>Lượt xem: {tech.views}</span>
                      <span>Yêu cầu liên hệ: {tech.inquiries}</span>
                      <span>Ngày đăng: {tech.created_at}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => router.push(`/technologies/${tech.id}`)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => router.push(`/technologies/${tech.id}/edit`)}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm('Bạn có chắc chắn muốn xóa công nghệ này?')) {
                          // TODO: Implement delete functionality
                          console.log('Delete technology:', tech.id);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {technologies.length === 0 && (
            <div className="text-center py-12">
              <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có công nghệ nào
              </h3>
              <p className="text-gray-600 mb-6">
                Bắt đầu đăng tải công nghệ đầu tiên của bạn
              </p>
              <button 
                onClick={() => router.push('/technologies/register')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center mx-auto"
              >
                <Plus className="h-5 w-5 mr-2" />
                Đăng công nghệ mới
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

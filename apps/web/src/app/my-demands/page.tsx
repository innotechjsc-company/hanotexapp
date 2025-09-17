'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Target, Plus, Edit, Trash2, Eye, MoreVertical } from 'lucide-react';

export default function MyDemandsPage() {
  const router = useRouter();
  const [demands] = useState([
    {
      id: 1,
      title: 'Tìm kiếm công nghệ xử lý rác thải sinh học',
      status: 'ACTIVE',
      responses: 5,
      budget: '500,000,000 VND',
      deadline: '2024-03-15',
      created_at: '2024-01-10',
      category: 'Công nghệ môi trường'
    },
    {
      id: 2,
      title: 'Cần công nghệ IoT cho nông nghiệp thông minh',
      status: 'PENDING',
      responses: 0,
      budget: 'Chưa xác định',
      deadline: '2024-04-30',
      created_at: '2024-01-25',
      category: 'Công nghệ nông nghiệp'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'Đang tìm kiếm';
      case 'PENDING':
        return 'Chờ duyệt';
      case 'CLOSED':
        return 'Đã đóng';
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
                <Target className="h-8 w-8 text-green-600 mr-3" />
                Nhu cầu của tôi
              </h1>
              <p className="text-gray-600 mt-2">
                Quản lý và theo dõi các nhu cầu công nghệ bạn đã đăng
              </p>
            </div>
            <button 
              onClick={() => router.push('/demands/register')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Đăng nhu cầu mới
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng nhu cầu</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <MoreVertical className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Phản hồi</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Đang tìm kiếm</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
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

        {/* Demands List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Danh sách nhu cầu</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {demands.map((demand) => (
              <div key={demand.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {demand.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(demand.status)}`}>
                        {getStatusText(demand.status)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {demand.category}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Ngân sách:</span>
                        <span className="ml-2 font-medium">{demand.budget}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Hạn chót:</span>
                        <span className="ml-2 font-medium">{demand.deadline}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Phản hồi:</span>
                        <span className="ml-2 font-medium text-blue-600">{demand.responses} nhà cung cấp</span>
                      </div>
                    </div>

                    <div className="mt-2 text-sm text-gray-500">
                      Ngày đăng: {demand.created_at}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => router.push(`/demands/${demand.id}`)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => router.push(`/demands/${demand.id}/edit`)}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm('Bạn có chắc chắn muốn xóa nhu cầu này?')) {
                          // TODO: Implement delete functionality
                          console.log('Delete demand:', demand.id);
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

          {demands.length === 0 && (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có nhu cầu nào
              </h3>
              <p className="text-gray-600 mb-6">
                Bắt đầu đăng nhu cầu đầu tiên của bạn
              </p>
              <button 
                onClick={() => router.push('/demands/register')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center mx-auto"
              >
                <Plus className="h-5 w-5 mr-2" />
                Đăng nhu cầu mới
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

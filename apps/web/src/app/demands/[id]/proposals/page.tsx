'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/store/auth';
import { 
  ArrowLeft, 
  Eye, 
  MessageSquare, 
  CheckCircle, 
  XCircle,
  Clock,
  Star,
  FileText,
  Download,
  User
} from 'lucide-react';

interface Proposal {
  id: string;
  proposer: {
    id: string;
    name: string;
    company: string;
    avatar: string;
  };
  technology: {
    id: string;
    title: string;
    description: string;
  };
  match_score: number;
  solution_description: string;
  implementation_timeline: string;
  estimated_cost: string;
  cooperation_terms: string;
  additional_documents: string[];
  status: 'pending' | 'accepted' | 'rejected' | 'under_review';
  created_at: string;
}

interface Demand {
  id: string;
  title: string;
  description: string;
  budget: string;
  deadline: string;
}

export default function DemandProposalsPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [demand, setDemand] = useState<Demand | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Load demand and proposals
  useEffect(() => {
    // TODO: Fetch demand details
    setDemand({
      id: params.id as string,
      title: 'Tìm kiếm công nghệ xử lý rác thải sinh học',
      description: 'Cần công nghệ xử lý rác thải sinh học hiệu quả, thân thiện môi trường.',
      budget: '500,000,000 VND',
      deadline: '2024-03-15'
    });

    // TODO: Fetch proposals
    setProposals([
      {
        id: '1',
        proposer: {
          id: 'user1',
          name: 'Nguyễn Văn B',
          company: 'Công ty ABC Tech',
          avatar: 'NB'
        },
        technology: {
          id: 'tech1',
          title: 'Hệ thống xử lý rác thải sinh học tiên tiến',
          description: 'Công nghệ xử lý rác thải sinh học sử dụng vi sinh vật có lợi...'
        },
        match_score: 9,
        solution_description: 'Giải pháp của chúng tôi sử dụng công nghệ vi sinh tiên tiến...',
        implementation_timeline: '3-6 tháng',
        estimated_cost: '400,000,000 - 500,000,000 VND',
        cooperation_terms: 'Thanh toán theo tiến độ, bảo hành 2 năm...',
        additional_documents: ['technical_spec.pdf', 'certificate.pdf'],
        status: 'pending',
        created_at: '2024-01-20'
      },
      {
        id: '2',
        proposer: {
          id: 'user2',
          name: 'Trần Thị C',
          company: 'Viện Nghiên cứu XYZ',
          avatar: 'TC'
        },
        technology: {
          id: 'tech2',
          title: 'Công nghệ phân hủy rác thải hữu cơ',
          description: 'Công nghệ phân hủy nhanh rác thải hữu cơ bằng enzyme...'
        },
        match_score: 7,
        solution_description: 'Công nghệ enzyme của chúng tôi có thể phân hủy...',
        implementation_timeline: '4-8 tháng',
        estimated_cost: '300,000,000 - 450,000,000 VND',
        cooperation_terms: 'Hợp tác nghiên cứu, chia sẻ quyền sở hữu...',
        additional_documents: ['research_paper.pdf'],
        status: 'under_review',
        created_at: '2024-01-22'
      }
    ]);
  }, [params.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chờ xem xét';
      case 'accepted':
        return 'Đã chấp nhận';
      case 'rejected':
        return 'Đã từ chối';
      case 'under_review':
        return 'Đang xem xét';
      default:
        return 'Không xác định';
    }
  };

  const handleAcceptProposal = (proposalId: string) => {
    // TODO: Implement accept proposal
    console.log('Accepting proposal:', proposalId);
  };

  const handleRejectProposal = (proposalId: string) => {
    // TODO: Implement reject proposal
    console.log('Rejecting proposal:', proposalId);
  };

  const handleContactProposer = (proposal: Proposal) => {
    // TODO: Navigate to message with proposer
    router.push(`/messages?user=${proposal.proposer.id}`);
  };

  const filteredProposals = filterStatus === 'all' 
    ? proposals 
    : proposals.filter(p => p.status === filterStatus);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Đề xuất nhận được</h1>
                <p className="text-gray-600">{demand?.title}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả</option>
                <option value="pending">Chờ xem xét</option>
                <option value="under_review">Đang xem xét</option>
                <option value="accepted">Đã chấp nhận</option>
                <option value="rejected">Đã từ chối</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredProposals.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có đề xuất nào
            </h3>
            <p className="text-gray-600">
              Các đề xuất sẽ xuất hiện ở đây khi có người quan tâm đến nhu cầu của bạn.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Proposals List */}
            <div className="lg:col-span-1 space-y-4">
              {filteredProposals.map((proposal) => (
                <div
                  key={proposal.id}
                  onClick={() => setSelectedProposal(proposal)}
                  className={`bg-white rounded-lg shadow p-4 cursor-pointer transition-all ${
                    selectedProposal?.id === proposal.id 
                      ? 'ring-2 ring-blue-500 border-blue-500' 
                      : 'hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                        {proposal.proposer.avatar}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{proposal.proposer.name}</h3>
                        <p className="text-sm text-gray-600">{proposal.proposer.company}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(proposal.status)}`}>
                      {getStatusText(proposal.status)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 text-sm">
                      {proposal.technology.title}
                    </h4>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span>{proposal.match_score}/10</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{proposal.implementation_timeline}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Proposal Details */}
            <div className="lg:col-span-2">
              {selectedProposal ? (
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                          {selectedProposal.proposer.avatar}
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-gray-900">
                            {selectedProposal.proposer.name}
                          </h2>
                          <p className="text-gray-600">{selectedProposal.proposer.company}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedProposal.status)}`}>
                        {getStatusText(selectedProposal.status)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Technology Info */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Công nghệ đề xuất</h3>
                      <p className="text-gray-900 font-medium">{selectedProposal.technology.title}</p>
                      <p className="text-gray-600 mt-1">{selectedProposal.technology.description}</p>
                    </div>

                    {/* Match Score */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Mức độ phù hợp</h3>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${selectedProposal.match_score * 10}%` }}
                          ></div>
                        </div>
                        <span className="text-lg font-semibold text-blue-600">
                          {selectedProposal.match_score}/10
                        </span>
                      </div>
                    </div>

                    {/* Solution Description */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Mô tả giải pháp</h3>
                      <p className="text-gray-700">{selectedProposal.solution_description}</p>
                    </div>

                    {/* Timeline & Cost */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Thời gian triển khai</h3>
                        <p className="text-gray-700">{selectedProposal.implementation_timeline}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Chi phí ước tính</h3>
                        <p className="text-gray-700">{selectedProposal.estimated_cost}</p>
                      </div>
                    </div>

                    {/* Cooperation Terms */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Điều kiện hợp tác</h3>
                      <p className="text-gray-700">{selectedProposal.cooperation_terms}</p>
                    </div>

                    {/* Documents */}
                    {selectedProposal.additional_documents.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Tài liệu đính kèm</h3>
                        <div className="space-y-2">
                          {selectedProposal.additional_documents.map((doc, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <FileText className="h-5 w-5 text-blue-600" />
                                <span className="text-sm text-gray-900">{doc}</span>
                              </div>
                              <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1">
                                <Download className="h-4 w-4" />
                                <span>Tải xuống</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {selectedProposal.status === 'pending' && (
                      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                          onClick={() => handleContactProposer(selectedProposal)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>Liên hệ</span>
                        </button>
                        <button
                          onClick={() => handleRejectProposal(selectedProposal.id)}
                          className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors flex items-center space-x-2"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Từ chối</span>
                        </button>
                        <button
                          onClick={() => handleAcceptProposal(selectedProposal.id)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Chấp nhận</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Chọn một đề xuất để xem chi tiết
                  </h3>
                  <p className="text-gray-600">
                    Click vào đề xuất ở bên trái để xem thông tin chi tiết
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

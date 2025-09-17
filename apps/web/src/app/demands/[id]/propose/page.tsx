'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/store/auth';
import { 
  ArrowLeft, 
  Send, 
  Upload, 
  CheckCircle, 
  AlertCircle,
  Target,
  Clock,
  DollarSign,
  FileText,
  Users,
  Calendar
} from 'lucide-react';

interface Demand {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: string;
  deadline: string;
  requirements: string[];
  contact_info: {
    name: string;
    email: string;
    phone: string;
  };
}

interface Proposal {
  technology_id: string;
  technology_title: string;
  match_score: number;
  solution_description: string;
  implementation_timeline: string;
  estimated_cost: string;
  cooperation_terms: string;
  additional_documents: File[];
}

export default function ProposeSolutionPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const [demand, setDemand] = useState<Demand | null>(null);
  const [proposal, setProposal] = useState<Proposal>({
    technology_id: '',
    technology_title: '',
    match_score: 5,
    solution_description: '',
    implementation_timeline: '',
    estimated_cost: '',
    cooperation_terms: '',
    additional_documents: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userTechnologies, setUserTechnologies] = useState([]);

  // Load demand details
  useEffect(() => {
    // TODO: Fetch demand details from API
    setDemand({
      id: params.id as string,
      title: 'Tìm kiếm công nghệ xử lý rác thải sinh học',
      description: 'Cần công nghệ xử lý rác thải sinh học hiệu quả, thân thiện môi trường, có thể triển khai quy mô công nghiệp.',
      category: 'Công nghệ môi trường',
      budget: '500,000,000 VND',
      deadline: '2024-03-15',
      requirements: [
        'Hiệu suất xử lý > 90%',
        'Chi phí vận hành thấp',
        'Thời gian triển khai < 6 tháng',
        'Có chứng nhận môi trường'
      ],
      contact_info: {
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@company.com',
        phone: '0123456789'
      }
    });

    // TODO: Fetch user's technologies
    setUserTechnologies([
      { id: '1', title: 'Hệ thống xử lý rác thải sinh học tiên tiến' },
      { id: '2', title: 'Công nghệ phân hủy rác thải hữu cơ' }
    ]);
  }, [params.id]);

  const handleSubmitProposal = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Submit proposal to API
      console.log('Submitting proposal:', proposal);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - redirect to success page
      router.push(`/demands/${params.id}/propose/success`);
    } catch (error) {
      console.error('Error submitting proposal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setProposal(prev => ({
      ...prev,
      additional_documents: [...prev.additional_documents, ...files]
    }));
  };

  if (!demand) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Đề xuất giải pháp</h1>
              <p className="text-gray-600">Gửi đề xuất công nghệ cho nhu cầu này</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Demand Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin nhu cầu</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">{demand.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{demand.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-600">{demand.category}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-gray-600">{demand.budget}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-orange-600" />
                    <span className="text-gray-600">{demand.deadline}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Yêu cầu kỹ thuật:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {demand.requirements.map((req, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Thông tin liên hệ:</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>{demand.contact_info.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>{demand.contact_info.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Proposal Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Đề xuất của bạn</h2>
                <p className="text-gray-600 mt-1">Điền thông tin chi tiết về giải pháp công nghệ</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Technology Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chọn công nghệ đề xuất *
                  </label>
                  <select
                    value={proposal.technology_id}
                    onChange={(e) => {
                      const selectedTech = userTechnologies.find(t => t.id === e.target.value);
                      setProposal(prev => ({
                        ...prev,
                        technology_id: e.target.value,
                        technology_title: selectedTech?.title || ''
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Chọn công nghệ</option>
                    {userTechnologies.map((tech) => (
                      <option key={tech.id} value={tech.id}>
                        {tech.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Match Score */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mức độ phù hợp (1-10) *
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={proposal.match_score}
                      onChange={(e) => setProposal(prev => ({ ...prev, match_score: parseInt(e.target.value) }))}
                      className="flex-1"
                    />
                    <span className="text-lg font-semibold text-blue-600 w-8">
                      {proposal.match_score}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Không phù hợp</span>
                    <span>Rất phù hợp</span>
                  </div>
                </div>

                {/* Solution Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả giải pháp cụ thể *
                  </label>
                  <textarea
                    value={proposal.solution_description}
                    onChange={(e) => setProposal(prev => ({ ...prev, solution_description: e.target.value }))}
                    rows={4}
                    placeholder="Mô tả chi tiết về cách công nghệ của bạn đáp ứng nhu cầu này..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Implementation Timeline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian triển khai *
                  </label>
                  <input
                    type="text"
                    value={proposal.implementation_timeline}
                    onChange={(e) => setProposal(prev => ({ ...prev, implementation_timeline: e.target.value }))}
                    placeholder="Ví dụ: 3-6 tháng, 6-12 tháng..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Estimated Cost */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chi phí ước tính *
                  </label>
                  <input
                    type="text"
                    value={proposal.estimated_cost}
                    onChange={(e) => setProposal(prev => ({ ...prev, estimated_cost: e.target.value }))}
                    placeholder="Ví dụ: 300,000,000 - 500,000,000 VND"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Cooperation Terms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Điều kiện hợp tác
                  </label>
                  <textarea
                    value={proposal.cooperation_terms}
                    onChange={(e) => setProposal(prev => ({ ...prev, cooperation_terms: e.target.value }))}
                    rows={3}
                    placeholder="Điều kiện hợp tác, phương thức thanh toán, bảo hành..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Additional Documents */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tài liệu bổ sung
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <div className="text-sm text-gray-600 mb-4">
                      Kéo thả tài liệu vào đây hoặc click để chọn
                    </div>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.jpg,.png"
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Chọn tài liệu
                    </label>
                  </div>
                  
                  {proposal.additional_documents.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {proposal.additional_documents.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <span className="text-sm text-gray-900">{file.name}</span>
                          </div>
                          <button
                            onClick={() => {
                              setProposal(prev => ({
                                ...prev,
                                additional_documents: prev.additional_documents.filter((_, i) => i !== index)
                              }));
                            }}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Xóa
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => router.back()}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSubmitProposal}
                    disabled={isSubmitting || !proposal.technology_id || !proposal.solution_description}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Đang gửi...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Gửi đề xuất</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

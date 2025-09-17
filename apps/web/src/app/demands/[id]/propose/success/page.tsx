'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowLeft, Eye, MessageSquare } from 'lucide-react';

export default function ProposalSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Đề xuất đã được gửi thành công!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Đề xuất của bạn đã được gửi đến người đăng nhu cầu. 
          Họ sẽ xem xét và phản hồi trong thời gian sớm nhất.
        </p>

        {/* What's Next */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-blue-900 mb-2">Những bước tiếp theo:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Người mua sẽ xem xét đề xuất của bạn</li>
            <li>• Bạn sẽ nhận được thông báo khi có phản hồi</li>
            <li>• Có thể trao đổi thêm thông tin qua tin nhắn</li>
            <li>• Tiến hành đàm phán và ký hợp đồng nếu phù hợp</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.push('/my-demands')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>Xem đề xuất của tôi</span>
          </button>
          
          <button
            onClick={() => router.push('/messages')}
            className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
          >
            <MessageSquare className="h-4 w-4" />
            <span>Tin nhắn</span>
          </button>
          
          <button
            onClick={() => router.push('/demands')}
            className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Quay lại danh sách nhu cầu</span>
          </button>
        </div>
      </div>
    </div>
  );
}

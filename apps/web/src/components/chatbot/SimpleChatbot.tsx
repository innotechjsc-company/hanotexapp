'use client';

import { useState } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface SimpleChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
  context?: 'general' | 'register';
  isAuthenticated?: boolean;
}

export default function SimpleChatbot({ isOpen, onToggle, context = 'general', isAuthenticated = false }: SimpleChatbotProps) {
  const [messages, setMessages] = useState(() => {
    if (isAuthenticated) {
      return [
        {
          id: '1',
          type: 'bot',
          content: `👋 **Chào mừng bạn quay trở lại HANOTEX!**

Tôi có thể giúp bạn:
• Tìm kiếm sản phẩm KH&CN phù hợp
• Hướng dẫn đăng ký sản phẩm mới
• Quản lý sản phẩm đã đăng
• Hỗ trợ kỹ thuật

Bạn cần hỗ trợ gì hôm nay?`,
          timestamp: new Date()
        }
      ];
    } else {
      return [
        {
          id: '1',
          type: 'bot',
          content: `👋 **Chào mừng bạn đến với HANOTEX!**

HANOTEX là sàn giao dịch công nghệ hàng đầu Việt Nam. Tôi có thể giúp bạn:

• Tìm hiểu về HANOTEX
• Khám phá các sản phẩm KH&CN
• Hướng dẫn đăng ký tài khoản
• Tìm hiểu quy trình giao dịch

Bạn muốn tìm hiểu gì?`,
          timestamp: new Date()
        }
      ];
    }
  });
  const [inputValue, setInputValue] = useState('');

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Responses for authenticated users
    if (isAuthenticated) {
      if (message.includes('đăng ký') || message.includes('đăng sản phẩm')) {
        return 'Để đăng ký sản phẩm mới, bạn có thể:\n\n1. Truy cập trang "Đăng công nghệ" trong menu\n2. Điền đầy đủ thông tin sản phẩm\n3. Upload tài liệu minh chứng\n4. Sử dụng tính năng OCR để tự động điền\n\nBạn cần hướng dẫn chi tiết không?';
      }
      
      if (message.includes('quản lý') || message.includes('sản phẩm của tôi')) {
        return 'Bạn có thể quản lý sản phẩm đã đăng qua:\n\n• Trang "Công nghệ của tôi"\n• Chỉnh sửa thông tin\n• Cập nhật trạng thái\n• Xem thống kê tương tác\n\nCần hỗ trợ gì cụ thể?';
      }
      
      if (message.includes('tìm kiếm') || message.includes('tìm')) {
        return 'Để tìm sản phẩm phù hợp:\n\n• Sử dụng thanh tìm kiếm\n• Lọc theo lĩnh vực, TRL\n• Xem sản phẩm nổi bật\n• Theo dõi nhu cầu mới\n\nBạn đang tìm sản phẩm thuộc lĩnh vực nào?';
      }
    }
    
    // General responses for non-authenticated users
    if (message.includes('hanotex') || message.includes('sàn')) {
      return 'HANOTEX là sàn giao dịch công nghệ hàng đầu Việt Nam, kết nối các nhà khoa học, doanh nghiệp và nhà đầu tư để thúc đẩy chuyển giao công nghệ.';
    }
    
    if (message.includes('công nghệ') || message.includes('sản phẩm')) {
      return 'Chúng tôi có hàng nghìn sản phẩm KH&CN từ các lĩnh vực:\n\n• Điện tử - Viễn thông - CNTT\n• Cơ khí - Tự động hóa\n• Vật liệu - Hóa học\n• Sinh học - Công nghệ sinh học\n• Năng lượng - Môi trường\n\nBạn quan tâm lĩnh vực nào?';
    }
    
    if (message.includes('đăng ký') || message.includes('tài khoản')) {
      return 'Để tham gia HANOTEX:\n\n1. Đăng ký tài khoản miễn phí\n2. Xác thực email\n3. Hoàn thiện hồ sơ\n4. Bắt đầu đăng sản phẩm hoặc tìm kiếm\n\nBạn muốn đăng ký ngay không?';
    }
    
    if (message.includes('liên hệ') || message.includes('hỗ trợ')) {
      return 'Bạn có thể liên hệ với chúng tôi:\n\n• Email: support@hanotex.vn\n• Hotline: 1900-xxxx\n• Chat trực tiếp (như hiện tại)\n• Trung tâm hỗ trợ online\n\nCần hỗ trợ gì cụ thể?';
    }
    
    if (message.includes('quy trình') || message.includes('cách thức')) {
      return 'Quy trình giao dịch trên HANOTEX:\n\n1. Đăng ký tài khoản\n2. Đăng sản phẩm KH&CN\n3. Tìm kiếm đối tác\n4. Thương lượng và ký kết\n5. Chuyển giao công nghệ\n\nBạn muốn tìm hiểu bước nào?';
    }
    
    return isAuthenticated 
      ? 'Cảm ơn bạn đã sử dụng HANOTEX! Bạn có thể đăng sản phẩm mới hoặc tìm kiếm cơ hội hợp tác.'
      : 'Cảm ơn bạn đã quan tâm! Hãy đăng ký tài khoản để trải nghiệm đầy đủ các tính năng của HANOTEX.';
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    setTimeout(() => {
      const botResponse = getBotResponse(inputValue);
      const botMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    }, 500);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col">
          <div className="bg-blue-600 text-white p-3 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-4 w-4" />
              <h3 className="font-semibold text-sm">HANOTEX Assistant</h3>
            </div>
            <button
              onClick={onToggle}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-2 rounded-lg text-xs ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start space-x-1">
                    {message.type === 'bot' && <Bot className="h-3 w-3 mt-0.5 flex-shrink-0" />}
                    {message.type === 'user' && <User className="h-3 w-3 mt-0.5 flex-shrink-0" />}
                    <span>{message.content}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Nhập câu hỏi..."
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

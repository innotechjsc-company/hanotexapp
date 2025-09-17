'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  CheckCircle, 
  ArrowRight,
  Zap,
  Target,
  DollarSign,
  Users,
  FileText,
  Search,
  Plus,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import StepGuide from './StepGuide';
import TemplateGenerator from './TemplateGenerator';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  intent?: string;
  steps?: string[];
  quickActions?: QuickAction[];
}

interface QuickAction {
  label: string;
  action: string;
  icon: React.ReactNode;
  href?: string;
}

interface SmartChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
  context?: 'general' | 'register' | 'search' | 'invest';
}

export default function SmartChatbot({ isOpen, onToggle, context = 'general' }: SmartChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showStepGuide, setShowStepGuide] = useState(false);
  const [showTemplateGenerator, setShowTemplateGenerator] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'bot',
        content: getWelcomeMessage(),
        timestamp: new Date(),
        intent: 'welcome',
        quickActions: getQuickActions()
      }]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getWelcomeMessage = () => {
    switch (context) {
      case 'register':
        return "Chào bạn! Tôi sẽ hướng dẫn bạn đăng công nghệ lên HANOTEX. Bạn muốn bắt đầu với bước nào?";
      case 'search':
        return "Tôi sẽ giúp bạn tìm kiếm công nghệ phù hợp. Hãy cho tôi biết bạn đang tìm gì?";
      case 'invest':
        return "Chào nhà đầu tư! Tôi sẽ hỗ trợ bạn tìm cơ hội đầu tư và kết nối với các dự án tiềm năng.";
      default:
        return "Xin chào! Tôi là trợ lý thông minh của HANOTEX. Tôi có thể giúp bạn:\n• Đăng công nghệ\n• Tìm nhu cầu\n• Tham gia đầu tư\n• Môi giới công nghệ\n• Hỗ trợ pháp lý";
    }
  };

  const getQuickActions = (): QuickAction[] => {
    return [
      {
        label: 'Đăng công nghệ',
        action: 'register_technology',
        icon: <Plus className="h-4 w-4" />,
        href: '/technologies/register'
      },
      {
        label: 'Tìm nhu cầu',
        action: 'search_demand',
        icon: <Search className="h-4 w-4" />,
        href: '/demands'
      },
      {
        label: 'Đầu tư',
        action: 'investment',
        icon: <DollarSign className="h-4 w-4" />,
        href: '/services/investment'
      },
      {
        label: 'Môi giới',
        action: 'brokerage',
        icon: <Users className="h-4 w-4" />
      }
    ];
  };

  const recognizeIntent = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('đăng') && (lowerMessage.includes('công nghệ') || lowerMessage.includes('sản phẩm'))) {
      return 'register_technology';
    }
    if (lowerMessage.includes('tìm') && lowerMessage.includes('nhu cầu')) {
      return 'search_demand';
    }
    if (lowerMessage.includes('đầu tư') || lowerMessage.includes('đầu tư')) {
      return 'investment';
    }
    if (lowerMessage.includes('môi giới') || lowerMessage.includes('môi giới')) {
      return 'brokerage';
    }
    if (lowerMessage.includes('pháp lý') || lowerMessage.includes('hợp đồng')) {
      return 'legal_support';
    }
    if (lowerMessage.includes('định giá') || lowerMessage.includes('thẩm định')) {
      return 'valuation';
    }
    if (lowerMessage.includes('đấu giá')) {
      return 'auction';
    }
    
    return 'general_inquiry';
  };

  const getResponseForIntent = (intent: string, message: string): { content: string; steps?: string[]; quickActions?: QuickAction[] } => {
    switch (intent) {
      case 'register_technology':
        return {
          content: "Tuyệt! Tôi sẽ hướng dẫn bạn đăng công nghệ từng bước:",
          steps: [
            "Chuẩn bị thông tin cơ bản (tên, mô tả ngắn)",
            "Xác định mức độ phát triển (TRL 1-9)",
            "Chuẩn bị tài liệu kỹ thuật và chứng nhận",
            "Xác định quyền sở hữu trí tuệ",
            "Chọn phương thức giao dịch (bán, chuyển nhượng, hợp tác)",
            "Đăng tải và chờ xét duyệt"
          ],
          quickActions: [
            {
              label: 'Mở form đăng công nghệ',
              action: 'open_register_form',
              icon: <Plus className="h-4 w-4" />,
              href: '/technologies/register'
            },
            {
              label: 'Tải mẫu mô tả',
              action: 'download_template',
              icon: <FileText className="h-4 w-4" />
            }
          ]
        };

      case 'search_demand':
        return {
          content: "Tôi sẽ giúp bạn tìm nhu cầu công nghệ phù hợp:",
          steps: [
            "Xác định lĩnh vực/ngành công nghệ",
            "Định nghĩa yêu cầu kỹ thuật cụ thể",
            "Thiết lập ngân sách và thời hạn",
            "Sử dụng bộ lọc thông minh",
            "Kết nối với nhà cung cấp tiềm năng"
          ],
          quickActions: [
            {
              label: 'Tìm nhu cầu hiện có',
              action: 'browse_demands',
              icon: <Search className="h-4 w-4" />,
              href: '/demands'
            },
            {
              label: 'Đăng nhu cầu mới',
              action: 'post_demand',
              icon: <Plus className="h-4 w-4" />,
              href: '/demands/register'
            }
          ]
        };

      case 'investment':
        return {
          content: "Hướng dẫn tham gia đầu tư công nghệ:",
          steps: [
            "Xác định lĩnh vực quan tâm và mức độ rủi ro",
            "Tìm kiếm dự án theo TRL và giai đoạn phát triển",
            "Đánh giá tiềm năng thương mại và thị trường",
            "Yêu cầu tài liệu chi tiết và thẩm định",
            "Đàm phán điều kiện đầu tư",
            "Ký kết hợp đồng và giải ngân"
          ],
          quickActions: [
            {
              label: 'Xem dự án đầu tư',
              action: 'browse_investments',
              icon: <DollarSign className="h-4 w-4" />,
              href: '/services/investment'
            },
            {
              label: 'Yêu cầu định giá',
              action: 'request_valuation',
              icon: <FileText className="h-4 w-4" />,
              href: '/services/valuation'
            }
          ]
        };

      case 'brokerage':
        return {
          content: "Hướng dẫn hoạt động môi giới công nghệ:",
          steps: [
            "Đăng ký làm môi giới và xác thực danh tính",
            "Chọn lĩnh vực chuyên môn",
            "Tìm kiếm cơ hội môi giới phù hợp",
            "Kết nối người mua và người bán",
            "Hỗ trợ đàm phán và ký kết",
            "Theo dõi giao dịch và nhận hoa hồng"
          ],
          quickActions: [
            {
              label: 'Đăng ký môi giới',
              action: 'register_broker',
              icon: <Users className="h-4 w-4" />,
              href: '/services/legal'
            },
            {
              label: 'Xem cơ hội môi giới',
              action: 'browse_opportunities',
              icon: <Search className="h-4 w-4" />,
              href: '/technologies'
            }
          ]
        };

      case 'legal_support':
        return {
          content: "Dịch vụ hỗ trợ pháp lý của HANOTEX:",
          steps: [
            "Đăng ký sở hữu trí tuệ và bằng sáng chế",
            "Soạn thảo hợp đồng chuyển giao công nghệ",
            "Bảo vệ quyền sở hữu trí tuệ",
            "Tư vấn pháp lý về giao dịch",
            "Hỗ trợ giải quyết tranh chấp"
          ],
          quickActions: [
            {
              label: 'Dịch vụ pháp lý',
              action: 'legal_services',
              icon: <FileText className="h-4 w-4" />,
              href: '/services/legal'
            },
            {
              label: 'Tư vấn pháp lý',
              action: 'legal_consultation',
              icon: <HelpCircle className="h-4 w-4" />,
              href: '/contact'
            }
          ]
        };

      case 'valuation':
        return {
          content: "Dịch vụ định giá và thẩm định công nghệ:",
          steps: [
            "Chuẩn bị hồ sơ công nghệ cần định giá",
            "Chọn phương pháp định giá phù hợp",
            "Thực hiện phân tích thị trường",
            "Xác định giá trị và báo cáo",
            "Cập nhật vào hệ thống giao dịch"
          ],
          quickActions: [
            {
              label: 'Yêu cầu định giá',
              action: 'request_valuation',
              icon: <DollarSign className="h-4 w-4" />,
              href: '/services/valuation'
            }
          ]
        };

      default:
        return {
          content: "Tôi hiểu bạn cần hỗ trợ. Hãy cho tôi biết cụ thể hơn về:\n• Bạn muốn đăng công nghệ?\n• Tìm kiếm nhu cầu?\n• Tham gia đầu tư?\n• Hỗ trợ pháp lý?\n• Hay điều gì khác?",
          quickActions: getQuickActions()
        };
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot thinking
    setTimeout(() => {
      const intent = recognizeIntent(inputValue);
      const response = getResponseForIntent(intent, inputValue);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.content,
        timestamp: new Date(),
        intent,
        steps: response.steps,
        quickActions: response.quickActions
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickAction = (action: QuickAction) => {
    // Handle special actions first
    if (action.action === 'open_register_form') {
      setShowStepGuide(true);
      return;
    }
    
    if (action.action === 'download_template') {
      setShowTemplateGenerator(true);
      return;
    }
    
    // Always add interaction message first for better UX
    const actionMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: `Tôi muốn ${action.label.toLowerCase()}`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, actionMessage]);
    
    // Generate response after a short delay
    setTimeout(() => {
      const intent = recognizeIntent(actionMessage.content);
      const response = getResponseForIntent(intent, actionMessage.content);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.content,
        timestamp: new Date(),
        intent,
        steps: response.steps,
        quickActions: response.quickActions
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Open link after showing the response
      if (action.href) {
        setTimeout(() => {
          window.open(action.href, '_blank');
        }, 1000);
      }
    }, 500);
  };

  const technologyTemplates = [
    {
      id: 'tech_description',
      title: 'Mẫu mô tả công nghệ',
      description: 'Template để mô tả chi tiết về công nghệ/sản phẩm',
      category: 'Công nghệ',
      content: `MÔ TẢ CÔNG NGHỆ

Tên công nghệ: {{technology_name}}
Lĩnh vực: {{field}}
Mức độ phát triển (TRL): {{trl_level}}

MÔ TẢ TỔNG QUAN:
{{general_description}}

TÍNH NĂNG CHÍNH:
{{main_features}}

ỨNG DỤNG THỰC TẾ:
{{applications}}

LỢI ÍCH VƯỢT TRỘI:
{{advantages}}

THÔNG TIN PHÁP LÝ:
- Bằng sáng chế: {{patent_status}}
- Chứng nhận: {{certifications}}
- Lãnh thổ bảo hộ: {{protection_territory}}

THÔNG TIN LIÊN HỆ:
{{contact_info}}`,
      fields: [
        { name: 'technology_name', type: 'text', label: 'Tên công nghệ', required: true, placeholder: 'VD: Hệ thống AI xử lý ảnh y tế' },
        { name: 'field', type: 'select', label: 'Lĩnh vực', required: true, options: ['Công nghệ thông tin', 'Y tế', 'Nông nghiệp', 'Môi trường', 'Năng lượng', 'Khác'] },
        { name: 'trl_level', type: 'select', label: 'Mức độ phát triển (TRL)', required: true, options: ['1-3: Nghiên cứu cơ bản', '4-6: Phát triển', '7-9: Thương mại hóa'] },
        { name: 'general_description', type: 'textarea', label: 'Mô tả tổng quan', required: true, placeholder: 'Mô tả ngắn gọn về công nghệ...' },
        { name: 'main_features', type: 'textarea', label: 'Tính năng chính', required: true, placeholder: 'Liệt kê các tính năng nổi bật...' },
        { name: 'applications', type: 'textarea', label: 'Ứng dụng thực tế', required: true, placeholder: 'Các ứng dụng cụ thể...' },
        { name: 'advantages', type: 'textarea', label: 'Lợi ích vượt trội', required: true, placeholder: 'Điểm mạnh so với giải pháp hiện tại...' },
        { name: 'patent_status', type: 'text', label: 'Trạng thái bằng sáng chế', required: false, placeholder: 'Đã cấp/Đang xét duyệt/Chưa có' },
        { name: 'certifications', type: 'text', label: 'Chứng nhận', required: false, placeholder: 'CE, FDA, ISO...' },
        { name: 'protection_territory', type: 'text', label: 'Lãnh thổ bảo hộ', required: false, placeholder: 'Việt Nam, PCT...' },
        { name: 'contact_info', type: 'textarea', label: 'Thông tin liên hệ', required: true, placeholder: 'Tên, email, điện thoại...' }
      ]
    }
  ];

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Step Guide Modal */}
      {showStepGuide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Hướng dẫn đăng công nghệ</h2>
                <button
                  onClick={() => setShowStepGuide(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <StepGuide
                title="Quy trình đăng công nghệ lên HANOTEX"
                steps={[
                  {
                    id: 'step1',
                    title: 'Chuẩn bị thông tin cơ bản',
                    description: 'Thu thập và chuẩn bị các thông tin cơ bản về công nghệ',
                    status: 'pending',
                    estimatedTime: '15-30 phút',
                    requirements: ['Tên công nghệ', 'Mô tả ngắn gọn', 'Lĩnh vực áp dụng'],
                    tips: ['Sử dụng từ khóa rõ ràng, dễ hiểu', 'Tránh thuật ngữ kỹ thuật phức tạp']
                  },
                  {
                    id: 'step2',
                    title: 'Xác định mức độ phát triển (TRL)',
                    description: 'Đánh giá và xác định Technology Readiness Level của công nghệ',
                    status: 'pending',
                    estimatedTime: '10-20 phút',
                    requirements: ['Hiểu biết về TRL 1-9', 'Đánh giá thực trạng công nghệ'],
                    tips: ['TRL 1-3: Nghiên cứu cơ bản', 'TRL 4-6: Phát triển', 'TRL 7-9: Thương mại hóa']
                  },
                  {
                    id: 'step3',
                    title: 'Chuẩn bị tài liệu kỹ thuật',
                    description: 'Tập hợp các tài liệu kỹ thuật, chứng nhận và bằng sáng chế',
                    status: 'pending',
                    estimatedTime: '30-60 phút',
                    requirements: ['Tài liệu kỹ thuật chi tiết', 'Chứng nhận chất lượng', 'Bằng sáng chế (nếu có)'],
                    tips: ['Scan tài liệu với độ phân giải cao', 'Định dạng PDF để dễ đọc']
                  },
                  {
                    id: 'step4',
                    title: 'Xác định quyền sở hữu trí tuệ',
                    description: 'Khai báo đầy đủ thông tin về quyền sở hữu trí tuệ',
                    status: 'pending',
                    estimatedTime: '15-30 phút',
                    requirements: ['Bằng sáng chế', 'Đơn đăng ký', 'Lãnh thổ bảo hộ'],
                    tips: ['Kiểm tra tính hợp lệ của bằng sáng chế', 'Xác nhận quyền sở hữu']
                  },
                  {
                    id: 'step5',
                    title: 'Chọn phương thức giao dịch',
                    description: 'Lựa chọn hình thức chuyển giao công nghệ phù hợp',
                    status: 'pending',
                    estimatedTime: '10-20 phút',
                    requirements: ['Mục tiêu thương mại', 'Điều kiện chuyển giao', 'Giá trị ước tính'],
                    tips: ['Bán độc quyền', 'Chuyển nhượng', 'Hợp tác phát triển', 'Cấp phép sử dụng']
                  },
                  {
                    id: 'step6',
                    title: 'Đăng tải và chờ xét duyệt',
                    description: 'Hoàn tất đăng tải và theo dõi quá trình xét duyệt',
                    status: 'pending',
                    estimatedTime: '5-10 phút',
                    requirements: ['Kiểm tra thông tin', 'Xác nhận đăng tải'],
                    tips: ['Theo dõi email thông báo', 'Chuẩn bị tài liệu bổ sung nếu cần']
                  }
                ]}
                onCompleteAll={() => {
                  setShowStepGuide(false);
                  setShowTemplateGenerator(true);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Template Generator Modal */}
      {showTemplateGenerator && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Tạo mẫu mô tả công nghệ</h2>
                <button
                  onClick={() => setShowTemplateGenerator(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <TemplateGenerator
                templates={technologyTemplates}
                onGenerate={(template, data) => {
                  console.log('Generated template:', template, data);
                }}
                onDownload={(template, data) => {
                  console.log('Downloaded template:', template, data);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Chatbot Toggle Button */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <h3 className="font-semibold">Trợ lý HANOTEX</h3>
            </div>
            <button
              onClick={onToggle}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`flex items-start space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div className={`px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                      
                      {/* Steps Checklist */}
                      {message.steps && (
                        <div className="mt-3 space-y-2">
                          {message.steps.map((step, index) => (
                            <div key={index} className="flex items-start space-x-2 text-xs">
                              <CheckCircle className="h-3 w-3 mt-0.5 text-green-500 flex-shrink-0" />
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Quick Actions */}
                      {message.quickActions && (
                        <div className="mt-3 space-y-2">
                          {message.quickActions.map((action, index) => (
                            <button
                              key={index}
                              onClick={() => handleQuickAction(action)}
                              className="flex items-center space-x-2 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 py-1 rounded transition-colors"
                            >
                              {action.icon}
                              <span>{action.label}</span>
                              <ChevronRight className="h-3 w-3" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className={`text-xs text-gray-500 mt-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập câu hỏi của bạn..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

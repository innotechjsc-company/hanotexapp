"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  HelpCircle,
  Lightbulb,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  suggestions?: string[];
  userType?: "INVESTOR" | "INDIVIDUAL" | "ORGANIZATION";
  step?: number;
  totalSteps?: number;
}

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
  context?: "register" | "general";
}

export default function IntelligentChatbot({
  isOpen,
  onToggle,
  context = "register",
}: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (context === "register") {
      return [
        {
          id: "1",
          type: "bot",
          content:
            "👋 **Chào mừng bạn đến với trang đăng ký sản phẩm KH&CN!**\n\nTôi sẽ hướng dẫn bạn từng bước để đăng sản phẩm lên HANOTEX:\n\n• Hướng dẫn điền form đăng ký\n• Giải thích các trường thông tin\n• Cách sử dụng tính năng OCR\n• Gợi ý nội dung phù hợp\n\nBạn muốn bắt đầu từ đâu?",
          timestamp: new Date(),
          suggestions: [
            "Hướng dẫn đăng ký sản phẩm",
            "Giải thích TRL là gì?",
            "Cách điền thông tin người đăng",
            "Sử dụng OCR để tự động điền",
          ],
        },
      ];
    } else {
      return [
        {
          id: "1",
          type: "bot",
          content:
            "Xin chào! Tôi là trợ lý thông minh của HANOTEX. Tôi có thể giúp bạn:\n\n• Hướng dẫn đăng ký sản phẩm KH&CN\n• Giải thích các trường thông tin\n• Gợi ý cách điền form hiệu quả\n• Trả lời câu hỏi về quy trình\n\nBạn cần hỗ trợ gì?",
          timestamp: new Date(),
          suggestions: [
            "Hướng dẫn đăng ký sản phẩm",
            "Giải thích TRL là gì?",
            "Cách điền thông tin người đăng",
            "Tài liệu cần chuẩn bị",
          ],
        },
      ];
    }
  });
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userType, setUserType] = useState<
    "INVESTOR" | "INDIVIDUAL" | "ORGANIZATION" | null
  >(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentGuide, setCurrentGuide] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getUserTypeFromMessage = (
    message: string
  ): "INVESTOR" | "INDIVIDUAL" | "ORGANIZATION" | null => {
    const msg = message.toLowerCase();
    if (
      msg.includes("nhà đầu tư") ||
      msg.includes("đầu tư") ||
      msg.includes("investor")
    ) {
      return "INVESTOR";
    }
    if (
      msg.includes("cá nhân") ||
      msg.includes("individual") ||
      msg.includes("cá nhân")
    ) {
      return "INDIVIDUAL";
    }
    if (
      msg.includes("tổ chức") ||
      msg.includes("viện") ||
      msg.includes("trường") ||
      msg.includes("doanh nghiệp") ||
      msg.includes("organization")
    ) {
      return "ORGANIZATION";
    }
    return null;
  };

  const getStepByStepGuide = (
    guideType: "register",
    userType: "INVESTOR" | "INDIVIDUAL" | "ORGANIZATION",
    step: number
  ) => {
    const guides = {
      register: {
        INVESTOR: [
          {
            title: "Bước 1: Thông tin nhà đầu tư",
            content: `🏦 **Thông tin nhà đầu tư** *(Bắt buộc)*

**Thông tin cơ bản:**
• Tên tổ chức đầu tư
• Mã số thuế/Giấy phép hoạt động
• Người đại diện pháp luật
• Lĩnh vực đầu tư quan tâm

**💡 Lưu ý:** Nhà đầu tư cần cung cấp thông tin pháp lý đầy đủ để đảm bảo tính minh bạch.`,
            suggestions: [
              "Tiếp tục bước 2",
              "Hỏi về lĩnh vực đầu tư",
              "Thông tin pháp lý cần thiết",
            ],
          },
          {
            title: "Bước 2: Tiêu chí đầu tư",
            content: `🎯 **Tiêu chí đầu tư** *(Bắt buộc)*

**Mức đầu tư:**
• Ngân sách đầu tư (VND)
• Giai đoạn đầu tư (Seed, Series A, B, C)
• Lĩnh vực ưu tiên

**Điều kiện:**
• TRL tối thiểu yêu cầu
• Địa bàn hoạt động
• Thời gian hoàn vốn mong muốn

**💡 Gợi ý:** Xác định rõ tiêu chí giúp tìm được công nghệ phù hợp.`,
            suggestions: [
              "Tiếp tục bước 3",
              "Hỏi về TRL",
              "Cách đánh giá công nghệ",
            ],
          },
          {
            title: "Bước 3: Quy trình đầu tư",
            content: `📋 **Quy trình đầu tư**

**Các bước:**
1. Tìm kiếm công nghệ phù hợp
2. Liên hệ với chủ sở hữu
3. Đánh giá kỹ thuật và thương mại
4. Thương lượng điều khoản
5. Ký kết hợp đồng đầu tư

**💡 Mẹo:** Sử dụng bộ lọc để tìm công nghệ phù hợp với tiêu chí.`,
            suggestions: [
              "Cách tìm kiếm công nghệ",
              "Đánh giá công nghệ",
              "Quy trình thương lượng",
            ],
          },
        ],
        INDIVIDUAL: [
          {
            title: "Bước 1: Thông tin cá nhân",
            content: `👤 **Thông tin cá nhân** *(Bắt buộc)*

**Thông tin cơ bản:**
• Họ tên đầy đủ
• Email và số điện thoại
• Đơn vị công tác
• Chức vụ/chuyên môn

**💡 Lưu ý:** Thông tin này sẽ hiển thị công khai, đảm bảo tính chính xác.`,
            suggestions: [
              "Tiếp tục bước 2",
              "Hỏi về bảo mật thông tin",
              "Cách thay đổi thông tin",
            ],
          },
          {
            title: "Bước 2: Thông tin sản phẩm",
            content: `🔬 **Thông tin sản phẩm KH&CN** *(Bắt buộc)*

**Mô tả sản phẩm:**
• Tên sản phẩm rõ ràng, dễ hiểu
• Tóm tắt công khai (2-3 câu)
• Chi tiết bảo mật (chỉ hiển thị sau NDA)

**💡 Gợi ý:** Viết mô tả hấp dẫn để thu hút nhà đầu tư.`,
            suggestions: [
              "Tiếp tục bước 3",
              "Cách viết mô tả hấp dẫn",
              "Phân biệt công khai/bảo mật",
            ],
          },
          {
            title: "Bước 3: Phân loại và TRL",
            content: `🏷️ **Phân loại và TRL** *(Bắt buộc)*

**Phân loại:**
• Lĩnh vực: Khoa học tự nhiên, Kỹ thuật, Y dược, etc.
• Ngành: Điện tử, Cơ khí, Vật liệu, etc.
• Chuyên ngành: Cụ thể hơn

**TRL (Mức độ phát triển):**
• TRL 1-3: Nghiên cứu cơ bản
• TRL 4-6: Phát triển công nghệ
• TRL 7-9: Thương mại hóa

**💡 Mẹo:** Sử dụng OCR để tự động điền thông tin từ tài liệu.`,
            suggestions: [
              "Tiếp tục bước 4",
              "Giải thích TRL chi tiết",
              "Cách sử dụng OCR",
            ],
          },
        ],
        ORGANIZATION: [
          {
            title: "Bước 1: Thông tin tổ chức",
            content: `🏢 **Thông tin tổ chức** *(Bắt buộc)*

**Thông tin pháp lý:**
• Tên đầy đủ của tổ chức
• Mã số thuế
• Giấy phép hoạt động
• Người đại diện pháp luật

**Thông tin liên hệ:**
• Địa chỉ trụ sở chính
• Email và số điện thoại
• Website (nếu có)

**💡 Lưu ý:** Tổ chức cần cung cấp đầy đủ thông tin pháp lý.`,
            suggestions: [
              "Tiếp tục bước 2",
              "Hỏi về giấy phép",
              "Thông tin pháp lý cần thiết",
            ],
          },
          {
            title: "Bước 2: Năng lực tổ chức",
            content: `⚡ **Năng lực tổ chức** *(Bắt buộc)*

**Năng lực nghiên cứu:**
• Số lượng nhà khoa học
• Phòng thí nghiệm/thiết bị
• Các dự án đã thực hiện
• Báo cáo nghiệm thu

**Năng lực thương mại:**
• Kinh nghiệm chuyển giao công nghệ
• Mạng lưới đối tác
• Khả năng sản xuất

**💡 Gợi ý:** Năng lực mạnh giúp tăng độ tin cậy.`,
            suggestions: [
              "Tiếp tục bước 3",
              "Cách thể hiện năng lực",
              "Tài liệu minh chứng",
            ],
          },
          {
            title: "Bước 3: Sản phẩm và IP",
            content: `🔒 **Sản phẩm và Sở hữu trí tuệ** *(Bắt buộc)*

**Sản phẩm KH&CN:**
• Mô tả chi tiết sản phẩm
• Ứng dụng thực tế
• Lợi ích kinh tế-xã hội

**Sở hữu trí tuệ:**
• Bằng sáng chế (nếu có)
• Giải pháp hữu ích
• Kiểu dáng công nghiệp
• Bí mật thương mại

**💡 Mẹo:** IP mạnh tăng giá trị sản phẩm.`,
            suggestions: ["Tiếp tục bước 4", "Các loại IP", "Cách bảo vệ IP"],
          },
        ],
      },
    };

    return guides[guideType]?.[userType]?.[step] || null;
  };

  const getBotResponse = (
    userMessage: string
  ): {
    content: string;
    suggestions?: string[];
    userType?: string;
    step?: number;
    totalSteps?: number;
  } => {
    const message = userMessage.toLowerCase();

    // Hướng dẫn đăng ký sản phẩm - Step by step
    if (
      message.includes("hướng dẫn") ||
      message.includes("đăng ký") ||
      message.includes("sản phẩm")
    ) {
      if (!userType) {
        return {
          content: `👋 **Chào mừng bạn đến với HANOTEX!**

Để hướng dẫn bạn tốt nhất, tôi cần biết bạn là:
• **Nhà đầu tư** - Tìm kiếm công nghệ để đầu tư
• **Cá nhân** - Đăng sản phẩm KH&CN cá nhân
• **Tổ chức/Viện-Trường** - Đăng sản phẩm từ tổ chức

Bạn thuộc nhóm nào?`,
          suggestions: [
            "Tôi là nhà đầu tư",
            "Tôi là cá nhân",
            "Tôi là tổ chức/viện trường",
          ],
        };
      }

      const detectedUserType = getUserTypeFromMessage(userMessage) || userType;
      const step = currentStep;
      const guide = getStepByStepGuide("register", detectedUserType, step);

      if (guide) {
        return {
          content: guide.content,
          suggestions: guide.suggestions,
          userType: detectedUserType,
          step: step + 1,
          totalSteps: 3,
        };
      }

      return {
        content: `🎉 **Hoàn thành hướng dẫn cơ bản!**

Bạn đã nắm được các bước chính. Bây giờ bạn có thể:
• Bắt đầu điền form đăng ký
• Hỏi thêm về bất kỳ bước nào
• Tìm hiểu về các tính năng khác

Chúc bạn thành công! 🚀`,
        suggestions: [
          "Bắt đầu đăng ký",
          "Hỏi về OCR",
          "Tìm hiểu TRL",
          "Các tính năng khác",
        ],
      };
    }

    // Xử lý user type detection
    const detectedUserType = getUserTypeFromMessage(userMessage);
    if (detectedUserType && !userType) {
      setUserType(detectedUserType);
      setCurrentGuide("register");
      setCurrentStep(0);

      const guide = getStepByStepGuide("register", detectedUserType, 0);
      if (guide) {
        return {
          content: `✅ **Đã xác định bạn là ${detectedUserType === "INVESTOR" ? "nhà đầu tư" : detectedUserType === "INDIVIDUAL" ? "cá nhân" : "tổ chức/viện trường"}!**

${guide.content}`,
          suggestions: guide.suggestions,
          userType: detectedUserType,
          step: 1,
          totalSteps: 3,
        };
      }
    }

    // Xử lý tiếp tục bước tiếp theo
    if (message.includes("tiếp tục") || message.includes("bước tiếp")) {
      if (userType && currentGuide === "register") {
        const nextStep = currentStep + 1;
        const guide = getStepByStepGuide("register", userType, nextStep);

        if (guide) {
          return {
            content: guide.content,
            suggestions: guide.suggestions,
            userType: userType,
            step: nextStep + 1,
            totalSteps: 3,
          };
        }
      }
    }

    // Giải thích TRL
    if (
      message.includes("trl") ||
      message.includes("mức độ") ||
      message.includes("phát triển")
    ) {
      return {
        content: `🔬 **TRL (Technology Readiness Level) - Mức độ sẵn sàng công nghệ:**

**TRL 1-3: Nghiên cứu cơ bản**
• TRL 1: Nguyên lý cơ bản
• TRL 2: Khái niệm công nghệ  
• TRL 3: Bằng chứng thực nghiệm

**TRL 4-6: Phát triển công nghệ**
• TRL 4: Mẫu thử trong lab
• TRL 5: Mẫu thử gần điều kiện thực
• TRL 6: Nguyên mẫu

**TRL 7-9: Thương mại hóa**
• TRL 7: Trình diễn quy mô pilot
• TRL 8: Hoàn thiện
• TRL 9: Thương mại hóa

**💡 Gợi ý:** Dựa vào tài liệu của bạn để xác định TRL phù hợp!`,
        suggestions: [
          "Cách xác định TRL",
          "Sử dụng OCR để gợi ý TRL",
          "Ví dụ về TRL",
        ],
      };
    }

    // Thông tin người đăng
    if (
      message.includes("người đăng") ||
      message.includes("thông tin cá nhân") ||
      message.includes("doanh nghiệp")
    ) {
      return {
        content: `👤 **Thông tin người đăng:**

**Cá nhân:**
• Họ tên, email, số điện thoại
• Đơn vị công tác, chức vụ

**Doanh nghiệp:**
• Tên công ty, mã số thuế
• Giấy phép kinh doanh
• Người đại diện pháp luật
• Năng lực sản xuất

**Viện/Trường:**
• Tên đơn vị, mã số thuế
• Giấy phép hoạt động
• Người đại diện pháp luật
• Báo cáo nghiệm thu

**💡 Lưu ý:** Thông tin này sẽ được hiển thị công khai!`,
        suggestions: [
          "Cách bảo mật thông tin",
          "Thay đổi thông tin sau khi đăng",
          "Quyền riêng tư",
        ],
      };
    }

    // Tài liệu cần chuẩn bị
    if (
      message.includes("tài liệu") ||
      message.includes("chuẩn bị") ||
      message.includes("upload")
    ) {
      return {
        content: `📎 **Tài liệu cần chuẩn bị:**

**Tài liệu minh chứng:**
• Báo cáo nghiên cứu (PDF)
• Hình ảnh sản phẩm (JPG/PNG)
• Video demo (MP4)
• Bằng sáng chế, chứng nhận

**Tài liệu pháp lý:**
• Giấy phép kinh doanh
• Chứng nhận tiêu chuẩn
• Báo cáo nghiệm thu

**💡 Tính năng OCR:**
• Tự động đọc tài liệu PDF/ảnh
• Điền thông tin vào form
• Gợi ý TRL dựa trên nội dung

**Kích thước:** Tối đa 10MB mỗi file`,
        suggestions: [
          "Cách sử dụng OCR",
          "Định dạng file được hỗ trợ",
          "Tối ưu hóa tài liệu",
        ],
      };
    }

    // Lĩnh vực và phân loại
    if (
      message.includes("lĩnh vực") ||
      message.includes("ngành") ||
      message.includes("chuyên ngành")
    ) {
      return {
        content: `🏷️ **Phân loại sản phẩm KH&CN:**

**Lĩnh vực:**
• Khoa học tự nhiên
• Khoa học kỹ thuật & công nghệ
• Khoa học y, dược
• Khoa học nông nghiệp
• Khoa học xã hội
• Khoa học nhân văn
• Khoa học liên ngành

**Ngành chính:**
• Điện tử - Viễn thông - CNTT
• Cơ khí - Tự động hóa
• Vật liệu - Hóa học
• Sinh học - Công nghệ sinh học
• Năng lượng - Môi trường

**💡 Gợi ý:** Chọn chính xác để tăng khả năng tìm kiếm!`,
        suggestions: [
          "Cách chọn lĩnh vực phù hợp",
          "Danh sách đầy đủ các ngành",
          "Tác động của phân loại",
        ],
      };
    }

    // Sở hữu trí tuệ
    if (
      message.includes("sở hữu") ||
      message.includes("trí tuệ") ||
      message.includes("ip") ||
      message.includes("bằng sáng chế")
    ) {
      return {
        content: `🔒 **Sở hữu trí tuệ (IP):**

**Loại hình IP:**
• **Patent (Bằng sáng chế):** Giải pháp kỹ thuật mới, bảo hộ 20 năm
• **Utility Model (Giải pháp hữu ích):** Giải pháp kỹ thuật mới, bảo hộ 10 năm
• **Industrial Design (Kiểu dáng công nghiệp):** Hình dáng sản phẩm, bảo hộ 15 năm
• **Trademark (Nhãn hiệu):** Dấu hiệu phân biệt, bảo hộ 10 năm
• **Copyright (Bản quyền):** Mã nguồn, thuật toán, bảo hộ 50 năm
• **Trade Secret (Bí mật thương mại):** Thông tin bí mật, không thời hạn

**💡 Lưu ý:** Có IP sẽ tăng giá trị và độ tin cậy của sản phẩm!`,
        suggestions: ["Cách đăng ký IP", "Lợi ích của IP", "Bảo vệ IP"],
      };
    }

    // Pháp lý và lãnh thổ
    if (
      message.includes("pháp lý") ||
      message.includes("lãnh thổ") ||
      message.includes("bảo hộ")
    ) {
      return {
        content: `⚖️ **Pháp lý & Lãnh thổ:**

**Phạm vi bảo hộ:**
• Việt Nam
• ASEAN
• Châu Á - Thái Bình Dương
• Toàn cầu

**Chứng nhận tiêu chuẩn:**
• ISO 9001 (Quản lý chất lượng)
• ISO 14001 (Môi trường)
• ISO 45001 (An toàn lao động)
• CE Marking (Châu Âu)
• FDA (Hoa Kỳ)

**💡 Lưu ý:** Chứng nhận quốc tế tăng khả năng xuất khẩu!`,
        suggestions: [
          "Cách đăng ký chứng nhận",
          "Lợi ích của chứng nhận",
          "Quy trình pháp lý",
        ],
      };
    }

    // OCR và tự động hóa
    if (
      message.includes("ocr") ||
      message.includes("tự động") ||
      message.includes("điền")
    ) {
      return {
        content: `🤖 **Tính năng OCR thông minh:**

**Cách sử dụng:**
1. Upload tài liệu PDF/ảnh vào "Tài liệu minh chứng"
2. Hệ thống tự động đọc và phân tích
3. Thông tin được điền tự động vào form

**Thông tin được trích xuất:**
• Tên sản phẩm
• Lĩnh vực, ngành, chuyên ngành
• Gợi ý mức độ TRL
• Độ tin cậy của kết quả

**💡 Mẹo:** OCR hoạt động tốt nhất với tài liệu rõ nét, có text!`,
        suggestions: [
          "Cách tối ưu tài liệu cho OCR",
          "Xử lý lỗi OCR",
          "Độ chính xác của OCR",
        ],
      };
    }

    // Câu hỏi chung
    if (
      message.includes("giúp") ||
      message.includes("hỗ trợ") ||
      message.includes("không biết")
    ) {
      return {
        content: `🤝 **Tôi có thể giúp bạn:**

**Hướng dẫn chi tiết:**
• Cách điền từng trường thông tin
• Giải thích thuật ngữ chuyên môn
• Gợi ý nội dung phù hợp

**Tính năng thông minh:**
• OCR tự động điền form
• Gợi ý TRL dựa trên tài liệu
• Validation thông tin real-time

**Hãy hỏi cụ thể:**
• "Cách điền thông tin người đăng"
• "TRL là gì?"
• "Tài liệu cần chuẩn bị gì?"

Tôi luôn sẵn sàng hỗ trợ bạn! 😊`,
        suggestions: [
          "Hướng dẫn đăng ký sản phẩm",
          "Giải thích TRL là gì?",
          "Cách điền thông tin người đăng",
          "Tài liệu cần chuẩn bị",
        ],
      };
    }

    // Mặc định
    return {
      content: `🤔 **Tôi hiểu bạn cần hỗ trợ!**

Bạn có thể hỏi tôi về:
• Hướng dẫn đăng ký sản phẩm
• Giải thích các trường thông tin
• Cách sử dụng tính năng OCR
• Quy trình và yêu cầu

Hoặc chọn một gợi ý bên dưới để tôi hỗ trợ tốt hơn! 😊`,
      suggestions: [
        "Hướng dẫn đăng ký sản phẩm",
        "Giải thích TRL là gì?",
        "Cách điền thông tin người đăng",
        "Tài liệu cần chuẩn bị",
      ],
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: botResponse.content,
        timestamp: new Date(),
        suggestions: botResponse.suggestions,
        userType: botResponse.userType as any,
        step: botResponse.step,
        totalSteps: botResponse.totalSteps,
      };

      // Update state if user type is detected
      if (botResponse.userType && botResponse.userType !== userType) {
        setUserType(botResponse.userType as any);
      }
      if (botResponse.step !== undefined) {
        setCurrentStep(botResponse.step - 1);
      }

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
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
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === "bot" && (
                      <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                    )}
                    {message.type === "user" && (
                      <User className="h-4 w-4 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      {/* Progress Bar for Step-by-Step Guide */}
                      {message.step &&
                        message.totalSteps &&
                        message.type === "bot" && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                              <span>
                                Bước {message.step} / {message.totalSteps}
                              </span>
                              <span>
                                {Math.round(
                                  (message.step / message.totalSteps) * 100
                                )}
                                %
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${(message.step / message.totalSteps) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        )}

                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                      {message.suggestions && message.type === "bot" && (
                        <div className="mt-3 space-y-2">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="block w-full text-left p-2 bg-white bg-opacity-20 rounded text-xs hover:bg-opacity-30 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập câu hỏi của bạn..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

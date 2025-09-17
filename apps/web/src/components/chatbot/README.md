# HANOTEX Smart Chatbot

## Tổng quan

HANOTEX Smart Chatbot là một trợ lý thông minh được thiết kế để hỗ trợ người dùng thực hiện các hoạt động chính trên sàn giao dịch công nghệ HANOTEX. Chatbot sử dụng AI để nhận diện ý định (intent) của người dùng và cung cấp hướng dẫn step-by-step phù hợp.

## Tính năng chính

### 1. Nhận diện Intent thông minh
- **Đăng công nghệ**: Hướng dẫn quy trình đăng sản phẩm KH&CN
- **Tìm nhu cầu**: Hỗ trợ tìm kiếm nhu cầu công nghệ phù hợp
- **Đầu tư**: Hướng dẫn tham gia đầu tư và kết nối với dự án
- **Môi giới**: Hỗ trợ hoạt động môi giới công nghệ
- **Pháp lý**: Tư vấn và hỗ trợ pháp lý
- **Định giá**: Hướng dẫn yêu cầu định giá và thẩm định

### 2. Step-by-step Guidance
- **Checklist tương tác**: Hướng dẫn từng bước với checkbox
- **Thời gian ước tính**: Hiển thị thời gian cần thiết cho mỗi bước
- **Yêu cầu và mẹo**: Cung cấp thông tin chi tiết cho từng bước
- **Tiến độ theo dõi**: Theo dõi tiến độ hoàn thành

### 3. Template Generator
- **Mẫu mô tả công nghệ**: Tạo template chuẩn cho mô tả sản phẩm
- **Form động**: Điền thông tin và tạo nội dung tự động
- **Export/Import**: Tải xuống và sao chép nội dung

### 4. Quick Actions
- **Nút hành động nhanh**: Truy cập trực tiếp các chức năng
- **Link điều hướng**: Mở trang liên quan trong tab mới
- **Context-aware**: Hiển thị actions phù hợp với ngữ cảnh

## Cách sử dụng

### 1. Khởi động Chatbot
```typescript
// Chatbot sẽ tự động xuất hiện ở góc phải màn hình
// Click vào icon MessageCircle để mở/đóng
```

### 2. Tương tác với Chatbot
```
Người dùng: "Tôi muốn đăng công nghệ AI xử lý ảnh y tế"

Chatbot: "Tuyệt! Tôi sẽ hướng dẫn bạn đăng công nghệ từng bước:"
- Hiển thị 6 bước checklist
- Quick actions: "Mở form đăng công nghệ", "Tải mẫu mô tả"
```

### 3. Sử dụng Step Guide
- Click "Mở form đăng công nghệ" để xem hướng dẫn chi tiết
- Hoàn thành từng bước theo checklist
- Theo dõi tiến độ hoàn thành
- Nhận mẹo và yêu cầu cho từng bước

### 4. Tạo Template
- Click "Tải mẫu mô tả" để mở Template Generator
- Chọn mẫu phù hợp
- Điền thông tin vào form
- Tạo và tải xuống nội dung

## Cấu trúc Code

### Components chính

#### 1. SmartChatbot.tsx
- Component chính của chatbot
- Xử lý logic nhận diện intent
- Quản lý state và tương tác

#### 2. StepGuide.tsx
- Hiển thị checklist tương tác
- Theo dõi tiến độ hoàn thành
- Cung cấp thông tin chi tiết cho từng bước

#### 3. TemplateGenerator.tsx
- Tạo và quản lý template
- Form động với các loại field khác nhau
- Export/Import nội dung

### Intent Recognition

```typescript
const recognizeIntent = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('đăng') && lowerMessage.includes('công nghệ')) {
    return 'register_technology';
  }
  // ... các intent khác
};
```

### Response Generation

```typescript
const getResponseForIntent = (intent: string, message: string) => {
  switch (intent) {
    case 'register_technology':
      return {
        content: "Tuyệt! Tôi sẽ hướng dẫn bạn đăng công nghệ từng bước:",
        steps: [...],
        quickActions: [...]
      };
    // ... các response khác
  }
};
```

## Customization

### Thêm Intent mới
1. Cập nhật `recognizeIntent()` function
2. Thêm case mới trong `getResponseForIntent()`
3. Định nghĩa steps và quickActions

### Thêm Template mới
1. Tạo template object với structure chuẩn
2. Thêm vào `technologyTemplates` array
3. Định nghĩa fields và content

### Thêm Step mới
1. Cập nhật steps array trong StepGuide
2. Định nghĩa requirements và tips
3. Thiết lập estimatedTime

## Best Practices

### 1. Intent Recognition
- Sử dụng từ khóa rõ ràng và đa dạng
- Xử lý các biến thể của cùng một ý định
- Fallback cho các intent không xác định

### 2. Step Design
- Chia nhỏ các bước phức tạp
- Cung cấp thời gian ước tính thực tế
- Đưa ra yêu cầu và mẹo hữu ích

### 3. Template Design
- Sử dụng placeholder rõ ràng ({{field_name}})
- Cung cấp options cho select fields
- Validation cho required fields

### 4. UX/UI
- Responsive design cho mobile
- Loading states cho các action dài
- Clear visual hierarchy
- Accessible design

## Testing

### 1. Intent Recognition Testing
```typescript
// Test cases
const testCases = [
  { input: "đăng công nghệ", expected: "register_technology" },
  { input: "tìm nhu cầu", expected: "search_demand" },
  { input: "đầu tư", expected: "investment" }
];
```

### 2. Step Guide Testing
- Test completion flow
- Test progress tracking
- Test error handling

### 3. Template Testing
- Test form validation
- Test content generation
- Test export functionality

## Future Enhancements

### 1. AI Integration
- Tích hợp với AI model để cải thiện intent recognition
- Natural language processing cho câu hỏi phức tạp
- Context awareness và memory

### 2. Analytics
- Tracking user interactions
- Success rate của các intent
- Optimization dựa trên data

### 3. Multi-language Support
- Hỗ trợ tiếng Anh
- Localization cho các region khác

### 4. Advanced Features
- Voice interaction
- Image recognition
- Document analysis
- Integration với external APIs

## Troubleshooting

### 1. Common Issues
- **Intent không được nhận diện**: Kiểm tra từ khóa trong `recognizeIntent()`
- **Template không tạo được**: Kiểm tra placeholder syntax
- **Step không hoàn thành**: Kiểm tra logic trong `handleStepClick()`

### 2. Debug Mode
```typescript
// Enable debug logging
const DEBUG = true;
if (DEBUG) {
  console.log('Intent recognized:', intent);
  console.log('Response generated:', response);
}
```

### 3. Performance
- Lazy loading cho các component lớn
- Memoization cho expensive operations
- Debouncing cho user input

## Support

Để được hỗ trợ hoặc báo cáo lỗi, vui lòng liên hệ:
- Email: support@hanotex.com
- GitHub Issues: [Link to repository]
- Documentation: [Link to docs]
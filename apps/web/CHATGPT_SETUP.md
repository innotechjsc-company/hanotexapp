# Hướng dẫn cấu hình ChatGPT API cho HANOTEX Chatbot

## 1. Tạo OpenAI API Key

1. Truy cập [OpenAI Platform](https://platform.openai.com/)
2. Đăng nhập hoặc tạo tài khoản
3. Vào **API Keys** trong menu
4. Click **Create new secret key**
5. Copy API key (dạng: `sk-...`)

## 2. Cấu hình Environment Variables

Tạo file `.env.local` trong thư mục `apps/web/` với nội dung:

```env
# OpenAI API Configuration
OPENAI_API_KEY=sk-your_openai_api_key_here

# HANOTEX API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=http://localhost:3001
NEXT_PUBLIC_PAYLOAD_API_URL=http://localhost:4000/api
```

## 3. Khởi động lại Web App

```bash
cd apps/web
npm run dev
```

## 4. Test Chatbot

1. Mở http://localhost:3000
2. Click vào icon chatbot (góc phải màn hình)
3. Thử các câu hỏi:
   - "Tôi muốn tìm niềm vui" → Sẽ gọi ChatGPT API
   - "Tôi muốn đăng công nghệ" → Sẽ dùng logic HANOTEX

## 5. Troubleshooting

### Lỗi "API key not configured"
- Kiểm tra file `.env.local` có đúng không
- Restart web app sau khi thêm API key

### Lỗi "OpenAI API error"
- Kiểm tra API key có hợp lệ không
- Kiểm tra tài khoản OpenAI có credit không
- Kiểm tra kết nối internet

### Fallback Response
Nếu ChatGPT API không hoạt động, chatbot sẽ dùng response mặc định của HANOTEX.

## 6. Cost Management

- ChatGPT API tính phí theo token
- Có thể giới hạn số lượng request
- Monitor usage trên OpenAI dashboard

## 7. Security

- Không commit API key vào git
- Sử dụng environment variables
- Có thể thêm rate limiting

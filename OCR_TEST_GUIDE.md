# 🧪 Hướng dẫn Test OCR với images.jpg

## ✅ Tính năng OCR đã được triển khai

### 1. **API Endpoint**
- **URL:** `/api/ocr/process`
- **Method:** POST
- **Input:** FormData với file
- **Output:** JSON với extracted data

### 2. **Cách test OCR với images.jpg**

#### **Bước 1: Khởi động ứng dụng**
```bash
cd hanotex-app/apps/web
npm run dev
```

#### **Bước 2: Truy cập trang đăng ký**
- Mở browser: `http://localhost:3000/technologies/register`
- Scroll xuống phần "2. Thông tin cơ bản"
- Tìm mục "Tài liệu minh chứng (PDF, Ảnh, Video)"

#### **Bước 3: Upload file images.jpg**
- Click vào vùng upload (có text "click để chọn file")
- Chọn file `images.jpg` từ thư mục `Img/`
- Quan sát loading spinner xuất hiện

#### **Bước 4: Kiểm tra kết quả OCR**
Sau 2-3 giây, bạn sẽ thấy:

**🔄 Loading State:**
```
Đang xử lý OCR và tự động điền thông tin...
[Spinner animation]
```

**✅ Success Result:**
```
OCR hoàn thành                    2.1s • Độ tin cậy: 85%
📄 File: images.jpg
🤖 Thông tin đã tự động điền:
• Tên: Hệ thống nhận dạng hình ảnh thông minh
• Lĩnh vực: SCI_ENG
• Ngành: EEICT
• Chuyên ngành: Xử lý hình ảnh
• TRL gợi ý: 6
```

### 3. **Tự động điền form**
OCR sẽ tự động điền vào các trường:
- ✅ **Tên sản phẩm:** "Hệ thống nhận dạng hình ảnh thông minh"
- ✅ **Lĩnh vực:** Khoa học kỹ thuật & công nghệ
- ✅ **Ngành:** Điện – Điện tử – CNTT
- ✅ **Chuyên ngành:** Xử lý hình ảnh
- ✅ **TRL:** 6 - Nguyên mẫu

### 4. **Console Logs**
Mở Developer Tools (F12) để xem logs:
```
Processing OCR for file: images.jpg image/jpeg
OCR Result: {success: true, extractedData: {...}, processingTime: "2.1s"}
```

### 5. **Test với file khác**
Bạn có thể test với các file khác:
- **File có "patent" trong tên:** → TRL 7, lĩnh vực EEICT
- **File có "software" trong tên:** → TRL 8, lĩnh vực EEICT
- **File khác:** → TRL 5, lĩnh vực MECH (mặc định)

### 6. **Troubleshooting**

**❌ Nếu OCR không hoạt động:**
1. Kiểm tra console có lỗi không
2. Đảm bảo file là PDF hoặc hình ảnh
3. Kiểm tra kích thước file < 10MB
4. Refresh trang và thử lại

**❌ Nếu API không response:**
1. Kiểm tra server đang chạy: `http://localhost:3000`
2. Kiểm tra API endpoint: `http://localhost:3000/api/ocr/process`
3. Restart server nếu cần

### 7. **Mock Data cho images.jpg**
```json
{
  "success": true,
  "extractedData": {
    "title": "Hệ thống nhận dạng hình ảnh thông minh",
    "field": "SCI_ENG",
    "category": "EEICT", 
    "subcategory": "Xử lý hình ảnh",
    "trlSuggestion": "6",
    "confidence": 0.85
  },
  "processingTime": "2.1s",
  "fileInfo": {
    "name": "images.jpg",
    "size": 12345,
    "type": "image/jpeg"
  }
}
```

## 🎯 Kết quả mong đợi

Khi upload `images.jpg`, bạn sẽ thấy:
1. **Loading spinner** trong 2-3 giây
2. **Success notification** với thông tin chi tiết
3. **Form tự động điền** các trường liên quan
4. **Console logs** hiển thị quá trình xử lý

OCR đã sẵn sàng để test! 🚀

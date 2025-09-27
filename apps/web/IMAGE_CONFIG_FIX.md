# 🔧 Sửa lỗi Next.js Image Configuration

## ❌ **Lỗi gặp phải**
```
Invalid src prop (https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80) on `next/image`, hostname "images.unsplash.com" is not configured under images in your `next.config.js`
```

## ✅ **Giải pháp đã áp dụng**

### 1. **Cập nhật next.config.js**
Đã thêm các domain cần thiết vào cấu hình:

```javascript
images: {
  domains: [
    "localhost", 
    "hanotex.com", 
    "127.0.0.1", 
    "images.unsplash.com",           // ✅ Unsplash images
    "commondatastorage.googleapis.com", // ✅ Google Cloud Storage videos
    "cdnjs.cloudflare.com"           // ✅ CDN resources
  ],
  remotePatterns: [
    {
      protocol: "https",
      hostname: "images.unsplash.com",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "commondatastorage.googleapis.com",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "cdnjs.cloudflare.com",
      pathname: "/**",
    },
    {
      protocol: "https",
      hostname: "*.tile.openstreetmap.org",
      pathname: "/**",
    },
  ],
}
```

### 2. **Domains đã được cấu hình**
- ✅ **images.unsplash.com** - Hình ảnh từ Unsplash
- ✅ **commondatastorage.googleapis.com** - Video từ Google Cloud
- ✅ **cdnjs.cloudflare.com** - CDN resources
- ✅ ***.tile.openstreetmap.org** - Map tiles

## 🚀 **Cách khắc phục**

### **Bước 1: Restart Development Server**
```bash
# Dừng server hiện tại (Ctrl+C)
# Sau đó chạy lại:
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

### **Bước 2: Kiểm tra kết quả**
- ✅ Hình ảnh từ Unsplash sẽ load bình thường
- ✅ Video từ Google Cloud sẽ hoạt động
- ✅ Không còn lỗi Next.js Image

## 📝 **Lưu ý quan trọng**

### **Khi nào cần restart server:**
- ✅ Thay đổi `next.config.js`
- ✅ Thay đổi environment variables
- ✅ Thay đổi TypeScript config

### **Khi nào KHÔNG cần restart:**
- ❌ Thay đổi component code
- ❌ Thay đổi CSS/styling
- ❌ Thay đổi page content

## 🔍 **Troubleshooting**

### **Nếu vẫn gặp lỗi:**
1. **Clear cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

2. **Kiểm tra domain trong code:**
   ```bash
   grep -r "https://" src/
   ```

3. **Thêm domain mới vào next.config.js:**
   ```javascript
   domains: ["new-domain.com"]
   ```

## 📊 **Kết quả sau khi sửa**

### **Trước khi sửa:**
- ❌ Lỗi Next.js Image
- ❌ Hình ảnh không load
- ❌ Console errors

### **Sau khi sửa:**
- ✅ Tất cả hình ảnh load bình thường
- ✅ Video background hoạt động
- ✅ Không còn lỗi console
- ✅ Performance tối ưu với Next.js Image

---

**🎉 Banner trang chủ giờ đây sẽ hiển thị đầy đủ hình ảnh và video mà không gặp lỗi!**

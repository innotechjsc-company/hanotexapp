# Quy Tắc Thư Mục Services

## Mục Đích
Thư mục này chứa service modules đóng gói business logic, external integrations, và utility functions không phù hợp với pure API hoặc hooks.

## Services Hiện Có
- `localstorage`: Client-side storage management (tokens, user preferences, cache)

## Hướng Dẫn

### Cấu Trúc Service
- Tạo service modules cho specific domains hoặc integrations
- Export service object hoặc individual functions
- Giữ services stateless khi có thể
- Sử dụng classes cho services cần internal state hoặc lifecycle

### Các Loại Service Phổ Biến
1. **Storage Services**: localStorage, sessionStorage, IndexedDB
2. **Authentication Services**: Token management, session handling
3. **Analytics Services**: Event tracking, metrics
4. **Notification Services**: Push notifications, toast messages
5. **WebSocket Services**: Real-time communication
6. **File Services**: Upload, download, processing
7. **Validation Services**: Form validation, data sanitization

### Best Practices
- Services nên là framework-agnostic
- Sử dụng dependency injection khi phù hợp
- Xử lý errors gracefully với try-catch
- Cung cấp type-safe interfaces
- Document service methods với JSDoc
- Làm services testable (pure functions hoặc mockable classes)
- Tránh tight coupling với React components
- Sử dụng singleton pattern cho services quản lý global state

### Storage Service Pattern
```typescript
export const storageService = {
  setItem: (key: string, value: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },
  
  getItem: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Storage error:', error);
      return null;
    }
  },
  
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  }
};
```

### Tích Hợp Với Các Layer Khác
- Services có thể được sử dụng bởi hooks, components, và API layer
- Services KHÔNG nên import từ `/components` hoặc `/screens`
- Services có thể sử dụng `/api` clients và `/types`
- Giữ services ở lower level of abstraction hơn hooks

### Xử Lý Lỗi
- Services nên throw meaningful errors
- Sử dụng custom error classes khi phù hợp
- Log errors để debugging
- KHÔNG swallow errors silently

### Quy Ước Bổ Sung
- ✅ **NÊN**: Tách business logic ra khỏi components vào services
- ✅ **NÊN**: Sử dụng TypeScript interfaces cho service contracts
- ❌ **KHÔNG**: Lưu UI state trong services - dùng stores/hooks
- ✅ **NÊN**: Implement retry logic cho external services
- ✅ **NÊN**: Cache kết quả của expensive operations
- ❌ **KHÔNG**: Tạo services cho simple utility functions - dùng `/utils`
- ✅ **NÊN**: Document service dependencies và side effects
- ✅ **NÊN**: Implement service health checks cho critical services
- ✅ **NÊN**: Version control breaking changes trong service APIs

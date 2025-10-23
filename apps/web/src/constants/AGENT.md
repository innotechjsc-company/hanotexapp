# Quy Tắc Thư Mục Constants

## Mục Đích
Thư mục này chứa các hằng số toàn ứng dụng, giá trị cấu hình, và dữ liệu tĩnh.

## Hướng Dẫn

### Phân Loại Hằng Số
1. **API Constants**: Endpoints, base URLs, API keys (non-sensitive)
2. **UI Constants**: Màu sắc, kích thước, breakpoints, z-index values
3. **Route Constants**: Application routes và paths
4. **Validation Constants**: Regex patterns, min/max values, rules
5. **Business Constants**: Status values, types, categories
6. **Configuration**: Feature flags, limits, thresholds

### Quy Ước Đặt Tên
- Sử dụng UPPER_SNAKE_CASE cho primitive constants
- Sử dụng PascalCase cho constant objects
- Prefix các constants liên quan với common prefix
- Sử dụng tên mô tả rõ mục đích

### Ví Dụ Cấu Trúc
```typescript
// routes.ts
export const ROUTES = {
  HOME: '/',
  AUCTION: '/auction',
  AUCTION_DETAIL: '/auction/:id',
  MY_PROPOSALS: '/my-proposals',
  SETTINGS: '/settings',
} as const;

// validation.ts
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^[0-9]{10}$/;
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// status.ts
export const AUCTION_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  CLOSED: 'closed',
  CANCELLED: 'cancelled',
} as const;

export type AuctionStatus = typeof AUCTION_STATUS[keyof typeof AUCTION_STATUS];
```

### Best Practices
- Sử dụng `as const` cho object constants để có literal types
- Nhóm các constants liên quan trong cùng file
- Export constants dưới dạng named exports
- KHÔNG duplicate giá trị - tham chiếu constants có sẵn
- Document các constants phức tạp bằng comments
- Sử dụng TypeScript utility types để tạo types từ constants
- KHÔNG bao giờ lưu secrets hoặc sensitive data ở đây (dùng environment variables)

### Biến Môi Trường (Environment Variables)
- Truy cập environment variables qua config file
- Cung cấp fallback values
- Validate required environment variables khi khởi động
- Sử dụng type-safe wrappers

```typescript
// config.ts
export const Config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  isProduction: process.env.NODE_ENV === 'production',
  featureFlags: {
    enableNewUI: process.env.NEXT_PUBLIC_ENABLE_NEW_UI === 'true',
  },
} as const;
```

### Magic Numbers
- Thay thế magic numbers bằng named constants
- Thêm comments giải thích ý nghĩa
- Nhóm các numeric constants liên quan

```typescript
// Thay vì: if (users.length > 100)
export const MAX_USERS_PER_PAGE = 100;
// Sử dụng: if (users.length > MAX_USERS_PER_PAGE)
```

### Tích Hợp TypeScript
- Export types tạo từ constants
- Sử dụng const assertions cho immutability
- Tận dụng union types từ constant objects

### Điều Cần Tránh
- Mutable constants (dùng Object.freeze hoặc as const)
- Gọi functions trong constant definitions (trừ khi thực sự constant)
- Import từ components hoặc hooks (constants nên ở low-level)
- Constants quá cụ thể chỉ dùng một lần

### Quy Ước Bổ Sung
- ✅ **NÊN**: Nhóm constants theo domain/feature
- ✅ **NÊN**: Sử dụng enum cho các giá trị liên quan
- ❌ **KHÔNG**: Hard-code strings/numbers trong code - tạo constants
- ✅ **NÊN**: Document nguồn gốc của magic values (API specs, business rules, etc.)
- ✅ **NÊN**: Version control các thay đổi về constants quan trọng
- ❌ **KHÔNG**: Mix configuration và business constants trong cùng file

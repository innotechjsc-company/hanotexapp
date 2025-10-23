# Quy Tắc Thư Mục API

## Mục Đích
Thư mục này chứa PayloadCMS API client implementation và tất cả các endpoint-specific API functions.

## Kiến Trúc
- `client.ts`: Core PayloadApiClient class với authentication, request handling, và token refresh logic
- `config.ts`: API configuration constants (base URL, headers, timeout)
- Các file riêng lẻ: Domain-specific API functions (auctions, auth, bids, categories, etc.)

## Hướng Dẫn

### Thêm Endpoint Mới
1. Tạo file mới theo tên resource (ví dụ: `users.ts`, `orders.ts`)
2. Import API client từ `./client`
3. Định nghĩa TypeScript interfaces cho request/response types
4. Export functions sử dụng client methods (get, post, patch, delete)
5. Tuân theo pattern có sẵn: `export const fetchResourceName = async (params) => { ... }`

### Xác Thực (Authentication)
- Client tự động xử lý token injection qua `Authorization` header
- Token refresh tự động khi nhận 401 responses
- Sử dụng `localStorageService` để lưu token persistently
- KHÔNG bao giờ hardcode tokens hoặc credentials

### Xử Lý Lỗi
- Tất cả API errors tuân theo `ApiError` interface
- Xử lý timeout errors (408 status)
- Cung cấp error messages có ý nghĩa
- Sử dụng try-catch blocks trong consuming code

### Định Dạng Response
- Tất cả responses tuân theo `ApiResponse<T>` interface
- Paginated responses bao gồm: `docs`, `totalDocs`, `limit`, `page`, `totalPages`, etc.
- Single resource responses sử dụng `data` field
- Kiểm tra `errors` array trong failed responses

### Best Practices
- Sử dụng TypeScript generics cho type-safe responses
- Giữ endpoint functions pure và focused
- Document query parameters trong function signatures
- Sử dụng naming convention nhất quán: `fetch*`, `create*`, `update*`, `delete*`
- Xử lý query string parameters qua `params` object trong GET requests
- Luôn validate required parameters trước khi gọi requests

### Quy Ước Bổ Sung
- ✅ **NÊN**: Tách riêng API logic khỏi business logic
- ✅ **NÊN**: Sử dụng async/await thay vì promises chains
- ✅ **NÊN**: Log errors để debug (development only)
- ❌ **KHÔNG**: Expose raw API errors ra UI - transform thành user-friendly messages
- ✅ **NÊN**: Implement retry logic cho network failures
- ✅ **NÊN**: Set timeout hợp lý cho từng loại request
- ✅ **NÊN**: Cache API responses khi phù hợp (với expiry time)
- ❌ **KHÔNG**: Gọi API trong loops - sử dụng batch requests

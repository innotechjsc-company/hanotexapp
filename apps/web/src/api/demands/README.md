# Demands API

API để quản lý nhu cầu công nghệ trong hệ thống HANOTEX.

## Endpoints

### 1. Lấy danh sách demands

```
GET /api/v1/demands
```

**Query Parameters:**

- `page` (number): Trang hiện tại (mặc định: 1)
- `limit` (number): Số lượng items per page (mặc định: 20)
- `search` (string): Tìm kiếm theo title hoặc description
- `category` (string): Lọc theo category ID
- `user` (string): Lọc theo user ID
- `trl_level` (number): Lọc theo TRL level
- `min_price` (number): Giá tối thiểu
- `max_price` (number): Giá tối đa

**Response:**

```json
{
  "success": true,
  "docs": [...],
  "totalDocs": 10,
  "limit": 20,
  "page": 1,
  "totalPages": 1,
  "hasNextPage": false,
  "hasPrevPage": false,
  "nextPage": null,
  "prevPage": null
}
```

### 2. Lấy demand theo ID

```
GET /api/v1/demands/{id}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "1",
    "title": "Tìm kiếm công nghệ xử lý nước thải",
    "description": "...",
    "category": "550e8400-e29b-41d4-a716-446655440005",
    "user": "user-1",
    "trl_level": 7,
    "option": "...",
    "option_technology": "...",
    "option_rule": "...",
    "from_price": 500000000,
    "to_price": 2000000000,
    "cooperation": "Chuyển giao công nghệ",
    "documents": [],
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

### 3. Tạo demand mới

```
POST /api/v1/demands
```

**Request Body:**

```json
{
  "title": "Tiêu đề nhu cầu",
  "description": "Mô tả chi tiết",
  "category": "category-id",
  "user": "user-id",
  "trl_level": 5,
  "option": "Mô tả yêu cầu mong muốn",
  "option_technology": "Mô tả yêu cầu công nghệ",
  "option_rule": "Mô tả quy tắc",
  "from_price": 1000000,
  "to_price": 5000000,
  "cooperation": "Hình thức hợp tác",
  "documents": []
}
```

**Required fields:**

- `title`
- `description`
- `category`
- `user`
- `trl_level`

**Response:**

```json
{
  "success": true,
  "data": { ... },
  "message": "Demand created successfully"
}
```

### 4. Cập nhật demand

```
PUT /api/v1/demands/{id}
```

**Request Body:** Tương tự POST nhưng tất cả fields đều optional

### 5. Xóa demand

```
DELETE /api/v1/demands/{id}
```

## Sử dụng trong Frontend

```typescript
import apiClient from "@/lib/api";

// Tạo demand mới
const response = await apiClient.createDemand({
  title: "Test Demand",
  description: "Test Description",
  category: "category-id",
  user: "user-id",
  trl_level: 5,
});

if (response.success) {
  console.log("Created demand:", response.data);
}

// Lấy danh sách demands
const demandsResponse = await apiClient.getDemands({
  search: "công nghệ",
  category: "category-id",
  page: 1,
  limit: 10,
});

if (demandsResponse.success) {
  console.log("Demands:", demandsResponse.data);
}

// Lấy demand theo ID
const demandResponse = await apiClient.getDemand("demand-id");

if (demandResponse.success) {
  console.log("Demand:", demandResponse.data);
}
```

## Error Handling

Tất cả API endpoints sẽ trả về error format:

```json
{
  "success": false,
  "error": "Error message"
}
```

HTTP Status Codes:

- 200: Success
- 400: Bad Request (missing required fields)
- 404: Not Found
- 500: Internal Server Error

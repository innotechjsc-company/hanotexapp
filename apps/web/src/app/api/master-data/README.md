# Master Data API

API này cung cấp dữ liệu master cho các select fields trong form đăng ký công nghệ.

## Endpoints

### `/api/master-data/all`
Trả về tất cả master data trong một request.

**Response:**
```json
{
  "success": true,
  "data": {
    "fields": [...],
    "industries": [...],
    "specialties": [...],
    "trlLevels": [...],
    "categories": [...],
    "ipTypes": [...],
    "ipStatuses": [...],
    "protectionTerritories": [...],
    "certifications": [...],
    "commercializationMethods": [...],
    "transferMethods": [...]
  }
}
```

### Individual Endpoints

- `/api/master-data/fields` - Lĩnh vực
- `/api/master-data/industries` - Ngành
- `/api/master-data/specialties` - Chuyên ngành
- `/api/master-data/trl-levels` - Mức độ TRL
- `/api/master-data/categories` - Danh mục
- `/api/master-data/ip-types` - Loại hình IP
- `/api/master-data/ip-statuses` - Tình trạng IP
- `/api/master-data/protection-territories` - Phạm vi bảo hộ
- `/api/master-data/certifications` - Chứng nhận tiêu chuẩn
- `/api/master-data/commercialization-methods` - Phương án thương mại hóa
- `/api/master-data/transfer-methods` - Hình thức chuyển quyền

## Data Structure

### Fields
```typescript
{
  value: string;  // Mã code
  label: string;  // Tên hiển thị
}
```

### IP Types
```typescript
{
  value: string;        // Mã code
  label: string;        // Tên hiển thị
  description: string;  // Mô tả chi tiết
}
```

### Territories & Certifications
```typescript
{
  value: string;    // Mã code
  tooltip: string;  // Tooltip mô tả
}
```

## Usage

### React Hook
```typescript
import { useMasterData } from '@/hooks/useMasterData';

const { masterData, loading, error } = useMasterData();
```

### Direct API Call
```typescript
const response = await fetch('/api/master-data/all');
const result = await response.json();
```

## Benefits

1. **Centralized Management**: Tất cả master data được quản lý tập trung
2. **Easy Updates**: Chỉ cần cập nhật API, không cần deploy lại frontend
3. **Consistency**: Đảm bảo dữ liệu nhất quán across toàn bộ ứng dụng
4. **Performance**: Có thể cache và optimize loading
5. **CMS Ready**: Dễ dàng tích hợp với CMS để quản lý dữ liệu

## Future Enhancements

- [ ] Database integration
- [ ] Admin panel để quản lý master data
- [ ] Caching mechanism
- [ ] Versioning cho master data
- [ ] Multi-language support

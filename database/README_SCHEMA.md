# HANOTEX Database Schema Files

Tệp schema.sql gốc đã được tách thành các tệp nhỏ hơn để dễ đọc và bảo trì hơn.

## Cấu trúc tệp

| Tệp                       | Mô tả                                                          |
| ------------------------- | -------------------------------------------------------------- |
| `00_extensions_types.sql` | Extensions PostgreSQL và các kiểu dữ liệu tùy chỉnh            |
| `01_users.sql`            | Bảng users và các bảng profile (individual, company, research) |
| `02_categories.sql`       | Bảng categories (phân loại công nghệ)                          |
| `03_technologies.sql`     | Các bảng liên quan đến công nghệ                               |
| `04_auctions.sql`         | Các bảng đấu giá và bid                                        |
| `05_transactions.sql`     | Bảng giao dịch                                                 |
| `06_documents.sql`        | Bảng tài liệu                                                  |
| `07_notifications.sql`    | Bảng thông báo                                                 |
| `08_indexes.sql`          | Các chỉ mục để tối ưu hiệu suất                                |
| `09_triggers.sql`         | Triggers và functions                                          |

## Cách sử dụng

### Tạo database hoàn chỉnh

```bash
# Sử dụng tệp combined
psql -d hanotex -f schema_combined.sql
```

### Tạo từng phần riêng lẻ

```bash
# Tạo từng bước
psql -d hanotex -f 00_extensions_types.sql
psql -d hanotex -f 01_users.sql
psql -d hanotex -f 02_categories.sql
psql -d hanotex -f 03_technologies.sql
psql -d hanotex -f 04_auctions.sql
psql -d hanotex -f 05_transactions.sql
psql -d hanotex -f 06_documents.sql
psql -d hanotex -f 07_notifications.sql
psql -d hanotex -f 08_indexes.sql
psql -d hanotex -f 09_triggers.sql
```

## Lưu ý

- Các tệp phải được thực thi theo thứ tự từ 00 đến 09
- Tệp `schema_combined.sql` sẽ tự động thực thi tất cả các tệp theo đúng thứ tự
- Tệp `schema.sql` gốc vẫn được giữ lại để tham khảo

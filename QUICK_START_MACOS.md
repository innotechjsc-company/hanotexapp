# HƯỚNG DẪN NHANH - CHẠY HANOTEX TRÊN MACOS

## 🚀 Quick Start (5 phút)

### Bước 1: Kiểm tra môi trường hiện tại
```bash
# Bạn đang ở đây
pwd
# /Users/duynguyen/Innotech/hanotech/skhcnHN

# Kiểm tra Node.js (cần >=18)
node --version
npm --version

# Kiểm tra Docker
docker --version
```

### Bước 2: Cài đặt dependencies
```bash
cd hanotex-app

# Cài đặt packages
npm install
# hoặc yarn install (nếu có yarn)
```

### Bước 3: Khởi động database
```bash
# Khởi động Docker Desktop trước (nếu chưa chạy)

# Start PostgreSQL, Redis và pgAdmin
docker-compose up -d

# Kiểm tra containers đã chạy
docker-compose ps
```

### Bước 4: Cấu hình environment
```bash
# Copy file config
cp apps/web/env.example apps/web/.env.local

# File .env.local sẽ có config sẵn cho localhost
```

### Bước 5: Chạy ứng dụng
```bash
# Chạy development mode
npm run dev

# Mở browser: http://localhost:3000
```

---

## 🎯 Truy cập ứng dụng

### Web Application
- **URL**: http://localhost:3000
- **Tài khoản admin**: admin@hanotex.com / password123
- **Tài khoản test**: nguyen.van.a@email.com / password123

### Database Management
- **pgAdmin**: http://localhost:5050
  - Email: admin@hanotex.com
  - Password: admin123
- **PostgreSQL**: localhost:5432 (hanotex/postgres/123456)
- **Redis**: localhost:6379

---

## 🔧 Lệnh hữu ích

```bash
# Dừng tất cả
docker-compose down
npm run dev # Ctrl+C để stop

# Khởi động lại database
docker-compose restart

# Xem logs
docker-compose logs -f

# Reset database (xóa hết data)
docker-compose down -v
docker-compose up -d

# Build production
npm run build
npm run start
```

---

## ⚠️ Troubleshooting

### Lỗi port đã sử dụng
```bash
# Kiểm tra process sử dụng port
lsof -i :3000
lsof -i :5432

# Kill process (thay PID)
kill -9 PID
```

### Docker không chạy
```bash
# Mở Docker Desktop app
open -a Docker

# Hoặc khởi động từ Applications
```

### Database connection error
```bash
# Restart containers
docker-compose restart postgres

# Kiểm tra logs
docker-compose logs postgres
```

---

## 📁 Cấu trúc dự án

```
skhcnHN/
├── hanotex-app/          # Vào đây để làm việc
│   ├── apps/web/         # Next.js app
│   ├── database/         # SQL files
│   ├── docker-compose.yml
│   └── package.json
└── docs/                 # Các file hướng dẫn
```

---

## 🎨 Development

### Chạy từng phần
```bash
# Chỉ database
docker-compose up -d postgres redis

# Chỉ web app
cd apps/web
npm run dev
```

### Làm việc với database
```bash
# Kết nối vào PostgreSQL
docker exec -it hanotex-postgres psql -U postgres -d hanotex

# Backup data
docker exec hanotex-postgres pg_dump -U postgres hanotex > backup.sql
```

---

## 💡 Tips

1. **Luôn khởi động Docker Desktop trước**
2. **Sử dụng yarn thay vì npm** (nhanh hơn)
3. **Bookmark pgAdmin** để quản lý database
4. **Ctrl+C để stop dev server** khi cần
5. **docker-compose down -v** để reset hết data

---

*Happy coding! 🚀*

*Cần hỗ trợ? Xem file `HUONG_DAN_CHAY_DU_AN.md` để biết thêm chi tiết.*
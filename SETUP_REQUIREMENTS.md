# DANH SÁCH CÔNG CỤ CẦN CÀI ĐẶT - HANOTEX PROJECT

## 1. CÔNG CỤ PHÁT TRIỂN CƠ BẢN

### 1.1 Node.js & Package Manager
- **Node.js**: Phiên bản 18.x hoặc 20.x (LTS)
  - Download: https://nodejs.org/
  - Kiểm tra: `node --version`
  - Kiểm tra npm: `npm --version`

- **Package Manager** (chọn một):
  - **npm** (đi kèm Node.js)
  - **yarn** (khuyến nghị): `npm install -g yarn`
  - **pnpm** (nhanh nhất): `npm install -g pnpm`

### 1.2 Git & Version Control
- **Git**: Đã có sẵn (đã sử dụng)
  - Kiểm tra: `git --version`
- **GitHub CLI** (tùy chọn): `winget install GitHub.cli`

## 2. CÔNG CỤ PHÁT TRIỂN FRONTEND

### 2.1 Code Editor
- **Visual Studio Code** (khuyến nghị)
  - Download: https://code.visualstudio.com/
  - Extensions cần thiết:
    - ES7+ React/Redux/React-Native snippets
    - Tailwind CSS IntelliSense
    - TypeScript Importer
    - Auto Rename Tag
    - Bracket Pair Colorizer
    - GitLens
    - Prettier - Code formatter
    - ESLint

### 2.2 Browser Developer Tools
- **Chrome DevTools** (đã có sẵn)
- **React Developer Tools** (Extension)
- **Redux DevTools** (Extension)

## 3. CÔNG CỤ PHÁT TRIỂN BACKEND

### 3.1 Database
- **PostgreSQL**: Phiên bản 15+
  - Download: https://www.postgresql.org/download/
  - Hoặc Docker: `docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres`

- **Redis** (cho caching):
  - Download: https://redis.io/download
  - Hoặc Docker: `docker run --name redis -p 6379:6379 -d redis`

### 3.2 Database Management Tools
- **pgAdmin** (PostgreSQL GUI):
  - Download: https://www.pgadmin.org/download/
- **RedisInsight** (Redis GUI):
  - Download: https://redis.com/redis-enterprise/redis-insight/

## 4. CÔNG CỤ CONTAINER & DEPLOYMENT

### 4.1 Docker
- **Docker Desktop**:
  - Download: https://www.docker.com/products/docker-desktop/
  - Kiểm tra: `docker --version`
  - Kiểm tra: `docker-compose --version`

### 4.2 Cloud Services (chọn một)
- **AWS CLI**: `winget install Amazon.AWSCLI`
- **Azure CLI**: `winget install Microsoft.AzureCLI`
- **Google Cloud SDK**: https://cloud.google.com/sdk/docs/install

## 5. CÔNG CỤ TESTING & QUALITY

### 5.1 Testing Tools
- **Jest** (sẽ cài qua npm)
- **Cypress** (sẽ cài qua npm)
- **Playwright** (sẽ cài qua npm)

### 5.2 Code Quality
- **ESLint** (sẽ cài qua npm)
- **Prettier** (sẽ cài qua npm)
- **Husky** (sẽ cài qua npm)

## 6. CÔNG CỤ DESIGN & UI

### 6.1 Design Tools
- **Figma** (Web-based): https://figma.com
- **Adobe XD** (tùy chọn)
- **Sketch** (Mac only)

### 6.2 Icon & Assets
- **Lucide Icons** (sẽ cài qua npm)
- **Heroicons** (sẽ cài qua npm)

## 7. CÔNG CỤ MONITORING & ANALYTICS

### 7.1 Development Monitoring
- **Sentry** (sẽ cài qua npm)
- **LogRocket** (sẽ cài qua npm)

### 7.2 Analytics
- **Google Analytics** (tích hợp)
- **Mixpanel** (tích hợp)

## 8. CÔNG CỤ API DEVELOPMENT

### 8.1 API Testing
- **Postman**:
  - Download: https://www.postman.com/downloads/
- **Insomnia** (alternative):
  - Download: https://insomnia.rest/download

### 8.2 API Documentation
- **Swagger UI** (sẽ cài qua npm)
- **Postman** (đã liệt kê ở trên)

## 9. CÔNG CỤ SECURITY

### 9.1 Security Testing
- **OWASP ZAP** (tùy chọn):
  - Download: https://owasp.org/www-project-zap/

### 9.2 SSL/TLS
- **Let's Encrypt** (cho production)
- **mkcert** (cho local development): `winget install FiloSottile.mkcert`

## 10. CÔNG CỤ PERFORMANCE

### 10.1 Performance Monitoring
- **Lighthouse** (Chrome DevTools)
- **WebPageTest** (online tool)

### 10.2 Bundle Analysis
- **webpack-bundle-analyzer** (sẽ cài qua npm)
- **source-map-explorer** (sẽ cài qua npm)

---

## HƯỚNG DẪN CÀI ĐẶT NHANH

### Bước 1: Cài đặt Node.js
```bash
# Download từ https://nodejs.org/
# Chọn phiên bản LTS (18.x hoặc 20.x)
# Cài đặt với tùy chọn mặc định
```

### Bước 2: Cài đặt Package Manager
```bash
# Cài đặt yarn (khuyến nghị)
npm install -g yarn

# Hoặc cài đặt pnpm (nhanh nhất)
npm install -g pnpm
```

### Bước 3: Cài đặt Docker
```bash
# Download Docker Desktop từ https://www.docker.com/products/docker-desktop/
# Khởi động Docker Desktop
```

### Bước 4: Cài đặt Database
```bash
# PostgreSQL
# Download từ https://www.postgresql.org/download/
# Hoặc sử dụng Docker:
docker run --name hanotex-postgres -e POSTGRES_PASSWORD=hanotex123 -e POSTGRES_DB=hanotex -p 5432:5432 -d postgres

# Redis
# Download từ https://redis.io/download
# Hoặc sử dụng Docker:
docker run --name hanotex-redis -p 6379:6379 -d redis
```

### Bước 5: Cài đặt VS Code Extensions
```bash
# Mở VS Code và cài đặt các extensions:
# - ES7+ React/Redux/React-Native snippets
# - Tailwind CSS IntelliSense
# - TypeScript Importer
# - Prettier - Code formatter
# - ESLint
# - GitLens
```

---

## KIỂM TRA CÀI ĐẶT

Sau khi cài đặt, chạy các lệnh sau để kiểm tra:

```bash
# Kiểm tra Node.js
node --version
npm --version

# Kiểm tra Package Manager
yarn --version
# hoặc
pnpm --version

# Kiểm tra Git
git --version

# Kiểm tra Docker
docker --version
docker-compose --version

# Kiểm tra PostgreSQL
psql --version

# Kiểm tra Redis
redis-cli --version
```

---

## LƯU Ý QUAN TRỌNG

1. **Node.js**: Cần phiên bản 18.x trở lên để hỗ trợ các tính năng mới
2. **Docker**: Cần thiết cho việc chạy database và các service khác
3. **VS Code**: Khuyến nghị sử dụng với các extensions đã liệt kê
4. **Database**: Có thể sử dụng Docker để dễ dàng setup
5. **Package Manager**: Yarn hoặc pnpm sẽ nhanh hơn npm

---

## NEXT STEPS

Sau khi cài đặt xong tất cả công cụ:
1. Khởi động lại terminal/command prompt
2. Chạy lệnh kiểm tra
3. Bắt đầu setup dự án HANOTEX



# HANOTEX - Sàn Giao dịch Công nghệ Hà Nội

## 🚀 Quick Start

### Prerequisites
- Docker Desktop
- Node.js 18+ (nếu chưa có, xem [SETUP_REQUIREMENTS.md](./SETUP_REQUIREMENTS.md))

### 1. Setup Database

#### Prerequisites
- **Docker Desktop** must be installed and running
- Start Docker Desktop and wait for it to fully load

#### Option A: Using Docker (Recommended)
```bash
# Windows:
scripts/start-docker.bat

# This will:
# 1. Check if Docker is running
# 2. Start PostgreSQL, Redis, and pgAdmin
# 3. Create database schema
# 4. Insert sample data
```

#### Option B: Manual Setup
```bash
# Start containers
docker-compose up -d

# Wait for PostgreSQL to be ready
# Then run schema and data scripts
```

### 2. Check Database
```bash
# Quick data check
scripts/quick-check.bat

# Full data check
scripts/check-data.bat

# Connect to PostgreSQL
docker exec -it hanotex-postgres psql -U postgres -d hanotex

# Run schema
\i /docker-entrypoint-initdb.d/schema.sql

# Run sample data
\i /docker-entrypoint-initdb.d/seed_data.sql
```

### 2. Access Services

- **PostgreSQL**: `localhost:5432`
  - Database: `hanotex`
  - Username: `postgres`
  - Password: `123456`

- **Redis**: `localhost:6379`

- **pgAdmin**: http://localhost:5050
  - Email: `admin@hanotex.com`
  - Password: `admin123`

### 3. Sample Data

Database đã được populate với dữ liệu mẫu:

#### Users
- **Admin**: `admin@hanotex.com` / `password123`
- **Individual**: `nguyen.van.a@email.com` / `password123`
- **Company**: `contact@techcorp.vn` / `password123`
- **Research**: `rd@hust.edu.vn` / `password123`

#### Technologies
1. **Hệ thống đốt LPG cho động cơ ô tô** (TRL 7)
2. **Hệ thống AI nhận diện bệnh lý từ hình ảnh y tế** (TRL 6)
3. **Vật liệu composite từ sợi tre** (TRL 5)
4. **Hệ thống IoT giám sát chất lượng nước** (TRL 8)
5. **Thuốc điều trị ung thư từ cây dược liệu** (TRL 4)

#### Categories
- Khoa học tự nhiên
- Khoa học kỹ thuật & công nghệ
- Khoa học y, dược
- Khoa học nông nghiệp

## 📁 Project Structure

```
hanotex-app/
├── apps/
│   ├── web/                 # Next.js Frontend
│   └── api/                 # Node.js Backend API
├── packages/
│   ├── ui/                  # Shared UI Components
│   ├── database/            # Database utilities
│   └── types/               # TypeScript types
├── database/
│   ├── schema.sql           # Database schema
│   ├── seed_data.sql        # Sample data
│   └── setup.sql            # Setup script
├── scripts/
│   ├── setup-database.bat   # Windows setup script
│   └── setup-database.sh    # Linux/Mac setup script
├── docker-compose.yml       # Docker services
└── README.md
```

## 🛠️ Development

### Database Commands
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Reset database
docker-compose down -v
docker-compose up -d
```

### Database Connection
```bash
# Connect via Docker
docker exec -it hanotex-postgres psql -U postgres -d hanotex

# Connect via pgAdmin
# Open http://localhost:5050
# Add server: host=postgres, port=5432, database=hanotex
```

## 📊 Database Schema

### Core Tables
- `users` - User accounts
- `individual_profiles` - Individual user details
- `company_profiles` - Company details
- `research_profiles` - Research institution details
- `technologies` - Technology listings
- `categories` - Technology taxonomy
- `auctions` - Auction information
- `bids` - Bid records
- `transactions` - Transaction records

### Key Features
- **Multi-user types**: Individual, Company, Research Institution
- **Technology taxonomy**: Hierarchical categories
- **IP management**: Patents, trademarks, etc.
- **Auction system**: English, Dutch, Sealed bid
- **Pricing models**: Appraisal, Ask, Auction, Offer
- **Document management**: File uploads and storage

## 🔧 Configuration

### Environment Variables
Create `.env.local` file:
```env
# Database
DATABASE_URL=postgresql://postgres:123456@localhost:5432/hanotex
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Technologies
- `GET /api/technologies` - List technologies
- `GET /api/technologies/:id` - Get technology details
- `POST /api/technologies` - Create technology
- `PUT /api/technologies/:id` - Update technology
- `DELETE /api/technologies/:id` - Delete technology

### Auctions
- `GET /api/auctions` - List auctions
- `GET /api/auctions/:id` - Get auction details
- `POST /api/auctions/:id/bid` - Place bid
- `GET /api/auctions/:id/bids` - Get auction bids

## 🚀 Next Steps

1. ✅ Database setup complete
2. 🔄 Setup backend API
3. 🔄 Setup frontend application
4. 🔄 Implement authentication
5. 🔄 Create technology registration form
6. 🔄 Implement auction system

## 📞 Support

For issues or questions:
- Check [SETUP_REQUIREMENTS.md](./SETUP_REQUIREMENTS.md) for installation help
- Review database logs: `docker-compose logs postgres`
- Check container status: `docker-compose ps`

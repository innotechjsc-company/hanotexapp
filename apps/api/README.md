# HANOTEX Backend API

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (running via Docker)
- Redis (optional, for caching)

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
# Copy environment file
cp env.example .env

# Edit .env file with your configuration
# Database credentials should match your PostgreSQL setup
```

### 3. Start Development Server
```bash
# Start with hot reload
npm run dev

# Or build and start
npm run build
npm start
```

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh token

### Technologies
- `GET /api/v1/technologies` - List technologies (with search/filter)
- `GET /api/v1/technologies/:id` - Get technology details
- `POST /api/v1/technologies` - Create technology (authenticated)
- `PUT /api/v1/technologies/:id` - Update technology (owner only)
- `DELETE /api/v1/technologies/:id` - Delete technology (owner only)
- `POST /api/v1/technologies/:id/submit` - Submit for approval

### Users
- `GET /api/v1/users` - List users (admin only)
- `GET /api/v1/users/:id` - Get user profile
- `PUT /api/v1/users/:id` - Update user profile
- `POST /api/v1/users/:id/verify` - Verify user (admin only)
- `POST /api/v1/users/:id/deactivate` - Deactivate user (admin only)

### Categories
- `GET /api/v1/categories` - List all categories
- `GET /api/v1/categories/:id` - Get category details
- `GET /api/v1/categories/:id/technologies` - Get technologies by category

### Auctions
- `GET /api/v1/auctions` - List active auctions
- `GET /api/v1/auctions/:id` - Get auction details
- `POST /api/v1/auctions` - Create auction (authenticated)
- `POST /api/v1/auctions/:id/bid` - Place bid (authenticated)
- `GET /api/v1/auctions/:id/bids` - Get auction bids

## 🔧 Configuration

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://postgres:123456@localhost:5432/hanotex
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hanotex
DB_USER=postgres
DB_PASSWORD=123456

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=development
API_VERSION=v1

# CORS
CORS_ORIGIN=http://localhost:3000
```

## 📊 Database Schema

The API connects to PostgreSQL with the following main tables:
- `users` - User accounts
- `individual_profiles` - Individual user details
- `company_profiles` - Company details
- `research_profiles` - Research institution details
- `technologies` - Technology listings
- `categories` - Technology taxonomy
- `auctions` - Auction information
- `bids` - Bid records
- `transactions` - Transaction records

## 🔐 Authentication

The API uses JWT tokens for authentication:
1. Login with email/password to get access token
2. Include token in Authorization header: `Bearer <token>`
3. Token expires in 7 days (configurable)
4. Use refresh endpoint to get new token

## 📝 API Response Format

All API responses follow this format:
```json
{
  "success": true|false,
  "data": {...},
  "message": "Optional message",
  "error": "Error message if success is false",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📚 API Documentation

Once the server is running, visit:
- Health check: http://localhost:3001/health
- API root: http://localhost:3001/
- API endpoints: http://localhost:3001/api/v1/

## 🚀 Production Deployment

1. Set `NODE_ENV=production`
2. Configure production database
3. Set secure JWT secrets
4. Enable HTTPS
5. Configure reverse proxy (nginx)
6. Set up monitoring and logging

## 🔍 Development

### Project Structure
```
src/
├── config/          # Database and app configuration
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Data models
├── routes/          # API routes
├── services/        # Business logic
├── types/           # TypeScript types
├── utils/           # Utility functions
└── index.ts         # Main server file
```

### Adding New Routes
1. Create route file in `src/routes/`
2. Import and use in `src/index.ts`
3. Add validation schemas in `src/middleware/validation.ts`
4. Add TypeScript types in `src/types/index.ts`

## 🐛 Troubleshooting

### Common Issues
1. **Database connection failed**: Check PostgreSQL is running and credentials are correct
2. **JWT errors**: Ensure JWT_SECRET is set in environment
3. **CORS errors**: Check CORS_ORIGIN matches your frontend URL
4. **Port already in use**: Change PORT in .env file

### Logs
- Development: Console logs with morgan
- Production: Configure proper logging service


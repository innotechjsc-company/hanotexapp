# HANOTEX Frontend

Frontend application cho sàn giao dịch công nghệ HANOTEX được xây dựng với Next.js 14, React 18, TypeScript và Tailwind CSS.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm hoặc yarn
- Backend API đang chạy (port 3001)

### 1. Install Dependencies
```bash
npm install
# hoặc
yarn install
```

### 2. Environment Setup
```bash
# Copy environment file
cp env.example .env.local

# Edit .env.local với cấu hình của bạn
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Start Development Server
```bash
npm run dev
# hoặc
yarn dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── providers.tsx      # Global providers
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── home/             # Home page components
│   ├── layout/           # Layout components
│   └── forms/            # Form components
├── lib/                  # Utility libraries
│   ├── api.ts           # API client
│   └── utils.ts         # Utility functions
├── hooks/               # Custom React hooks
├── store/               # Zustand state management
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── styles/              # Global styles
    └── globals.css      # Tailwind CSS
```

## 🎨 UI Components

### Design System
- **Colors**: Primary (blue), Secondary (green), Accent (yellow), Danger (red)
- **Typography**: Inter font family
- **Spacing**: Consistent spacing scale
- **Shadows**: Soft, medium, strong shadow variants

### Component Library
- **Buttons**: Primary, secondary, outline, ghost variants
- **Forms**: Input, select, textarea, checkbox, radio
- **Cards**: Standard card with header, body, footer
- **Badges**: Status indicators with color coding
- **Alerts**: Info, success, warning, danger variants
- **Loading**: Spinner, skeleton components

## 🔧 Configuration

### Tailwind CSS
- Custom color palette
- Extended spacing and sizing
- Custom animations and keyframes
- Component-based utility classes

### TypeScript
- Strict type checking
- Path aliases for clean imports
- Comprehensive type definitions

### Next.js
- App Router (Next.js 13+)
- Image optimization
- Font optimization
- SEO optimization

## 📱 Features

### Home Page
- **Hero Section**: Main call-to-action với search
- **Featured Technologies**: Công nghệ nổi bật
- **Categories**: Danh mục công nghệ
- **Stats**: Thống kê sàn giao dịch
- **How It Works**: Quy trình hoạt động
- **Testimonials**: Đánh giá người dùng
- **CTA Section**: Call-to-action cuối trang

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interface
- Optimized for all devices

### Performance
- Code splitting
- Image optimization
- Font optimization
- Lazy loading
- SEO optimization

## 🎯 State Management

### Zustand Stores
- **Auth Store**: User authentication state
- **Technology Store**: Technologies và categories
- **Auction Store**: Auctions và bids
- **UI Store**: UI state (modals, notifications)

### React Query
- Server state management
- Caching và synchronization
- Background updates
- Error handling

## 🔐 Authentication

### JWT Token Management
- Automatic token refresh
- Secure storage
- Route protection
- Role-based access

### User Types
- **Individual**: Cá nhân
- **Company**: Doanh nghiệp
- **Research Institution**: Viện/Trường

## 📊 API Integration

### API Client
- Axios-based HTTP client
- Request/response interceptors
- Error handling
- Type-safe API calls

### Endpoints
- Authentication (login, register, profile)
- Technologies (CRUD, search, filter)
- Users (profile management)
- Categories (hierarchical taxonomy)
- Auctions (create, bid, manage)

## 🎨 Styling

### Tailwind CSS Classes
```css
/* Button variants */
.btn-primary    /* Primary button */
.btn-secondary  /* Secondary button */
.btn-outline    /* Outline button */
.btn-ghost      /* Ghost button */

/* Form components */
.form-input     /* Input field */
.form-select    /* Select dropdown */
.form-textarea  /* Textarea */
.form-label     /* Form label */

/* Card components */
.card           /* Card container */
.card-header    /* Card header */
.card-body      /* Card body */
.card-footer    /* Card footer */

/* Badge components */
.badge-primary  /* Primary badge */
.badge-success  /* Success badge */
.badge-warning  /* Warning badge */
.badge-danger   /* Danger badge */
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://api.hanotex.com/api/v1
NEXT_PUBLIC_APP_URL=https://hanotex.com
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

### Run Tests
```bash
npm test
npm run test:coverage
```

### Testing Tools
- Jest (unit testing)
- React Testing Library (component testing)
- Cypress (E2E testing)

## 📈 Performance

### Core Web Vitals
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

### Optimization
- Image optimization
- Code splitting
- Lazy loading
- Caching strategies

## 🔍 SEO

### Meta Tags
- Dynamic title và description
- Open Graph tags
- Twitter Card tags
- Structured data

### Sitemap
- Automatic sitemap generation
- Robots.txt
- Canonical URLs

## 🐛 Troubleshooting

### Common Issues
1. **API Connection Failed**: Kiểm tra backend API đang chạy
2. **Build Errors**: Kiểm tra TypeScript types
3. **Styling Issues**: Kiểm tra Tailwind CSS classes
4. **Authentication Issues**: Kiểm tra JWT token

### Debug Mode
```bash
DEBUG=* npm run dev
```

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details.


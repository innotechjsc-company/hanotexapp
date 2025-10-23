# Quy Tắc Tổng Quan - Dự Án Hanotex

## Giới Thiệu
Đây là dự án Next.js sử dụng App Router với PayloadCMS backend. Dự án tuân theo kiến trúc phân tầng rõ ràng để đảm bảo code dễ bảo trì, mở rộng và test.

## Cấu Trúc Thư Mục

```
src/
├── api/           # API client và endpoint functions
├── app/           # Next.js App Router pages và layouts
├── components/    # Reusable React components
├── constants/     # Application constants và config
├── hooks/         # Custom React hooks
├── lib/           # Third-party library configurations
├── screens/       # Screen-level components
├── services/      # Business logic và external integrations
├── store/         # Global state management (Zustand/Redux)
├── styles/        # Global styles và theme config
├── types/         # TypeScript type definitions
└── utils/         # Pure utility functions
```

## Nguyên Tắc Kiến Trúc

### Phân Tầng (Layered Architecture)
```
┌─────────────────────────────────────┐
│    app/ (Next.js Routes)            │ ← Framework layer
├─────────────────────────────────────┤
│    screens/ (Screen Components)     │ ← Presentation layer
├─────────────────────────────────────┤
│    components/ + hooks/             │ ← UI + Logic layer
├─────────────────────────────────────┤
│    services/ + store/               │ ← Business logic layer
├─────────────────────────────────────┤
│    api/ (API Client)                │ ← Data access layer
├─────────────────────────────────────┤
│    utils/ + constants/ + types/     │ ← Foundation layer
└─────────────────────────────────────┘
```

### Dependency Flow (Chiều phụ thuộc)
- **Top → Bottom**: Các layer trên có thể import từ các layer dưới
- **No circular dependencies**: Tránh import ngược lên

```
app/          →  screens/
screens/      →  components/ + hooks/
components/   →  api/ + services/ + store/
hooks/        →  api/ + services/
services/     →  api/
api/          →  utils/ + constants/ + types/
```

## Quy Tắc Chung

### 1. API Integration
- ✅ **NÊN**: Sử dụng functions từ `/api` cho mọi API calls
- ❌ **KHÔNG**: Gọi fetch() trực tiếp trong components/screens
- ✅ **NÊN**: Wrap API calls trong custom hooks
- ✅ **NÊN**: Handle loading, error, success states

### 2. UI Development
- ✅ **NÊN**: Sử dụng TailwindCSS cho styling
- ✅ **NÊN**: Sử dụng Ant Design components khi phù hợp
- ✅ **NÊN**: Tái sử dụng components từ `/components`
- ❌ **KHÔNG**: Viết inline styles
- ✅ **NÊN**: Đảm bảo responsive design

### 3. State Management
- **Local state**: `useState` trong components
- **Global state**: Store từ `/store` (auth, UI preferences)
- **Server state**: Custom hooks tích hợp với `/api`
- **Form state**: Local state hoặc form libraries (React Hook Form)

### 4. TypeScript
- ✅ **NÊN**: Define types rõ ràng cho props, state, API responses
- ✅ **NÊN**: Import types từ `/types`
- ❌ **KHÔNG**: Sử dụng `any` (dùng `unknown` + type guards)
- ✅ **NÊN**: Export prop types để reuse

### 5. Code Organization
- ✅ **NÊN**: Tách logic phức tạp ra custom hooks
- ✅ **NÊN**: Tách business logic ra services
- ✅ **NÊN**: Keep components small và focused
- ❌ **KHÔNG**: Copy-paste code (tạo reusable utilities)

## Chi Tiết Từng Thư Mục

Mỗi thư mục con có file AGENT.md riêng với quy tắc chi tiết:

### 📁 `/api` - API Layer
- PayloadCMS API client và endpoint functions
- Authentication, token refresh tự động
- Error handling thống nhất
- [Chi tiết →](./api/AGENT.md)

### 📁 `/app` - Next.js Routes
- App Router pages, layouts, loading, error states
- Server vs Client Components
- Metadata cho SEO
- [Chi tiết →](./app/AGENT.md)

### 📁 `/components` - UI Components
- Reusable React components theo feature
- TypeScript props, styling patterns
- Composition và reusability
- [Chi tiết →](./components/AGENT.md)

### 📁 `/constants` - Configuration
- Application constants
- Environment variables wrapper
- Route paths, validation rules
- [Chi tiết →](./constants/AGENT.md)

### 📁 `/hooks` - Custom Hooks
- Data fetching hooks
- Reusable logic hooks
- Hook patterns và best practices
- [Chi tiết →](./hooks/AGENT.md)

### 📁 `/lib` - Library Setup
- Third-party library configurations
- Analytics, monitoring, i18n
- Type-safe wrappers
- [Chi tiết →](./lib/AGENT.md)

### 📁 `/screens` - Screen Components
- High-level view components
- Composition từ components nhỏ
- Screen structure: index.tsx + components/ + hooks/
- [Chi tiết →](./screens/AGENT.md) *(Tiếng Việt)*

### 📁 `/services` - Business Logic
- Service modules cho domains
- External integrations
- localStorage, auth, analytics
- [Chi tiết →](./services/AGENT.md)

### 📁 `/store` - Global State
- Zustand/Redux store configuration
- State management strategy
- Store patterns và best practices
- [Chi tiết →](./store/AGENT.md)

### 📁 `/styles` - Styling
- Global CSS, theme configuration
- TailwindCSS setup
- CSS variables, dark mode
- [Chi tiết →](./styles/AGENT.md)

### 📁 `/types` - Type Definitions
- TypeScript interfaces và types
- API types, domain entities
- Utility types
- [Chi tiết →](./types/AGENT.md)

### 📁 `/utils` - Utilities
- Pure utility functions
- Date, string, number formatters
- Validation helpers
- [Chi tiết →](./utils/AGENT.md)

## Workflow Phát Triển Tính Năng Mới

### 1. Planning
1. Định nghĩa requirements
2. Xác định types trong `/types`
3. Thiết kế API endpoints trong `/api`
4. Plan components và screens

### 2. Implementation
```
1. Types       → Định nghĩa interfaces trong /types
2. API         → Tạo API functions trong /api
3. Hooks       → Tạo data fetching hooks trong /hooks
4. Components  → Tạo UI components trong /components
5. Screens     → Compose screen từ components
6. Routes      → Tạo routes trong /app
```

### 3. Best Practices
- Start từ bottom-up: types → api → hooks → components → screens → routes
- Reuse existing code trước khi tạo mới
- Keep components small (< 200 lines)
- Keep screens focused (< 300 lines)
- Extract reusable logic vào hooks/utils
- Document complex logic

## Testing Strategy
- **Unit tests**: Utils, services, pure functions
- **Integration tests**: Hooks, API functions
- **Component tests**: Components với React Testing Library
- **E2E tests**: Critical user flows với Playwright/Cypress

## Performance Guidelines
- Use Server Components khi có thể
- Lazy load heavy components
- Optimize images (next/image)
- Implement proper caching strategies
- Profile và optimize re-renders
- Code splitting routes

## Accessibility (A11y)
- Semantic HTML
- ARIA attributes khi cần
- Keyboard navigation
- Screen reader testing
- Color contrast compliance

## Git Workflow
- Feature branches: `feature/feature-name`
- Commit messages: Conventional Commits format
- PR reviews required
- Keep commits atomic và meaningful

## Environment Variables
- Development: `.env.local`
- Production: Set via hosting platform
- Always use `NEXT_PUBLIC_` prefix cho client-side variables
- Never commit secrets to Git

## Useful Commands
```bash
# Development
npm run dev

# Build
npm run build

# Lint
npm run lint

# Type check
npm run type-check

# Tests
npm run test
```

## Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Ant Design Documentation](https://ant.design/components/overview)

## Support
Nếu có thắc mắc về architecture hoặc coding patterns:
1. Đọc AGENT.md trong thư mục tương ứng
2. Tham khảo existing code trong codebase
3. Hỏi team lead hoặc senior developers

---

**Lưu ý**: Document này và các AGENT.md trong từng thư mục được tạo ra để hỗ trợ AI agents và developers hiểu rõ cấu trúc và quy tắc của dự án.

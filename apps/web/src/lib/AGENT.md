# Quy Tắc Thư Mục Lib

## Mục Đích
Thư mục này chứa configurations, initializations, và wrappers cho third-party libraries và external integrations.

## Hướng Dẫn

### Tích Hợp Library Phổ Biến
1. **Analytics**: Google Analytics, Mixpanel, Segment
2. **Monitoring**: Sentry, LogRocket, DataDog
3. **UI Libraries**: Tailwind config, styled-components theme
4. **Form Libraries**: React Hook Form, Formik setup
5. **Data Fetching**: React Query, SWR configuration
6. **Authentication**: Auth0, Firebase, NextAuth setup
7. **i18n**: Internationalization configuration
8. **Charts**: Chart.js, Recharts configuration

### Tổ Chức File
- Một file cho một library: `analytics.ts`, `sentry.ts`, `reactQuery.ts`
- Export configured instances hoặc initialization functions
- Giữ library-specific logic biệt lập
- Cung cấp type-safe wrappers khi cần

### Example Structure
```typescript
// analytics.ts
import { Analytics } from '@segment/analytics-next';

export const analytics = new Analytics({
  writeKey: process.env.NEXT_PUBLIC_SEGMENT_KEY!,
});

export const trackEvent = (event: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    analytics.track(event, properties);
  }
};

// sentry.ts
import * as Sentry from '@sentry/nextjs';

export const initSentry = () => {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    enabled: process.env.NODE_ENV === 'production',
  });
};

// reactQuery.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});
```

### Best Practices
- Tập trung library configuration ở một nơi
- Cung cấp type-safe wrappers cho DX tốt hơn
- Xử lý environment-specific configuration
- Document các environment variables bắt buộc
- Export initialized instances, không phải raw libraries
- Xử lý SSR considerations (check for `window`, `document`)
- Implement error boundaries cho library failures
- Giữ library versions đồng bộ trong toàn app

### Wrapper Functions
- Tạo wrapper functions để abstract library specifics
- Cung cấp consistent API trong toàn app
- Dễ dàng thay thế libraries trong tương lai
- Thêm application-specific defaults

```typescript
// Thay vì sử dụng library trực tiếp trong components:
import { toast } from 'react-toastify';

// Tạo wrapper:
// lib/notifications.ts
export const showSuccess = (message: string) => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 3000,
  });
};

export const showError = (message: string) => {
  toast.error(message, {
    position: 'top-right',
    autoClose: 5000,
  });
};
```

### Server vs Client
- Đánh dấu client-only libraries với 'use client' directive
- Xử lý SSR-safe initialization
- Sử dụng dynamic imports cho large client-only libraries
- Kiểm tra browser APIs trước khi sử dụng

### Testing
- Mock library instances trong tests
- Cung cấp test utilities để mock library functions
- Export mock versions cho Storybook

### Quản Lý Version
- Document library versions trong README
- Giữ peer dependencies đồng bộ
- Test major version upgrades kỹ lưỡng

### Quy Ước Bổ Sung
- ✅ **NÊN**: Tạo abstraction layer cho mọi third-party library
- ✅ **NÊN**: Sử dụng TypeScript để type library configs
- ❌ **KHÔNG**: Import libraries trực tiếp trong components - dùng wrappers
- ✅ **NÊN**: Lazy load heavy libraries khi có thể
- ✅ **NÊN**: Document tất cả configuration options
- ❌ **KHÔNG**: Hard-code library configs - sử dụng environment variables
- ✅ **NÊN**: Implement fallbacks cho khi libraries fail
- ✅ **NÊN**: Kiểm tra library size trước khi add vào project

# Lib Folder Rules

## Purpose
This folder contains configurations, initializations, and wrappers for third-party libraries and external integrations.

## Guidelines

### Common Library Integrations
1. **Analytics**: Google Analytics, Mixpanel, Segment
2. **Monitoring**: Sentry, LogRocket, DataDog
3. **UI Libraries**: Tailwind config, styled-components theme
4. **Form Libraries**: React Hook Form, Formik setup
5. **Data Fetching**: React Query, SWR configuration
6. **Authentication**: Auth0, Firebase, NextAuth setup
7. **i18n**: Internationalization configuration
8. **Charts**: Chart.js, Recharts configuration

### File Organization
- One file per library: `analytics.ts`, `sentry.ts`, `reactQuery.ts`
- Export configured instances or initialization functions
- Keep library-specific logic isolated
- Provide type-safe wrappers when needed

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
- Centralize library configuration in one place
- Provide type-safe wrappers for better DX
- Handle environment-specific configuration
- Document required environment variables
- Export initialized instances, not raw libraries
- Handle SSR considerations (check for `window`, `document`)
- Implement error boundaries for library failures
- Keep library versions in sync across the app

### Wrapper Functions
- Create wrapper functions to abstract library specifics
- Provide consistent API across the app
- Make it easier to swap libraries in the future
- Add application-specific defaults

```typescript
// Instead of using library directly in components:
import { toast } from 'react-toastify';

// Create a wrapper:
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
- Mark client-only libraries with 'use client' directive
- Handle SSR-safe initialization
- Use dynamic imports for large client-only libraries
- Check for browser APIs before using

### Testing
- Mock library instances in tests
- Provide test utilities that mock library functions
- Export mock versions for Storybook

### Version Management
- Document library versions in README
- Keep peer dependencies in sync
- Test major version upgrades thoroughly

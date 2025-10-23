# Constants Folder Rules

## Purpose
This folder contains application-wide constants, configuration values, and static data.

## Guidelines

### Constant Categories
1. **API Constants**: Endpoints, base URLs, API keys (non-sensitive)
2. **UI Constants**: Colors, sizes, breakpoints, z-index values
3. **Route Constants**: Application routes and paths
4. **Validation Constants**: Regex patterns, min/max values, rules
5. **Business Constants**: Status values, types, categories
6. **Configuration**: Feature flags, limits, thresholds

### Naming Conventions
- Use UPPER_SNAKE_CASE for primitive constants
- Use PascalCase for constant objects
- Prefix related constants with common prefix
- Use descriptive names that explain purpose

### Example Structure
```typescript
// routes.ts
export const ROUTES = {
  HOME: '/',
  AUCTION: '/auction',
  AUCTION_DETAIL: '/auction/:id',
  MY_PROPOSALS: '/my-proposals',
  SETTINGS: '/settings',
} as const;

// validation.ts
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^[0-9]{10}$/;
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// status.ts
export const AUCTION_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  CLOSED: 'closed',
  CANCELLED: 'cancelled',
} as const;

export type AuctionStatus = typeof AUCTION_STATUS[keyof typeof AUCTION_STATUS];
```

### Best Practices
- Use `as const` for object constants to get literal types
- Group related constants in single files
- Export constants as named exports
- Don't duplicate values - reference existing constants
- Document complex constants with comments
- Use TypeScript utility types to derive types from constants
- Never store secrets or sensitive data here (use environment variables)

### Environment Variables
- Access environment variables through a config file
- Provide fallback values
- Validate required environment variables on startup
- Use type-safe wrappers

```typescript
// config.ts
export const Config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  isProduction: process.env.NODE_ENV === 'production',
  featureFlags: {
    enableNewUI: process.env.NEXT_PUBLIC_ENABLE_NEW_UI === 'true',
  },
} as const;
```

### Magic Numbers
- Replace magic numbers with named constants
- Add comments explaining the meaning
- Group related numeric constants

```typescript
// Instead of: if (users.length > 100)
export const MAX_USERS_PER_PAGE = 100;
// Use: if (users.length > MAX_USERS_PER_PAGE)
```

### TypeScript Integration
- Export types derived from constants
- Use const assertions for immutability
- Leverage union types from constant objects

### What to Avoid
- Mutable constants (use Object.freeze or as const)
- Function calls in constant definitions (unless truly constant)
- Importing from components or hooks (constants should be low-level)
- Overly specific constants used only once

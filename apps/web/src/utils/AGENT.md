# Utils Folder Rules

## Purpose
This folder contains pure utility functions, helpers, and common utilities used throughout the application.

## Guidelines

### Utility Categories
1. **Date/Time**: Formatting, parsing, calculations
2. **String**: Manipulation, validation, formatting
3. **Number**: Formatting, calculations, currency
4. **Array**: Filtering, sorting, grouping, deduplication
5. **Object**: Deep clone, merge, pick, omit
6. **Validation**: Email, phone, URL, custom validators
7. **Formatting**: Currency, numbers, dates, names
8. **URL**: Query params, path manipulation
9. **File**: Size formatting, type checking, name sanitization

### Utility Function Guidelines
- Keep functions pure (no side effects)
- One function per responsibility
- Use TypeScript for type safety
- Export as named exports
- Group related utilities in single files

### Example Structure
```typescript
// dateUtils.ts
export const formatDate = (date: Date, format: string): string => {
  // Implementation
};

export const isDateInPast = (date: Date): boolean => {
  return date < new Date();
};

export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
```

### Best Practices
- Write pure, testable functions
- Handle edge cases and null/undefined inputs
- Use meaningful parameter names
- Add JSDoc comments for complex utilities
- Avoid dependencies on React or external libraries when possible
- Consider using established libraries (lodash, date-fns) for complex operations
- Create utility types in `/types` for utility function signatures

### Common Utility Patterns
```typescript
// Null-safe accessor
export const getNestedValue = <T>(
  obj: unknown,
  path: string,
  defaultValue?: T
): T | undefined => {
  // Implementation
};

// Debounce
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  // Implementation
};

// Currency formatter
export const formatCurrency = (
  amount: number,
  currency = 'VND'
): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency,
  }).format(amount);
};
```

### Testing
- Utils should have high test coverage
- Test edge cases thoroughly
- Use pure functions for easy testing
- Mock external dependencies

### What NOT to Include
- React hooks (use `/hooks`)
- API calls (use `/api`)
- Business logic (use `/services`)
- Component helpers (co-locate with components)

# Types Folder Rules

## Purpose
This folder contains TypeScript type definitions, interfaces, and type utilities for the entire application.

## Guidelines

### Organization
- Group related types in single files by domain
- Use descriptive file names: `auction.types.ts`, `user.types.ts`
- Export all types as named exports
- Consider creating an `index.ts` for barrel exports

### Type Definitions
- Use `interface` for object shapes that may be extended
- Use `type` for unions, intersections, and utility types
- Prefix generic type names with `T` when appropriate
- Use PascalCase for type and interface names

### Best Practices
- Keep types DRY - reuse and compose types
- Document complex types with JSDoc comments
- Use utility types: `Partial<T>`, `Pick<T>`, `Omit<T>`, `Record<K,V>`
- Avoid `any` - use `unknown` and type guards
- Define discriminated unions for complex state
- Export prop types from component folders when appropriate

### API Types
- Define request/response types for all API endpoints
- Keep API types synchronized with backend schemas
- Use generics for paginated responses
- Define error types consistently

### Common Patterns
```typescript
// Domain entity
export interface User {
  id: string;
  name: string;
  email: string;
}

// API response wrapper
export type UserResponse = ApiResponse<User>;

// Form data (subset of entity)
export type UserFormData = Omit<User, 'id'>;

// Update payload (all fields optional)
export type UserUpdateData = Partial<UserFormData>;
```

### Enums vs Union Types
- Prefer union types over enums for simple string constants
- Use enums when you need reverse mapping or complex behavior
- Consider `as const` for readonly constant objects

### Avoid
- Circular type dependencies
- Overly complex nested types
- Type assertions (`as`) unless absolutely necessary
- Implicit `any` types

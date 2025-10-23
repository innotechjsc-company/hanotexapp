# Services Folder Rules

## Purpose
This folder contains service modules that encapsulate business logic, external integrations, and utility functions that don't fit in pure API or hooks.

## Existing Services
- `localstorage`: Client-side storage management (tokens, user preferences, cache)

## Guidelines

### Service Structure
- Create service modules for specific domains or integrations
- Export service object or individual functions
- Keep services stateless when possible
- Use classes for services that need internal state or lifecycle

### Common Service Types
1. **Storage Services**: localStorage, sessionStorage, IndexedDB
2. **Authentication Services**: Token management, session handling
3. **Analytics Services**: Event tracking, metrics
4. **Notification Services**: Push notifications, toast messages
5. **WebSocket Services**: Real-time communication
6. **File Services**: Upload, download, processing
7. **Validation Services**: Form validation, data sanitization

### Best Practices
- Services should be framework-agnostic
- Use dependency injection when appropriate
- Handle errors gracefully with try-catch
- Provide type-safe interfaces
- Document service methods with JSDoc
- Make services testable (pure functions or mockable classes)
- Avoid tight coupling with React components
- Use singleton pattern for services that manage global state

### Storage Service Pattern
```typescript
export const storageService = {
  setItem: (key: string, value: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },
  
  getItem: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Storage error:', error);
      return null;
    }
  },
  
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  }
};
```

### Integration with Other Layers
- Services can be used by hooks, components, and API layer
- Services should not import from `/components` or `/screens`
- Services can use `/api` clients and `/types`
- Keep services at a lower level of abstraction than hooks

### Error Handling
- Services should throw meaningful errors
- Use custom error classes when appropriate
- Log errors for debugging
- Don't swallow errors silently

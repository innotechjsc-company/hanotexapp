# Store Folder Rules

## Purpose
This folder contains global state management configuration and stores (Zustand, Redux, or similar).

## Guidelines

### State Management Strategy
- Use global store for truly global state (user auth, theme, app settings)
- Prefer local state (useState) for component-specific state
- Use server state libraries (React Query, SWR) for API data
- Keep the store minimal and focused

### Store Structure
- One file per store domain: `authStore.ts`, `uiStore.ts`
- Export hooks to access store: `useAuthStore`, `useUIStore`
- Define TypeScript interfaces for store state and actions
- Use slices or modules for large stores

### Common Store Patterns (Zustand Example)
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  
  login: async (credentials) => {
    const { user, token } = await authApi.login(credentials);
    set({ user, token, isAuthenticated: true });
  },
  
  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
  },
  
  setUser: (user) => set({ user }),
}));
```

### Best Practices
- Keep actions simple and focused
- Use immer for immutable updates (if not built-in)
- Implement selectors for derived state
- Avoid storing server state - use React Query instead
- Persist critical state to localStorage when needed
- Use middleware for logging, persistence, or devtools
- Document state shape and actions

### What to Store
**DO Store:**
- Authentication state (user, token)
- UI state (theme, sidebar open/closed, modals)
- User preferences
- App-wide settings
- WebSocket connection state

**DON'T Store:**
- API response data (use React Query/SWR)
- Form state (use local state or form libraries)
- Derived state (compute on-the-fly)
- Temporary UI state

### Integration
- Import store hooks in components and hooks
- Don't access store directly outside of React
- Use store actions for state mutations
- Combine with localStorage service for persistence
- Test store actions independently

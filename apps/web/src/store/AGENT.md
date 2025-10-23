# Quy Tắc Thư Mục Store

## Mục Đích
Thư mục này chứa global state management configuration và stores (Zustand, Redux, hoặc tương tự).

## Hướng Dẫn

### Chiến Lược Quản Lý State
- Sử dụng global store cho truly global state (user auth, theme, app settings)
- Ưu tiên local state (useState) cho component-specific state
- Sử dụng server state libraries (React Query, SWR) cho API data
- Giữ store minimal và focused

### Cấu Trúc Store
- Một file cho một store domain: `authStore.ts`, `uiStore.ts`
- Export hooks để truy cập store: `useAuthStore`, `useUIStore`
- Định nghĩa TypeScript interfaces cho store state và actions
- Sử dụng slices hoặc modules cho large stores

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
- Giữ actions simple và focused
- Sử dụng immer cho immutable updates (nếu không built-in)
- Implement selectors cho derived state
- Tránh lưu server state - sử dụng React Query thay thế
- Persist critical state vào localStorage khi cần
- Sử dụng middleware cho logging, persistence, hoặc devtools
- Document state shape và actions

### Nên Lưu Gì
**NÊN LƯƯ:**
- Authentication state (user, token)
- UI state (theme, sidebar open/closed, modals)
- User preferences
- App-wide settings
- WebSocket connection state

**KHÔNG NÊN LƯƯ:**
- API response data (dùng React Query/SWR)
- Form state (dùng local state hoặc form libraries)
- Derived state (tính toán on-the-fly)
- Temporary UI state

### Tích Hợp
- Import store hooks trong components và hooks
- KHÔNG truy cập store trực tiếp ngoài React
- Sử dụng store actions cho state mutations
- Kết hợp với localStorage service cho persistence
- Test store actions độc lập

### Quy Ước Bổ Sung
- ✅ **NÊN**: Tách store theo domain (auth, ui, user, etc.)
- ✅ **NÊN**: Sử dụng selectors thay vì access state trực tiếp
- ❌ **KHÔNG**: Lưu cả app state trong một store duy nhất
- ✅ **NÊN**: Implement reset actions để clear state
- ✅ **NÊN**: Sử dụng TypeScript cho type-safe stores
- ❌ **KHÔNG**: Mutate state trực tiếp - dùng actions
- ✅ **NÊN**: Log state changes trong development mode
- ✅ **NÊN**: Implement hydration logic cho SSR/SSG
- ✅ **NÊN**: Document khi nào nên dùng store vs local state

# Quy Tắc Thư Mục Hooks

## Mục Đích
Thư mục này chứa custom React hooks cho reusable logic, data fetching, và side effects.

## Hooks Hiện Có
- `useBids.ts`: Bid-related data và operations
- `useCategories.ts`: Category data management
- `useMasterData.ts`: Master/reference data fetching
- `useNewsLike.ts`: News like functionality
- `useResearchInstitutions.ts`: Research institution data
- `useSEO.ts`: SEO metadata management
- `useUsers.ts`, `useUsersPayload.ts`: User data management
- `useWebSocket.ts`: WebSocket connection management

## Hướng Dẫn

### Tạo Custom Hooks
1. Đặt tên hooks với prefix `use` (React convention)
2. Tên file phải khớp với tên hook: `useFeatureName.ts`
3. Return values dưới dạng object cho rõ ràng: `{ data, loading, error, refetch }`
4. Sử dụng TypeScript cho parameter và return type safety

### Data Fetching Hooks
- Tích hợp với API layer từ `/api`
- Quản lý loading, error, và success states
- Implement refetch/retry functionality
- Cache data khi phù hợp
- Xử lý cleanup trong useEffect returns

### Hook Patterns
```typescript
export const useResourceName = (params?) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    // Implementation
  };

  useEffect(() => {
    fetchData();
    // Cleanup if needed
  }, [dependencies]);

  return { data, loading, error, refetch: fetchData };
};
```

### Best Practices
- Giữ hooks tập trung vào single responsibility
- Document hook parameters và return values
- Xử lý component unmounting (cleanup)
- Sử dụng dependency arrays đúng cách trong useEffect
- Tránh side effects trong render phase
- Cân nhắc sử dụng React Query hoặc SWR cho complex data fetching
- Làm hooks testable và reusable
- KHÔNG gọi hooks conditionally
- Tách common patterns thành shared hooks

### Quy Ước Bổ Sung
- ✅ **NÊN**: Return cả loading state và error state
- ✅ **NÊN**: Implement abort controller cho requests có thể hủy
- ✅ **NÊN**: Sử dụng useCallback cho functions được return
- ❌ **KHÔNG**: Fetch data trong hooks mà không có cleanup
- ✅ **NÊN**: Provide refetch function để manually trigger
- ✅ **NÊN**: Handle race conditions cho async operations
- ❌ **KHÔNG**: Gọi API trực tiếp - sử dụng `/api` layer
- ✅ **NÊN**: Sử dụng TypeScript generics cho flexible hooks
- ✅ **NÊN**: Implement debounce/throttle cho hooks tìm kiếm

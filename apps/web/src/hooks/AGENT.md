# Hooks Folder Rules

## Purpose
This folder contains custom React hooks for reusable logic, data fetching, and side effects.

## Existing Hooks
- `useBids.ts`: Bid-related data and operations
- `useCategories.ts`: Category data management
- `useMasterData.ts`: Master/reference data fetching
- `useNewsLike.ts`: News like functionality
- `useResearchInstitutions.ts`: Research institution data
- `useSEO.ts`: SEO metadata management
- `useUsers.ts`, `useUsersPayload.ts`: User data management
- `useWebSocket.ts`: WebSocket connection management

## Guidelines

### Creating Custom Hooks
1. Name hooks with `use` prefix (React convention)
2. File name should match hook name: `useFeatureName.ts`
3. Return values in object format for clarity: `{ data, loading, error, refetch }`
4. Use TypeScript for parameter and return type safety

### Data Fetching Hooks
- Integrate with API layer from `/api`
- Manage loading, error, and success states
- Implement refetch/retry functionality
- Cache data when appropriate
- Handle cleanup in useEffect returns

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
- Keep hooks focused on single responsibility
- Document hook parameters and return values
- Handle component unmounting (cleanup)
- Use dependency arrays correctly in useEffect
- Avoid side effects in render phase
- Consider using React Query or SWR for complex data fetching
- Make hooks testable and reusable
- Don't call hooks conditionally
- Extract common patterns into shared hooks

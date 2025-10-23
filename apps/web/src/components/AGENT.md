# Components Folder Rules

## Purpose
This folder contains reusable React components organized by feature/domain.

## Structure
- Feature-based folders: `admin/`, `auction/`, `auth/`, `demands/`, `home/`, etc.
- Shared UI components: `input/`, `layout/`
- Standalone components: `DescriptionEditor.tsx`, `DownloadTest.tsx`

## Guidelines

### Component Creation
1. Group related components in feature folders
2. Use PascalCase for component files: `ComponentName.tsx`
3. Export components as named exports when possible
4. Keep components focused on single responsibility

### TypeScript
- Define prop interfaces explicitly
- Use `React.FC<Props>` or functional component syntax
- Avoid `any` types - use `unknown` and type guards if needed
- Export prop types for reusability

### Styling
- Use consistent styling approach (check project's styling system)
- Co-locate styles with components when appropriate
- Follow existing class naming conventions

### State Management
- Use local state for component-specific data
- Use global store (see `/store`) for shared application state
- Leverage custom hooks (see `/hooks`) for complex logic

### API Integration
- Import API functions from `/api`
- Handle loading, error, and success states
- Use custom hooks for data fetching when applicable
- Never call API directly - always go through the API layer

### Best Practices
- Keep components small and composable
- Extract reusable logic into custom hooks
- Use meaningful component and prop names
- Add comments for complex logic
- Handle edge cases and loading states
- Make components accessible (ARIA attributes, semantic HTML)
- Memoize expensive computations with useMemo/useCallback when needed

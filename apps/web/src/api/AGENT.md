# API Folder Rules

## Purpose
This folder contains PayloadCMS API client implementation and all endpoint-specific API functions.

## Architecture
- `client.ts`: Core PayloadApiClient class with authentication, request handling, and token refresh logic
- `config.ts`: API configuration constants (base URL, headers, timeout)
- Individual files: Domain-specific API functions (auctions, auth, bids, categories, etc.)

## Guidelines

### Adding New Endpoints
1. Create a new file named after the resource (e.g., `users.ts`, `orders.ts`)
2. Import the API client from `./client`
3. Define TypeScript interfaces for request/response types
4. Export functions that use the client methods (get, post, patch, delete)
5. Follow the existing pattern: `export const fetchResourceName = async (params) => { ... }`

### Authentication
- The client automatically handles token injection via `Authorization` header
- Token refresh is automatic on 401 responses
- Use `localStorageService` for persistent token storage
- Never hardcode tokens or credentials

### Error Handling
- All API errors follow the `ApiError` interface
- Handle timeout errors (408 status)
- Provide meaningful error messages
- Use try-catch blocks in consuming code

### Response Format
- All responses follow `ApiResponse<T>` interface
- Paginated responses include: `docs`, `totalDocs`, `limit`, `page`, `totalPages`, etc.
- Single resource responses use `data` field
- Check for `errors` array in failed responses

### Best Practices
- Use TypeScript generics for type-safe responses
- Keep endpoint functions pure and focused
- Document query parameters in function signatures
- Use consistent naming: `fetch*`, `create*`, `update*`, `delete*`
- Handle query string parameters via the `params` object in GET requests
- Always validate required parameters before making requests

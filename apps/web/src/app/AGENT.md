# Quy Tắc Thư Mục App (Next.js App Router)

## Mục Đích
Thư mục này chứa Next.js 13+ App Router pages, layouts, và route-specific components.

## Cấu Trúc
Routes tuân theo file-system based routing convention:
- `admin/`: Admin dashboard pages
- `auction/`: Auction-related pages
- `auth/`: Authentication pages
- `contact/`: Contact page
- `demands/`: Technology demand pages
- `messages/`: Messaging interface
- `my-proposals/`: User proposals
- `my-investments/`: User investments
- `settings/`: User settings
- `technologies/`: Technology catalog
- Static pages: `privacy/`, `terms/`, `faq/`, `refund-policy/`, `user-guide/`

## Hướng Dẫn

### Page Components
- Sử dụng `page.tsx` cho route endpoints
- Sử dụng `layout.tsx` cho shared layouts
- Sử dụng `loading.tsx` cho loading states
- Sử dụng `error.tsx` cho error boundaries
- Sử dụng `not-found.tsx` cho 404 pages

### Server vs Client Components
- Mặc định sử dụng Server Components cho performance tốt hơn
- Chỉ thêm `'use client'` directive khi cần:
  - Sử dụng React hooks (useState, useEffect, etc.)
  - Event handlers
  - Browser-only APIs
  - Third-party libraries phụ thuộc vào client features

### Data Fetching
- Fetch data trong Server Components trực tiếp
- Sử dụng async/await trong Server Components
- Tận dụng Next.js caching tự động
- Sử dụng Client Components với hooks cho client-side data fetching

### Metadata
- Export `metadata` object từ pages cho SEO
- Sử dụng `generateMetadata` cho dynamic metadata
- Bao gồm title, description, OpenGraph, và Twitter cards

### Best Practices
- Giữ page components đơn giản - delegate sang feature components
- Co-locate route-specific components trong route folder
- Sử dụng route groups `(groupName)` để tổ chức mà không ảnh hưởng URL
- Implement proper error boundaries
- Sử dụng loading states cho UX tốt hơn
- Tuân theo Next.js conventions cho special files
- Implement proper authentication checks cho protected routes
- Sử dụng dynamic routes với `[param]` syntax khi cần
- Tận dụng Server Actions cho mutations khi phù hợp

### Navigation
- Sử dụng `next/link` cho client-side navigation
- Sử dụng `next/navigation` hooks: `useRouter`, `usePathname`, `useSearchParams`
- Implement proper loading states trong quá trình navigation

### Static vs Dynamic
- Sử dụng Static Generation mặc định
- Sử dụng Dynamic Rendering khi data thay đổi thường xuyên
- Sử dụng `revalidate` option cho ISR (Incremental Static Regeneration)
- Rõ ràng về dynamic behavior với `dynamic` export

### Quy Ước Bổ Sung
- ✅ **NÊN**: Sử dụng Server Components cho data fetching khi có thể
- ✅ **NÊN**: Tách layout logic khỏi page logic
- ✅ **NÊN**: Implement error.tsx cho từng route quan trọng
- ✅ **NÊN**: Sử dụng loading.tsx thay vì custom loading components
- ❌ **KHÔNG**: Fetch data trong Client Components nếu có thể fetch ở Server
- ✅ **NÊN**: Sử dụng parallel routes cho complex layouts
- ✅ **NÊN**: Implement breadcrumbs cho navigation tốt hơn
- ❌ **KHÔNG**: Nest quá nhiều layouts (tối đa 3 levels)
- ✅ **NÊN**: Sử dụng Suspense boundaries cho streaming

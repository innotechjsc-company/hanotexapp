# App Folder Rules (Next.js App Router)

## Purpose
This folder contains Next.js 13+ App Router pages, layouts, and route-specific components.

## Structure
Routes follow the file-system based routing convention:
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

## Guidelines

### Page Components
- Use `page.tsx` for route endpoints
- Use `layout.tsx` for shared layouts
- Use `loading.tsx` for loading states
- Use `error.tsx` for error boundaries
- Use `not-found.tsx` for 404 pages

### Server vs Client Components
- Default to Server Components for better performance
- Add `'use client'` directive only when needed:
  - Using React hooks (useState, useEffect, etc.)
  - Event handlers
  - Browser-only APIs
  - Third-party libraries that depend on client features

### Data Fetching
- Fetch data in Server Components directly
- Use async/await in Server Components
- Leverage Next.js caching automatically
- Use Client Components with hooks for client-side data fetching

### Metadata
- Export `metadata` object from pages for SEO
- Use `generateMetadata` for dynamic metadata
- Include title, description, OpenGraph, and Twitter cards

### Best Practices
- Keep page components simple - delegate to feature components
- Co-locate route-specific components in the route folder
- Use route groups `(groupName)` for organization without affecting URL
- Implement proper error boundaries
- Use loading states for better UX
- Follow Next.js conventions for special files
- Implement proper authentication checks for protected routes
- Use dynamic routes with `[param]` syntax when needed
- Leverage Server Actions for mutations when appropriate

### Navigation
- Use `next/link` for client-side navigation
- Use `next/navigation` hooks: `useRouter`, `usePathname`, `useSearchParams`
- Implement proper loading states during navigation

### Static vs Dynamic
- Use Static Generation by default
- Use Dynamic Rendering when data changes frequently
- Use `revalidate` option for ISR (Incremental Static Regeneration)
- Be explicit about dynamic behavior with `dynamic` export

import { NextRequest, NextResponse } from 'next/server'
import { CORS_HEADERS } from './utils/cors'

/**
 * Global middleware for CORS handling
 * This ensures CORS headers are added to all API responses
 */
export function middleware(request: NextRequest) {
  // Handle preflight requests globally
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 200,
      headers: CORS_HEADERS,
    })
  }

  // Continue with the request
  const response = NextResponse.next()
  
  // Add CORS headers to all responses
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

// Configure which paths this middleware applies to
export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
  ],
}
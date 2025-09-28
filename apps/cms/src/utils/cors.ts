import { NextResponse } from 'next/server'

/**
 * CORS headers configuration
 * Allows all origins, methods, and headers for development
 */
export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400', // 24 hours
}

/**
 * Handle OPTIONS request for CORS preflight
 * @returns NextResponse with CORS headers
 */
export function handleCORSPreflight(): NextResponse {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  })
}

/**
 * Add CORS headers to a NextResponse
 * @param response - The NextResponse to add headers to
 * @returns NextResponse with CORS headers added
 */
export function addCORSHeaders(response: NextResponse): NextResponse {
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

/**
 * Create a NextResponse.json with CORS headers
 * @param data - Data to return
 * @param options - Response options (status, etc.)
 * @returns NextResponse with CORS headers
 */
export function corsResponse(data: any, options: { status?: number } = {}): NextResponse {
  const response = NextResponse.json(data, options)
  return addCORSHeaders(response)
}

/**
 * Create an error response with CORS headers
 * @param message - Error message
 * @param status - HTTP status code
 * @returns NextResponse with error and CORS headers
 */
export function corsErrorResponse(message: string, status: number = 500): NextResponse {
  return corsResponse(
    {
      success: false,
      error: message,
    },
    { status }
  )
}
import configPromise from '@payload-config'
import { getPayload } from 'payload'

/**
 * Authenticate user from request headers
 * @param req - The request object
 * @param corsHeaders - CORS headers to include in error responses
 * @returns Promise that resolves to user object or throws Response with error
 */
export const authenticateUser = async (req: Request, corsHeaders: Record<string, string>) => {
  const payload = await getPayload({ config: configPromise })

  // Get authenticated user
  let user: any
  try {
    const authResult = await payload.auth({ headers: req.headers })
    user = authResult.user
  } catch (e) {
    throw new Response(JSON.stringify({ success: false, error: 'Authentication failed' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }

  // Check if user is authenticated
  if (!user) {
    throw new Response(JSON.stringify({ success: false, error: 'User not authenticated' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }

  return user
}

/**
 * Alternative version that returns result object instead of throwing
 * @param req - The request object
 * @param corsHeaders - CORS headers to include in error responses
 * @returns Promise that resolves to { success: boolean, user?: any, error?: Response }
 */
export const authenticateUserSafe = async (req: Request, corsHeaders: Record<string, string>) => {
  try {
    const user = await authenticateUser(req, corsHeaders)
    return { success: true, user }
  } catch (error) {
    if (error instanceof Response) {
      return { success: false, error }
    }
    // Fallback for unexpected errors
    return {
      success: false,
      error: new Response(JSON.stringify({ success: false, error: 'Authentication failed' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }),
    }
  }
}

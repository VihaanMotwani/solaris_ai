import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function checks if the token is valid
function isTokenValid(authCookie: string): boolean {
  try {
    const authData = JSON.parse(authCookie)
    const tokenExpiry = authData.state?.tokenExpiry
    
    if (!tokenExpiry) return false
    
    // Check if token is expired (with 10-second buffer)
    return Date.now() < tokenExpiry - 10000
  } catch (error) {
    console.error('Error validating token:', error)
    return false
  }
}

// This is a simplified middleware for MVP that checks for the existence of auth cookie
export function middleware(request: NextRequest) {
  const authStorageCookie = request.cookies.get('auth-storage')
  const authSessionCookie = request.cookies.get('auth-session')
  const isLoginPage = request.nextUrl.pathname === '/login'
  const isLoginHandler = request.nextUrl.pathname === '/login-handler'
  const isForceLogin = request.nextUrl.pathname === '/force-login'
  const isDashboardPage = request.nextUrl.pathname === '/dashboard' || 
                         request.nextUrl.pathname.startsWith('/dashboard/')
  const isAuthEndpoint = request.nextUrl.pathname.startsWith('/api/auth/')
  const isAssetPath = request.nextUrl.pathname.match(/\.(js|css|png|jpg|svg|ico)$/) !== null
  
  // Always log path
  console.log(`[Middleware] Path: ${request.nextUrl.pathname}`)
  console.log(`[Middleware] User Agent: ${request.headers.get('user-agent')?.slice(0, 50)}...`)
  console.log(`[Middleware] Referrer: ${request.headers.get('referer') || 'none'}`)
  
  // Check for either cookie
  const hasAuthCookie = authStorageCookie || authSessionCookie
  
  // Log details for debugging
  if (authSessionCookie) {
    console.log(`[Middleware] Auth session cookie found: ${authSessionCookie.value.substring(0, 20)}...`)
  } else {
    console.log(`[Middleware] No auth session cookie found`)
  }
  
  if (authStorageCookie) {
    console.log(`[Middleware] Auth storage cookie found`)
  } else {
    console.log(`[Middleware] No auth storage cookie found`)
  }
  
  // List of paths that should always be accessible
  const publicPaths = ['/login', '/login-handler', '/force-login', '/api/auth/login', '/api/auth/refresh']
  
  // ALWAYS bypass auth for these paths
  if (publicPaths.includes(request.nextUrl.pathname) || isAssetPath || isAuthEndpoint) {
    console.log(`[Middleware] Bypassing auth check for: ${request.nextUrl.pathname}`)
    return NextResponse.next()
  }
  
  // For all other routes, check auth
  if (!hasAuthCookie) {
    console.log(`[Middleware] No auth cookie, redirecting to login`)
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // If we have the session cookie, we can try to validate it
  if (authSessionCookie) {
    console.log(`[Middleware] Session cookie authenticated, allowing access to: ${request.nextUrl.pathname}`)
    return NextResponse.next()
  }
  
  // If we only have the storage cookie, try to validate it
  if (authStorageCookie) {
    try {
      const authData = JSON.parse(authStorageCookie.value)
      const isAuthenticated = !!authData.state?.isAuthenticated
      
      if (isAuthenticated) {
        console.log(`[Middleware] Storage cookie authenticated, allowing access to: ${request.nextUrl.pathname}`)
        return NextResponse.next()
      }
    } catch (error) {
      console.error('[Middleware] Error parsing storage cookie:', error)
    }
  }
  
  // If we reach here, auth failed
  console.log(`[Middleware] Auth validation failed, redirecting to login`)
  return NextResponse.redirect(new URL('/login', request.url))
}

// Match these paths for the middleware, but exclude special paths
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
} 
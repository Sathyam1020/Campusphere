import { verifyToken } from '@/lib/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // PRIORITY: Check Authorization header first (for localStorage token)
  const authHeader = request.headers.get('authorization');
  const headerToken = authHeader?.replace('Bearer ', '');
  
  // FALLBACK: Check cookie token
  const cookieToken = request.cookies.get('auth-token')?.value;
  
  // Use header token first, then cookie token
  const token = headerToken || cookieToken;
  
  const { pathname } = request.nextUrl;

  console.log(`🔍 Middleware: ${pathname}, Header Token: ${headerToken ? 'EXISTS' : 'NONE'}, Cookie Token: ${cookieToken ? 'EXISTS' : 'NONE'}`);
  
  if (token) {
    console.log(`🔑 Using token from: ${headerToken ? 'Header' : 'Cookie'}`);
  }

  // Define auth-related pages that logged-in users shouldn't access
  const authPages = ['/', '/sign-in', '/sign-up'];
  const isAuthPage = authPages.includes(pathname);

  // Define auth API routes that should always be accessible
  const authApiRoutes = [
    '/api/auth/college/signup',
    '/api/auth/college/signin', 
    '/api/auth/student/signup',
    '/api/auth/student/signin',
    '/api/colleges',
    '/api/test-auth'
  ];
  const isAuthApiRoute = authApiRoutes.some(route => pathname.startsWith(route));

  // If no token (user not logged in)
  if (!token) {
    console.log(`🔓 No token - allowing access to: ${pathname}`);
    
    // Allow auth pages and auth API routes
    if (isAuthPage || isAuthApiRoute) {
      return NextResponse.next();
    }

    // Block all other API routes
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    // Redirect to sign-in for protected pages
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // If token exists (user is logged in)
  try {
    const payload = verifyToken(token);
    console.log(`🔐 Valid token for user: ${payload.email} (${payload.type})`);

    // 🚫 REDIRECT LOGGED-IN USERS FROM AUTH PAGES
    if (isAuthPage) {
      console.log(`🚫 Redirecting logged-in user from: ${pathname}`);
      
      if (payload.type === 'student') {
        return NextResponse.redirect(new URL('/home', request.url));
      } else if (payload.type === 'teacher') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } else if (payload.type === 'recruiter') {
        return NextResponse.redirect(new URL('/recruiter', request.url));
      }
      
      // Fallback
      return NextResponse.redirect(new URL('/home', request.url));
    }

    // Role-based route restrictions
    if (!pathname.startsWith('/api/')) {
      // Student routes
      if ((pathname.startsWith('/(student)') || pathname.startsWith('/home')) && payload.type !== 'student') {
        if (payload.type === 'college' || payload.type === 'teacher') {
          return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }

      // Teacher/College routes  
      if ((pathname.startsWith('/(teacher)') || pathname.startsWith('/dashboard')) && payload.type !== 'college') {
        if (payload.type === 'student') {
          return NextResponse.redirect(new URL('/home', request.url));
        }
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    }

    // For API routes, add user info to headers
    if (pathname.startsWith('/api/')) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', payload.userId);
      requestHeaders.set('x-user-email', payload.email);
      requestHeaders.set('x-user-type', payload.type);

      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    }

    // Allow access to other pages
    return NextResponse.next();

  } catch (error) {
    console.error('❌ Token verification failed:', error);
    console.error('❌ Token that failed:', token?.substring(0, 50) + '...');
    console.error('❌ Error details:', error instanceof Error ? error.message : 'Unknown error');

    // Clear invalid token and redirect
    if (pathname.startsWith('/api/')) {
      const response = NextResponse.json(
        { error: 'Invalid or expired token', code: 'INVALID_TOKEN' },
        { status: 401 }
      );
      response.cookies.delete('auth-token');
      console.log('🗑️ Deleted invalid token cookie from API route');
      return response;
    }

    const response = NextResponse.redirect(new URL('/sign-in', request.url));
    response.cookies.delete('auth-token');
    console.log('🗑️ Deleted invalid token cookie and redirecting to sign-in');
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions (.png, .jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$|.*\\.css$|.*\\.js$).*)',
  ],
};

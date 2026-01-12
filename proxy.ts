import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/sign-up', '/forgot-password', '/reset-password', '/verify-email'];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get the auth token from cookies
    // Note: 'auth_token' should match AUTH_CONFIG.tokenKey
    const token = request.cookies.get('auth_token')?.value;
    console.log(token);

    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));

    // 1. If user is authenticated and tries to access a public route (like /login)
    if (token && isPublicRoute) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 2. If user is NOT authenticated and tries to access a protected route
    if (!token && !isPublicRoute && pathname !== '/') {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('app', 'OG');
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
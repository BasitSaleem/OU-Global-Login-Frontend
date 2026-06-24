import logger from '@/utils/logger';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/sign-up', '/forgot-password', '/reset-password', '/verify-email'];

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = request.cookies.get('auth_token')?.value;
    logger.log(token);

    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
    if (token && isPublicRoute) {
        return NextResponse.redirect(new URL('/', request.url));
    }

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
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const pathname = req.nextUrl.pathname;

  // allow public pages
  if (pathname === '/' || pathname === '/not-authorized' || pathname === '/post-login') {
    return NextResponse.next();
  }

  // protect dashboard routes
  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/post-login',
    '/admin/:path*',
    '/dashboard/:path*',
    '/convener-dashboard/:path*'
  ],
};
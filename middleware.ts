import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token');
  const pathname = req.nextUrl.pathname;


  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/not-authorized')
  ) {
    return NextResponse.next();
  }

  
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/meetings',
    '/attendance',
    '/staffs'
  ],
};
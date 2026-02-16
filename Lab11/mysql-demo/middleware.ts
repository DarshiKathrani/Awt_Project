import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const pathname = req.nextUrl.pathname;

  // public
  if (pathname === '/' || pathname === '/not-authorized') {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  let role: string;
  try {
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    );
    role = payload.role;
  } catch {
    return NextResponse.redirect(new URL('/', req.url));
  }

  
  if (pathname === '/post-login') {
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    if (role === 'staff') {
      
    }
    if(role === 'meeting_convener') 
      return NextResponse.redirect(new URL('/meeting_convener', req.url));
    return NextResponse.redirect(new URL('/not-authorized', req.url));
  }

  // 🔒 Strict isolation
  const ROLE_ROUTE: Record<string, string> = {
    admin: '/admin',
    staff: '/dashboard',
    meeting_convener: '/dashboard',
  };

  const allowedBase = ROLE_ROUTE[role];
  if (!allowedBase || !pathname.startsWith(allowedBase)) {
    return NextResponse.redirect(new URL('/not-authorized', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/post-login',
    '/admin/:path*',
    '/dashboard/:path*',
  ],
};

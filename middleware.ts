import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedPrefixes = ['/client', '/trainer', '/manager'];

function isPublicPath(pathname: string) {
  // allow login, auth routes and next/static assets
  if (pathname === '/' || pathname.startsWith('/auth') || pathname.startsWith('/_next') || pathname.startsWith('/static') || pathname.startsWith('/favicon')) {
    return true;
  }
  return false;
}

function getBaseForRole(roleRaw: string) {
  const rl = (roleRaw || '').toLowerCase();
  if (rl.startsWith('personal')) return '/trainer';
  if (rl.startsWith('manager')) return '/manager';
  return '/client';
}

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = req.nextUrl.pathname;

  if (isPublicPath(pathname)) return NextResponse.next();

  const token = req.cookies.get('token')?.value ?? null;
  const roleRaw = req.cookies.get('role')?.value ?? '';

  // if on root or login and authenticated -> redirect to role base
  if ((pathname === '/' || pathname === '/auth/login') && token) {
    url.pathname = getBaseForRole(roleRaw);
    return NextResponse.redirect(url);
  }

  // protect role areas
  const targetPrefix = protectedPrefixes.find(p => pathname === p || pathname.startsWith(p + '/'));

  // not logged in -> send to login
  if (targetPrefix && !token) {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // logged in but wrong role -> redirect to correct base
  if (targetPrefix && token) {
    const expectedBase = getBaseForRole(roleRaw);
    if (!pathname.startsWith(expectedBase)) {
      url.pathname = expectedBase;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/client/:path*', '/trainer/:path*', '/manager/:path*', '/', '/auth/:path*'],
};
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch('https://assignment2.swafe.dk/api/Users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ ok: false, error: text }, { status: res.status });
    }

    const data = await res.json();
    const token = data.jwt as string;

    // decode role if available, fallback to Client
    let role = 'Client';
    try {
      const decoded: any = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      role = decoded?.Role ?? decoded?.role ?? role;
    } catch {
      // ignore
    }

    const response = NextResponse.json({ ok: true, role, token });

    // set HttpOnly cookie for server-side checks (middleware)
    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days, adjust as needed
    });

    // optionally set a non-HttpOnly role cookie so client code can read it (or client can store role in localStorage)
    response.cookies.set('role', role, {
      httpOnly: false,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    return NextResponse.json({ ok: false, error: 'internal error' }, { status: 500 });
  }
}
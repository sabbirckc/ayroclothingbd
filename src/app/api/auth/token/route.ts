import { auth } from '@/lib/auth';
import { cookies, headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const rawCookie =
      cookieStore.get('better-auth.session_token')?.value ||
      cookieStore.get('__Secure-better-auth.session_token')?.value ||
      cookieStore.get('clothspace_token')?.value;

    let token = rawCookie ? (rawCookie.includes('.') ? rawCookie.split('.')[0] : rawCookie) : null;
    let user: any = null;

    try {
      const reqHeaders = await headers();
      const session = await auth.api.getSession({ headers: reqHeaders });
      if (session?.session) {
        token = session.session.token || token || session.session.id;
        user = session.user;
      }
    } catch (e) {
      console.warn('Better-Auth getSession notice in /api/auth/token:', e);
    }

    if (!token && !user) {
      return NextResponse.json({ success: false, token: null, user: null });
    }

    return NextResponse.json({
      success: true,
      token,
      user,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, token: null, error: err?.message });
  }
}

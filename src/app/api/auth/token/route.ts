import { auth, db } from '@/lib/auth';
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

    // Direct database sync for latest role across both 'users' and 'user' collections
    if (user?.email) {
      try {
        const normalizedEmail = user.email.toLowerCase().trim();
        const docUsers = await db.collection('users').findOne({ email: normalizedEmail });
        const docUser = await db.collection('user').findOne({ email: normalizedEmail });

        let activeRole = 'customer';
        if (docUsers?.role === 'customer' || docUser?.role === 'customer') {
          activeRole = 'customer';
        } else if (docUsers?.role === 'admin' || docUser?.role === 'admin') {
          activeRole = 'admin';
        } else {
          activeRole = docUsers?.role || docUser?.role || 'customer';
        }

        // Sync both collections in database so they never conflict
        if (docUsers && docUsers.role !== activeRole) {
          await db.collection('users').updateOne(
            { email: normalizedEmail },
            { $set: { role: activeRole, updatedAt: new Date() } }
          );
        }
        if (docUser && docUser.role !== activeRole) {
          await db.collection('user').updateOne(
            { email: normalizedEmail },
            { $set: { role: activeRole, updatedAt: new Date() } }
          );
        }

        user.role = activeRole;
      } catch (dbErr) {
        console.warn('Database role sync error in /api/auth/token:', dbErr);
        if (!user.role) user.role = 'customer';
      }
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

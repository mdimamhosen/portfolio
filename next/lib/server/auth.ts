import 'server-only';
import { createHmac, scryptSync, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getClientIp } from './geo';
import { getDb } from './mongo';

export const base = (process.env.PUBLIC_SITE_URL || 'https://mdimamhosen.netlify.app').replace(/\/$/, '');
const secret = process.env.BLOG_SESSION_SECRET;
export const configured = Boolean(process.env.MONGODB_URI && secret);

export const json = (status: number, data: unknown, headers: Record<string, string> = {}) =>
  NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store', ...headers } });

// Same-origin check for state-changing requests (cookie is SameSite=Strict too).
export const allowedOrigin = (req: Request) => {
  const origin = req.headers.get('origin');
  return !origin || origin === base || origin === new URL(req.url).origin;
};

export const sign = (value: string) => createHmac('sha256', secret || '').update(value).digest('hex');

export const verifySession = (value: string | undefined) => {
  if (!secret || !value) return false;
  const [expiry, signature] = value.split('.');
  if (!/^\d+$/.test(expiry || '') || Number(expiry) < Date.now() || !signature || signature.length !== 64) return false;
  return timingSafeEqual(Buffer.from(sign(expiry)), Buffer.from(signature));
};

export const isAdmin = async () => verifySession((await cookies()).get('blog_session')?.value);

const secure = process.env.NODE_ENV === 'production' ? ' Secure;' : '';
export const sessionCookie = (expiry: number) => `blog_session=${expiry}.${sign(String(expiry))}; HttpOnly;${secure} SameSite=Strict; Path=/; Max-Age=43200`;
export const clearCookie = `blog_session=; HttpOnly;${secure} SameSite=Strict; Path=/; Max-Age=0`;

export const verifyPassword = (password: string) => {
  const [salt, hash] = (process.env.BLOG_ADMIN_PASSWORD_HASH || '').split(':');
  if (!salt || !/^[a-f0-9]{128}$/.test(hash || '')) return false;
  const actual = scryptSync(password, salt, 64);
  return timingSafeEqual(actual, Buffer.from(hash, 'hex'));
};

export const ipHash = (req: Request) => sign(getClientIp(req.headers));

/** Fixed-window limiter backed by a TTL collection. Returns true when the caller is over `max` per minute. */
export async function rateLimited(req: Request, bucketName: string, max: number) {
  const db = await getDb();
  const key = `${bucketName}:${ipHash(req)}`;
  const since = new Date(Date.now() - 60_000);
  const count = await db.collection('rate_limits').countDocuments({ key, at: { $gte: since } });
  if (count >= max) return true;
  await db.collection('rate_limits').insertOne({ key, at: new Date() });
  return false;
}

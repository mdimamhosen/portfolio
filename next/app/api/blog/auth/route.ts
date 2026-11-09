import { allowedOrigin, clearCookie, configured, ipHash, isAdmin, json, sessionCookie, verifyPassword } from '@/lib/server/auth';
import { getDb } from '@/lib/server/mongo';

export const GET = async () => json(200, { authenticated: await isAdmin() });
export const DELETE = () => json(200, { ok: true }, { 'Set-Cookie': clearCookie });

export async function POST(req: Request) {
  if (!allowedOrigin(req)) return json(405, { error: 'Method not allowed' });
  if (!configured || !process.env.BLOG_ADMIN_PASSWORD_HASH) return json(503, { error: 'Blog admin is not configured' });
  try {
    const db = await getDb();
    const ip = ipHash(req);
    const since = new Date(Date.now() - 15 * 60_000);
    const attempts = await db.collection('blog_login_attempts').countDocuments({ ip_hash: ip, attempted_at: { $gte: since } });
    if (attempts >= 5) return json(429, { error: 'Too many attempts. Try again in 15 minutes.' });
    await db.collection('blog_login_attempts').insertOne({ ip_hash: ip, attempted_at: new Date() });
    const input = await req.json().catch(() => ({}));
    if (typeof input.password !== 'string' || !verifyPassword(input.password)) return json(401, { error: 'Invalid credentials' });
    return json(200, { authenticated: true }, { 'Set-Cookie': sessionCookie(Date.now() + 12 * 60 * 60_000) });
  } catch {
    return json(503, { error: 'Authentication is temporarily unavailable' });
  }
}

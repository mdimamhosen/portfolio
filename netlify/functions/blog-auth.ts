import type { Handler } from '@netlify/functions';
import { allowedOrigin, clearCookie, configured, db, ipHash, isAdmin, json, sessionCookie, verifyPassword } from './_blog/core';

export const handler: Handler = async event => {
  if (event.httpMethod === 'GET') return json(200, { authenticated: isAdmin(event) });
  if (event.httpMethod === 'DELETE') return json(200, { ok: true }, { 'Set-Cookie': clearCookie });
  if (event.httpMethod !== 'POST' || !allowedOrigin(event)) return json(405, { error: 'Method not allowed' });
  if (!configured || !process.env.BLOG_ADMIN_PASSWORD_HASH) return json(503, { error: 'Blog admin is not configured' });
  try {
    const ip = ipHash(event);
    const since = new Date(Date.now() - 15 * 60_000).toISOString();
    const attempts = await db('blog_login_attempts', `select=id&ip_hash=eq.${ip}&attempted_at=gte.${encodeURIComponent(since)}`) as unknown[];
    if (attempts.length >= 5) return json(429, { error: 'Too many attempts. Try again in 15 minutes.' });
    await db('blog_login_attempts', '', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ ip_hash: ip }) });
    const input = JSON.parse(event.body || '{}');
    if (typeof input.password !== 'string' || !verifyPassword(input.password)) return json(401, { error: 'Invalid credentials' });
    return json(200, { authenticated: true }, { 'Set-Cookie': sessionCookie(Date.now() + 12 * 60 * 60_000) });
  } catch { return json(503, { error: 'Authentication is temporarily unavailable' }); }
};

import type { Handler } from '@netlify/functions';
import { base, configured, db, publicFilter } from './_blog/core';
const escape = (s: unknown) => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export const handler: Handler = async () => {
  let rows: {title:string;slug:string;excerpt:string;published_at:string}[] = [];
  if (configured) try { rows = await db('blog_articles', `select=title,slug,excerpt,published_at&${publicFilter()}&order=published_at.desc&limit=30`); } catch { return { statusCode: 503, body: 'Feed temporarily unavailable' }; }
  return { statusCode: 200, headers: {'Content-Type':'application/rss+xml; charset=utf-8','Cache-Control':'public, max-age=0, s-maxage=3600'}, body: `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Md. Imam Hosen — Blog</title><link>${base}/blog</link><description>Technical articles on backend, full stack, and AI development.</description>${rows.map(a => `<item><title>${escape(a.title)}</title><link>${base}/blog/${escape(a.slug)}</link><guid>${base}/blog/${escape(a.slug)}</guid><description>${escape(a.excerpt)}</description><pubDate>${new Date(a.published_at).toUTCString()}</pubDate></item>`).join('')}</channel></rss>` };
};

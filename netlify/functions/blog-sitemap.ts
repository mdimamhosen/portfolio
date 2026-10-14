import type { Handler } from '@netlify/functions';
import { base, configured, db, publicFilter } from './_blog/core';
export const handler: Handler = async () => {
  const urls = ['/', '/services', '/services/backend-development', '/services/ai-integration', '/blog'];
  if (configured) {
    try {
      const rows = await db('blog_articles', `select=slug&${publicFilter()}&order=published_at.desc&limit=1000`) as {slug:string}[];
      urls.push(...rows.map(row => `/blog/${row.slug}`));
    } catch { return { statusCode: 503, headers: {'Content-Type':'text/plain; charset=utf-8'}, body: 'Sitemap temporarily unavailable' }; }
  }
  return { statusCode: 200, headers: {'Content-Type':'application/xml; charset=utf-8','Cache-Control':'public, max-age=0, s-maxage=3600'}, body: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url => `<url><loc>${base}${url}</loc></url>`).join('')}</urlset>` };
};

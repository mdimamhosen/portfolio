import type { Handler } from '@netlify/functions';
import { allowedOrigin, configured, db, isAdmin, json, publicFilter } from './_blog/core';
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const fields = 'id,title,slug,excerpt,content,cover_image,cover_image_alt,status,author,category,tags,seo_title,seo_description,canonical_url,social_image,published_at,created_at,updated_at';
export const handler: Handler = async event => {
  if (!configured) return json(503, { error: 'Blog database is not configured' });
  const admin = isAdmin(event);
  try {
    if (event.httpMethod === 'GET') {
      const slug = event.queryStringParameters?.slug;
      const page = Math.min(Math.max(Number(event.queryStringParameters?.page) || 1, 1), 1000);
      const query = [`select=${fields}`, admin && event.queryStringParameters?.admin === '1' ? '' : publicFilter, slug ? `slug=eq.${encodeURIComponent(slug)}` : '', 'order=published_at.desc.nullslast,created_at.desc', `limit=${slug ? 1 : admin && event.queryStringParameters?.admin === '1' ? 1000 : 10}`, slug ? '' : `offset=${(page - 1) * 10}`].filter(Boolean).join('&');
      const rows = await db('blog_articles', query);
      return json(200, slug ? { article: rows[0] || null } : { articles: rows });
    }
    if (!admin) return json(401, { error: 'Administrator sign in required' });
    if (!allowedOrigin(event)) return json(403, { error: 'Invalid request origin' });
    const body = JSON.parse(event.body || '{}');
    const id = event.queryStringParameters?.id;
    if (event.httpMethod === 'DELETE') {
      if (!id || !/^[a-f0-9-]{36}$/.test(id)) return json(400, { error: 'Invalid article ID' });
      await db('blog_articles', `id=eq.${id}`, { method: 'DELETE' });
      return json(200, { ok: true });
    }
    if (!['POST','PATCH'].includes(event.httpMethod)) return json(405, { error: 'Method not allowed' });
    const title = String(body.title || '').trim();
    const slug = String(body.slug || '').trim();
    const content = String(body.content || '');
    const status = body.status || 'draft';
    if (title.length < 5 || title.length > 160 || !slugPattern.test(slug) || content.length > 100000 || !['draft','published','scheduled'].includes(status)) return json(400, { error: 'Check title, slug, content, and status' });
    const date = body.published_at ? new Date(body.published_at) : status === 'published' ? new Date() : null;
    if (status === 'published' && content.length < 100) return json(400, { error: 'Published articles need at least 100 characters' });
    if (status === 'scheduled' && (!date || date.getTime() <= Date.now())) return json(400, { error: 'Schedule a future publication date' });
    const urls = [body.cover_image, body.social_image, body.canonical_url].filter(Boolean);
    if (urls.some((value: unknown) => String(value).length > 2048) || String(body.category || '').length > 80 || String(body.seo_title || '').length > 160 || String(body.seo_description || '').length > 320) return json(400, { error: 'Article metadata is too long' });
    if (urls.some((value: unknown) => { try { const url = new URL(String(value)); return url.protocol !== 'https:'; } catch { return true; } })) return json(400, { error: 'Image and canonical URLs must be valid HTTPS URLs' });
    if (body.cover_image && !String(body.cover_image_alt || '').trim()) return json(400, { error: 'Cover image alt text is required' });
    const article = { title, slug, content, status, excerpt: String(body.excerpt || '').slice(0, 320), cover_image: body.cover_image || null, cover_image_alt: body.cover_image_alt || null, author: 'Md. Imam Hosen', category: body.category || null, tags: Array.isArray(body.tags) ? body.tags.map((tag: unknown) => String(tag).trim().slice(0,50)).filter(Boolean).slice(0,10) : [], seo_title: body.seo_title || null, seo_description: body.seo_description || null, canonical_url: body.canonical_url || null, social_image: body.social_image || null, published_at: date?.toISOString() || null, updated_at: new Date().toISOString() };
    if (event.httpMethod === 'PATCH' && (!id || !/^[a-f0-9-]{36}$/.test(id))) return json(400, { error: 'Invalid article ID' });
    const rows = await db('blog_articles', event.httpMethod === 'PATCH' ? `id=eq.${id}&select=${fields}` : `select=${fields}`, { method: event.httpMethod, headers: { Prefer: 'return=representation' }, body: JSON.stringify(article) });
    return json(200, { article: rows[0] });
  } catch (error) { return json(500, { error: error instanceof Error ? error.message : 'Blog request failed' }); }
};

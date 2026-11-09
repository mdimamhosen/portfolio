// Pure (no server imports) so it can be unit tested with node --test.
export type Article = {
  id: string; title: string; slug: string; excerpt: string; content: string;
  status: 'draft' | 'published' | 'scheduled';
  cover_image: string | null; cover_image_alt: string | null; author: string;
  category: string | null; tags: string[]; seo_title: string | null; seo_description: string | null;
  canonical_url: string | null; social_image: string | null;
  published_at: string | null; created_at: string; updated_at: string;
};

export const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Relative /api/images/<id> URLs come from our own upload endpoint.
const isOwnImage = (value: string) => /^\/api\/images\/[a-f0-9]{24}$/.test(value);

/** Same rules as the old Netlify blog-articles function. Returns the fields to store, or an error message. */
export function validateArticle(body: Record<string, unknown>, now = new Date()): { error: string } | { article: Omit<Article, 'id' | 'created_at'> } {
  const title = String(body.title || '').trim();
  const slug = String(body.slug || '').trim();
  const content = String(body.content || '');
  const status = (body.status || 'draft') as Article['status'];
  if (title.length < 5 || title.length > 160 || !slugPattern.test(slug) || content.length > 100000 || !['draft', 'published', 'scheduled'].includes(status)) return { error: 'Check title, slug, content, and status' };
  const date = body.published_at ? new Date(String(body.published_at)) : status === 'published' ? now : null;
  if (date && Number.isNaN(date.getTime())) return { error: 'Invalid publication date' };
  if (status === 'published' && content.length < 100) return { error: 'Published articles need at least 100 characters' };
  if (status === 'scheduled' && (!date || date.getTime() <= now.getTime())) return { error: 'Schedule a future publication date' };
  const urls = [body.cover_image, body.social_image, body.canonical_url].filter(Boolean).map(String);
  if (urls.some(value => value.length > 2048) || String(body.category || '').length > 80 || String(body.seo_title || '').length > 160 || String(body.seo_description || '').length > 320) return { error: 'Article metadata is too long' };
  if (urls.some(value => { if (isOwnImage(value)) return false; try { return new URL(value).protocol !== 'https:'; } catch { return true; } })) return { error: 'Image and canonical URLs must be valid HTTPS URLs' };
  if (body.cover_image && !String(body.cover_image_alt || '').trim()) return { error: 'Cover image alt text is required' };
  const str = (v: unknown) => (v ? String(v) : null);
  return {
    article: {
      title, slug, content, status,
      excerpt: String(body.excerpt || '').slice(0, 320),
      cover_image: str(body.cover_image), cover_image_alt: str(body.cover_image_alt),
      author: 'Md. Imam Hosen', category: str(body.category),
      tags: Array.isArray(body.tags) ? body.tags.map(tag => String(tag).trim().slice(0, 50)).filter(Boolean).slice(0, 10) : [],
      seo_title: str(body.seo_title), seo_description: str(body.seo_description),
      canonical_url: str(body.canonical_url), social_image: str(body.social_image),
      published_at: date?.toISOString() || null, updated_at: now.toISOString(),
    },
  };
}

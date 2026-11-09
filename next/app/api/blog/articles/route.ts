import { randomUUID } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { allowedOrigin, configured, isAdmin, json } from '@/lib/server/auth';
import { articles, publicFilter } from '@/lib/server/blog';
import { validateArticle } from '@/lib/server/blog-validate';

const uuid = /^[a-f0-9-]{36}$/;
const noId = { projection: { _id: 0 } } as const;

export async function GET(req: Request) {
  if (!configured) return json(503, { error: 'Blog database is not configured' });
  try {
    const params = new URL(req.url).searchParams;
    const adminList = params.get('admin') === '1' && (await isAdmin());
    const slug = params.get('slug');
    const page = Math.min(Math.max(Number(params.get('page')) || 1, 1), 1000);
    const filter = { ...(adminList ? {} : publicFilter()), ...(slug ? { slug } : {}) };
    const rows = await (await articles()).find(filter, noId).sort({ published_at: -1, created_at: -1 }).skip(slug ? 0 : (page - 1) * 10).limit(slug ? 1 : adminList ? 1000 : 10).toArray();
    return json(200, slug ? { article: rows[0] || null } : { articles: rows });
  } catch (error) {
    return json(500, { error: error instanceof Error ? error.message : 'Blog request failed' });
  }
}

async function write(req: Request) {
  if (!configured) return json(503, { error: 'Blog database is not configured' });
  if (!(await isAdmin())) return json(401, { error: 'Administrator sign in required' });
  if (!allowedOrigin(req)) return json(403, { error: 'Invalid request origin' });
  try {
    const id = new URL(req.url).searchParams.get('id');
    const collection = await articles();
    if (req.method === 'DELETE') {
      if (!id || !uuid.test(id)) return json(400, { error: 'Invalid article ID' });
      await collection.deleteOne({ id });
      revalidatePath('/blog', 'layout');
      return json(200, { ok: true });
    }
    const result = validateArticle(await req.json().catch(() => ({})));
    if ('error' in result) return json(400, { error: result.error });
    if (req.method === 'PATCH' && (!id || !uuid.test(id))) return json(400, { error: 'Invalid article ID' });
    const saved = req.method === 'PATCH'
      ? await collection.findOneAndUpdate({ id: id! }, { $set: result.article }, { returnDocument: 'after', ...noId })
      : (await collection.insertOne({ ...result.article, id: randomUUID(), created_at: new Date().toISOString() }), await collection.findOne({ slug: result.article.slug }, noId));
    if (!saved) return json(404, { error: 'Article not found' });
    revalidatePath('/blog', 'layout');
    revalidatePath('/sitemap.xml');
    return json(200, { article: saved });
  } catch (error) {
    // Duplicate slug hits the unique index.
    if ((error as { code?: number }).code === 11000) return json(409, { error: 'An article with this slug already exists' });
    return json(500, { error: error instanceof Error ? error.message : 'Blog request failed' });
  }
}

export { write as POST, write as PATCH, write as DELETE };

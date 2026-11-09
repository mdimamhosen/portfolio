import 'server-only';
import type { Filter } from 'mongodb';
import { getDb, hasMongo } from './mongo';
import { escapeRegex, type Article } from './blog-validate';

export type { Article };
export const articles = async () => (await getDb()).collection<Article>('blog_articles');
export const publicFilter = (): Filter<Article> => ({ status: { $in: ['published', 'scheduled'] }, published_at: { $lte: new Date().toISOString() } });
const noId = { projection: { _id: 0 } } as const;

export async function listPublic(page: number, search: string) {
  if (!hasMongo()) return { rows: [] as Article[], next: false };
  const filter: Filter<Article> = publicFilter();
  if (search) filter.$or = [{ title: { $regex: escapeRegex(search), $options: 'i' } }, { excerpt: { $regex: escapeRegex(search), $options: 'i' } }];
  const rows = await (await articles()).find(filter, { projection: { _id: 0, content: 0 } }).sort({ published_at: -1 }).skip((page - 1) * 10).limit(11).toArray();
  return { rows: rows.slice(0, 10), next: rows.length > 10 };
}

export async function getPublic(slug: string) {
  if (!hasMongo()) return null;
  return (await articles()).findOne({ ...publicFilter(), slug }, noId);
}

export async function related(article: Article) {
  if (!article.category) return [];
  return (await articles()).find({ ...publicFilter(), category: article.category, slug: { $ne: article.slug } }, { projection: { _id: 0, title: 1, slug: 1 } }).sort({ published_at: -1 }).limit(3).toArray();
}

export async function allPublicSlugs() {
  if (!hasMongo()) return [];
  return (await articles()).find(publicFilter(), { projection: { _id: 0, slug: 1, updated_at: 1, title: 1, excerpt: 1, published_at: 1 } }).sort({ published_at: -1 }).limit(1000).toArray();
}

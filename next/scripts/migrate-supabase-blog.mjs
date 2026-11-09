#!/usr/bin/env node
// One-time copy of Supabase blog_articles into MongoDB. Upserts by slug, so re-running is safe.
// Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... MONGODB_URI=... [MONGODB_DB=portfolio] node scripts/migrate-supabase-blog.mjs [--images]
import { MongoClient, GridFSBucket } from 'mongodb';
import sharp from 'sharp';

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, MONGODB_URI, MONGODB_DB = 'portfolio' } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !MONGODB_URI) {
  console.error('Set SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and MONGODB_URI.');
  process.exit(1);
}
const withImages = process.argv.includes('--images');

const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_articles?select=*&order=created_at.asc`, {
  headers: { apikey: SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}` },
});
if (!res.ok) throw new Error(`Supabase request failed (${res.status}): ${await res.text()}`);
const rows = await res.json();
console.log(`Fetched ${rows.length} articles from Supabase.`);

const client = await MongoClient.connect(MONGODB_URI);
try {
  const db = client.db(MONGODB_DB);
  const col = db.collection('blog_articles');
  await col.createIndex({ slug: 1 }, { unique: true });
  await col.createIndex({ id: 1 }, { unique: true });
  const images = new GridFSBucket(db, { bucketName: 'images' });
  const iso = (v) => (v ? new Date(v).toISOString() : null);

  // Copies a Supabase-hosted image into GridFS as WebP; leaves other URLs untouched.
  const moveImage = async (url) => {
    if (!withImages || !url || !url.startsWith(`${SUPABASE_URL}/storage/`)) return url;
    const r = await fetch(url);
    if (!r.ok) { console.warn(`  image skipped (${r.status}): ${url}`); return url; }
    const webp = await sharp(Buffer.from(await r.arrayBuffer())).rotate().resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
    const id = await new Promise((resolve, reject) => {
      const s = images.openUploadStream('cover.webp', { metadata: { contentType: 'image/webp', source: url } });
      s.once('finish', () => resolve(s.id.toString())).once('error', reject).end(webp);
    });
    return `/api/images/${id}`;
  };

  let inserted = 0, updated = 0;
  for (const row of rows) {
    const doc = {
      id: row.id, title: row.title, slug: row.slug, excerpt: row.excerpt || '', content: row.content || '',
      status: row.status, author: row.author || 'Md. Imam Hosen', category: row.category || null, tags: row.tags || [],
      cover_image: await moveImage(row.cover_image), cover_image_alt: row.cover_image_alt || null,
      seo_title: row.seo_title || null, seo_description: row.seo_description || null,
      canonical_url: row.canonical_url || null, social_image: await moveImage(row.social_image),
      published_at: iso(row.published_at), created_at: iso(row.created_at) || new Date().toISOString(), updated_at: iso(row.updated_at) || new Date().toISOString(),
    };
    const r = await col.updateOne({ slug: doc.slug }, { $set: doc }, { upsert: true });
    if (r.upsertedCount) inserted++; else updated++;
    console.log(`  ${r.upsertedCount ? 'inserted' : 'updated '} ${doc.slug}`);
  }
  console.log(`Done: ${inserted} inserted, ${updated} updated, ${await col.countDocuments()} total in MongoDB.`);
} finally {
  await client.close();
}

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { escapeRegex, validateArticle } from '../lib/server/blog-validate.ts';

const now = new Date('2026-10-15T00:00:00Z');
const base = { title: 'Hello world', slug: 'hello-world', content: 'x'.repeat(120), status: 'published' };

test('accepts a valid published article and stamps published_at', () => {
  const r = validateArticle(base, now);
  assert.ok('article' in r);
  assert.equal(r.article.published_at, now.toISOString());
  assert.equal(r.article.author, 'Md. Imam Hosen');
});

test('rejects bad slug, short published content, past schedule', () => {
  assert.ok('error' in validateArticle({ ...base, slug: 'Bad Slug' }, now));
  assert.ok('error' in validateArticle({ ...base, content: 'short' }, now));
  assert.ok('error' in validateArticle({ ...base, status: 'scheduled', published_at: '2020-01-01' }, now));
  assert.ok('error' in validateArticle({ ...base, published_at: 'not a date' }, now));
});

test('cover image needs https or our own upload, plus alt text', () => {
  assert.ok('error' in validateArticle({ ...base, cover_image: 'http://x.com/a.png', cover_image_alt: 'a' }, now));
  assert.ok('error' in validateArticle({ ...base, cover_image: 'https://x.com/a.png' }, now));
  assert.ok('article' in validateArticle({ ...base, cover_image: '/api/images/0123456789abcdef01234567', cover_image_alt: 'a' }, now));
  assert.ok('error' in validateArticle({ ...base, cover_image: '/api/images/../../etc', cover_image_alt: 'a' }, now));
});

test('escapeRegex neutralises regex metacharacters', () => {
  assert.ok(new RegExp(escapeRegex('a.*(b)')).test('xa.*(b)y'));
  assert.ok(!new RegExp(escapeRegex('a.*')).test('abc'));
});

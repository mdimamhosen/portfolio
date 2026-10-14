import type { Handler } from '@netlify/functions';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { base, configured, db, publicFilter, publicAnalytics } from './_blog/core';
const escape = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const html = (title: string, description: string, path: string, body: string, schema?: object, canonical?: string, image?: string) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)}</title><meta name="description" content="${escape(description)}"><link rel="canonical" href="${escape(canonical || `${base}${path}`)}"><meta property="og:type" content="${schema ? 'article' : 'website'}"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="${escape(canonical || `${base}${path}`)}">${image ? `<meta property="og:image" content="${escape(image)}">` : ''}<meta name="twitter:card" content="summary_large_image">${schema ? `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>` : ''}<style>body{margin:0;background:#090d19;color:#f4f6fa;font:18px/1.7 system-ui,sans-serif}header,main,footer{max-width:800px;margin:auto;padding:24px}a{color:#6ed5ec}h1,h2,h3{line-height:1.2}article{overflow-wrap:anywhere}pre{overflow:auto;background:#151e31;padding:20px;border-radius:10px}img{max-width:100%;height:auto}table{border-collapse:collapse;display:block;overflow:auto}th,td{border:1px solid #344154;padding:8px}.hljs-keyword,.hljs-title{color:#80d8ff}.hljs-string{color:#a7e8b4}.hljs-comment{color:#91a0b4}nav a{margin-right:20px}.muted{color:#9da9ba}</style>${publicAnalytics(schema ? 'article' : 'blog')}</head><body><header><nav><a href="/">Md. Imam Hosen</a><a href="/blog">Blog</a><a href="/#contact">Contact</a></nav></header><main>${body}</main><footer><a href="/">Portfolio</a></footer></body></html>`;
export const handler: Handler = async event => {
  if (event.httpMethod !== 'GET') return { statusCode: 405, body: '' };
  if (!configured) return { statusCode: 503, headers: {'Content-Type':'text/html'}, body: html('Blog unavailable', 'Blog is being configured.', '/blog', '<h1>Blog is being configured</h1>') };
  const slug = event.path.match(/^\/blog\/([a-z0-9-]+)\/?$/)?.[1];
  try {
    if (slug) {
      const rows = await db('blog_articles', `select=*&${publicFilter()}&slug=eq.${slug}&limit=1`) as Record<string,unknown>[];
      const article = rows[0];
      if (!article) return { statusCode: 404, headers: {'Content-Type':'text/html; charset=utf-8'}, body: html('Article not found', 'This article is unavailable.', `/blog/${slug}`, '<h1>Article not found</h1><p><a href="/blog">Browse articles</a></p>') };
      const title = String(article.seo_title || article.title);
      const description = String(article.seo_description || article.excerpt || '').slice(0, 320);
      const content = renderToStaticMarkup(React.createElement(ReactMarkdown, { children: String(article.content), remarkPlugins: [remarkGfm], rehypePlugins: [rehypeHighlight] }));
      const minutes = Math.max(1, Math.ceil(String(article.content).trim().split(/\s+/).length / 200));
      const schema = { '@context':'https://schema.org', '@type':'BlogPosting', headline: article.title, description, author: { '@type':'Person', name: article.author, url: base }, datePublished: article.published_at, dateModified: article.updated_at, mainEntityOfPage: `${base}/blog/${slug}` };
      let related: {title:string;slug:string}[] = [];
      if (article.category) {
        try { related = await db('blog_articles', `select=title,slug&${publicFilter()}&category=eq.${encodeURIComponent(String(article.category))}&slug=neq.${slug}&order=published_at.desc&limit=3`); } catch { /* article remains available */ }
      }
      const body = `<article><p class="muted"><a href="/blog">Blog</a>${article.category ? ` / ${escape(article.category)}` : ''}</p><h1>${escape(article.title)}</h1><p>${escape(article.excerpt)}</p><p class="muted">${escape(article.author)} · ${escape(String(article.published_at).slice(0,10))} · ${minutes} min read</p>${article.cover_image ? `<img src="${escape(article.cover_image)}" alt="${escape(article.cover_image_alt || article.title)}">` : ''}${content}</article><p><button onclick="navigator.clipboard.writeText(location.href)">Copy link</button> · <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${base}/blog/${slug}`)}" target="_blank" rel="noopener noreferrer">Share on LinkedIn</a></p>${related.length ? `<h2>Related articles</h2><ul>${related.map(a => `<li><a href="/blog/${escape(a.slug)}">${escape(a.title)}</a></li>`).join('')}</ul>` : ''}<p><a href="/blog">← All articles</a></p>`;
      return { statusCode: 200, headers: {'Content-Type':'text/html; charset=utf-8', 'Cache-Control':'public, max-age=0, s-maxage=300'}, body: html(title, description, `/blog/${slug}`, body, schema, article.canonical_url ? String(article.canonical_url) : undefined, article.social_image ? String(article.social_image) : article.cover_image ? String(article.cover_image) : undefined) };
    }
    const page = Math.min(Math.max(Number(event.queryStringParameters?.page) || 1,1),1000);
    const search = String(event.queryStringParameters?.q || '').trim().replace(/[^a-zA-Z0-9 -]/g,'').slice(0,60);
    const searchFilter = search ? `&or=(title.ilike.*${encodeURIComponent(search)}*,excerpt.ilike.*${encodeURIComponent(search)}*)` : '';
    const rows = await db('blog_articles', `select=title,slug,excerpt,published_at,category&${publicFilter()}${searchFilter}&order=published_at.desc&limit=11&offset=${(page-1)*10}`) as Record<string,unknown>[];
    const visible = rows.slice(0,10);
    const next = rows.length > 10;
    const query = (n: number) => `/blog?${search ? `q=${encodeURIComponent(search)}&` : ''}page=${n}`;
    const body = `<h1>Technical articles</h1><p>Writing about backend development, full stack applications, and AI systems.</p><form action="/blog" method="get"><label for="search">Search articles</label> <input id="search" name="q" value="${escape(search)}" maxlength="60" style="padding:8px;background:#151e31;color:white;border:1px solid #344154"> <button style="padding:8px">Search</button></form>${visible.length ? visible.map(a => `<article><h2><a href="/blog/${escape(a.slug)}">${escape(a.title)}</a></h2><p>${escape(a.excerpt)}</p><p class="muted">${escape(String(a.published_at).slice(0,10))}</p></article>`).join('') : '<p>No articles found.</p>'}<nav>${page > 1 ? `<a href="${query(page-1)}">← Newer</a>` : ''}${next ? `<a href="${query(page+1)}">Older →</a>` : ''}</nav>`;
    const path = search ? '/blog' : page > 1 ? `/blog?page=${page}` : '/blog';
    return { statusCode: 200, headers: {'Content-Type':'text/html; charset=utf-8', 'Cache-Control':'public, max-age=0, s-maxage=300', ...(search ? {'X-Robots-Tag':'noindex, follow'} : {})}, body: html('Blog | Md. Imam Hosen', 'Technical articles by Md. Imam Hosen on backend development, full stack applications, and AI.', path, body) };
  } catch { return { statusCode: 503, headers: {'Content-Type':'text/html'}, body: html('Blog unavailable', 'Please try again later.', '/blog', '<h1>Blog is temporarily unavailable</h1>') }; }
};

import { SITE_URL as base } from "@/lib/site";
import { allPublicSlugs } from "@/lib/server/blog";

export const revalidate = 3600;
const escape = (s: unknown) => String(s || "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function GET() {
  let rows: Awaited<ReturnType<typeof allPublicSlugs>>;
  try {
    rows = (await allPublicSlugs()).slice(0, 30);
  } catch {
    return new Response("Feed temporarily unavailable", { status: 503 });
  }
  const items = rows.map((a) => `<item><title>${escape(a.title)}</title><link>${base}/blog/${escape(a.slug)}</link><guid>${base}/blog/${escape(a.slug)}</guid><description>${escape(a.excerpt)}</description><pubDate>${new Date(a.published_at!).toUTCString()}</pubDate></item>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Md. Imam Hosen — Blog</title><link>${base}/blog</link><description>Technical articles on backend, full stack, and AI development.</description>${items}</channel></rss>`, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}

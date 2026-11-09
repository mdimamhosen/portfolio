import Link from "next/link";
import type { Metadata } from "next";
import { listPublic } from "@/lib/server/blog";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

type Props = { searchParams: Promise<{ page?: string; q?: string }> };
const read = async (searchParams: Props["searchParams"]) => {
  const sp = await searchParams;
  return {
    page: Math.min(Math.max(Number(sp.page) || 1, 1), 1000),
    search: String(sp.q || "").trim().replace(/[^a-zA-Z0-9 -]/g, "").slice(0, 60),
  };
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { page, search } = await read(searchParams);
  return {
    title: "Blog",
    description: "Technical articles by Md. Imam Hosen on backend development, full stack applications, and AI.",
    alternates: { canonical: page > 1 && !search ? `/blog?page=${page}` : "/blog" },
    // Search result pages are thin duplicates: keep them out of the index but let crawlers follow links.
    robots: search ? { index: false, follow: true } : undefined,
  };
}

export default async function BlogIndex({ searchParams }: Props) {
  const { page, search } = await read(searchParams);
  let data: Awaited<ReturnType<typeof listPublic>> | null = null;
  try {
    data = await listPublic(page, search);
  } catch (error) {
    console.error("Blog list failed", error);
  }
  const query = (n: number) => `/blog?${search ? `q=${encodeURIComponent(search)}&` : ""}page=${n}`;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-4xl font-bold tracking-tight">Technical articles</h1>
        <p className="mt-4 text-lg text-muted-foreground">Writing about backend development, full stack applications, and AI systems.</p>
        <form action="/blog" method="get" className="mt-6 flex gap-2">
          <label htmlFor="search" className="sr-only">Search articles</label>
          <input id="search" name="q" defaultValue={search} maxLength={60} placeholder="Search articles" className="flex-1 rounded-lg border border-border bg-card px-3 py-2" />
          <button className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground">Search</button>
        </form>
        {!data ? (
          <p className="mt-8">The blog is temporarily unavailable. Please try again later.</p>
        ) : data.rows.length ? (
          data.rows.map((a) => (
            <article key={a.slug} className="mt-8 border-b border-border/50 pb-6">
              <h2 className="text-2xl font-semibold"><Link href={`/blog/${a.slug}`} className="hover:underline">{a.title}</Link></h2>
              <p className="mt-2 text-muted-foreground">{a.excerpt}</p>
              <p className="mt-2 text-sm text-muted-foreground"><time dateTime={a.published_at!}>{a.published_at?.slice(0, 10)}</time>{a.category ? ` · ${a.category}` : ""}</p>
            </article>
          ))
        ) : (
          <p className="mt-8">No articles found.</p>
        )}
        <nav aria-label="Pagination" className="mt-8 flex justify-between">
          {page > 1 ? <Link href={query(page - 1)} className="underline">← Newer</Link> : <span />}
          {data?.next ? <Link href={query(page + 1)} className="underline">Older →</Link> : null}
        </nav>
      </main>
      <SiteFooter />
    </div>
  );
}

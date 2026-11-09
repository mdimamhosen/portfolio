import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { getPublic, related } from "@/lib/server/blog";
import { SITE_URL, AUTHOR, jsonLd } from "@/lib/site";
import { AuthorBio, Crumbs, SiteFooter, SiteHeader, breadcrumbLd } from "@/components/SiteChrome";
import CopyLink from "./copy-link";

export const revalidate = 300;
// Empty list = no build-time DB access; each article is rendered on first visit, then cached (ISR).
export const generateStaticParams = async () => [];
type Props = { params: Promise<{ slug: string }> };
const valid = (slug: string) => /^[a-z0-9-]+$/.test(slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = valid(slug) ? await getPublic(slug).catch(() => null) : null;
  if (!article) return { title: "Article not found", robots: { index: false } };
  const title = article.seo_title || article.title;
  const description = (article.seo_description || article.excerpt || "").slice(0, 320);
  const image = article.social_image || article.cover_image || undefined;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: article.canonical_url || `/blog/${slug}` },
    openGraph: { type: "article", title, description, url: `/blog/${slug}`, publishedTime: article.published_at || undefined, modifiedTime: article.updated_at, authors: [AUTHOR.name], images: image ? [image] : undefined },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : undefined },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  if (!valid(slug)) notFound();
  const article = await getPublic(slug);
  if (!article) notFound();
  const rel = await related(article).catch(() => []);
  const minutes = Math.max(1, Math.ceil(article.content.trim().split(/\s+/).length / 200));
  const url = `${SITE_URL}/blog/${slug}`;
  const posting = {
    "@context": "https://schema.org", "@type": "BlogPosting", headline: article.title,
    description: (article.seo_description || article.excerpt || "").slice(0, 320),
    author: { "@type": "Person", name: article.author, url: SITE_URL, sameAs: [AUTHOR.github, AUTHOR.linkedin] },
    datePublished: article.published_at, dateModified: article.updated_at, mainEntityOfPage: url,
    ...(article.cover_image ? { image: new URL(article.cover_image, SITE_URL).toString() } : {}),
  };
  return (
    <div className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(posting)} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbLd(SITE_URL, [{ name: "Home", href: "/" }, { name: "Blog", href: "/blog" }, { name: article.title, href: `/blog/${slug}` }]))} />
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Crumbs items={[{ name: "Home", href: "/" }, { name: "Blog", href: "/blog" }, ...(article.category ? [{ name: article.category }] : [])]} />
        <article>
          <h1 className="text-4xl font-bold tracking-tight">{article.title}</h1>
          {article.excerpt && <p className="mt-4 text-lg text-muted-foreground">{article.excerpt}</p>}
          <p className="mt-3 text-sm text-muted-foreground">{article.author} · <time dateTime={article.published_at!}>{article.published_at?.slice(0, 10)}</time> · {minutes} min read</p>
          {article.cover_image && (
            // Fixed aspect box prevents layout shift; covers can be external URLs, so plain <img> instead of next/image remotePatterns.
            <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-xl bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={article.cover_image} alt={article.cover_image_alt || article.title} className="h-full w-full object-cover" fetchPriority="high" />
            </div>
          )}
          {/* Markdown is rendered without raw HTML (no rehype-raw), so stored content can't inject scripts. */}
          <div className="prose prose-invert mt-8 max-w-none prose-pre:overflow-auto prose-img:rounded-lg">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{article.content}</ReactMarkdown>
          </div>
        </article>
        <p className="mt-8 flex gap-4 text-sm">
          <CopyLink />
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className="underline">Share on LinkedIn</a>
        </p>
        <AuthorBio />
        {rel.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-semibold">Related articles</h2>
            <ul className="mt-3 list-disc space-y-1 pl-6">{rel.map((a) => <li key={a.slug}><Link href={`/blog/${a.slug}`} className="underline">{a.title}</Link></li>)}</ul>
          </section>
        )}
        <p className="mt-10"><Link href="/blog" className="underline">← All articles</Link></p>
      </main>
      <SiteFooter />
    </div>
  );
}

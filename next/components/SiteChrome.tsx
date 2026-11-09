import Link from "next/link";
import { AUTHOR } from "@/lib/site";

// Server-rendered header/footer for content pages (/blog, /services). The home page keeps its own Navigation.
export function SiteHeader() {
  return (
    <header className="border-b border-border/50">
      <nav aria-label="Main" className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-5 text-sm">
        <Link href="/" className="font-semibold text-foreground">{AUTHOR.name}</Link>
        <Link href="/services" className="text-muted-foreground hover:text-foreground">Services</Link>
        <Link href="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link>
        <Link href="/#contact" className="text-muted-foreground hover:text-foreground">Contact</Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/50">
      <div className="mx-auto flex max-w-3xl flex-wrap gap-x-6 gap-y-2 px-4 py-8 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Portfolio</Link>
        <Link href="/services/backend-development" className="hover:text-foreground">Backend Development</Link>
        <Link href="/services/ai-integration" className="hover:text-foreground">AI Integration</Link>
        <Link href="/blog" className="hover:text-foreground">Blog</Link>
        <a href="/feed.xml" className="hover:text-foreground">RSS</a>
      </div>
    </footer>
  );
}

export function Crumbs({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
      <ol className="flex flex-wrap gap-1">
        {items.map((item, i) => (
          <li key={item.name} className="flex gap-1">
            {i > 0 && <span aria-hidden="true">/</span>}
            {item.href ? <Link href={item.href} className="hover:text-foreground">{item.name}</Link> : <span aria-current="page">{item.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export const breadcrumbLd = (base: string, items: { name: string; href: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: `${base}${item.href}` })),
});

export function AuthorBio() {
  return (
    <aside aria-label="About the author" className="mt-12 rounded-xl border border-border/60 bg-card p-5">
      <p className="font-semibold text-foreground">{AUTHOR.name}</p>
      <p className="text-sm text-muted-foreground">{AUTHOR.jobTitle}. Builds full stack applications, backend APIs, and AI workflows.</p>
      <p className="mt-2 flex gap-4 text-sm">
        <a href={AUTHOR.github} rel="me noopener noreferrer" target="_blank" className="underline">GitHub</a>
        <a href={AUTHOR.linkedin} rel="me noopener noreferrer" target="_blank" className="underline">LinkedIn</a>
        <Link href="/#about" className="underline">Full profile</Link>
      </p>
    </aside>
  );
}

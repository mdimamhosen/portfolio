import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICES } from "@/lib/services";
import { SITE_URL, AUTHOR, jsonLd } from "@/lib/site";
import { AuthorBio, Crumbs, SiteFooter, SiteHeader, breadcrumbLd } from "@/components/SiteChrome";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(SERVICES).map((slug) => ({ slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const s = SERVICES[(await params).slug];
  if (!s) return {};
  const path = `/services/${(await params).slug}`;
  return { title: s.title, description: s.description, alternates: { canonical: path }, openGraph: { title: s.title, description: s.description, url: path } };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const s = SERVICES[slug];
  if (!s) notFound();
  const path = `/services/${slug}`;
  const faq = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: s.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };
  return (
    <div className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbLd(SITE_URL, [{ name: "Home", href: "/" }, { name: "Services", href: "/services" }, { name: s.title, href: path }]))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(faq)} />
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Crumbs items={[{ name: "Home", href: "/" }, { name: "Services", href: "/services" }, { name: s.title }]} />
        <h1 className="text-4xl font-bold tracking-tight">{s.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{s.intro}</p>
        <h2 className="mt-10 text-2xl font-semibold">What I can deliver</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6">{s.scope.map((x) => <li key={x}>{x}</li>)}</ul>
        <h2 className="mt-10 text-2xl font-semibold">Approach</h2>
        <p className="mt-3">{s.approach}</p>
        <h2 className="mt-10 text-2xl font-semibold">Related work</h2>
        <p className="mt-3"><a href={s.projectUrl} rel="noopener noreferrer" className="underline">{s.project}</a> is an existing project featured in my portfolio. Project scope and contribution details can be discussed directly.</p>
        <h2 className="mt-10 text-2xl font-semibold">Frequently asked questions</h2>
        <dl className="mt-3 space-y-4">
          {s.faq.map((f) => (
            <div key={f.q}>
              <dt className="font-semibold">{f.q}</dt>
              <dd className="mt-1 text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
        <h2 className="mt-10 text-2xl font-semibold">Discuss a project</h2>
        <p className="mt-3"><a href={`mailto:${AUTHOR.email}?subject=Development%20project`} className="underline">Email {AUTHOR.name}</a> with the problem, current stack, and expected timeline.</p>
        <p className="mt-3"><Link href="/blog" className="underline">Read technical articles</Link></p>
        <AuthorBio />
      </main>
      <SiteFooter />
    </div>
  );
}

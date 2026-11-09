import Link from "next/link";
import type { Metadata } from "next";
import { SERVICES } from "@/lib/services";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Development Services",
  description: "Backend development and AI integration services by Md. Imam Hosen.",
  alternates: { canonical: "/services" },
  openGraph: { title: "Development Services", description: "Backend development and AI integration services by Md. Imam Hosen.", url: "/services" },
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-4xl font-bold tracking-tight">Development services</h1>
        <p className="mt-4 text-lg text-muted-foreground">I work on application backends and practical AI integrations. Explore each service for scope, approach, and project context.</p>
        {Object.entries(SERVICES).map(([slug, s]) => (
          <section key={slug} className="mt-6 rounded-xl border border-border/60 bg-card p-5">
            <h2 className="text-xl font-semibold"><Link href={`/services/${slug}`} className="hover:underline">{s.title}</Link></h2>
            <p className="mt-2 text-muted-foreground">{s.description}</p>
          </section>
        ))}
      </main>
      <SiteFooter />
    </div>
  );
}

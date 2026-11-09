import type { Metadata } from "next";
import Index from "@/views/Index";

export const metadata: Metadata = {
  alternates: { canonical: "/", types: { "application/rss+xml": [{ url: "/feed.xml", title: "Md. Imam Hosen Blog" }] } },
  openGraph: { type: "website", url: "/", title: "Md. Imam Hosen | Full Stack, Backend & AI Engineer", description: "Explore selected full stack, backend, and AI projects by Md. Imam Hosen.", images: ["/logo.png"] },
};

export default function Home() {
  return <Index />;
}

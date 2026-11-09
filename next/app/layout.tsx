import type { Metadata, Viewport } from "next";
import Providers from "./providers";
import { AUTHOR, SITE_URL, jsonLd } from "@/lib/site";
import "./globals.css";

const title = "Md. Imam Hosen | Full Stack, Backend & AI Engineer";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: "%s | Md. Imam Hosen" },
  description: "Md. Imam Hosen builds full stack applications, backend APIs, and AI workflows. Explore selected projects and get in touch about development work.",
  authors: [{ name: AUTHOR.name, url: SITE_URL }],
  alternates: { types: { "application/rss+xml": [{ url: "/feed.xml", title: "Md. Imam Hosen Blog" }] } },
  robots: { index: true, follow: true },
  manifest: "/manifest.webmanifest",
  icons: { icon: "/logo.png" },
  openGraph: { type: "website", title, description: "Explore selected full stack, backend, and AI projects by Md. Imam Hosen.", images: ["/logo.png"] },
  twitter: { card: "summary_large_image", title, description: "Selected full stack, backend, and AI projects by Md. Imam Hosen.", images: ["/logo.png"] },
};

export const viewport: Viewport = { themeColor: "#090d19" };

const person = { "@context": "https://schema.org", "@type": "Person", name: AUTHOR.name, url: `${SITE_URL}/`, sameAs: [AUTHOR.github, AUTHOR.linkedin], jobTitle: AUTHOR.jobTitle };
const website = { "@context": "https://schema.org", "@type": "WebSite", name: "Md. Imam Hosen Portfolio", url: `${SITE_URL}/` };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(person)} />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(website)} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

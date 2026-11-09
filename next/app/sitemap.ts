import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { allPublicSlugs } from "@/lib/server/blog";
import { SERVICES } from "@/lib/services";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fixed = ["/", "/services", ...Object.keys(SERVICES).map((slug) => `/services/${slug}`), "/blog"];
  // A DB outage must not drop the static pages from the sitemap.
  const posts = await allPublicSlugs().catch(() => []);
  return [
    ...fixed.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...posts.map((post) => ({ url: `${SITE_URL}/blog/${post.slug}`, lastModified: post.updated_at || post.published_at || undefined })),
  ];
}

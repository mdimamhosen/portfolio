import type { Metadata } from "next";
import { BlogAdmin } from "../../client-views";

export const metadata: Metadata = { title: "Blog management", robots: { index: false, follow: false } };

export default function Page() {
  return <BlogAdmin />;
}

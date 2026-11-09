import type { Metadata } from "next";
import { AdminVisitors } from "../../client-views";

export const metadata: Metadata = { title: "Visitor analytics", robots: { index: false, follow: false } };

export default function Page() {
  return <AdminVisitors />;
}

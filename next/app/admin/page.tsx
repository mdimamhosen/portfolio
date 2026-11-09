import type { Metadata } from "next";
import { AdminFiles } from "../client-views";

export const metadata: Metadata = { title: "Cloud files", robots: { index: false, follow: false } };

export default function Page() {
  return <AdminFiles />;
}

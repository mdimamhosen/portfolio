import type { Metadata } from "next";
import { Share } from "../client-views";

export const metadata: Metadata = { title: "SwiftDrop file sharing", robots: { index: false, follow: false } };

export default function Page() {
  return <Share />;
}

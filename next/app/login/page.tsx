import type { Metadata } from "next";
import { Login } from "../client-views";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

export default function Page() {
  return <Login />;
}

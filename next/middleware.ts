import { NextResponse, type NextRequest } from "next/server";

// Edge runtime has no node:crypto, so this is only a presence check that saves a page load.
// Every admin API re-verifies the signed session server-side.
export function middleware(req: NextRequest) {
  if (!req.cookies.get("blog_session")?.value) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
}

export const config = { matcher: ["/admin", "/admin/:path*"] };

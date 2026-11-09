/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: import.meta.dirname,
  trailingSlash: false,
  images: { formats: ["image/avif", "image/webp"] },
  serverExternalPackages: ["mongodb", "sharp"],
  async redirects() {
    return [{ source: "/index.html", destination: "/", permanent: true }];
  },
  async headers() {
    const noindex = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];
    return [
      { source: "/:path*", headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ] },
      { source: "/api/:path((?!images/).*)", headers: [...noindex, { key: "Cache-Control", value: "no-store" }] },
      { source: "/admin/:path*", headers: [...noindex, { key: "Cache-Control", value: "no-store" }] },
      { source: "/admin", headers: [...noindex, { key: "Cache-Control", value: "no-store" }] },
      { source: "/login", headers: noindex },
      { source: "/share", headers: noindex },
    ];
  },
};
export default nextConfig;

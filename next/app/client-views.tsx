"use client";

import dynamic from "next/dynamic";

// These screens use localStorage, peerjs and other browser APIs during render and are noindex, so skip SSR.
const loading = () => <div className="min-h-screen bg-slate-950 p-8 text-white">Loading…</div>;
export const Share = dynamic(() => import("@/views/Share"), { ssr: false, loading });
export const Login = dynamic(() => import("@/views/Login"), { ssr: false, loading });
export const AdminFiles = dynamic(() => import("@/views/AdminFiles"), { ssr: false, loading });
export const AdminVisitors = dynamic(() => import("@/views/AdminVisitors"), { ssr: false, loading });
export const BlogAdmin = dynamic(() => import("@/views/BlogAdmin"), { ssr: false, loading: () => <div className="min-h-screen bg-slate-950 p-8 text-white">Loading editor…</div> });

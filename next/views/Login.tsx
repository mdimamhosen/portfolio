"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Login = () => {
  const router = useRouter();
  const next = useSearchParams().get("next");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/blog/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
    setLoading(false);
    if (!res.ok) {
      setMessage((await res.json().catch(() => ({}))).error || "Sign in failed");
      return;
    }
    // Only allow same-site admin paths as the post-login destination.
    router.replace(next?.startsWith("/admin") ? next : "/admin");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md">
        <h1 className="text-2xl font-semibold">Admin Sign In</h1>
        <p className="mt-1 text-sm text-white/70">Administrator password required.</p>
        <form onSubmit={signIn} className="mt-4 space-y-3">
          <Input type="password" autoComplete="current-password" required aria-label="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="border-white/20 bg-white/10" />
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
          {message ? <p role="status" className="text-sm text-white/80">{message}</p> : null}
        </form>
      </div>
    </div>
  );
};

export default Login;

"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useSessionNotification } from "@/hooks/useSessionNotification";
import { initEmail } from "@/lib/email";

// Browser-only widgets (sessionStorage, chat UI); keep them out of the server render and the first JS chunk.
const Analytics = dynamic(() => import("@/components/Analytics"), { ssr: false });
const PortfolioChat = dynamic(() => import("@/components/PortfolioChat"), { ssr: false });

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  useSessionNotification();

  useEffect(() => {
    try {
      initEmail();
    } catch (error) {
      console.warn("Email init failed:", error);
    }

    // Unregister leftover PWA service workers from the old Vite build (they cached stale HTML/assets).
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((reg) => void reg.unregister()));
      if ("caches" in window) caches.keys().then((keys) => keys.forEach((key) => void caches.delete(key)));
    }
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Analytics />
          {children}
          <PortfolioChat />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

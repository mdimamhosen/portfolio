import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminVisitors from "./pages/AdminVisitors";
import Share from "./pages/Share";
import Login from "./pages/Login";
import AdminFiles from "./pages/AdminFiles";
import { useSessionNotification } from "@/hooks/useSessionNotification";
import PortfolioChat from "@/components/PortfolioChat";

const queryClient = new QueryClient();

const App = () => {
  useSessionNotification();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/share" element={<Share />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminFiles />} />
            <Route path="/admin/visitors" element={<AdminVisitors />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <PortfolioChat />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

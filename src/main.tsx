import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initEmail } from "./lib/email";

try {
  initEmail();
} catch (error) {
  console.warn("Email init failed:", error);
}

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Root element #root not found");
}

createRoot(rootEl).render(<App />);

// Unregister leftover PWA service workers (they cached stale HTML/assets).
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((reg) => {
        void reg.unregister();
      });
    });
    if ("caches" in window) {
      caches.keys().then((keys) => {
        keys.forEach((key) => {
          void caches.delete(key);
        });
      });
    }
  });
}

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initEmail } from "./lib/email";

initEmail();

createRoot(document.getElementById("root")!).render(<App />);

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

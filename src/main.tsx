import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initEmail } from "./lib/email";

initEmail();

createRoot(document.getElementById("root")!).render(<App />);

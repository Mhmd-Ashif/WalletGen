import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Buffer } from "buffer";
import process from "process";
import { Toaster } from "./components/ui/sonner.tsx";
window.Buffer = Buffer;
window.process = process;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Toaster position="top-center" richColors />
  </StrictMode>
);

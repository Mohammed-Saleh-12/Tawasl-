import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { SpeedInsights } from "@vercel/speed-insights/react";

createRoot(document.getElementById("root")!).render(
  <>
    <App />
    <SpeedInsights />
  </>
);

import { basic } from "@memora/schemas";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { Router } from "./router.tsx";

basic.parse({});
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)

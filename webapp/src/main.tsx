import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import { App } from "#src/App.tsx";
import "#src/index.css";
import "#src/ui/library-styles/lucide.css";
import "#src/ui/library-styles/react-aria.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

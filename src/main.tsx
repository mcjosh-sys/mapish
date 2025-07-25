import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { PageTitleProvider } from "./contexts/page-title-context.tsx";
import { HeaderProvider } from "./contexts/header-context.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import { DataProvider } from "./contexts/data-context.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PageTitleProvider>
      <HeaderProvider>
        <DataProvider>
          <App />
        </DataProvider>
        <Toaster position="top-right" />
      </HeaderProvider>
    </PageTitleProvider>
  </StrictMode>
);

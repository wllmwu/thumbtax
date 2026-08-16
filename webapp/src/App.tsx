import { specifications } from "@thumbtax/forms";
import { BrowserRouter, Route, Routes } from "react-router";

import { useAutoSave } from "#src/persistence/useAutoSave";
import { AboutPage } from "#src/ui/pages/AboutPage";
import { GlossaryPage } from "#src/ui/pages/GlossaryPage";
import { Layout } from "#src/ui/pages/Layout";
import { MainPage } from "#src/ui/pages/MainPage";

export function App() {
  useAutoSave(specifications);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="glossary" element={<GlossaryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

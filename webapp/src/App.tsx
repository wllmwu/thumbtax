import React from "react";

import { BrowserRouter, Route, Routes } from "react-router";

import { usePersistence } from "#src/persistence/usePersistence";
import { SpecificationClient } from "#src/specifications/specificationClient";
import { Layout } from "#src/ui/navigation/Layout";
import { AboutPage } from "#src/ui/pages/AboutPage";
import { MainPage } from "#src/ui/pages/MainPage";

export function App() {
  const specifications = React.useMemo(
    () => new SpecificationClient().getAllForms(),
    [],
  );
  usePersistence(specifications);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

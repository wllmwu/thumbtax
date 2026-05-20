import React from "react";

import { BrowserRouter, Route, Routes } from "react-router";

import { SpecificationClient } from "#src/specifications/specificationClient";
import { useStore } from "#src/state/useStore";
import { Layout } from "#src/ui/navigation/Layout";
import { AboutPage } from "#src/ui/pages/AboutPage";
import { MainPage } from "#src/ui/pages/MainPage";

export function App() {
  const initialize = useStore((state) => state.initialize);

  React.useEffect(() => {
    const client = new SpecificationClient();
    initialize(
      { filingStatus: "single", formClasses: [], formInstances: {} },
      { connectionsGraphNodePositions: {} },
      { browserSaveEnabled: false, maximumHistorySize: 50 },
      client.getAllForms(),
    );
  }, [initialize]);

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

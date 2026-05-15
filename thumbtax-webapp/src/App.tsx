import { BrowserRouter, Route, Routes } from "react-router";

import { Layout } from "#src/ui/navigation/Layout";
import { AboutPage } from "#src/ui/pages/AboutPage";
import { MainPage } from "#src/ui/pages/MainPage";

export function App() {
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

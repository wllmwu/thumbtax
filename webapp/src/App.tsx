import { specifications } from "@thumbtax/forms";
import { createBrowserRouter, RouterProvider } from "react-router";

import { useAutoSave } from "#src/persistence/useAutoSave";
import { AboutPage } from "#src/ui/pages/AboutPage";
import { GlossaryPage } from "#src/ui/pages/GlossaryPage";
import { IncomeBuilderPage } from "#src/ui/pages/IncomeBuilderPage";
import { Layout } from "#src/ui/pages/Layout";
import { MainPage } from "#src/ui/pages/MainPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "glossary", element: <GlossaryPage /> },
      { path: "income-builder", element: <IncomeBuilderPage /> },
      { path: "privacy", element: <h1>todo</h1> },
      { path: "terms", element: <h1>todo</h1> },
    ],
  },
]);

export function App() {
  useAutoSave(specifications);

  return <RouterProvider router={router} />;
}

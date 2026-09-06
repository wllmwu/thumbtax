import { specifications } from "@thumbtax/forms";
import { createBrowserRouter, RouterProvider } from "react-router";

import { useAutoSave } from "#src/persistence/useAutoSave";
import { AboutPage } from "#src/ui/pages/AboutPage";
import { GlossaryPage } from "#src/ui/pages/GlossaryPage";
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
    ],
  },
]);

export function App() {
  useAutoSave(specifications);

  return <RouterProvider router={router} />;
}

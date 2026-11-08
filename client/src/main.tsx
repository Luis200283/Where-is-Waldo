import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App.tsx";
import Index from "./Index.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  { path: "/L1", element: <App level={1} /> },
  { path: "/L2", element: <App level={2} /> },
  { path: "/L3", element: <App level={3} /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

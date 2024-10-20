import { createBrowserRouter } from "react-router-dom";
import DemoPage from "../pages/DemoPage";
import HomePage from "../pages/HomePage";
import App from "../App";

export const routesRegistry = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
        name: "Home",
      },
      {
        path: "/demo",
        element: <DemoPage />,
        name: "Demo",
      },
    ],
  },
];

export const router = createBrowserRouter(routesRegistry);

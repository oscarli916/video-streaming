import { createBrowserRouter } from "react-router-dom";
import DemoPage from "../pages/DemoPage";
import HomePage from "../pages/HomePage";
import App from "../App";
import RoomPage from "../pages/RoomPage";
import MeetingPage from "../pages/MeetingPage";

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
      {
        path: "/room",
        element: <RoomPage />,
        name: "Room",
      },
      {
        path: "/room/:id",
        element: <MeetingPage />,
      },
    ],
  },
];

export const router = createBrowserRouter(routesRegistry);

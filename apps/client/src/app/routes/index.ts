import { lazy } from "react";
import { createBrowserRouter } from "react-router";

import MainLayout from "@/components/layout/MainLayout";
import { ROUTES } from "@/constants/common";
import HomePage from "@/features/home/HomePage";

export const routes = createBrowserRouter([
  {
    Component: MainLayout,
    children: [
      {
        path: ROUTES.HOME(),
        Component: HomePage,
      },
      {
        path: ROUTES.PIN(":pinId"),
        Component: lazy(() => import("@/features/pin/pages/PinPage/PinPage")),
      },
      {
        path: ROUTES.SEARCH(),
        Component: lazy(() => import("@/features/pin/pages/SearchPage")),
      },
      {
        path: ROUTES.IDEAS(),
        Component: lazy(() => import("@/features/pin/pages/IdeasPage")),
      },
    ],
  },
]);

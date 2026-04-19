import { lazy } from "react";
import { createBrowserRouter } from "react-router";

import MainLayout from "@/components/layout/MainLayout";
import SavedIdeasLayout from "@/components/layout/SavedIdeasLayout";
import { ROUTES } from "@/constants/common";
import HomePage from "@/features/home/pages/HomePage";

export const routes = createBrowserRouter([
  {
    Component: MainLayout,
    children: [
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
      {
        Component: SavedIdeasLayout,
        children: [
          {
            path: ROUTES.PROFILE(":username"),
            Component: lazy(
              () => import("@/features/saved-idea/pages/SavedIdeasPins/SavedIdeasPins")
            ),
          },
        ],
      },
      {
        path: ROUTES.HOME(),
        Component: HomePage,
      },
    ],
  },
]);

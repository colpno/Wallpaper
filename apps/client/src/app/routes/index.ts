import { lazy } from "react";
import { createBrowserRouter } from "react-router";

import { ROUTES } from "@/constants/common";
import HomePage from "@/features/home/HomePage";
import GuessLayout from "@/layouts/GuessLayout";

export const routes = createBrowserRouter([
  {
    Component: GuessLayout,
    children: [
      {
        path: ROUTES.HOME(),
        Component: HomePage,
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

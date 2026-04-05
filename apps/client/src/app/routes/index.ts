import { lazy } from "react";
import { createBrowserRouter } from "react-router";

import { ROUTES } from "@/constants/common";
import GuessLayout from "@/layouts/GuessLayout";

const routes = createBrowserRouter([
  {
    Component: GuessLayout,
    children: [
      {
        path: ROUTES.SEARCH(),
        Component: lazy(() => import("@/features/post/pages/SearchPage")),
      },
      {
        path: ROUTES.IDEAS(),
        Component: lazy(() => import("@/features/post/pages/IdeasPage")),
      },
    ],
  },
]);

export default routes;

import { lazy } from "react";
import { createBrowserRouter, type RouteObject } from "react-router";

const routes: RouteObject[] = [
  {
    path: "/ideas",
    Component: lazy(() => import("@/features/explore/pages/Explore")),
  },
];

export default createBrowserRouter(routes);

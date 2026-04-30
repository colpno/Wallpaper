import { lazy } from "react";
import { createBrowserRouter } from "react-router";

import MainLayout from "@/components/layout/MainLayout";
import OtherUserProfileLayout from "@/components/layout/OtherUserProfileLayout";
import ProtectedLayout from "@/components/layout/ProtectedLayout";
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
        Component: lazy(() => import("@/features/search/pages/SearchPage")),
      },

      {
        path: ROUTES.EXPLORE(),
        Component: lazy(() => import("@/features/pin/pages/ExplorePage")),
      },

      {
        Component: SavedIdeasLayout,
        children: [
          {
            path: ROUTES.SAVED_IDEA_PINS(":username"),
            Component: lazy(() => import("@/features/pin/pages/MyPins")),
          },
        ],
      },
      {
        Component: OtherUserProfileLayout,
        children: [
          {
            path: ROUTES.PROFILE_SAVES(":username"),
            Component: lazy(() => import("@/features/profile/pages/OtherUserProfileSavedPinsPage")),
          },
        ],
      },
      {
        path: ROUTES.PROFILE(":username"),
        Component: lazy(() => import("@/features/profile/pages/ProfilePage")),
      },

      {
        path: ROUTES.HOME(),
        Component: HomePage,
      },
    ],
  },
  {
    Component: ProtectedLayout,
    children: [
      {
        path: ROUTES.PIN_CREATION(),
        Component: lazy(() => import("@/features/pin/pages/PinCreation/PinCreation")),
      },
    ],
  },
]);

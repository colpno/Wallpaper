import { Outlet } from "react-router";

import { useStore } from "@/app/stores/useStore";

import GuessLayout from "./GuessLayout";
import ProtectedLayout from "./ProtectedLayout";

function MainLayout() {
  const user = useStore((state) => state.user);

  if (user) {
    return (
      <ProtectedLayout>
        <Outlet />
      </ProtectedLayout>
    );
  }

  return (
    <GuessLayout>
      <Outlet />
    </GuessLayout>
  );
}

export default MainLayout;

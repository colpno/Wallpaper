import { useStore } from "@/app/stores/useStore";

import GuessLayout from "./GuessLayout";
import ProtectedLayout from "./ProtectedLayout";
import SuspenseLayout from "./SuspenseLayout";

function MainLayout() {
  const user = useStore((state) => state.auth.user);

  if (user) {
    return (
      <ProtectedLayout>
        <SuspenseLayout />
      </ProtectedLayout>
    );
  }

  return (
    <GuessLayout>
      <SuspenseLayout />
    </GuessLayout>
  );
}

export default MainLayout;

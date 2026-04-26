import { useStore } from "@/app/stores/useStore";

import GuessHomePage from "./GuessHomePage";
import UserHomePage from "./UserHomePage";

function HomePage() {
  const user = useStore((state) => state.user);

  if (user) {
    return <UserHomePage />;
  }

  return <GuessHomePage />;
}

export default HomePage;

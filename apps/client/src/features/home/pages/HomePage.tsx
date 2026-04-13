import { useStore } from "@/app/stores/useStore";
import IdeasPage from "@/features/pin/pages/IdeasPage";

import GuessHomePage from "./GuessHomePage";

function HomePage() {
  const user = useStore((state) => state.user);

  if (user) {
    return <IdeasPage />;
  }

  return <GuessHomePage />;
}

export default HomePage;

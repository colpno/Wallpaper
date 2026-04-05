import { Outlet } from "react-router";

import Header from "@/components/layout/Header";
import { headerHeight } from "@/constants/components";

function GuessLayout() {
  return (
    <>
      <Header />
      <main className="min-h-dvh" style={{ paddingTop: headerHeight }}>
        <Outlet />
      </main>
    </>
  );
}

export default GuessLayout;

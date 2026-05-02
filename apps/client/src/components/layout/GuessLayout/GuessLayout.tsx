import { Outlet } from "react-router";

import Header from "@/components/layout/GuessLayout/components/Header";

function GuessLayout({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <Header />

      <main className="flex min-h-dvh flex-col pt-header-height">{children ?? <Outlet />}</main>
    </>
  );
}

export default GuessLayout;

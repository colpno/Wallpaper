import { cn } from "@repo/ui/lib";
import { useState } from "react";
import { Navigate } from "react-router";

import { useStore } from "@/app/stores/useStore";
import { ROUTES } from "@/constants/common";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { SidebarProvider, type SidebarProviderState } from "./components/Sidebar/Sidebar.context";

function ProtectedLayout({ children }: Pick<React.ComponentProps<"div">, "children">) {
  const user = useStore((state) => state.user);
  const [subSidebar, setSubSidebar] = useState<SidebarProviderState["subSidebar"]>(null);

  const sidebarContextState: SidebarProviderState = {
    subSidebar,
    setSubSidebar,
  };

  if (!user) {
    return <Navigate to={ROUTES.HOME()} />;
  }

  return (
    <SidebarProvider value={sidebarContextState}>
      <Header />

      <Sidebar />

      <main
        className={cn(
          "w-full transition-[padding-left] duration-not-sidebar ease-out",
          subSidebar
            ? "pl-[calc(var(--spacing-sidebar-width)+var(--spacing-sub-sidebar-width))]"
            : "pl-sidebar-width"
        )}
      >
        {children}
      </main>
    </SidebarProvider>
  );
}

export default ProtectedLayout;

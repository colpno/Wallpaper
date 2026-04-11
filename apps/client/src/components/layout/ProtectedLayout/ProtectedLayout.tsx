import { SidebarProvider } from "@repo/ui/components";

import { headerHeight, sidebarWidth } from "@/constants/components";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

function ProtectedLayout({ children }: Pick<React.ComponentProps<"div">, "children">) {
  return (
    <SidebarProvider
      open={false}
      style={
        {
          "--sidebar-width": sidebarWidth,
          "--sidebar-width-icon": sidebarWidth,
        } as React.CSSProperties
      }
    >
      <Header />

      <Sidebar />

      <main className="w-full" style={{ paddingTop: headerHeight }}>
        {children}
      </main>
    </SidebarProvider>
  );
}

export default ProtectedLayout;

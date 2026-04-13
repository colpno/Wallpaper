import { SidebarProvider } from "@repo/ui/components";

import { HEADER_HEIGHT, SIDEBAR_WIDTH } from "@/constants/components";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

function ProtectedLayout({ children }: Pick<React.ComponentProps<"div">, "children">) {
  return (
    <SidebarProvider
      open={false}
      style={
        {
          "--sidebar-width": SIDEBAR_WIDTH,
          "--sidebar-width-icon": SIDEBAR_WIDTH,
        } as React.CSSProperties
      }
    >
      <Header />

      <Sidebar />

      <main className="w-full" style={{ paddingTop: HEADER_HEIGHT }}>
        {children}
      </main>
    </SidebarProvider>
  );
}

export default ProtectedLayout;

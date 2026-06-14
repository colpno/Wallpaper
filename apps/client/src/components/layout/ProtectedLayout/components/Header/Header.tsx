import { cn } from "@repo/ui/lib";

import SearchBar from "@/components/layout/SearchBar";

import { useSidebar } from "../Sidebar/Sidebar.context";
import Account from "./components/Account";

function Header(props: React.ComponentProps<"header">) {
  const { subSidebar } = useSidebar();

  return (
    <header
      {...props}
      className={cn(
        "fixed inset-x-0 top-0 z-header ml-sidebar-width flex h-header-height items-center gap-4 bg-background p-4 transition-[margin-left] duration-not-sidebar ease-out",
        subSidebar && "ml-[calc(var(--spacing-sidebar-width)+var(--spacing-sub-sidebar-width))]",
        props.className
      )}
    >
      <SearchBar className="flex-1" />

      <Account />
    </header>
  );
}

export default Header;

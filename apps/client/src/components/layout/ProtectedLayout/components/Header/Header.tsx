import { cn } from "@repo/ui/lib";

import { headerHeight, sidebarWidth } from "@/constants/components";

import Account from "./components/Account";
import SearchBar from "./components/SearchBar";

function Header(props: React.ComponentProps<"header">) {
  return (
    <header
      {...props}
      className={cn(
        "fixed top-0 right-0 z-header flex items-center gap-4 bg-background p-4",
        props.className
      )}
      style={{
        ...props.style,
        height: headerHeight,
        left: sidebarWidth,
      }}
    >
      <SearchBar className="flex-1" />

      <Account />
    </header>
  );
}

export default Header;

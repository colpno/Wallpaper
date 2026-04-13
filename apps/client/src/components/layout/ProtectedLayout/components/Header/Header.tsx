import { cn } from "@repo/ui/lib";
import { FaChevronDown } from "react-icons/fa6";

import { Dish1 } from "@/assets/images";
import Tooltip from "@/components/common/Tooltip";
import Button from "@/components/ui/Button";
import Image from "@/components/ui/Image";
import { headerHeight, sidebarWidth } from "@/constants/components";

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

      <div className="flex items-center gap-1">
        <Tooltip
          trigger={<Image src={Dish1} className="size-9.5 rounded-full border bg-blue-300" />}
        >
          Profile
        </Tooltip>

        <Tooltip
          trigger={
            <Button variant="ghost-icon">
              <FaChevronDown />
            </Button>
          }
          slotProps={{
            trigger: {
              asChild: true,
            },
          }}
        >
          Account
        </Tooltip>
      </div>
    </header>
  );
}

export default Header;

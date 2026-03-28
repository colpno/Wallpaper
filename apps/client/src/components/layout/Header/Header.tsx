import { Button } from "@repo/ui/components";
import { cn } from "@repo/ui/lib";
import { useState } from "react";
import { createPortal } from "react-dom";

import Icon from "@/components/ui/Icon";
import Link from "@/components/ui/Link";
import { headerHeight } from "@/constants/components";

import NavItem from "./components/NavItem";
import Search from "./components/Search";

const menu = [{ name: "Explore", href: "#" }];

function Header() {
  const [searchActive, setSearchActive] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 right-0 left-0 z-10 flex items-center gap-4 bg-background px-4"
        style={{ height: headerHeight }}>
        <div className="flex items-center">
          <Link href="/" className="px-3">
            <Icon />
          </Link>

          <ul className="flex gap-2 *:max-h-full!">
            {menu.map((item) => (
              <li key={item.href}>
                <NavItem {...item} />
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1">
          <Search searchActive={searchActive} setSearchActive={setSearchActive} />
        </div>

        <div className="flex items-center gap-2 *:max-h-full!">
          <Button variant="secondary">Log In</Button>
          <Button>Sign Up</Button>
        </div>
      </nav>

      {createPortal(
        <div
          className={cn(searchActive && "fixed top-0 right-0 bottom-0 left-0 z-9 bg-[#0006]")}
        />,
        document.getElementById("root") as HTMLElement
      )}
    </>
  );
}

export default Header;

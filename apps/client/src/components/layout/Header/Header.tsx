import { Button } from "@repo/ui/components";

import Icon from "@/components/ui/Icon";
import Link from "@/components/ui/Link";
import { ROUTES } from "@/constants/common";
import { headerHeight } from "@/constants/components";

import SearchBar from "./components/SearchBar";

const menu = [{ label: "Explore", href: ROUTES.IDEAS() }];

function Header() {
  return (
    <header
      className="fixed top-0 right-0 left-0 z-10 flex items-center gap-4 bg-background p-4 shadow-[0_2px_1px_rgba(0,0,0,0.1)]"
      style={{ height: headerHeight }}
    >
      <nav className="flex items-center">
        <Link href={ROUTES.HOME()} className="px-3">
          <Icon />
        </Link>

        <ul className="flex gap-2 *:max-h-full">
          {menu.map((item) => (
            <li key={item.href}>
              <Link href={item.href} navbar button variant="ghost" className="font-bold">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <SearchBar className="flex-1" />

      <div className="flex items-center gap-2 *:max-h-full!">
        <Button variant="secondary">Log In</Button>
        <Button>Sign Up</Button>
      </div>
    </header>
  );
}

export default Header;

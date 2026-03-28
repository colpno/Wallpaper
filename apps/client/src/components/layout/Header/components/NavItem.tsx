import type { LinkAsNavLinkProps } from "@/components/ui/Link";

import { buttonVariants } from "@repo/ui/components";
import { cn } from "@repo/ui/lib";

import Link from "@/components/ui/Link";

type Menu = {
  name: string;
  href: string;
} & LinkAsNavLinkProps;

function NavItem(props: Menu) {
  return (
    <Link
      navbar
      href={props.href}
      className={({ isActive }) =>
        cn(
          buttonVariants(),
          "font-bold! select-none",
          isActive ? "rounded-4xl! bg-black! text-white!" : ""
        )
      }>
      {props.name}
    </Link>
  );
}

export default NavItem;

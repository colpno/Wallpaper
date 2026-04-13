import type {
  LinkAsAnchorProps,
  LinkAsLinkProps,
  LinkAsNavLinkProps,
  LinkProps,
} from "./Link.types";

import { buttonVariants } from "@repo/ui/components";
import { cn } from "@repo/ui/lib";
import { Link as InternalLink, NavLink } from "react-router";

function Link({ external, navlink, button, size, variant, to, ...props }: LinkProps) {
  const className: string = cn(button && buttonVariants({ size, variant }));

  if (external) {
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        {...(props as LinkAsAnchorProps)}
        href={to}
        className={cn(className, props.className)}
      />
    );
  }

  if (navlink) {
    return (
      <NavLink
        {...(props as LinkAsNavLinkProps)}
        to={to}
        className={(state) =>
          cn(
            className,
            typeof props.className === "function" ? props.className(state) : props.className
          )
        }
      />
    );
  }

  return (
    <InternalLink
      {...(props as LinkAsLinkProps)}
      to={to}
      className={cn(className, props.className)}
    />
  );
}

export default Link;

import type {
  LinkAsAnchorProps,
  LinkAsLinkProps,
  LinkAsNavLinkProps,
  LinkProps,
} from "./Link.types";

import { buttonVariants } from "@repo/ui/components";
import { cn } from "@repo/ui/lib";
import { Link as RouterLink, NavLink } from "react-router";

function Link({ external, navbar, button, size, variant, ...props }: LinkProps) {
  const className: string = cn(button && buttonVariants({ size, variant }));

  if (external) {
    return (
      <a
        target="_blank"
        rel="noopener noreferrer"
        {...(props as LinkAsAnchorProps)}
        className={cn(className, props.className)}
      />
    );
  }

  if (navbar) {
    return (
      <NavLink
        {...(props as LinkAsNavLinkProps)}
        to={props.href}
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
    <RouterLink
      {...(props as LinkAsLinkProps)}
      to={props.href}
      className={cn(className, props.className)}
    />
  );
}

export default Link;

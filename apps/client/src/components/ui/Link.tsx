import type { VariantProps } from "class-variance-authority";

import { buttonVariants } from "@repo/ui/components";
import { cn } from "@repo/ui/lib";
import { Link as RouterLink, type LinkProps, NavLink, type NavLinkProps } from "react-router";

type BaseProps = {
  href: string;
  external?: boolean;
  navbar?: boolean;
  button?: boolean;
} & VariantProps<typeof buttonVariants>;

export type LinkAsLinkProps = Omit<LinkProps, "to"> &
  Omit<BaseProps, "external" | "navbar"> & {
    external?: false;
    navbar?: false;
  };

export type LinkAsNavLinkProps = Omit<NavLinkProps, "to"> &
  Omit<BaseProps, "external" | "navbar"> & {
    external?: false;
    /** Indicates that the link is used in a navbar context. */
    navbar: boolean;
  };

export type LinkAsAnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  Omit<BaseProps, "external" | "navbar"> & {
    /** Indicates that the link is external and should open in a new tab. */
    external: boolean;
    navbar?: false;
  };

type Props = LinkAsLinkProps | LinkAsNavLinkProps | LinkAsAnchorProps;

function Link({ external, navbar, button, size, variant, ...props }: Props) {
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

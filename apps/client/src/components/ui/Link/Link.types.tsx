import type { VariantProps } from "class-variance-authority";

import { buttonVariants } from "@repo/ui/components";
import { type LinkProps as RouterLinkProps, type NavLinkProps } from "react-router";

type BaseProps = {
  to: string;
  external?: boolean;
  navlink?: boolean;
  button?: boolean;
} & VariantProps<typeof buttonVariants>;

export type LinkAsLinkProps = {
  external?: false;
  navlink?: false;
} & Omit<RouterLinkProps, "to"> &
  Omit<BaseProps, "external" | "navlink">;

export type LinkAsNavLinkProps = {
  external?: false;
  navlink: boolean;
} & Omit<NavLinkProps, "to"> &
  Omit<BaseProps, "external" | "navlink">;

export type LinkAsAnchorProps = {
  external: boolean;
  navlink?: false;
} & React.AnchorHTMLAttributes<HTMLAnchorElement> &
  Omit<BaseProps, "external" | "navlink">;

export type LinkProps = LinkAsLinkProps | LinkAsNavLinkProps | LinkAsAnchorProps;

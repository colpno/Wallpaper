import type { VariantProps } from "class-variance-authority";

import { buttonVariants } from "@repo/ui/components";
import { type LinkProps as RouterLinkProps, type NavLinkProps } from "react-router";

type BaseProps = {
  href: string;
  external?: boolean;
  navbar?: boolean;
  button?: boolean;
} & VariantProps<typeof buttonVariants>;

export type LinkAsLinkProps = {
  external?: false;
  navbar?: false;
} & Omit<RouterLinkProps, "to"> &
  Omit<BaseProps, "external" | "navbar">;

export type LinkAsNavLinkProps = {
  external?: false;
  /** Indicates that the link is used in a navbar context. */
  navbar: boolean;
} & Omit<NavLinkProps, "to"> &
  Omit<BaseProps, "external" | "navbar">;

export type LinkAsAnchorProps = {
  /** Indicates that the link is external and should open in a new tab. */
  external: boolean;
  navbar?: false;
} & React.AnchorHTMLAttributes<HTMLAnchorElement> &
  Omit<BaseProps, "external" | "navbar">;

export type LinkProps = LinkAsLinkProps | LinkAsNavLinkProps | LinkAsAnchorProps;

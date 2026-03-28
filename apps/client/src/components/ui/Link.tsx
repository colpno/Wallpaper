import { Link as RouterLink, type LinkProps, NavLink, type NavLinkProps } from "react-router";

export type LinkAsLinkProps = Omit<LinkProps, "to">;
export type LinkAsNavLinkProps = Omit<NavLinkProps, "to">;
export type LinkAsAnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

type Props =
  | ({
      href: string;
      external?: false;
      navbar?: false;
    } & LinkAsLinkProps)
  | ({
      href: string;
      external?: false;
      /** Indicates that the link is used in a navbar context. */
      navbar: boolean;
    } & LinkAsNavLinkProps)
  | ({
      href: string;
      /** Indicates that the link is external and should open in a new tab. */
      external: boolean;
      navbar?: false;
    } & LinkAsAnchorProps);

function Link({ external, navbar, ...props }: Props) {
  if (external) {
    return <a target="_blank" rel="noopener noreferrer" {...(props as LinkAsAnchorProps)} />;
  }

  if (navbar) {
    return <NavLink {...(props as LinkAsNavLinkProps)} to={props.href} />;
  }

  return <RouterLink {...(props as LinkAsLinkProps)} to={props.href} />;
}

export default Link;

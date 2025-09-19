import { memo } from 'react';
import { Link, LinkProps } from 'react-router-dom';

interface BaseProps {
  children: React.ReactNode;
  href?: string;
  external?: boolean;
  disabled?: boolean;
}

type Props<T> = T extends { external: true }
  ? BaseProps & React.AnchorHTMLAttributes<HTMLAnchorElement>
  : BaseProps & Omit<LinkProps, 'to'>;

function HyperLinkWrapper<T>({ children, href, external, disabled, ...props }: Props<T>) {
  if (!href || disabled) return children;

  if (external) {
    return (
      <a {...props} href={href}>
        {children}
      </a>
    );
  }

  return (
    <Link {...props} to={href}>
      {children}
    </Link>
  );
}

export default memo(HyperLinkWrapper);

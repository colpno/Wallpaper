import { Button } from '@mui/material';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import { ButtonAsButtonProps } from '~/types/index.ts';
import { cn } from '~/utils/cssUtils.ts';

type Props = Omit<ButtonAsButtonProps, 'as'>;

function StyledButton({
  children,
  className,
  disableTextTransform,
  href,
  external,
  ...props
}: Props) {
  const LinkComponent = href ? (external ? 'a' : Link) : undefined;
  const hyperlinks = LinkComponent ? (LinkComponent === 'a' ? { href } : { to: href }) : {};

  return (
    <Button
      loadingPosition="start"
      type="button"
      {...props}
      className={cn(disableTextTransform && '!normal-case', className)}
      LinkComponent={LinkComponent}
      {...hyperlinks}
    >
      {children}
    </Button>
  );
}

export default memo(StyledButton);

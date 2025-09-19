import { IconButton as MUIIconButton } from '@mui/material';
import { memo } from 'react';
import { Link } from 'react-router-dom';

import { ButtonAsIconProps } from '~/types/index.ts';

type Props = Omit<ButtonAsIconProps, 'as'>;

function IconButton({ href, external, ...props }: Props) {
  const LinkComponent = href ? (external ? 'a' : Link) : undefined;
  const hyperlinks = LinkComponent ? (LinkComponent === 'a' ? { href } : { to: href }) : {};

  return <MUIIconButton type="button" {...props} LinkComponent={LinkComponent} {...hyperlinks} />;
}

export default memo(IconButton);

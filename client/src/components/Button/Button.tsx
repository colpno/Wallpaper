import { memo } from 'react';

import {
  ButtonAsButtonProps,
  ButtonAsIconProps,
  ButtonAsUnstyledProps,
  ButtonProps,
} from '~/types/index.ts';
import IconButton from './components/IconButton';
import StyledButton from './components/StyledButton.tsx';
import UnstyledButton from './components/UnstyledButton';

function Button({ as, ...props }: ButtonProps) {
  switch (as) {
    case 'unstyled':
      return <UnstyledButton {...(props as ButtonAsUnstyledProps)} />;

    case 'icon':
      return <IconButton {...(props as ButtonAsIconProps)} />;

    case 'button':
    default:
      return <StyledButton {...(props as ButtonAsButtonProps)} />;
  }
}

export default memo(Button);

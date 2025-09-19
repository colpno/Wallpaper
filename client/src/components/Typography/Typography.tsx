import { Typography as MUITypography } from '@mui/material';
import { memo } from 'react';

import { TypoAsHyperLinkProps, TypographyProps } from '~/types/index.ts';
import CopyableTypography from './components/CopyableTypography';
import HyperLinkTypography from './components/HyperLinkTypography';

function Typography(props: TypographyProps) {
  const isHyperLink = 'href' in props && !!props.href;
  const isCopyable = 'copyable' in props && props.copyable;

  if (isHyperLink) {
    return <HyperLinkTypography {...(props as TypoAsHyperLinkProps)} />;
  }

  if (isCopyable) {
    return <CopyableTypography {...props} />;
  }

  return <MUITypography {...props} />;
}

export default memo(Typography);

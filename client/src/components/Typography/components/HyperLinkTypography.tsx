import { Typography } from '@mui/material';
import { memo } from 'react';

import { HyperLinkWrapper } from '~/components/index.ts';
import { TypoAsHyperLinkProps } from '~/types/index.ts';

function HyperLinkTypography({ href, external, ...props }: TypoAsHyperLinkProps) {
  return (
    <HyperLinkWrapper href={href} external={external}>
      <Typography {...props} />
    </HyperLinkWrapper>
  );
}

export default memo(HyperLinkTypography);

import { Typography } from '@mui/material';
import { memo } from 'react';
import { toast } from 'react-toastify';

import { TypoAsCopyableTextProps } from '~/types/index.ts';

function CopyableTypography(props: TypoAsCopyableTextProps) {
  const copyText = () => {
    navigator.clipboard
      .writeText(props.children)
      .then(() => toast.success('Copied to clipboard'))
      .catch(() => toast.error('Failed to copy to clipboard'));
  };

  return <Typography onClick={copyText} title="Click to copy" {...props} />;
}

export default memo(CopyableTypography);

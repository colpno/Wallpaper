import { memo } from 'react';

import { cn } from '~/utils/cssUtils.ts';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: string;
}

function Container({ maxWidth = '1360px', ...props }: Props) {
  return (
    <div
      {...props}
      style={{ maxWidth }}
      className={cn('mx-auto flex-[0_1] px-2', props.className)}
    />
  );
}

export default memo(Container);

import { memo } from 'react';

import { ButtonAsUnstyledProps } from '~/types/buttonTypes.ts';
import { cn } from '~/utils/cssUtils.ts';

type Props = Omit<ButtonAsUnstyledProps, 'as'>;

function UnstyledButton({ className, ...props }: Props) {
  return <button type="button" {...props} className={cn('cursor-pointer', className)} />;
}

export default memo(UnstyledButton);

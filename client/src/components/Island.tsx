import { memo } from 'react';

import { cn } from '~/utils/cssUtils.ts';

type Props<Tag extends keyof JSX.IntrinsicElements = 'div'> = {
  /** @default div */
  component?: Tag;
} & JSX.IntrinsicElements[Tag];

function Island({ component: Component = 'div', className, ...props }: Props) {
  return (
    <Component
      {...props}
      className={cn(
        'rounded-md bg-primary-1 dark:bg-secondary-2 border-1 shadow-lg border-black/8 dark:border-gray-900 dark:shadow-gray-500/5',
        className
      )}
    />
  );
}

export default memo(Island);

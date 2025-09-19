import React, { memo } from 'react';

import { TypographyProps } from '~/types/typographyTypes.ts';
import { cn } from '~/utils/cssUtils.ts';
import { Typography } from './index.ts';

type LabelProps = TypographyProps &
  React.AllHTMLAttributes<HTMLElement> & {
    required?: boolean;
    error?: boolean;
  };

function FieldLabel({ children, required, className, error, ...props }: LabelProps) {
  if (!children) return null;

  return (
    <>
      <Typography
        {...props}
        className={cn('ml-2 inline-block', error && '!text-red-500', className)}
      >
        {children}
        {required && (
          <Typography component="span" className="ml-0.5 font-bold text-red-500">
            *
          </Typography>
        )}
      </Typography>
      <br />
    </>
  );
}

export default memo(FieldLabel);

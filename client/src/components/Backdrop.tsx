import { memo } from 'react';
import { createPortal } from 'react-dom';

import { useDisableScroll } from '~/hooks/index.ts';
import { cn } from '~/utils/cssUtils.ts';

interface Props {
  open: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  slotProps?: {
    root?: React.HTMLAttributes<HTMLDivElement>;
    backdrop?: React.HTMLAttributes<HTMLDivElement>;
    container?: React.HTMLAttributes<HTMLDivElement>;
  };
}

function Backdrop({ open, onClose, children, slotProps }: Props) {
  useDisableScroll();

  if (!open) return null;

  return createPortal(
    <div
      {...slotProps?.root}
      className={cn('fixed top-0 right-0 bottom-0 left-0 z-backdrop', slotProps?.root?.className)}
    >
      <div
        {...slotProps?.backdrop}
        className={cn(
          'absolute top-0 right-0 bottom-0 left-0 bg-black opacity-60',
          slotProps?.backdrop?.className
        )}
        onClick={onClose}
      />
      <div
        {...slotProps?.container}
        className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_72px_12px_rgba(0,0,0,0.18)]',
          slotProps?.container?.className
        )}
      >
        {children}
      </div>
    </div>,
    document.getElementById('root') as Element
  );
}

export default memo(Backdrop);

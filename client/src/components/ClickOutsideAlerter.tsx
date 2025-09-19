import React, { memo, useRef } from 'react';

import useClickOutside from '~/hooks/useClickOutside.ts';

interface Props extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  onClick: () => void;
  children: React.ReactNode;
}

// TODO: ESC key
function ClickOutsideAlerter({ onClick, ...props }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, onClick);
  return <div {...props} ref={containerRef} />;
}

export default memo(ClickOutsideAlerter);

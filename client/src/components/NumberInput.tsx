import React, { memo, useRef } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

import { cn } from '~/utils/cssUtils.ts';
import { Button, Typography } from './index.ts';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  fullWidth?: boolean;
  unit?: string;
  min?: number;
  max?: number;
  /** @default 1 */
  step?: number;
}

function NumberInput({ error, fullWidth, unit, min, max, step = 1, ...props }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const triggerChangeEvent = () => {
    if (inputRef.current) {
      const event = new Event('change', { bubbles: true });
      inputRef.current.dispatchEvent(event);
    }
  };

  const increase = () => {
    const ele = inputRef.current;
    const value = ele ? parseInt(ele.value) : 0;
    const newValue = value + step;
    if (max && newValue > max) return;
    if (ele) {
      inputRef.current.value = `${newValue}`;
      triggerChangeEvent();
    }
  };

  const decrease = () => {
    const ele = inputRef.current;
    const value = ele ? parseInt(ele.value) : 0;
    const newValue = value - step;
    if (min && newValue < min) return;
    if (ele) {
      inputRef.current.value = `${newValue}`;
      triggerChangeEvent();
    }
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border-1 border-black dark:border-white',
        fullWidth && 'flex',
        error && 'border-red-500'
      )}
    >
      <input
        {...props}
        id={props.name}
        onKeyDown={preventTyping}
        ref={inputRef}
        className={cn(
          'flex-1 py-2 pl-3 text-primary-1 outline-none [&::-webkit-outer-spin-button,&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button,&::-webkit-inner-spin-button]:appearance-none',
          props.className
        )}
      />
      {unit && <Typography className="pointer-events-none ml-2 select-none">{unit}</Typography>}
      <div className="ml-3 mr-2 flex flex-col gap-0.5 *:rounded-sm *:bg-gray-200 *:px-1 *:py-0.5 *:transition-transform *:duration-100 *:ease-in-out *:hover:bg-gray-300 *:active:scale-90">
        <Button as="unstyled" onClick={increase}>
          <FaChevronUp fontSize="70%" />
        </Button>
        <Button as="unstyled" onClick={decrease}>
          <FaChevronDown fontSize="70%" />
        </Button>
      </div>
    </div>
  );
}

export default memo(NumberInput);

const preventTyping = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (
    !/[0-9\.,]|Enter|ArrowDown|ArrowUp|ArrowLeft|ArrowRight|Backspace|End|Home|Clear|Copy|Cut|Paste|Redo|Undo/.test(
      e.key
    ) &&
    !e.ctrlKey &&
    !e.altKey &&
    !e.metaKey
  ) {
    e.preventDefault();
  }
};

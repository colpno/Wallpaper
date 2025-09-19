import { memo, useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import { v4 } from 'uuid';

import { ButtonAsButtonProps } from '~/types/buttonTypes.ts';
import { cn } from '~/utils/cssUtils.ts';
import { Button, Typography } from './index.ts';

interface Props extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  totalPages: number;
  siblingCount?: number;
  onChange?: (page: number) => void;
}

function Pagination({ totalPages: tail, siblingCount = 2, onChange, ...props }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = searchParams.get('page');
  const currPage = pageParam && /^\d+$/.test(pageParam) ? parseInt(pageParam) : 1;
  const head = 1; // first page
  const [body, setBody] = useState<number[]>([]); // middle pages
  const hasFirstEllipsis = body[0] - head > 1;
  const hasSecondEllipsis = tail - body[body.length - 1] > 1;
  const hasLastPage = tail > head;
  const uuid = v4();

  const handlePageChange = (page: number) => {
    if (page < head || page > tail) return;
    setSearchParams((prev) => ({ ...prev, page: `${page}` }));
    onChange?.(page);
  };

  // Calculate the sibling pages to display
  useEffect(() => {
    // The number of sibling pages to show on the left of the current page
    const leftSibling = Math.min(siblingCount, currPage - head);
    // The number of sibling pages to show on the right of the current page
    const rightSibling = Math.min(siblingCount, tail - currPage);
    // The starting page number for the range of pages to display
    const start = Math.max(head, currPage - leftSibling);
    // The ending page number for the range of pages to display
    const end = Math.min(tail, currPage + rightSibling);
    // Adjust the start and end pages to ensure they are within valid bounds
    const range: [number, number] = [
      start <= head ? head + 1 : start,
      end >= tail ? tail - 1 : end,
    ];
    setBody(generatePages(...range));
  }, [siblingCount, head, tail, currPage]);

  if (tail === head) return null;

  return (
    <div {...props} className={cn('text-primary-1 flex items-center gap-2', props.className)}>
      <ArrowButton direction="left" onClick={() => handlePageChange(currPage - 1)} />
      <PageButton
        disabled={currPage === head}
        onClick={() => handlePageChange(head)}
        children={head}
      />
      {hasFirstEllipsis && <Ellipsis />}
      {body.map((p) => (
        <PageButton
          disabled={currPage === p}
          onClick={() => handlePageChange(p)}
          children={p}
          key={`${uuid}-${p}`}
        />
      ))}
      {hasSecondEllipsis && <Ellipsis />}
      {hasLastPage && (
        <PageButton
          disabled={currPage === tail}
          onClick={() => handlePageChange(tail)}
          children={tail}
        />
      )}
      <ArrowButton direction="right" onClick={() => handlePageChange(currPage + 1)} />
    </div>
  );
}

export default memo(Pagination);

const buttonClasses = 'py-1 px-2 leading-none';

interface ArrowButtonProps extends ButtonAsButtonProps {
  direction: 'left' | 'right';
}

function ArrowButton({ direction, className, ...props }: ArrowButtonProps) {
  return (
    <Button
      {...props}
      variant="content"
      className={cn(buttonClasses, 'hidden md:block', className)}
    >
      {direction === 'left' ? <FaChevronLeft /> : <FaChevronRight />}
    </Button>
  );
}

interface PageButtonProps extends Omit<ButtonAsButtonProps, 'children'> {
  children: number;
}

function PageButton({ disabled, ...props }: PageButtonProps) {
  return (
    <Button
      {...props}
      variant={disabled ? 'container' : 'content'}
      className={cn(buttonClasses, props.children >= 10 && 'px-1.5')}
    />
  );
}

function Ellipsis() {
  return (
    <Typography component="span" className="select-none">
      ...
    </Typography>
  );
}

const generatePages = (start: number, end: number) => {
  const pages: number[] = [];
  if (start > end) return pages;
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
};

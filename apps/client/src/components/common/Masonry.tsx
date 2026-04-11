import { cn } from "@repo/ui/lib";
import { memo, useEffect, useRef } from "react";

/**
 * Need to wrap each item with `MasonryWrapper` in order to function.
 */
export const Masonry = memo(function Masonry({ children, ...props }: React.ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);

  // Inspired from https://css-tricks.com/making-a-masonry-layout-that-works-today
  useEffect(() => {
    const masonry = ref.current;
    if (!masonry) return;

    masonry.style.gridAutoRows = "0px"; // Remove rows height
    masonry.style.setProperty("row-gap", "1px", "important"); // Make the span match 1:1 with the item height

    let frame: number | null = null;
    const colGap = parseFloat(getComputedStyle(masonry).columnGap);
    const wrappers = Array.from(masonry.children) as HTMLElement[];

    // Set height of an item
    const resizeItem = (wrapper: HTMLElement) => {
      const item = wrapper.firstElementChild as HTMLElement;
      if (!item) return;

      const { height } = item.getBoundingClientRect();
      wrapper.style.gridRowEnd = `span ${Math.round(height + colGap)}`;
    };

    // Ensure resizing before painting and run once per frame
    const scheduleResize = () => {
      if (frame) cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        wrappers.forEach(resizeItem);
      });
    };

    // Observe container
    const masonryObserver = new ResizeObserver(scheduleResize);
    masonryObserver.observe(masonry);

    // Initial layout
    scheduleResize();

    // Clean up
    return () => {
      masonryObserver.disconnect();
    };
  }, [children]);

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4 lg:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]",
        props.className
      )}
    >
      {children}
    </div>
  );
});

export function MasonryWrapper(props: React.ComponentProps<"div">) {
  return <div {...props} />;
}

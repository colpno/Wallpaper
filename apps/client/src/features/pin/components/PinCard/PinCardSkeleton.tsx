import { Skeleton } from "@repo/ui/components";
import { cn } from "@repo/ui/lib";

function PinCardSkeleton(props: React.ComponentProps<typeof Skeleton>) {
  const height = Math.min(600, Math.max(150, Math.ceil(Math.random() * 1000)));

  return (
    <Skeleton
      {...props}
      className={cn("w-full rounded-2xl", props.className)}
      style={{ height: `${height}px`, ...props.style }}
    />
  );
}

export default PinCardSkeleton;

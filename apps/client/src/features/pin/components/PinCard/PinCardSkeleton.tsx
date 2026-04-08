import { Skeleton } from "@repo/ui/components";
import { cn } from "@repo/ui/lib";

function PinCardSkeleton(props: React.ComponentProps<typeof Skeleton>) {
  return <Skeleton {...props} className={cn("size-full rounded-xl", props.className)} />;
}

export default PinCardSkeleton;

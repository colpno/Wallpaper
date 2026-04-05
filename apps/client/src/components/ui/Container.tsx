import type { ElementType, JSX } from "react";

import { cn } from "@repo/ui/lib";

type Props<TAs extends keyof JSX.IntrinsicElements> = React.ComponentProps<TAs> & {
  as?: TAs;
};

function Container<TAs extends keyof JSX.IntrinsicElements>({ as, ...props }: Props<TAs>) {
  const Element = (as ?? "div") as ElementType;

  return (
    <Element {...props} className={cn("mx-auto w-full max-w-7xl px-3 2xl:px-0", props.className)} />
  );
}

export default Container;

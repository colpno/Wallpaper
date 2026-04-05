import type { ElementType, JSX } from "react";

import { cn } from "@repo/ui/lib";
import { cva, type VariantProps } from "class-variance-authority";

type Props<TAs extends keyof JSX.IntrinsicElements> = {
  /**
   * @default "p"
   */
  as?: TAs;
} & React.ComponentProps<TAs> &
  VariantProps<typeof variants> &
  React.ComponentProps<TAs>;

const variants = cva("", {
  variants: {
    size: {
      lg: "text-[20px]",
      md: "text-[16px]",
      sm: "text-[14px]",
      xs: "text-[12px]",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

function Typography<TAs extends keyof JSX.IntrinsicElements>({ size, as, ...props }: Props<TAs>) {
  const Element = (as ?? "p") as ElementType;

  return (
    <Element
      {...(props as React.ComponentProps<TAs>)}
      className={cn(variants({ size }), props.className)}
    />
  );
}

export default Typography;

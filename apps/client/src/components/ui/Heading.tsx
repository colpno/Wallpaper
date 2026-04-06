import type { ElementType } from "react";

import { cn } from "@repo/ui/lib";
import { cva, type VariantProps } from "class-variance-authority";

type Variant = Exclude<VariantProps<typeof variants>["variant"], undefined | null>;

type Props<TVariant extends Variant> = React.ComponentProps<TVariant> &
  VariantProps<typeof variants>;

const variants = cva("font-bold -tracking-[0.5px]", {
  variants: {
    variant: {
      h1: "text-[50px]",
      h2: "text-[38px]",
    },
  },
});

function Heading<TVariant extends Variant>({ variant, ...props }: Props<TVariant>) {
  const Element = (variant ?? "h1") as ElementType;

  return <Element {...props} className={cn(variants({ variant }), props.className)} />;
}

export default Heading;

import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-95 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary-600 focus-visible:border-primary focus-visible:ring-primary/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-neutral-300",
        tertiary: "bg-background text-foreground hover:bg-background/80",
        outline: "border bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        active:
          "bg-selected-background text-selected-foreground hover:bg-selected-hover-background",
      },
      size: {
        xs: "gap-0.5 px-2 py-1 text-xs",
        sm: "gap-1 px-3 py-2 text-sm",
        md: "px-3.5 py-3 text-base",
        lg: "px-4 py-2 text-sm",
        xl: "px-5 py-3 text-base",
        "icon-xs": "size-2 rounded-sm text-xs *:size-3",
        "icon-sm": "size-4 rounded-sm text-xs *:size-3",
        "icon-md": "size-6 rounded-md text-sm *:size-4.5",
        "icon-lg": "size-9 rounded-lg text-base *:size-5",
        "icon-xl": "size-12 rounded-xl text-2xl *:size-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "md",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

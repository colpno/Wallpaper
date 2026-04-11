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
        outline: "border bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",

        icon: "bg-primary text-primary-foreground hover:bg-primary-600 focus-visible:border-primary focus-visible:ring-primary/50",
        "secondary-icon": "bg-secondary text-secondary-foreground hover:bg-neutral-300",
        "outline-icon": "border bg-background hover:bg-accent hover:text-accent-foreground",
        "ghost-icon": "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        xs: "",
        sm: "",
        md: "",
        lg: "",
        xl: "",
      },
    },
    compoundVariants: [
      // Icon
      ...(
        [
          {
            size: "xs",
            className: "size-2 rounded-sm text-xs",
          },
          {
            size: "sm",
            className: "size-4 rounded-sm text-xs",
          },
          {
            size: "md",
            className: "size-6 rounded-md text-sm",
          },
          {
            size: "lg",
            className: "size-9 rounded-lg text-base",
          },
          {
            size: "xl",
            className: "size-12 rounded-xl text-2xl",
          },
        ] as const
      ).map((config) => ({
        ...config,
        variant: ["icon", "ghost-icon", "outline-icon", "secondary-icon"] as Array<
          "icon" | "ghost-icon" | "outline-icon" | "secondary-icon"
        >,
      })),
      // Others
      ...(
        [
          {
            size: "xs",
            className: "px-1 py-1 text-xs",
          },
          {
            size: "sm",
            className: "px-2 py-2 text-sm",
          },
          {
            size: "md",
            className: "px-3.5 py-3 text-base",
          },
          {
            size: "lg",
            className: "px-4 py-2 text-sm",
          },
          {
            size: "xl",
            className: "px-5 py-3 text-base",
          },
        ] as const
      ).map((config) => ({
        ...config,
        variant: ["default", "outline", "secondary", "ghost"] as Array<
          "default" | "outline" | "secondary" | "ghost"
        >,
      })),
    ],
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

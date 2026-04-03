import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-95 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-primary-700 bg-primary text-primary-foreground",
        destructive: "hover:bg-destructive-600 bg-destructive text-white",
        warning: "bg-warning hover:bg-warning-600 text-white",
        success: "bg-success hover:bg-success-600 text-white",
        info: "bg-info hover:bg-info-600 text-white",
        outline:
          "hover:border-primary-700 hover:text-primary-700 border border-primary text-primary",
        secondary: "bg-secondary text-secondary-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        icon: "hover:bg-primary-700 bg-primary text-primary-foreground",
        "ghost-icon": "hover:bg-accent hover:text-accent-foreground",
        "outline-icon":
          "hover:border-primary-700 hover:text-primary-700 border border-primary text-primary",
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
            className: "size-5 rounded-sm text-xs",
          },
          {
            size: "sm",
            className: "size-6 rounded-sm text-sm",
          },
          {
            size: "md",
            className: "size-7 rounded-md text-base",
          },
          {
            size: "lg",
            className: "size-8 rounded-md text-lg",
          },
          {
            size: "xl",
            className: "size-9 rounded-md text-[22px]",
          },
        ] as const
      ).map((config) => ({
        ...config,
        variant: ["icon", "ghost-icon", "outline-icon"] as Array<
          "icon" | "ghost-icon" | "outline-icon"
        >,
      })),
      // Others
      ...(
        [
          {
            size: "xs",
            className: "px-1 py-0.5 text-xs",
          },
          {
            size: "sm",
            className: "px-2 py-1 text-xs",
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
        variant: [
          "default",
          "destructive",
          "warning",
          "success",
          "info",
          "outline",
          "secondary",
          "ghost",
        ] as Array<
          | "default"
          | "destructive"
          | "warning"
          | "success"
          | "info"
          | "outline"
          | "secondary"
          | "ghost"
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

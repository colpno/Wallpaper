import { cn } from "@repo/ui";
import React from "react";

type Variant = "section" | "div";

type Props<V extends Variant> = {
  /**
   * @default "div"
   */
  variant?: V;
} & (V extends "section" ? React.ComponentProps<"section"> : React.ComponentProps<"div">);

function Container<V extends Variant>({ variant, ...props }: Props<V>) {
  if (!variant) throw new Error("Variant is required");

  const Component = (variant as "div") || "div";

  return (
    <Component
      {...(props as React.ComponentProps<"div">)}
      className={cn("mx-auto lg:w-[1244px]", props.className)}
    />
  );
}

export default Container;

import { cva, type VariantProps } from "class-variance-authority";

type Variant = Exclude<VariantProps<typeof headingVariants>["variant"], undefined | null>;

type Props<V extends Variant> = {
  /**
   * @default "h1"
   */
  variant: V;
} & React.ComponentProps<V> &
  VariantProps<typeof headingVariants>;

const headingVariants = cva("font-bold -tracking-[0.5px]", {
  variants: {
    variant: {
      h1: "my-8 text-4xl",
      h2: "mb-4 text-[28px]",
    },
  },
});

function Heading<V extends Variant>({ variant, className, ...props }: Props<V>) {
  if (!variant) throw new Error("Variant is required");

  const Component = (variant as "h1") || "h1";

  return <Component {...props} className={headingVariants({ variant, className })} />;
}

export default Heading;

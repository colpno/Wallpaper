import type { VariantProps } from "class-variance-authority";

import { Button as UIButton, buttonVariants, Toggle, toggleVariants } from "@repo/ui/components";

type ButtonAsButtonProps = {
  toggle?: never;
} & React.ComponentProps<typeof UIButton>;

type ButtonAsToggleProps = {
  toggle: boolean;
} & Omit<React.ComponentProps<typeof Toggle>, keyof VariantProps<typeof toggleVariants>> &
  Pick<ButtonAsButtonProps, keyof VariantProps<typeof buttonVariants>>;

type Props = ButtonAsButtonProps | ButtonAsToggleProps;

function Button({ type = "button", toggle, ...props }: Props) {
  if (toggle) {
    const { size, variant, ...rest } = props as ButtonAsToggleProps;

    return (
      <UIButton asChild size={size} variant={variant}>
        <Toggle
          {...rest}
          className="data-[state=on]:border-selected-background data-[state=on]:bg-selected-background data-[state=on]:text-selected-foreground! data-[state=on]:hover:border-selected-hover-background data-[state=on]:hover:bg-selected-hover-background"
          type={type}
        />
      </UIButton>
    );
  }

  return <UIButton {...(props as ButtonAsButtonProps)} type={type} />;
}

export default Button;
